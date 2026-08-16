import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BLOCKERS, QUESTIONS, ROLE_OPTIONS, ASSET_OPTIONS } from './data/questions';
import { ProductDemo } from './components/ProductDemos';
import { QuestionCard } from './components/QuestionCard';
import { PresenterMenu } from './components/PresenterMenu';
import { clearSession, loadSession, newSession, saveSession } from './logic/persistence';
import { generateThesis } from './logic/thesis';
import { submitSession } from './logic/submission';
import { toggleRanking } from './logic/ranking';
import type { Answers, Screen, SessionState } from './types/survey';

const answerKeys: Partial<Record<number, Exclude<keyof Answers, 'q4_relationship_drivers' | 'implementation_blocker' | 'implementation_blocker_other' | 'q1_primary_customer_share' | 'q1_primary_customers_over_10k'>>> = {
  2: 'q2_deposit_viability', 3: 'q3_relationship_pricing',
  5: 'q5_customer_first_recommendation', 6: 'q6_autonomy', 7: 'q7_next_step',
};

function Brand() { return <div className="brand"><span>✦</span><b>CFA</b><small>Chief Financial Agent</small></div>; }

function ContextScreen({ session, onChange, onContinue }: { session: SessionState; onChange: (key: 'bank_name' | 'role' | 'asset_size', value: string) => void; onContinue: () => void }) {
  return <main className="context-screen"><div className="context-visual"><span className="overline">Before we begin</span><h1>Make this conversation relevant to your institution.</h1><p>It’ll help us understand the magnitude of the opportunity.</p><div className="context-signal"><span>3–5 min</span><span>7 strategic tradeoffs</span><span>1 CFA thesis</span></div></div><section className="context-card"><label>Bank / institution <small>Optional</small><input value={session.respondent.bank_name ?? ''} onChange={(e) => onChange('bank_name', e.target.value)} placeholder="Enter institution name" autoComplete="organization" /></label><label>Your role <select value={session.respondent.role ?? ''} onChange={(e) => onChange('role', e.target.value)}><option value="">Select role</option>{ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label><label>Institution asset size <select value={session.respondent.asset_size ?? ''} onChange={(e) => onChange('asset_size', e.target.value)}><option value="">Select asset size</option>{ASSET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label><button className="primary-button" type="button" onClick={onContinue}>Continue <span>→</span></button><button className="text-button" type="button" onClick={onContinue}>Skip for now</button></section></main>;
}

function Summary({ session, onContact, onSync, onDone, onReset }: { session: SessionState; onContact: (key: 'name' | 'email', value: string) => void; onSync: () => Promise<'saved' | 'local' | 'demo'>; onDone: () => void; onReset: () => void }) {
  const [contactStatus, setContactStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const thesis = generateThesis(session.answers);
  const labels = QUESTIONS[4].options.reduce<Record<string,string>>((map, o) => ({ ...map, [o.value]: o.label }), {});
  const blocked = session.answers.q7_next_step === 'implementation_blocked';
  const noCase = session.answers.q7_next_step === 'no_business_case';
  const sendContact = async () => {
    setContactStatus('saving');
    const result = await onSync();
    setContactStatus(result === 'saved' ? 'success' : 'error');
  };

  return <main className="summary-screen"><div className="summary-top"><Brand /><span className={`sync-pill ${session.syncStatus}`}>{session.syncStatus === 'saved' ? '✓ Saved' : session.syncStatus === 'local' ? 'Saved on this device' : session.syncStatus === 'saving' ? 'Saving…' : session.syncStatus === 'demo' ? 'Saved locally' : 'Complete'}</span></div><div className="summary-grid"><section className="summary-main"><span className="overline">CFA × {session.respondent.bank_name || 'Your Institution'}</span><h1>{noCase ? "Thanks — that's useful signal." : "Thanks — this is your CFA thesis."}</h1><p>Your responses suggest CFA would primarily be a</p><h2>{thesis.primary_opportunity} + {thesis.secondary_opportunity.toLowerCase()} product</h2><div className="summary-dimensions"><div><span>Relationship pricing stance</span><b>{thesis.relationship_economics}</b></div><div><span>Preferred operating model</span><b>{thesis.operating_model}</b></div><div><span>Strategic fit based on your answers</span><b>{thesis.strategic_fit}</b></div><div><span>Pilot readiness</span><b>{thesis.pilot_readiness}</b></div></div>{blocked && <div className="blocker-summary"><div><span>Economic interest</span><b>Positive</b></div><div><span>Deployment readiness</span><b>{thesis.pilot_readiness}</b></div></div>}<div className="driver-summary"><span>Your top relationship drivers</span><ol>{session.answers.q4_relationship_drivers.map((d) => <li key={d}>{labels[d]}</li>)}</ol></div></section><aside className="send-card"><span className="overline">Optional</span><h3>Send me this summary</h3><p>Add professional contact details to include them with this response.</p><label>Name<input value={session.respondent.name ?? ''} onChange={(e) => { onContact('name', e.target.value); setContactStatus('idle'); }} autoComplete="name" placeholder="Your name" disabled={contactStatus === 'saving'} /></label><label>Work email<input type="email" value={session.respondent.email ?? ''} onChange={(e) => { onContact('email', e.target.value); setContactStatus('idle'); }} autoComplete="email" placeholder="name@institution.com" disabled={contactStatus === 'saving'} /></label><button className={`primary-button send-button ${contactStatus === 'success' ? 'sent' : ''}`} type="button" onClick={() => void sendContact()} disabled={!session.respondent.email || contactStatus === 'saving' || contactStatus === 'success'}>{contactStatus === 'saving' ? <><span className="button-spinner" aria-hidden="true" /> Sending…</> : contactStatus === 'success' ? <>✓ Sent successfully</> : <>{contactStatus === 'error' ? 'Retry submission' : 'Send this thesis'} <span>→</span></>}</button>{contactStatus === 'success' && <div className="send-success" role="status"><b>Thank you — submitted successfully.</b><span>Your contact details were added to this CFA response.</span></div>}{contactStatus === 'error' && <p className="local-note" role="status">Connection unavailable. Your complete response is safe on this device. Retry when the connection returns.</p>}<button className="text-button" type="button" onClick={onDone}>Done</button><button className="text-button new-session-link" type="button" onClick={onReset}>Start another conversation</button></aside></div></main>;
}

export function App() {
  const [session, setSession] = useState<SessionState>(() => loadSession());
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const presenterMode = new URLSearchParams(window.location.search).get('presenter') === '1';
  const demoMode = !import.meta.env.VITE_FORMSPREE_ENDPOINT || import.meta.env.VITE_FORMSPREE_ENDPOINT.includes('REPLACE_ME');

  useEffect(() => { saveSession(session); }, [session]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (presenterMode && event.key.toLowerCase() === 'r' && !['INPUT', 'SELECT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) setPresenterOpen((open) => !open); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [presenterMode]);

  const step = typeof session.screen === 'number' ? session.screen : null;
  const selected = step && step !== 1 && step !== 4 ? session.answers[answerKeys[step]!] : undefined;
  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step === 1) return Boolean(session.answers.q1_primary_customer_share && session.answers.q1_primary_customers_over_10k);
    if (step === 4) return session.answers.q4_relationship_drivers.length === 3;
    return Boolean(session.answers[answerKeys[step]!]);
  }, [session.answers, step]);

  const go = (screen: Screen) => {
    setSession((current) => {
      const now = new Date();
      const elapsed = Math.max(0, Math.round((now.getTime() - Date.parse(current.activeStepStartedAt)) / 1000));
      return { ...current, screen, activeStepStartedAt: now.toISOString(), stepDurations: { ...current.stepDurations, [String(current.screen)]: (current.stepDurations[String(current.screen)] ?? 0) + elapsed } };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectAnswer = (value: string) => setSession((current) => {
    if (step === 4) {
      const existing = current.answers.q4_relationship_drivers;
      const next = toggleRanking(existing, value);
      return { ...current, answers: { ...current.answers, q4_relationship_drivers: next } };
    }
    if (!step) return current;
    return { ...current, answers: { ...current.answers, [answerKeys[step]!]: value } };
  });

  const sync = async (state = session) => {
    const completed = { ...state, completedAt: state.completedAt ?? new Date().toISOString(), syncStatus: 'saving' as const };
    setSession(completed);
    const status = await submitSession(completed);
    setSession((current) => ({ ...current, syncStatus: status, submitted: status === 'saved' }));
    return status;
  };

  const finish = async () => {
    const completedAt = new Date();
    const elapsed = Math.max(0, Math.round((completedAt.getTime() - Date.parse(session.activeStepStartedAt)) / 1000));
    const completed: SessionState = {
      ...session, screen: 'summary', completedAt: completedAt.toISOString(), syncStatus: 'saving',
      stepDurations: { ...session.stepDurations, [String(session.screen)]: (session.stepDurations[String(session.screen)] ?? 0) + elapsed },
    };
    setSession(completed); window.scrollTo({ top: 0 });
    const status = await submitSession(completed);
    setSession((current) => ({ ...current, syncStatus: status, submitted: status === 'saved' }));
  };

  const next = () => {
    if (!step || !canContinue) return;
    if (step < 7) go((step + 1) as Screen);
    else if (session.answers.q7_next_step === 'implementation_blocked') go('blocker');
    else void finish();
  };
  const back = () => { if (step) go(step === 1 ? 'context' : (step - 1) as Screen); else if (session.screen === 'blocker') go(7); };
  const reset = () => { clearSession(); setSession(newSession()); setConfirmingReset(false); setPresenterOpen(false); window.scrollTo({ top: 0 }); };

  return <div className="app-shell">
    {presenterMode && <PresenterMenu open={presenterOpen} sessionId={session.sessionId} status={session.syncStatus} demo={demoMode} confirming={confirmingReset} onToggle={() => setPresenterOpen((v) => !v)} onRequestReset={() => setConfirmingReset(true)} onCancelReset={() => setConfirmingReset(false)} onConfirmReset={reset} />}
    <AnimatePresence mode="wait">
      {session.screen === 'intro' && <motion.main className="intro-screen" key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><header><Brand /><span>Built for banking executives</span></header><div className="intro-content"><span className="intro-signal"><i /> A guided product experience</span><h1>What if your bank actively managed <em>your finances for you</em>?</h1><p>Without you spending your valuable time.</p><button className="primary-button intro-cta" type="button" onClick={() => go('context')}>Start the 3-minute experience <span>→</span></button></div><div className="intro-product"><div className="mini-card"><span>Visible today</span><b>$28.6K</b></div><div className="mini-agent"><span>✦</span><p>CFA found a larger liquidity relationship.</p></div><div className="mini-card accent"><span>With CFA</span><b>$69.4K</b><small>Illustrative household</small></div></div><footer>Customer value <i /> Relationship depth <i /> Household control</footer></motion.main>}
      {session.screen === 'context' && <motion.div key="context" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><header className="app-header"><Brand /><button className="header-back" type="button" onClick={() => go('intro')}>← Back</button></header><ContextScreen session={session} onChange={(key, value) => setSession((s) => ({ ...s, respondent: { ...s.respondent, [key]: value } }))} onContinue={() => go(1)} /></motion.div>}
      {step && <motion.div className="experience" key={`step-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><header className="app-header experience-header"><Brand /><div className="progress" aria-label={`Step ${step} of 7`}><span>{step} / 7</span><div>{[1,2,3,4,5,6,7].map((n) => <i key={n} className={n <= step ? 'filled' : ''} />)}</div></div></header><main className="experience-grid"><ProductDemo step={step} answers={session.answers} /><QuestionCard step={step} value={selected} ranking={session.answers.q4_relationship_drivers} presenterMode={presenterMode} answers={session.answers} onSelect={selectAnswer} onSelectGroup={(key, value) => setSession((s) => ({ ...s, answers: { ...s.answers, [key]: value } }))} /></main><nav className="step-nav"><button className="back-button" type="button" onClick={back}>← Back</button><button className="primary-button" type="button" onClick={next} disabled={!canContinue}>Continue <span>→</span></button></nav></motion.div>}
      {session.screen === 'blocker' && <motion.div key="blocker" className="blocker-screen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><header className="app-header"><Brand /><span className="step-label">One useful follow-up</span></header><main><section><span className="overline">Deployment readiness</span><h1>What would be the primary blocker?</h1><p>The economics and the path to deployment are separate signals.</p><div className="blocker-options">{BLOCKERS.map((o) => <button type="button" key={o.value} className={session.answers.implementation_blocker === o.value ? 'selected' : ''} onClick={() => setSession((s) => ({ ...s, answers: { ...s.answers, implementation_blocker: o.value } }))}><span /><b>{o.label}</b></button>)}</div>{session.answers.implementation_blocker === 'other' && <label className="other-blocker">Tell us briefly <input value={session.answers.implementation_blocker_other ?? ''} onChange={(e) => setSession((s) => ({ ...s, answers: { ...s.answers, implementation_blocker_other: e.target.value } }))} maxLength={120} /></label>}</section><aside><span>Economic interest</span><b>Positive</b><i /><span>Deployment readiness</span><b>Blocked</b><p>This distinction is useful. It helps identify the work a pilot would need to address.</p></aside></main><nav className="step-nav"><button className="back-button" type="button" onClick={back}>← Back</button><button className="primary-button" type="button" disabled={!session.answers.implementation_blocker} onClick={() => void finish()}>Complete thesis <span>→</span></button></nav></motion.div>}
      {session.screen === 'summary' && <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Summary session={session} onContact={(key, value) => setSession((s) => ({ ...s, respondent: { ...s.respondent, [key]: value } }))} onSync={() => sync()} onDone={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onReset={() => setConfirmingReset(true)} />{confirmingReset && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><span className="agent-star">✦</span><h2 id="reset-title">Start another conversation?</h2><p>This clears the current responses and creates a new session ID.</p><div><button className="back-button" type="button" onClick={() => setConfirmingReset(false)}>Cancel</button><button className="primary-button" type="button" onClick={reset}>Start new session</button></div></div></div>}</motion.div>}
    </AnimatePresence>
  </div>;
}
