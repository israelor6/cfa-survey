import { motion } from 'framer-motion';
import { Q1_GROUPS, QUESTIONS } from '../data/questions';
import type { Answers } from '../types/survey';

export function QuestionCard({ step, value, ranking, presenterMode, answers, onSelect, onSelectGroup }: {
  step: number; value?: string; ranking: string[]; presenterMode: boolean; answers: Answers;
  onSelect: (value: string) => void;
  onSelectGroup: (key: 'q1_primary_customer_share' | 'q1_primary_customers_over_10k', value: string) => void;
}) {
  const question = QUESTIONS[step];
  const isRanking = step === 4;
  return <section className="question-card" aria-labelledby="question-title">
    <div className="question-heading"><div><span className="question-index">{String(step).padStart(2, '0')}</span><span className="question-kicker">Your perspective</span></div>{presenterMode && <span className="research-tag">Validates: {question.eyebrow}</span>}</div>
    <h1 id="question-title">{question.title}</h1>
    {step === 1 ? <div className="baseline-groups">
      {Q1_GROUPS.map((group, groupIndex) => <fieldset key={group.key}>
        <legend><span>{groupIndex + 1}</span>{group.label}</legend>
        <div className="compact-options">{group.options.map((option) => {
          const selected = answers[group.key] === option.value;
          return <motion.button type="button" key={option.value} className={`compact-option ${selected ? 'selected' : ''}`} onClick={() => onSelectGroup(group.key, option.value)} whileTap={{ scale: .98 }} aria-pressed={selected}>{option.label}</motion.button>;
        })}</div>
      </fieldset>)}
      <p className="question-help">Approximate ranges are enough. This establishes the size of the addressable relationship base.</p>
    </div> : <>
    {isRanking && <p className="question-help">Choose your top 3 in order. Tap a selection again to remove it.</p>}
    <div className={`options ${isRanking ? 'ranking-options' : ''}`} role={isRanking ? 'group' : 'radiogroup'} aria-label={question.title}>
      {question.options.map((option) => {
        const rank = ranking.indexOf(option.value);
        const selected = isRanking ? rank >= 0 : value === option.value;
        return <motion.button type="button" key={option.value} className={`option ${selected ? 'selected' : ''}`} onClick={() => onSelect(option.value)} whileTap={{ scale: .99 }} role={isRanking ? undefined : 'radio'} aria-checked={isRanking ? undefined : selected} aria-pressed={isRanking ? selected : undefined}>
          {isRanking ? <span className="rank-badge">{rank >= 0 ? rank + 1 : ''}</span> : <span className="radio-mark"><i /></span>}
          <span><b>{option.label}</b>{option.detail && <small>{option.detail}</small>}</span>
        </motion.button>;
      })}
    </div></>}
  </section>;
}
