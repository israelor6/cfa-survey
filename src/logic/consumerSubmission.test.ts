import { describe, expect, it } from 'vitest';
import type { ConsumerSession } from '../types/consumer';
import { buildConsumerPayload } from './consumerSubmission';

const session: ConsumerSession = {
  schemaVersion: '1.0', surveyType: 'consumer', sessionId: 'consumer-test',
  startedAt: '2026-08-17T12:00:00.000Z', completedAt: '2026-08-17T12:04:00.000Z',
  screen: 'summary', respondent: { name: 'Alex', email: 'alex@example.com' },
  answers: { q1: 'four_five', q2: '1_2h', q3: 'yes', q7: 'Monarch, Acorns', q10: 'full_with_rules' },
  stepDurations: { '1': 12, '2': 9 }, activeStepStartedAt: '2026-08-17T12:03:30.000Z',
  metadata: { source: 'consumer-link' }, syncStatus: 'saved', submitted: true,
};

describe('buildConsumerPayload', () => {
  it('identifies and flattens consumer survey responses', () => {
    const payload = buildConsumerPayload(session);
    expect(payload.survey_type).toBe('consumer');
    expect(payload.metadata.duration_seconds).toBe(240);
    expect(payload.answers.q7).toBe('Monarch, Acorns');
    expect((payload as Record<string, unknown>).q10).toBe('full_with_rules');
    expect(payload.email).toBe('alex@example.com');
  });
});
