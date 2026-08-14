import { describe, expect, it } from 'vitest';
import { toggleRanking } from './ranking';

describe('toggleRanking', () => {
  it('captures exactly three ranked values and ignores a fourth', () => {
    let ranking: string[] = [];
    ranking = toggleRanking(ranking, 'deposits');
    ranking = toggleRanking(ranking, 'retention');
    ranking = toggleRanking(ranking, 'card_spend');
    expect(toggleRanking(ranking, 'wealth_assets')).toEqual(ranking);
  });

  it('removes a selected value and preserves order', () => {
    expect(toggleRanking(['deposits', 'retention', 'card_spend'], 'retention'))
      .toEqual(['deposits', 'card_spend']);
  });
});
