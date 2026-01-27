const STORAGE_KEY = "bct_r1_session_v1";
const TTL_MS = 24 * 60 * 60 * 1000;

export function saveSession(session) {
  try {
    const payload = {
      savedAt: Date.now(),
      session,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // best-effort; do not block UX
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || !payload.savedAt || !payload.session) return null;
    if (Date.now() - payload.savedAt > TTL_MS) {
      clearSession();
      return null;
    }
    return payload.session;
  } catch {
    return null;
  }
}

export function hasSession() {
  return !!loadSession();
}

export function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
