export type Option = { value: string; label: string; detail?: string };

export const QUESTIONS: Record<number, { eyebrow: string; title: string; options: Option[] }> = {
  1: {
    eyebrow: 'Primary relationship base',
    title: 'How much of your customer base already behaves like a primary-bank relationship?',
    options: [],
  },
  2: {
    eyebrow: 'Economic viability',
    title: 'What deposit outcome would make investment in an autonomous financial agent economically viable?',
    options: [
      { value: '10pct_5k_plus', label: '10% of customers add more than $5K' },
      { value: '10pct_10k_20k', label: '10% of customers add $10K–$20K' },
      { value: '20pct_10k_plus', label: '20% of customers add more than $10K' },
      { value: '20pct_30k_plus', label: '20% of customers add more than $30K' },
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
      { value: 'no_protect_margin', label: 'No — protecting product margin matters more than total interest income' },
    ],
  },
  4: {
    eyebrow: 'LTV drivers',
    title: 'Which behaviors signal a deeper, more valuable banking relationship?',
    options: [
      { value: 'card_spend', label: 'More debit / credit card spend' },
      { value: 'direct_deposit', label: 'More direct deposit' },
      { value: 'bill_pay', label: 'More bill pay' },
      { value: 'products_per_household', label: 'More products per household' },
      { value: 'wealth_assets', label: 'Wealth / investment assets' },
      { value: 'term_deposits', label: 'CDs / term deposits' },
      { value: 'credit_relationships', label: 'Loans / lines of credit' },
      { value: 'less_external_outflow', label: 'Less money leaving for fintechs and neobanks' },
    ],
  },
  5: {
    eyebrow: 'Customer-first product philosophy',
    title: 'Would you allow CFA to recommend a better product at your bank when it reduces short-term product revenue?',
    options: [
      { value: 'yes_trust_first', label: 'Yes — CFA can show the best eligible product proactively' },
      { value: 'yes_if_relationship_value', label: 'Only when modeled relationship value offsets lost margin' },
      { value: 'banker_approval', label: 'Only after a banker approves the recommendation' },
      { value: 'customer_requested_only', label: 'Only during a customer-initiated product review' },
      { value: 'no', label: 'No — product-level economics remain primary' },
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
      { value: 'pilot_sponsor', label: "I'd sponsor a pilot and work toward internal approval" },
      { value: 'internal_intro', label: "I'd introduce this to the right executive internally" },
      { value: 'evaluate_further', label: "I'd want to evaluate it further" },
      { value: 'implementation_blocked', label: 'The economics are interesting, but implementation would block us' },
      { value: 'no_business_case', label: "I don't see a compelling business case" },
    ],
  },
};

export const Q1_GROUPS = [
  {
    key: 'q1_primary_customer_share' as const,
    label: 'Approximately what share of customers consider you their primary bank?',
    options: [
      { value: 'under_20pct', label: 'Under 20%' }, { value: '20_40pct', label: '20%–40%' },
      { value: '40_60pct', label: '40%–60%' }, { value: '60pct_plus', label: '60%+' },
      { value: 'not_sure', label: 'Not sure' },
    ],
  },
  {
    key: 'q1_primary_customers_over_10k' as const,
    label: 'How many of those customers hold more than $10K in deposits?',
    options: [
      { value: 'under_10k', label: 'Under 10K' }, { value: '10k_50k', label: '10K–50K' },
      { value: '50k_250k', label: '50K–250K' }, { value: '250k_plus', label: '250K+' },
      { value: 'not_sure', label: 'Not sure' },
    ],
  },
] as const;

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

// A lightweight offline directory keeps conference use fast. Free text remains supported.
export const BANK_DIRECTORY = [
  { name: 'JPMorgan Chase', assetSize: '500b_plus' },
  { name: 'Bank of America', assetSize: '500b_plus' },
  { name: 'Citibank', assetSize: '500b_plus' },
  { name: 'Wells Fargo', assetSize: '500b_plus' },
  { name: 'U.S. Bank', assetSize: '500b_plus' },
  { name: 'PNC Bank', assetSize: '100b_500b' },
  { name: 'Truist Bank', assetSize: '500b_plus' },
  { name: 'Capital One', assetSize: '500b_plus' },
  { name: 'TD Bank', assetSize: '100b_500b' },
  { name: 'BMO Bank', assetSize: '100b_500b' },
  { name: 'Citizens Bank', assetSize: '100b_500b' },
  { name: 'Fifth Third Bank', assetSize: '100b_500b' },
  { name: 'M&T Bank', assetSize: '100b_500b' },
  { name: 'Huntington Bank', assetSize: '100b_500b' },
  { name: 'KeyBank', assetSize: '100b_500b' },
  { name: 'Regions Bank', assetSize: '100b_500b' },
  { name: 'Ally Bank', assetSize: '100b_500b' },
  { name: 'Navy Federal Credit Union', assetSize: '100b_500b' },
] as const;
