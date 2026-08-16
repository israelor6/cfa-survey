import type { Answers, Thesis } from '../types/survey';

const opportunities: Record<string, string> = {
  card_spend: 'Payments engagement', direct_deposit: 'Primary relationship',
  bill_pay: 'Payments engagement', products_per_household: 'Relationship expansion',
  wealth_assets: 'Relationship expansion', term_deposits: 'Deposit depth',
  credit_relationships: 'Credit relationship expansion',
  less_external_outflow: 'Relationship retention',
};

const relationshipLabels: Record<string, string> = {
  yes_relationship_economics: 'Relationship-first', yes_selected_segments: 'Segment-specific',
  new_money_only: 'New-money focused', retention_only: 'Retention-triggered',
  no_protect_margin: 'Margin-protective',
};

const operatingLabels: Record<string, string> = {
  insights_only: 'Advisory only', customer_approval: 'Customer approved',
  customer_rules: 'Customer rule-based automation',
  bank_customer_guardrails: 'Bank + customer guardrails', high_autonomy: 'Highly autonomous',
};

export function generateThesis(answers: Answers): Thesis {
  let score = 0;
  if (answers.q1_primary_customer_share && answers.q1_primary_customer_share !== 'not_sure') score += 1;
  if (answers.q1_primary_customers_over_10k && answers.q1_primary_customers_over_10k !== 'not_sure') score += 1;
  if (['10pct_5k_plus', '10pct_10k_20k'].includes(answers.q2_deposit_viability ?? '')) score += 2;
  else if (answers.q2_deposit_viability === '20pct_10k_plus') score += 1;
  if (['yes_relationship_economics', 'yes_selected_segments', 'retention_only'].includes(answers.q3_relationship_pricing ?? '')) score += 2;
  if (answers.q4_relationship_drivers.some((value) => ['direct_deposit', 'card_spend', 'products_per_household', 'credit_relationships'].includes(value))) score += 1;
  if (answers.q7_next_step === 'pilot_sponsor') score += 3;
  else if (answers.q7_next_step === 'internal_intro') score += 2;
  else if (answers.q7_next_step === 'evaluate_further' || answers.q7_next_step === 'implementation_blocked') score += 1;

  const strategicFit = answers.q7_next_step === 'no_business_case' ? 'Limited based on current priorities'
    : score >= 9 ? 'Very strong fit' : score >= 7 ? 'Strong fit' : score >= 5 ? 'Worth exploring'
      : score >= 3 ? 'Economics require validation' : 'Limited fit';

  const readiness = answers.q7_next_step === 'pilot_sponsor' ? 'High'
    : answers.q7_next_step === 'internal_intro' ? 'Internal alignment next'
      : answers.q7_next_step === 'implementation_blocked' ? `Blocked${answers.implementation_blocker ? ` — ${answers.implementation_blocker.replaceAll('_', ' ')}` : ''}`
        : answers.q7_next_step === 'no_business_case' ? 'Low' : 'Evaluate further';

  return {
    primary_opportunity: opportunities[answers.q4_relationship_drivers[0]] ?? 'Relationship value',
    secondary_opportunity: opportunities[answers.q4_relationship_drivers[1]] ?? 'Customer primacy',
    relationship_economics: relationshipLabels[answers.q3_relationship_pricing ?? ''] ?? 'To be determined',
    operating_model: operatingLabels[answers.q6_autonomy ?? ''] ?? 'To be determined',
    strategic_fit: strategicFit,
    pilot_readiness: readiness,
  };
}
