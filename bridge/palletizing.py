#!/usr/bin/env python3
"""palletizing.py -- generate a pick-and-place pallet program for the erobo10.

Mirrors the Universal Robots "Pallet" template idea: you teach a few reference poses
(a PICK pose and the pallet CORNER pose) and give a grid (counts + spacing); every cell
is computed as an offset from the corner, and for each cell the robot runs

    pick-approach -> PICK -> pick-retract -> place-approach -> PLACE(cell) -> place-retract

Approach/retract use a short vertical clearance so the tool never drags across placed
items. Transit moves are PTP (fast, via IK); the vertical approach/place/retract legs are
linear (straight down/up) for clean stacking.  Poses are {pos:{x,y,z}, rot:{roll,pitch,yaw}}
in the robot base frame (metres / radians); offsets are along base X/Y (grid) and Z (layers).

The output is a list of program steps ({type, pose, name}) consumed directly by the
ws_bridge program runner -- so palletizing reuses the same completion-gated execution and
the same collision / singularity safety as any other program.
"""
import copy


def _off(pose, dx=0.0, dy=0.0, dz=0.0):
    p = copy.deepcopy(pose)
    p["pos"]["x"] += dx
    p["pos"]["y"] += dy
    p["pos"]["z"] += dz
    return p


def cell_count(nx, ny, nz):
    return max(0, int(nx)) * max(0, int(ny)) * max(0, int(nz))


def generate(pick_pose, corner_pose, nx, ny, nz, dx, dy, dz, approach=0.05, order="row"):
    """Return (steps, cells). order: 'row' fills X then Y then layer; 'snake' alternates X
    direction each row (less travel)."""
    nx, ny, nz = int(nx), int(ny), int(nz)
    steps = []
    pick_up = _off(pick_pose, dz=approach)
    cells = 0
    for iz in range(nz):
        for iy in range(ny):
            xs = range(nx)
            if order == "snake" and iy % 2 == 1:
                xs = range(nx - 1, -1, -1)
            for ix in xs:
                cell = _off(corner_pose, ix * dx, iy * dy, iz * dz)
                cell_up = _off(cell, dz=approach)
                tag = "(%d,%d,L%d)" % (ix + 1, iy + 1, iz + 1)
                steps += [
                    {"type": "p", "pose": pick_up,    "name": "pick approach"},
                    {"type": "l", "pose": pick_pose,  "name": "PICK"},
                    {"type": "l", "pose": pick_up,    "name": "pick retract"},
                    {"type": "p", "pose": cell_up,    "name": "place approach " + tag},
                    {"type": "l", "pose": cell,       "name": "PLACE " + tag},
                    {"type": "l", "pose": cell_up,    "name": "place retract " + tag},
                ]
                cells += 1
    return steps, cells
