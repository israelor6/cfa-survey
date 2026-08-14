import { motion } from 'framer-motion';
import { QUESTIONS } from '../data/questions';

export function QuestionCard({ step, value, ranking, presenterMode, onSelect }: {
  step: number; value?: string; ranking: string[]; presenterMode: boolean; onSelect: (value: string) => void;
}) {
  const question = QUESTIONS[step];
  const isRanking = step === 4;
  return <section className="question-card" aria-labelledby="question-title">
    <div className="question-heading"><div><span className="question-index">{String(step).padStart(2, '0')}</span><span className="question-kicker">Your perspective</span></div>{presenterMode && <span className="research-tag">Validates: {question.eyebrow}</span>}</div>
    <h1 id="question-title">{question.title}</h1>
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
    </div>
  </section>;
}
