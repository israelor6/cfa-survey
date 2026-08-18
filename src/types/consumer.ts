export type ConsumerAnswers = Record<`q${number}`, string>;

export type ConsumerScreen = 'intro' | number | 'summary';

export type ConsumerSession = {
  schemaVersion: '1.0';
  surveyType: 'consumer';
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  screen: ConsumerScreen;
  answers: Partial<ConsumerAnswers>;
  respondent: { name?: string; email?: string };
  stepDurations: Record<string, number>;
  activeStepStartedAt: string;
  metadata: { source?: string; conference?: string; presenter?: string };
  syncStatus: 'idle' | 'saving' | 'saved' | 'local' | 'demo';
  submitted: boolean;
};
