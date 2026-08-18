import type { ConsumerSession } from '../types/consumer';

const KEY = 'cfa-consumer-session-v1';

export function newConsumerSession(): ConsumerSession {
  const now = new Date().toISOString();
  const params = new URLSearchParams(window.location.search);
  return {
    schemaVersion: '1.0', surveyType: 'consumer', sessionId: crypto.randomUUID(), startedAt: now,
    screen: 'intro', answers: {}, respondent: {}, stepDurations: {}, activeStepStartedAt: now,
    metadata: {
      source: params.get('source') ?? undefined,
      conference: params.get('conference') ?? undefined,
      presenter: params.get('presenter') ?? undefined,
    },
    syncStatus: 'idle', submitted: false,
  };
}

export function loadConsumerSession(): ConsumerSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ConsumerSession;
  } catch { /* Start safely if storage is unavailable or corrupt. */ }
  return newConsumerSession();
}

export function saveConsumerSession(session: ConsumerSession) {
  try { localStorage.setItem(KEY, JSON.stringify(session)); } catch { /* State remains in memory. */ }
}

export function clearConsumerSession() { localStorage.removeItem(KEY); }
