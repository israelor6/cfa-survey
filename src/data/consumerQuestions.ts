import type { Option } from './questions';

export type ConsumerQuestion = {
  eyebrow: string;
  title: string;
  help?: string;
  type?: 'choice' | 'text';
  placeholder?: string;
  options: Option[];
};

export const CONSUMER_QUESTIONS: Record<number, ConsumerQuestion> = {
  1: {
    eyebrow: 'Financial fragmentation',
    title: 'How many places do you currently keep or manage your money?',
    help: 'Count banks, investment apps, retirement accounts, wallets and budgeting tools.',
    options: [
      { value: 'one', label: '1 place', detail: 'Almost everything is together' },
      { value: 'two_three', label: '2–3 places' },
      { value: 'four_five', label: '4–5 places' },
      { value: 'six_plus', label: '6+ places', detail: 'My finances are highly fragmented' },
    ],
  },
  2: {
    eyebrow: 'Time burden',
    title: 'How much time do you spend organizing your finances each week?',
    options: [
      { value: 'under_30m', label: 'Less than 30 minutes' },
      { value: '30m_1h', label: '30 minutes–1 hour' },
      { value: '1_2h', label: '1–2 hours' },
      { value: '2_4h', label: '2–4 hours' },
      { value: '4h_plus', label: 'More than 4 hours' },
    ],
  },
  3: {
    eyebrow: 'Unmet need',
    title: 'Would you like to organize your finances better, but simply don’t have the time?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  4: {
    eyebrow: 'Sources of advice',
    title: 'Where do you primarily get financial advice?',
    help: 'Choose the source you rely on most often.',
    options: [
      { value: 'person', label: 'A person', detail: 'Advisor, family member, friend or colleague' },
      { value: 'social', label: 'Social media', detail: 'Instagram, TikTok, YouTube or similar' },
      { value: 'ai', label: 'An AI assistant or robo-advisor' },
      { value: 'research', label: 'My own research' },
      { value: 'none', label: 'I don’t currently seek financial advice' },
    ],
  },
  5: {
    eyebrow: 'Long-term ambition',
    title: 'What best describes your financial-independence or retirement goal?',
    options: [
      { value: 'fire_under_45', label: 'Reach financial independence before 45' },
      { value: 'fire_45_55', label: 'Reach financial independence between 45 and 55' },
      { value: 'retire_traditional', label: 'Retire around the traditional retirement age' },
      { value: 'keep_working', label: 'Keep working as long as I enjoy it' },
      { value: 'not_sure', label: 'I haven’t set a goal yet' },
    ],
  },
  6: {
    eyebrow: 'Bank expectations',
    title: 'Are you exploring fintechs because you expect more help from your bank than you receive today?',
    options: [
      { value: 'yes_main_reason', label: 'Yes — that’s a main reason' },
      { value: 'yes_partly', label: 'Partly — fintechs fill some gaps' },
      { value: 'no_other_reasons', label: 'No — I use fintechs for other reasons' },
      { value: 'not_using_fintechs', label: 'I’m not currently looking at fintechs' },
    ],
  },
  7: {
    eyebrow: 'Products you value',
    title: 'Which fintechs or apps do you like for managing your money?',
    help: 'List up to three. “None” is a perfectly useful answer.',
    type: 'text',
    placeholder: 'For example: Monarch, Robinhood, Acorns',
    options: [],
  },
  8: {
    eyebrow: 'Agent proposition',
    title: 'Would you use a financial agent offered by your bank to handle tasks you currently do manually?',
    options: [
      { value: 'definitely', label: 'Definitely' },
      { value: 'probably', label: 'Probably — after seeing how it works' },
      { value: 'maybe', label: 'Maybe — only for selected tasks' },
      { value: 'probably_not', label: 'Probably not' },
      { value: 'definitely_not', label: 'Definitely not' },
    ],
  },
  9: {
    eyebrow: 'Early participation',
    title: 'Would you invest in helping a service like this get started?',
    help: 'This could mean paying for early access, investing capital, or contributing time and feedback.',
    options: [
      { value: 'invest_capital', label: 'Yes — I’d consider investing capital' },
      { value: 'pay_early_access', label: 'Yes — I’d pay for early access' },
      { value: 'beta_feedback', label: 'I’d contribute time and feedback' },
      { value: 'use_free', label: 'I’d try it, but not invest or pay yet' },
      { value: 'no', label: 'No' },
    ],
  },
  10: {
    eyebrow: 'Delegation and trust',
    title: 'With clear rules and visibility, how much would you trust it to do its job while you focus on life?',
    options: [
      { value: 'full_with_rules', label: 'Fully — within rules I set' },
      { value: 'routine_only', label: 'For routine tasks only' },
      { value: 'approve_everything', label: 'Only if I approve every action' },
      { value: 'advice_only', label: 'For advice, but not actions' },
      { value: 'would_not_trust', label: 'I would not trust it with my finances' },
    ],
  },
};
