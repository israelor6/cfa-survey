import { generateThesis } from './thesis';
import type { SessionState, SurveySubmission } from '../types/survey';

export function buildPayload(session: SessionState) {
  const completedAt = session.completedAt ?? new Date().toISOString();
  const structured: SurveySubmission = {
    schema_version: session.schemaVersion,
    session_id: session.sessionId,
    metadata: {
      ...session.metadata,
      started_at: session.startedAt,
      completed_at: completedAt,
      duration_seconds: Math.max(0, Math.round((Date.parse(completedAt) - Date.parse(session.startedAt)) / 1000)),
    },
    respondent: session.respondent,
    answers: {
      q1_deposit_threshold: session.answers.q1_deposit_threshold ?? '',
      q2_liquidity_value: session.answers.q2_liquidity_value ?? '',
      q3_relationship_pricing: session.answers.q3_relationship_pricing ?? '',
      q4_relationship_drivers: session.answers.q4_relationship_drivers,
      q5_customer_first_recommendation: session.answers.q5_customer_first_recommendation ?? '',
      q6_autonomy: session.answers.q6_autonomy ?? '',
      q7_next_step: session.answers.q7_next_step ?? '',
      implementation_blocker: session.answers.implementation_blocker,
      implementation_blocker_other: session.answers.implementation_blocker_other,
    },
    step_duration_seconds: session.stepDurations,
    generated_thesis: generateThesis(session.answers),
  };
  return {
    ...structured,
    bank_name: session.respondent.bank_name ?? '', role: session.respondent.role ?? '',
    asset_size: session.respondent.asset_size ?? '', name: session.respondent.name ?? '', email: session.respondent.email ?? '',
    q1_deposit_threshold: structured.answers.q1_deposit_threshold,
    q2_liquidity_value: structured.answers.q2_liquidity_value,
    q3_relationship_pricing: structured.answers.q3_relationship_pricing,
    q4_rank_1: structured.answers.q4_relationship_drivers[0] ?? '',
    q4_rank_2: structured.answers.q4_relationship_drivers[1] ?? '',
    q4_rank_3: structured.answers.q4_relationship_drivers[2] ?? '',
    q5_customer_first: structured.answers.q5_customer_first_recommendation,
    q6_autonomy: structured.answers.q6_autonomy, q7_next_step: structured.answers.q7_next_step,
    blocker: structured.answers.implementation_blocker ?? '',
    thesis_primary: structured.generated_thesis.primary_opportunity,
    thesis_operating_model: structured.generated_thesis.operating_model,
    thesis_strategic_fit: structured.generated_thesis.strategic_fit,
  };
}

export async function submitSession(session: SessionState): Promise<'saved' | 'local' | 'demo'> {
  const payload = buildPayload(session);
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  if (!endpoint || endpoint.includes('REPLACE_ME')) {
    console.info('CFA demo payload (not submitted):', payload);
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
