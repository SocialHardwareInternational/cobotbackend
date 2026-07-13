#!/usr/bin/env python3
"""modbus_server.py -- Modbus TCP slave for PLC / SCADA / MES integration.

A dependency-free asyncio implementation of the Modbus TCP application protocol
(MBAP framing) supporting FC 01/02/03/04/05/06/0F/10. The register map mirrors
what commercial cobots expose (UR exposes the same idea on port 502):

DISCRETE INPUTS (FC02), read-only:
    0..15   DI0..DI15 digital inputs

COILS (FC01 read / FC05, FC0F write):
    0..15   DO0..DO15 digital outputs (writing sets the physical/virtual output)

INPUT REGISTERS (FC04), read-only, 16-bit:
    0  mode (0 idle,1 moving,2 stopping,3 estop,4 hold,5 freedrive)
    1  enabled    2  estop        3  moving         4  progress x1000
    5  speed override applied [%]                   6  safety zone (0/1/2)
    7  safety code (SafetyCode)  8  protective stop bits: b0 safety b1 contact b2 collision
    9  program running          10  program cycle count (running program)
    11 robot uptime [s, wraps]  12  loop jitter [us]
    16..21  joint position q1..q6   [mrad, int16]
    22..27  joint velocity qd1..qd6 [mrad/s, int16]
    28..30  TCP position x,y,z      [0.1 mm, int16]
    31..33  TCP orientation r,p,y   [mrad, int16]
    34..39  joint torque tau1..6    [0.1 Nm, int16]
    40      TCP speed [mm/s]        41  ext force [0.1 N]
    42..47  drive temperature [0.1 C]

HOLDING REGISTERS (FC03 read / FC06, FC10 write):
    0  speed override target x1000 (50..1000)
    1  command trigger: 1 start program(reg 2) / 2 stop / 3 enable / 4 disable /
                        5 reset e-stop / 6 E-STOP / 7 freedrive on / 8 freedrive off
       (self-clears to 0 after execution; result in holding reg 3)
    2  program number (1-based, creation order)
    3  last command result: 0 none, 1 ok, 2 error
"""
import asyncio
import math
import struct
import time

EXC_ILLEGAL_FUNCTION = 0x01
EXC_ILLEGAL_ADDRESS = 0x02
EXC_ILLEGAL_VALUE = 0x03


def _i16(v):
    v = int(round(v))
    return max(-32768, min(32767, v)) & 0xFFFF


class ModbusServer:
    """bind() callbacks connect the map to the controller:
       get_state() -> state dict, get_io() -> io dict,
       set_do(index, value), set_speed(frac), command(code, arg) -> bool
    """

    def __init__(self, host="0.0.0.0", port=1502, logger=None):
        self.host, self.port = host, port
        self.log = logger or (lambda *a: None)
        self.get_state = lambda: {}
        self.get_prog = lambda: {}
        self.get_io = lambda: {"di": 0, "do_state": 0}
        self.set_do = lambda i, v: None
        self.set_speed = lambda f: None
        self.command = lambda code, arg: False
        self._hold = {0: 1000, 1: 0, 2: 0, 3: 0}
        self._server = None

    def bind(self, get_state, get_io, set_do, set_speed, command, get_prog=None):
        self.get_state, self.get_io = get_state, get_io
        self.set_do, self.set_speed, self.command = set_do, set_speed, command
        if get_prog:
            self.get_prog = get_prog

    # ---- register map ----------------------------------------------------
    def _input_regs(self):
        # built from the RAW shared-memory snapshot (shm_layout.ShmClient.read_state)
        s = self.get_state() or {}
        q = s.get("q") or [0] * 6; qd = s.get("qd") or [0] * 6
        tp = s.get("tcp_pos") or s.get("flange_pos") or [0, 0, 0]
        tq = s.get("tcp_quat") or s.get("flange_quat") or [1, 0, 0, 0]
        w, x, y, z = (list(tq) + [1, 0, 0, 0])[:4]
        roll = math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y))
        pitch = math.asin(max(-1.0, min(1.0, 2 * (w * y - z * x))))
        yaw = math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z))
        tau = s.get("torque") or [0] * 6; temp = s.get("temp") or [0] * 6
        prog = self.get_prog() or {}
        regs = [0] * 48
        regs[0] = int(s.get("mode", 0)); regs[1] = 1 if s.get("enabled") else 0
        regs[2] = 1 if s.get("estop") else 0; regs[3] = 1 if s.get("moving") else 0
        regs[4] = _i16(1000 * float(s.get("progress", 0)))
        regs[5] = int(s.get("speed_pct", 100))
        regs[6] = int(s.get("safety_zone", 0)); regs[7] = int(s.get("safety_code", 0))
        regs[8] = (1 if s.get("safety_stop") else 0) | ((1 if s.get("contact") else 0) << 1) | ((1 if s.get("coll_stop") else 0) << 2)
        regs[9] = 1 if prog.get("running") else 0
        regs[10] = int(prog.get("cycle", 0)) & 0xFFFF
        regs[11] = int(s.get("t", 0)) & 0xFFFF
        regs[12] = _i16(s.get("loop_jitter_us", 0))
        for i in range(6):
            regs[16 + i] = _i16(1000 * q[i]); regs[22 + i] = _i16(1000 * qd[i])
        regs[28] = _i16(10000 * tp[0]); regs[29] = _i16(10000 * tp[1]); regs[30] = _i16(10000 * tp[2])
        regs[31] = _i16(1000 * roll); regs[32] = _i16(1000 * pitch); regs[33] = _i16(1000 * yaw)
        for i in range(6):
            regs[34 + i] = _i16(10 * tau[i]); regs[42 + i] = _i16(10 * temp[i])
        regs[40] = _i16(1000 * float(s.get("tcp_speed", 0)))
        regs[41] = _i16(10 * float(s.get("ext_force_mag", 0)))
        return regs

    def _write_hold(self, addr, val):
        if addr == 0:
            self._hold[0] = max(50, min(1000, val))
            self.set_speed(self._hold[0] / 1000.0)
        elif addr == 1:
            ok = self.command(val, self._hold.get(2, 0))
            self._hold[3] = 1 if ok else 2
            self._hold[1] = 0
        elif addr == 2:
            self._hold[2] = val
        elif addr == 3:
            self._hold[3] = val
        else:
            return False
        return True

    # ---- protocol ----------------------------------------------------------
    async def _client(self, reader, writer):
        peer = writer.get_extra_info("peername")
        self.log("modbus client connected %s" % (peer,))
        try:
            while True:
                hdr = await reader.readexactly(7)
                tid, pid, length, uid = struct.unpack(">HHHB", hdr)
                pdu = await reader.readexactly(length - 1)
                resp = self._pdu(pdu)
                writer.write(struct.pack(">HHHB", tid, 0, len(resp) + 1, uid) + resp)
                await writer.drain()
        except (asyncio.IncompleteReadError, ConnectionResetError):
            pass
        finally:
            writer.close()
            self.log("modbus client disconnected %s" % (peer,))

    def _exc(self, fc, code):
        return struct.pack(">BB", fc | 0x80, code)

    def _pdu(self, pdu):
        fc = pdu[0]
        try:
            if fc in (1, 2):                     # coils / discrete inputs
                addr, cnt = struct.unpack(">HH", pdu[1:5])
                if cnt < 1 or cnt > 2000 or addr + cnt > 16:
                    return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                io = self.get_io() or {}
                bits = io.get("do_state", 0) if fc == 1 else io.get("di", 0)
                nb = (cnt + 7) // 8
                out = bytearray(nb)
                for i in range(cnt):
                    if (bits >> (addr + i)) & 1:
                        out[i // 8] |= 1 << (i % 8)
                return struct.pack(">BB", fc, nb) + bytes(out)
            if fc in (3, 4):                     # holding / input registers
                addr, cnt = struct.unpack(">HH", pdu[1:5])
                if cnt < 1 or cnt > 125:
                    return self._exc(fc, EXC_ILLEGAL_VALUE)
                regs = self._input_regs() if fc == 4 else [self._hold.get(i, 0) for i in range(max(4, addr + cnt))]
                if addr + cnt > len(regs):
                    return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                body = b"".join(struct.pack(">H", regs[addr + i] & 0xFFFF) for i in range(cnt))
                return struct.pack(">BB", fc, len(body)) + body
            if fc == 5:                          # write single coil -> DO
                addr, val = struct.unpack(">HH", pdu[1:5])
                if addr > 15:
                    return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                self.set_do(addr, 1 if val == 0xFF00 else 0)
                return pdu[:5]
            if fc == 6:                          # write single holding register
                addr, val = struct.unpack(">HH", pdu[1:5])
                if not self._write_hold(addr, val):
                    return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                return pdu[:5]
            if fc == 15:                         # write multiple coils
                addr, cnt, nb = struct.unpack(">HHB", pdu[1:6])
                if addr + cnt > 16:
                    return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                data = pdu[6:6 + nb]
                for i in range(cnt):
                    self.set_do(addr + i, (data[i // 8] >> (i % 8)) & 1)
                return struct.pack(">BHH", fc, addr, cnt)
            if fc == 16:                         # write multiple holding registers
                addr, cnt, nb = struct.unpack(">HHB", pdu[1:6])
                vals = struct.unpack(">%dH" % cnt, pdu[6:6 + nb])
                for i, v in enumerate(vals):
                    if not self._write_hold(addr + i, v):
                        return self._exc(fc, EXC_ILLEGAL_ADDRESS)
                return struct.pack(">BHH", fc, addr, cnt)
            return self._exc(fc, EXC_ILLEGAL_FUNCTION)
        except Exception:
            return self._exc(fc, EXC_ILLEGAL_VALUE)

    async def start(self):
        self._server = await asyncio.start_server(self._client, self.host, self.port)
        self.log("Modbus TCP slave on %s:%d" % (self.host, self.port))

    async def stop(self):
        if self._server:
            self._server.close()
            await self._server.wait_closed()
