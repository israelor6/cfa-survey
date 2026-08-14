export type Option = { value: string; label: string; detail?: string };

export const QUESTIONS: Record<number, { eyebrow: string; title: string; options: Option[] }> = {
  1: {
    eyebrow: 'Deposit hurdle',
    title: 'What level of incremental deposits per household would make CFA economically meaningful?',
    options: [
      { value: 'under_5k', label: 'Under $5K' },
      { value: '5k_15k', label: '$5K–$15K' },
      { value: '15k_30k', label: '$15K–$30K' },
      { value: '30k_plus', label: '$30K+' },
      { value: 'deposits_not_priority', label: 'Deposit growth is not a major priority for us' },
    ],
  },
  2: {
    eyebrow: 'Liquidity / deposit value',
    title: "How valuable is keeping more of a customer's liquidity inside your institution until it is needed?",
    options: [
      { value: 'extremely_valuable', label: 'Extremely valuable', detail: 'Deposit depth is a strategic priority' },
      { value: 'segment_specific', label: 'Valuable for selected segments' },
      { value: 'only_if_sticky', label: 'Valuable only if balances prove sticky' },
      { value: 'limited_value', label: 'Some value, but not enough to drive deployment' },
      { value: 'not_priority', label: 'Not a meaningful priority' },
    ],
  },
  3: {
    eyebrow: 'Relationship pricing',
    title: 'Would your institution give up some margin on existing balances if total deposits and primary-bank status materially increased?',
    options: [
      { value: 'yes_relationship_economics', label: 'Yes — we already manage relationship economics this way' },
      { value: 'yes_selected_segments', label: 'Yes — but only for selected segments' },
      { value: 'new_money_only', label: 'Only for new money' },
      { value: 'retention_only', label: 'Only as a retention intervention' },
      { value: 'no_protect_margin', label: 'No — protecting existing-balance margin is more important' },
    ],
  },
  4: {
    eyebrow: 'LTV drivers',
    title: 'Which behaviors would create the most additional relationship value?',
    options: [
      { value: 'deposits', label: 'More deposits' },
      { value: 'card_spend', label: 'More debit / credit card spend' },
      { value: 'direct_deposit', label: 'More direct deposit' },
      { value: 'bill_pay', label: 'More bill pay' },
      { value: 'products_per_household', label: 'More products per household' },
      { value: 'wealth_assets', label: 'Wealth / investment assets' },
      { value: 'retention', label: 'Lower churn / higher retention' },
      { value: 'less_external_outflow', label: 'Less money leaving for fintechs and neobanks' },
    ],
  },
  5: {
    eyebrow: 'Customer-first product philosophy',
    title: 'Would you allow CFA to recommend a better product at your bank when it reduces short-term product revenue?',
    options: [
      { value: 'yes_trust_first', label: 'Yes — customer trust should win long term' },
      { value: 'yes_if_relationship_value', label: 'Yes — when total relationship value increases' },
      { value: 'banker_approval', label: 'Yes — but only with banker approval' },
      { value: 'customer_requested_only', label: 'Only when the customer asks' },
      { value: 'no', label: 'No' },
    ],
  },
  6: {
    eyebrow: 'Operational autonomy',
    title: 'What is the highest level of autonomy your institution could realistically support?',
    options: [
      { value: 'insights_only', label: 'Insights only', detail: 'CFA explains what the household should do' },
      { value: 'customer_approval', label: 'Recommendations + approval', detail: 'The household approves each plan' },
      { value: 'customer_rules', label: 'Automatic actions within customer rules' },
      { value: 'bank_customer_guardrails', label: 'Bank + customer guardrails' },
      { value: 'high_autonomy', label: 'Highly autonomous financial management' },
    ],
  },
  7: {
    eyebrow: 'Buying intent',
    title: 'If a pilot demonstrated economics like these with your customers, what would you do next?',
    options: [
      { value: 'pilot_sponsor', label: "I'd sponsor a pilot" },
      { value: 'internal_intro', label: "I'd introduce this to the right executive internally" },
      { value: 'evaluate_further', label: "I'd want to evaluate it further" },
      { value: 'implementation_blocked', label: 'The economics are interesting, but implementation would block us' },
      { value: 'no_business_case', label: "I don't see a compelling business case" },
    ],
  },
};

export const BLOCKERS: Option[] = [
  ['compliance', 'Compliance / regulatory'], ['core_integration', 'Core banking integration'],
  ['data_access', 'Data access'], ['infosec', 'Information security'],
  ['customer_trust', 'Customer trust'], ['internal_ownership', 'Internal product ownership'],
  ['economics', 'Economics'], ['procurement', 'Procurement'], ['other', 'Other'],
].map(([value, label]) => ({ value, label }));

export const ROLE_OPTIONS: Option[] = [
  ['ceo_president', 'CEO / President'], ['consumer_retail', 'Consumer / Retail Banking'],
  ['digital_product', 'Digital / Product'], ['deposits_treasury', 'Deposits / Treasury'],
  ['strategy_innovation', 'Strategy / Innovation'], ['technology', 'Technology'],
  ['risk_compliance', 'Risk / Compliance'], ['other', 'Other'],
].map(([value, label]) => ({ value, label }));

export const ASSET_OPTIONS: Option[] = [
  ['under_10b', 'Under $10B'], ['10b_50b', '$10B–$50B'], ['50b_100b', '$50B–$100B'],
  ['100b_500b', '$100B–$500B'], ['500b_plus', '$500B+'], ['prefer_not', 'Prefer not to say'],
].map(([value, label]) => ({ value, label }));
