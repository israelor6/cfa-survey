import type { ConsumerSession } from '../types/consumer';

export function buildConsumerPayload(session: ConsumerSession) {
  const completedAt = session.completedAt ?? new Date().toISOString();
  return {
    schema_version: session.schemaVersion,
    survey_type: session.surveyType,
    session_id: session.sessionId,
    metadata: {
      ...session.metadata,
      started_at: session.startedAt,
      completed_at: completedAt,
      duration_seconds: Math.max(0, Math.round((Date.parse(completedAt) - Date.parse(session.startedAt)) / 1000)),
    },
    respondent: session.respondent,
    answers: session.answers,
    step_duration_seconds: session.stepDurations,
    name: session.respondent.name ?? '',
    email: session.respondent.email ?? '',
    ...session.answers,
  };
}

export async function submitConsumerSession(session: ConsumerSession): Promise<'saved' | 'local' | 'demo'> {
  const payload = buildConsumerPayload(session);
  const consumerEndpoint = import.meta.env.VITE_CONSUMER_FORMSPREE_ENDPOINT;
  const endpoint = consumerEndpoint && !consumerEndpoint.includes('REPLACE_ME') ? consumerEndpoint : import.meta.env.VITE_FORMSPREE_ENDPOINT;
  if (!endpoint || endpoint.includes('REPLACE_ME')) {
    console.info('CFA consumer demo payload (not submitted):', payload);
    return 'demo';
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Submission rejected');
    return 'saved';
  } catch {
    return 'local';
  }
}
