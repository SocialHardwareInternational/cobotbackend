#!/usr/bin/env python3
"""users.py -- local user accounts, roles and API sessions for the erobo10 controller.

Pendant-style access control (the model used by commercial cobots):
  operator    run programs, jog with reduced rights, view everything
  programmer  operator + create/edit programs, waypoints, tools
  admin       programmer + safety configuration, users, system settings

PINs are stored as salted PBKDF2-SHA256 (never plaintext) in run/users.json.
Sessions are opaque random tokens with a 12 h idle expiry, held in memory
(a controller reboot logs everyone out -- the safe behaviour).
First boot creates 'admin' with PIN 1234 flagged must_change.
"""
import hashlib, hmac, json, os, secrets, threading, time

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUN = os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run")
DEFAULT_PATH = os.path.join(_RUN, "users.json")
ROLES = ("operator", "programmer", "admin")
_RANK = {r: i for i, r in enumerate(ROLES)}
SESSION_TTL = 12 * 3600


def _hash_pin(pin, salt):
    return hashlib.pbkdf2_hmac("sha256", pin.encode(), bytes.fromhex(salt), 60000).hex()


class UserStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = path
        self._lock = threading.Lock()
        self._sessions = {}  # token -> {user, role, t_last}
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with self._lock:
            users = self._read()
            if not users:
                salt = secrets.token_hex(16)
                users = [{"name": "admin", "role": "admin", "salt": salt,
                          "hash": _hash_pin("1234", salt), "must_change": True,
                          "created": round(time.time(), 1)}]
                self._write(users)

    def _read(self):
        try:
            with open(self.path) as f:
                d = json.load(f)
            return d if isinstance(d, list) else []
        except Exception:
            return []

    def _write(self, users):
        tmp = self.path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(users, f, indent=1)
        os.replace(tmp, self.path)

    def list(self):
        with self._lock:
            return [{"name": u["name"], "role": u["role"],
                     "must_change": bool(u.get("must_change"))} for u in self._read()]

    def login(self, name, pin):
        with self._lock:
            for u in self._read():
                if u["name"] == name:
                    if hmac.compare_digest(u["hash"], _hash_pin(str(pin), u["salt"])):
                        tok = secrets.token_urlsafe(32)
                        self._sessions[tok] = {"user": name, "role": u["role"], "t_last": time.time()}
                        return {"token": tok, "user": name, "role": u["role"],
                                "must_change": bool(u.get("must_change"))}
                    return None
        return None

    def logout(self, token):
        with self._lock:
            return self._sessions.pop(token, None) is not None

    def check(self, token, min_role="operator"):
        """Returns the session dict if the token is valid and outranks min_role, else None."""
        now = time.time()
        with self._lock:
            s = self._sessions.get(token)
            if not s or now - s["t_last"] > SESSION_TTL:
                self._sessions.pop(token, None)
                return None
            s["t_last"] = now
            if _RANK.get(s["role"], -1) < _RANK.get(min_role, 99):
                return None
            return dict(s)

    def add(self, name, pin, role):
        name = str(name).strip()[:32]
        if not name or role not in ROLES or len(str(pin)) < 4:
            raise ValueError("need a name, a role (%s) and a PIN of 4+ digits" % "/".join(ROLES))
        with self._lock:
            users = self._read()
            if any(u["name"] == name for u in users):
                raise ValueError("user '%s' already exists" % name)
            salt = secrets.token_hex(16)
            users.append({"name": name, "role": role, "salt": salt,
                          "hash": _hash_pin(str(pin), salt), "must_change": False,
                          "created": round(time.time(), 1)})
            self._write(users)
        return {"name": name, "role": role}

    def set_pin(self, name, new_pin):
        if len(str(new_pin)) < 4:
            raise ValueError("PIN must be 4+ digits")
        with self._lock:
            users = self._read()
            for u in users:
                if u["name"] == name:
                    u["salt"] = secrets.token_hex(16)
                    u["hash"] = _hash_pin(str(new_pin), u["salt"])
                    u["must_change"] = False
                    self._write(users)
                    return True
        return False

    def delete(self, name):
        with self._lock:
            users = self._read()
            if len([u for u in users if u["role"] == "admin"]) <= 1 and \
               any(u["name"] == name and u["role"] == "admin" for u in users):
                raise ValueError("cannot delete the last admin")
            n = len(users)
            users = [u for u in users if u["name"] != name]
            if len(users) != n:
                self._write(users)
                self._sessions = {t: s for t, s in self._sessions.items() if s["user"] != name}
                return True
            return False
