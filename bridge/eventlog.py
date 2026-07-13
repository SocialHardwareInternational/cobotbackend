#!/usr/bin/env python3
"""eventlog.py -- persistent event / alarm / audit log for the erobo10 controller.

SQLite-backed (run/erobo.db), thread-safe, bounded (auto-prunes to the newest
50k rows). Every safety event, mode change, program event, fault, and mutating
API action is recorded so an integrator can audit what the robot did and why --
the "flight recorder" every commercial controller ships with.

Levels: debug < info < warn < alarm.  `code` is a short machine-readable key
(e.g. "PROTECTIVE_STOP", "PROGRAM_DONE"); `data` is an optional JSON payload.
"""
import json, os, sqlite3, threading, time

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUN = os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run")
DEFAULT_DB = os.path.join(_RUN, "erobo.db")
LEVELS = ("debug", "info", "warn", "alarm")
MAX_ROWS = 50000


class EventLog:
    def __init__(self, path=DEFAULT_DB):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self._lock = threading.Lock()
        self._n = 0
        # The controller must NEVER fail to boot because the flight recorder cannot
        # write (network shares / read-only media / broken disks). Degrade in order:
        # WAL -> rollback journal -> in-memory (loud warning, still fully functional).
        self._db = None
        for attempt, (target, pragma) in enumerate(
                [(path, "WAL"), (path, "DELETE"), (":memory:", None)]):
            try:
                db = sqlite3.connect(target, check_same_thread=False)
                if pragma:
                    db.execute("PRAGMA journal_mode=%s" % pragma)
                db.execute("""CREATE TABLE IF NOT EXISTS events(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    t REAL NOT NULL, level TEXT NOT NULL, source TEXT NOT NULL,
                    code TEXT NOT NULL, message TEXT NOT NULL, data TEXT)""")
                db.execute("""CREATE TABLE IF NOT EXISTS counters(
                    key TEXT PRIMARY KEY, value REAL NOT NULL)""")
                db.execute("CREATE INDEX IF NOT EXISTS idx_events_t ON events(t)")
                db.commit()
                self._db = db
                if target == ":memory:":
                    print("[eventlog] WARNING: cannot write %s -- event log is IN MEMORY "
                          "only (move EROBO_RUN_DIR to a local disk to persist it)" % path)
                elif attempt == 1:
                    print("[eventlog] note: WAL unavailable on this filesystem -- using "
                          "rollback journal")
                break
            except sqlite3.Error:
                try:
                    db.close()
                except Exception:
                    pass
                continue

    def log(self, level, source, code, message, data=None):
        if level not in LEVELS:
            level = "info"
        try:
            self._log_impl(level, source, code, message, data)
        except sqlite3.Error as e:
            print("[eventlog] write failed (%s): %s %s" % (e, code, message))

    def _log_impl(self, level, source, code, message, data=None):
        with self._lock:
            self._db.execute("INSERT INTO events(t,level,source,code,message,data) VALUES(?,?,?,?,?,?)",
                             (time.time(), level, source, code, str(message)[:500],
                              json.dumps(data) if data is not None else None))
            self._n += 1
            if self._n >= 200:  # amortized prune + commit batching
                self._n = 0
                self._db.execute(
                    "DELETE FROM events WHERE id < (SELECT COALESCE(MAX(id),0) FROM events) - ?", (MAX_ROWS,))
            self._db.commit()

    def query(self, since=0.0, level=None, source=None, limit=500):
        q = "SELECT id,t,level,source,code,message,data FROM events WHERE t>?"
        args = [float(since)]
        if level:
            idx = LEVELS.index(level) if level in LEVELS else 0
            q += " AND level IN (%s)" % ",".join("?" * len(LEVELS[idx:]))
            args += list(LEVELS[idx:])
        if source:
            q += " AND source=?"
            args.append(source)
        q += " ORDER BY id DESC LIMIT ?"
        args.append(max(1, min(5000, int(limit))))
        with self._lock:
            rows = self._db.execute(q, args).fetchall()
        out = []
        for r in rows:
            out.append({"id": r[0], "t": round(r[1], 3), "level": r[2], "source": r[3],
                        "code": r[4], "message": r[5],
                        "data": json.loads(r[6]) if r[6] else None})
        return out

    def bump(self, key, by=1.0):
      try:
        with self._lock:
            self._db.execute("INSERT INTO counters(key,value) VALUES(?,?) "
                             "ON CONFLICT(key) DO UPDATE SET value=value+?", (key, by, by))
            self._db.commit()
      except sqlite3.Error:
        pass

    def counters(self):
        with self._lock:
            rows = self._db.execute("SELECT key,value FROM counters").fetchall()
        return {k: v for k, v in rows}

    def alarm_summary(self, window_s=86400.0):
        """Alarm counts by code over the window -- feeds predictive-maintenance hints."""
        with self._lock:
            rows = self._db.execute(
                "SELECT code, COUNT(*) FROM events WHERE level='alarm' AND t>? GROUP BY code ORDER BY 2 DESC",
                (time.time() - window_s,)).fetchall()
        return [{"code": r[0], "count": r[1]} for r in rows]
