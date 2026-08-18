import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CONSUMER_QUESTIONS } from '../data/consumerQuestions';
import { clearConsumerSession, loadConsumerSession, newConsumerSession, saveConsumerSession } from '../logic/consumerPersistence';
import { submitConsumerSession } from '../logic/consumerSubmission';
import type { ConsumerScreen, ConsumerSession } from '../types/consumer';
import { ConsumerProductDemo } from './ConsumerProductDemo';

function Brand() { return <div className="brand"><span>✦</span><b>CFA</b><small>Chief Financial Agent</small></div>; }

function ConsumerQuestionCard({ step, session, onAnswer }: { step: number; session: ConsumerSession; onAnswer: (value: string) => void }) {
  const question = CONSUMER_QUESTIONS[step];
  const value = session.answers[`q${step}`] ?? '';
  return <section className="question-card consumer-question-card" aria-labelledby="consumer-question-title">
    <div className="question-heading"><div><span className="question-index">{String(step).padStart(2, '0')}</span><span className="question-kicker">About your financial life</span></div><span className="consumer-research-tag">{question.eyebrow}</span></div>
    <h1 id="consumer-question-title">{question.title}</h1>
    {question.help && <p className="consumer-question-help">{question.help}</p>}
    {question.type === 'text' ? <label className="consumer-text-answer"><span>Your answer</span><textarea value={value} onChange={(event) => onAnswer(event.target.value)} placeholder={question.placeholder} maxLength={180} autoFocus /><small>{value.length}/180</small></label> : <div className="options" role="radiogroup" aria-label={question.title}>{question.options.map((option) => {
      const selected = option.value === value;
      return <motion.button type="button" key={option.value} className={`option ${selected ? 'selected' : ''}`} onClick={() => onAnswer(option.value)} whileTap={{ scale: .99 }} role="radio" aria-checked={selected}><span className="radio-mark"><i /></span><span><b>{option.label}</b>{option.detail && <small>{option.detail}</small>}</span></motion.button>;
    })}</div>}
  </section>;
}

function ConsumerSummary({ session, onContact, onSync, onReset }: { session: ConsumerSession; onContact: (key: 'name' | 'email', value: string) => void; onSync: () => Promise<'saved' | 'local' | 'demo'>; onReset: () => void }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const fragmentation = ['four_five', 'six_plus'].includes(session.answers.q1 ?? '');
  const wantsHelp = session.answers.q3 === 'yes';
  const adoption = ['definitely', 'probably'].includes(session.answers.q8 ?? '');
  const trust = session.answers.q10 === 'full_with_rules' ? 'Automation within your rules' : session.answers.q10 === 'routine_only' ? 'Routine-task automation' : session.answers.q10 === 'approve_everything' ? 'Approval before every action' : session.answers.q10 === 'advice_only' ? 'Advice first' : 'Trust still needs to be earned';
  const send = async () => {
    setStatus('saving');
    const result = await onSync();
    setStatus(result === 'saved' || result === 'demo' ? 'success' : 'error');
  };
  return <main className="summary-screen consumer-summary"><div className="summary-top"><Brand /><a className="route-link" href="#/banks">Bank survey →</a></div><div className="summary-grid"><section className="summary-main"><span className="overline">Your CFA perspective</span><h1>Thanks — you’ve helped shape a more useful financial agent.</h1><p>Your responses point to a product that should prioritize</p><h2>{fragmentation ? 'one connected financial picture' : 'lightweight financial coordination'} + {wantsHelp ? ' time-saving automation' : ' proactive guidance'}</h2><div className="summary-dimensions"><div><span>Consumer need</span><b>{wantsHelp ? 'Clear need for more organization' : 'Current system largely works'}</b></div><div><span>Agent adoption</span><b>{adoption ? 'Strong interest' : 'Trust must build gradually'}</b></div><div><span>Preferred trust model</span><b>{trust}</b></div><div><span>Favorite tools</span><b>{session.answers.q7 || 'None listed'}</b></div></div><div className="consumer-summary-note"><span>✦</span><p>CFA should make the full financial picture easier to understand, automate only within clear boundaries, and leave the customer in control.</p></div></section><aside className="send-card"><span className="overline">Optional</span><h3>Stay close to the build</h3><p>Add your details if you’d like to hear about future research or early access.</p><label>Name<input value={session.respondent.name ?? ''} onChange={(event) => { onContact('name', event.target.value); setStatus('idle'); }} placeholder="Your name" autoComplete="name" /></label><label>Email<input type="email" value={session.respondent.email ?? ''} onChange={(event) => { onContact('email', event.target.value); setStatus('idle'); }} placeholder="you@example.com" autoComplete="email" /></label><button className={`primary-button send-button ${status === 'success' ? 'sent' : ''}`} type="button" disabled={!session.respondent.email || status === 'saving' || status === 'success'} onClick={() => void send()}>{status === 'saving' ? 'Sending…' : status === 'success' ? '✓ Saved' : status === 'error' ? 'Retry' : 'Keep me informed →'}</button>{status === 'error' && <p className="local-note" role="status">Your response is saved on this device. Retry when your connection returns.</p>}<button className="text-button new-session-link" type="button" onClick={onReset}>Start another response</button></aside></div></main>;
}

export function ConsumerSurvey() {
  const [session, setSession] = useState<ConsumerSession>(loadConsumerSession);
  const [confirmReset, setConfirmReset] = useState(false);
  const step = typeof session.screen === 'number' ? session.screen : null;

  useEffect(() => { saveConsumerSession(session); }, [session]);

  const canContinue = useMemo(() => step ? Boolean(session.answers[`q${step}`]?.trim()) : false, [session.answers, step]);

  const go = (screen: ConsumerScreen) => {
    setSession((current) => {
      const now = new Date();
      const elapsed = Math.max(0, Math.round((now.getTime() - Date.parse(current.activeStepStartedAt)) / 1000));
      return { ...current, screen, activeStepStartedAt: now.toISOString(), stepDurations: { ...current.stepDurations, [String(current.screen)]: (current.stepDurations[String(current.screen)] ?? 0) + elapsed } };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = async () => {
    const now = new Date();
    const elapsed = Math.max(0, Math.round((now.getTime() - Date.parse(session.activeStepStartedAt)) / 1000));
    const completed: ConsumerSession = { ...session, screen: 'summary', completedAt: now.toISOString(), syncStatus: 'saving', stepDurations: { ...session.stepDurations, [String(session.screen)]: (session.stepDurations[String(session.screen)] ?? 0) + elapsed } };
    setSession(completed);
    window.scrollTo({ top: 0 });
    const syncStatus = await submitConsumerSession(completed);
    setSession((current) => ({ ...current, syncStatus, submitted: syncStatus === 'saved' }));
  };

  const sync = async () => {
    const completed = { ...session, completedAt: session.completedAt ?? new Date().toISOString(), syncStatus: 'saving' as const };
    setSession(completed);
    const syncStatus = await submitConsumerSession(completed);
    setSession((current) => ({ ...current, syncStatus, submitted: syncStatus === 'saved' }));
    return syncStatus;
  };

  const reset = () => {
    clearConsumerSession();
    setSession(newConsumerSession());
    setConfirmReset(false);
    window.scrollTo({ top: 0 });
  };

  return <div className="app-shell consumer-shell"><AnimatePresence mode="wait">
    {session.screen === 'intro' && <motion.main className="intro-screen consumer-intro" key="consumer-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><header><Brand /><div className="audience-nav"><a href="#/banks">For banks</a><a className="active" href="#/consumer">For consumers</a></div></header><div className="intro-content"><span className="intro-signal"><i /> A 4-minute conversation</span><h1>What if managing money took <em>less of your life</em>?</h1><p>Tell us how you manage finances today and explore what a trusted financial agent could do for you.</p><button className="primary-button intro-cta" type="button" onClick={() => go(1)}>Start the consumer survey <span>→</span></button></div><div className="consumer-intro-product"><div className="life-card"><span>This week</span><b>3 tasks handled</b><small>Bills covered · cash optimized · goals on track</small></div><div className="life-message"><span>✦</span><p><b>Your plan is current.</b><small>Go focus on life.</small></p></div></div><footer>Your money <i /> Your rules <i /> More time for life</footer></motion.main>}
    {step && <motion.div className="experience" key={`consumer-step-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><header className="app-header experience-header"><Brand /><div className="progress consumer-progress" aria-label={`Step ${step} of 10`}><span>{step} / 10</span><div>{Array.from({ length: 10 }, (_, index) => index + 1).map((number) => <i key={number} className={number <= step ? 'filled' : ''} />)}</div></div></header><main className="experience-grid"><ConsumerProductDemo step={step} session={session} /><ConsumerQuestionCard step={step} session={session} onAnswer={(value) => setSession((current) => ({ ...current, answers: { ...current.answers, [`q${step}`]: value } }))} /></main><nav className="step-nav"><button className="back-button" type="button" onClick={() => go(step === 1 ? 'intro' : step - 1)}>← Back</button><button className="primary-button" type="button" disabled={!canContinue} onClick={() => step < 10 ? go(step + 1) : void finish()}>{step === 10 ? 'Complete survey' : 'Continue'} <span>→</span></button></nav></motion.div>}
    {session.screen === 'summary' && <motion.div key="consumer-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ConsumerSummary session={session} onContact={(key, value) => setSession((current) => ({ ...current, respondent: { ...current.respondent, [key]: value } }))} onSync={sync} onReset={() => setConfirmReset(true)} />{confirmReset && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="consumer-reset-title"><span className="agent-star">✦</span><h2 id="consumer-reset-title">Start another response?</h2><p>This clears the current consumer answers and starts a new session.</p><div><button className="back-button" type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="primary-button" type="button" onClick={reset}>Start new response</button></div></div></div>}</motion.div>}
  </AnimatePresence></div>;
}
