import type { SessionState } from '../types/survey';

const KEY = 'cfa-conference-session-v1';

const urlMetadata = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('source') ?? undefined,
    conference: params.get('conference') ?? undefined,
    presenter: params.get('presenter') ?? undefined,
  };
};

export function newSession(): SessionState {
  const now = new Date().toISOString();
  return {
    schemaVersion: '1.0', sessionId: crypto.randomUUID(), startedAt: now, screen: 'intro',
    respondent: {}, answers: { q4_relationship_drivers: [] }, stepDurations: {},
    activeStepStartedAt: now, metadata: urlMetadata(), syncStatus: 'idle', submitted: false,
  };
}

export function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SessionState;
  } catch { /* Start safely if storage is unavailable or corrupt. */ }
  return newSession();
}

export function saveSession(session: SessionState) {
  try { localStorage.setItem(KEY, JSON.stringify(session)); } catch { /* State remains in memory. */ }
}

export function clearSession() { localStorage.removeItem(KEY); }
