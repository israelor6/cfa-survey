import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitSession } from './submission';
import type { SessionState } from '../types/survey';

const session: SessionState = {
  schemaVersion: '1.0', sessionId: 'test-session', startedAt: '2026-08-14T12:00:00.000Z',
  completedAt: '2026-08-14T12:03:00.000Z', screen: 'summary', respondent: {},
  answers: {
    q1_deposit_threshold: '15k_30k', q2_liquidity_value: 'extremely_valuable',
    q3_relationship_pricing: 'yes_selected_segments',
    q4_relationship_drivers: ['deposits', 'retention', 'card_spend'],
    q5_customer_first_recommendation: 'yes_if_relationship_value',
    q6_autonomy: 'customer_approval', q7_next_step: 'pilot_sponsor',
  },
  stepDurations: {}, activeStepStartedAt: '2026-08-14T12:02:30.000Z', metadata: {},
  syncStatus: 'idle', submitted: false,
};

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('submitSession', () => {
  it('reports a successful Formspree submission', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    await expect(submitSession(session)).resolves.toBe('saved');
  });

  it('keeps the response local when the connection fails', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(submitSession(session)).resolves.toBe('local');
  });

  it('uses demo mode when the endpoint is missing', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', '');
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    await expect(submitSession(session)).resolves.toBe('demo');
  });
});
