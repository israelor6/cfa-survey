import { describe, expect, it } from 'vitest';
import { generateThesis } from './thesis';
import type { Answers } from '../types/survey';

const base: Answers = {
  q1_primary_customer_share: '40_60pct', q1_primary_customers_over_10k: '50k_250k',
  q2_deposit_viability: '10pct_10k_20k',
  q3_relationship_pricing: 'yes_selected_segments',
  q4_relationship_drivers: ['direct_deposit', 'credit_relationships', 'card_spend'],
  q5_customer_first_recommendation: 'yes_if_relationship_value',
  q6_autonomy: 'customer_approval', q7_next_step: 'pilot_sponsor',
};

describe('generateThesis', () => {
  it('maps ranked priorities and relationship choices deterministically', () => {
    expect(generateThesis(base)).toMatchObject({
      primary_opportunity: 'Primary relationship', secondary_opportunity: 'Credit relationship expansion',
      relationship_economics: 'Segment-specific', operating_model: 'Customer approved',
      strategic_fit: 'Very strong fit', pilot_readiness: 'High',
    });
  });

  it('does not overstate fit when no business case is selected', () => {
    expect(generateThesis({ ...base, q7_next_step: 'no_business_case' }).strategic_fit)
      .toBe('Limited based on current priorities');
  });
});
