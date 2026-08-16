import { describe, expect, it } from 'vitest';
import { toggleRanking } from './ranking';

describe('toggleRanking', () => {
  it('captures exactly three ranked values and ignores a fourth', () => {
    let ranking: string[] = [];
    ranking = toggleRanking(ranking, 'direct_deposit');
    ranking = toggleRanking(ranking, 'credit_relationships');
    ranking = toggleRanking(ranking, 'card_spend');
    expect(toggleRanking(ranking, 'wealth_assets')).toEqual(ranking);
  });

  it('removes a selected value and preserves order', () => {
    expect(toggleRanking(['direct_deposit', 'credit_relationships', 'card_spend'], 'credit_relationships'))
      .toEqual(['direct_deposit', 'card_spend']);
  });
});
