export type Screen = 'intro' | 'context' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'blocker' | 'summary';

export type Answers = {
  q1_deposit_threshold?: string;
  q2_liquidity_value?: string;
  q3_relationship_pricing?: string;
  q4_relationship_drivers: string[];
  q5_customer_first_recommendation?: string;
  q6_autonomy?: string;
  q7_next_step?: string;
  implementation_blocker?: string;
  implementation_blocker_other?: string;
};

export type Respondent = {
  bank_name?: string;
  role?: string;
  asset_size?: string;
  name?: string;
  email?: string;
};

export type Thesis = {
  primary_opportunity: string;
  secondary_opportunity: string;
  relationship_economics: string;
  operating_model: string;
  strategic_fit: string;
  pilot_readiness: string;
};

export type SessionState = {
  schemaVersion: '1.0';
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  screen: Screen;
  respondent: Respondent;
  answers: Answers;
  stepDurations: Record<string, number>;
  activeStepStartedAt: string;
  metadata: { source?: string; conference?: string; presenter?: string };
  syncStatus: 'idle' | 'saving' | 'saved' | 'local' | 'demo';
  submitted: boolean;
};

export type SurveySubmission = {
  schema_version: string;
  session_id: string;
  metadata: {
    source?: string;
    conference?: string;
    presenter?: string;
    started_at: string;
    completed_at: string;
    duration_seconds: number;
  };
  respondent: Respondent;
  answers: Required<Pick<Answers,
    'q1_deposit_threshold' | 'q2_liquidity_value' | 'q3_relationship_pricing' |
    'q4_relationship_drivers' | 'q5_customer_first_recommendation' |
    'q6_autonomy' | 'q7_next_step'>> & Pick<Answers, 'implementation_blocker' | 'implementation_blocker_other'>;
  step_duration_seconds: Record<string, number>;
  generated_thesis: Thesis;
};
