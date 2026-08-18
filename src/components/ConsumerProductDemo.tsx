import { motion } from 'framer-motion';
import type { ConsumerSession } from '../types/consumer';

const accounts = [
  ['Everyday checking', '$4,820'], ['High-yield savings', '$18,400'],
  ['Investments', '$31,250'], ['Retirement', '$72,600'],
];

const answerLabels: Record<string, string> = {
  under_30m: '< 30 min', '30m_1h': '30–60 min', '1_2h': '1–2 hrs', '2_4h': '2–4 hrs', '4h_plus': '4+ hrs',
  person: 'A person', social: 'Social media', ai: 'AI / robo-advisor', research: 'Own research', none: 'No current source',
  fire_under_45: 'Before 45', fire_45_55: 'Age 45–55', retire_traditional: 'Traditional retirement', keep_working: 'Keep working', not_sure: 'Goal not set',
};

function AgentMessage({ children }: { children: React.ReactNode }) {
  return <motion.div className="consumer-agent-note" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><span>✦</span><div><b>CFA</b><p>{children}</p></div></motion.div>;
}

function Fragmentation({ answer }: { answer?: string }) {
  const visible = answer === 'one' ? 1 : answer === 'two_three' ? 3 : answer === 'four_five' ? 4 : 4;
  return <><div className="consumer-demo-heading"><span>YOUR CONNECTED VIEW</span><h2>Everything in one financial picture</h2></div><div className="consumer-account-grid">{accounts.slice(0, visible).map(([name, value], index) => <motion.div key={name} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .06 }}><span>{name}</span><b>{value}</b><small>{index === 0 ? 'Primary bank' : 'Connected securely'}</small></motion.div>)}</div><div className="consumer-total"><span>Connected net worth</span><b>$127,070</b></div><AgentMessage>I can coordinate your finances across accounts without making you move everything first.</AgentMessage></>;
}

function TimeBack({ answer }: { answer?: string }) {
  return <><div className="consumer-demo-heading"><span>WEEKLY ROUTINE</span><h2>Your financial admin, handled</h2></div><div className="automation-list"><div><i>✓</i><span><b>Bills reviewed</b><small>8 upcoming payments covered</small></span><em>Automatic</em></div><div><i>✓</i><span><b>Balances organized</b><small>Excess cash moved to savings</small></span><em>Automatic</em></div><div><i>✓</i><span><b>Goals updated</b><small>Retirement plan remains on track</small></span><em>Automatic</em></div></div><div className="time-return"><span>Your current weekly time</span><b>{answerLabels[answer ?? ''] ?? '—'}</b><strong>Time CFA could give back</strong></div></>;
}

function OrganizedLife({ answer }: { answer?: string }) {
  return <><div className="consumer-demo-heading"><span>TODAY’S PLAN</span><h2>One calm view of what matters</h2></div><div className="money-plan"><div><span>Safe to spend</span><b>$1,240</b><small>Until next payday</small></div><div><span>Bills reserved</span><b>$3,860</b><small>Already accounted for</small></div><div><span>Goals this month</span><b>$1,150</b><small>On track</small></div></div><AgentMessage>{answer === 'no' ? 'Your system already works. CFA can stay quietly in the background and flag only meaningful changes.' : 'I’ll keep the plan current, so getting organized doesn’t become another item on your list.'}</AgentMessage></>;
}

function Advice({ answer }: { answer?: string }) {
  return <><div className="consumer-demo-heading"><span>PERSONAL GUIDANCE</span><h2>Advice grounded in your full picture</h2></div><div className="advice-card"><span>Question</span><h3>Can I increase my travel budget this year?</h3><div><b>Yes — by $180/month</b><small>while keeping your emergency fund and retirement target on track</small></div></div><div className="source-chip"><span>Current primary source</span><b>{answerLabels[answer ?? ''] ?? 'Choose an answer'}</b></div><AgentMessage>I can explain the tradeoffs using your actual accounts, goals and rules.</AgentMessage></>;
}

function FireGoal({ answer }: { answer?: string }) {
  return <><div className="consumer-demo-heading"><span>FINANCIAL INDEPENDENCE</span><h2>Turn the destination into a monthly plan</h2></div><div className="goal-ring"><div><b>42%</b><span>funded</span></div></div><div className="goal-stats"><div><span>Your selected direction</span><b>{answerLabels[answer ?? ''] ?? 'Set your goal'}</b></div><div><span>Next best action</span><b>Increase monthly investing by $240</b></div><div><span>Plan check</span><b className="positive">On track</b></div></div></>;
}

function BankGap({ answer }: { answer?: string }) {
  const wantsMore = ['yes_main_reason', 'yes_partly'].includes(answer ?? '');
  return <><div className="consumer-demo-heading"><span>YOUR BANK, WORKING HARDER</span><h2>From storing money to managing it</h2></div><div className="expectation-grid"><div><span>Typical banking app</span><b>Balances</b><b>Transactions</b><b>Transfers</b></div><div className="enhanced"><span>With CFA</span><b>✓ Coordinated plan</b><b>✓ Proactive actions</b><b>✓ Goal guidance</b></div></div><AgentMessage>{wantsMore ? 'Bring the intelligence you seek from fintechs into the institution you already trust.' : 'Add useful coordination without forcing you to replace the tools you already like.'}</AgentMessage></>;
}

function FavoriteApps({ answer }: { answer?: string }) {
  const names = answer?.split(',').map((name) => name.trim()).filter(Boolean).slice(0, 3) ?? [];
  return <><div className="consumer-demo-heading"><span>CONNECTED ECOSYSTEM</span><h2>Your favorite tools can be part of the plan</h2></div><div className="app-orbit"><span className="orbit-center">✦<small>CFA</small></span>{(names.length ? names : ['Investing app', 'Budget app', 'Bank']).map((name, index) => <motion.span key={`${name}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * .1 }}>{name}</motion.span>)}</div><AgentMessage>One agent can keep the full picture current while your preferred products keep doing what they do best.</AgentMessage></>;
}

function AgentActions({ answer }: { answer?: string }) {
  return <><div className="consumer-demo-heading"><span>THIS WEEK</span><h2>Your agent prepared three actions</h2></div><div className="prepared-actions"><div><span>01</span><p><b>Reserve upcoming bills</b><small>$3,860 protected</small></p><em>Ready</em></div><div><span>02</span><p><b>Move idle cash to savings</b><small>+$22 estimated monthly interest</small></p><em>Ready</em></div><div><span>03</span><p><b>Keep investing goal on track</b><small>$575 scheduled</small></p><em>Ready</em></div></div><AgentMessage>{answer === 'definitely' ? 'I’ll handle these within your rules and keep you informed.' : 'Review, approve or automate each type of task at your pace.'}</AgentMessage></>;
}

function EarlyAccess({ answer }: { answer?: string }) {
  const role = answer === 'invest_capital' ? 'Founding investor' : answer === 'pay_early_access' ? 'Early-access member' : answer === 'beta_feedback' ? 'Design partner' : answer === 'use_free' ? 'Beta user' : 'Observer';
  return <><div className="consumer-demo-heading"><span>FOUNDING COMMUNITY</span><h2>Help shape the financial agent you want</h2></div><div className="founder-card"><span>YOUR PARTICIPATION</span><b>{role}</b><p>Influence priorities, guardrails and the moments where automation is most valuable.</p></div><div className="founder-path"><span className="done">Listen</span><i /><span>Build</span><i /><span>Test</span><i /><span>Launch</span></div></>;
}

function Trust({ answer }: { answer?: string }) {
  const automatic = answer === 'full_with_rules';
  return <><div className="consumer-demo-heading"><span>YOUR CONTROL CENTER</span><h2>You set the boundaries</h2></div><div className="trust-controls"><div><span>Pay recurring bills</span><i className={automatic ? 'on' : ''}><b /></i></div><div><span>Move cash between my accounts</span><i className={automatic ? 'on' : ''}><b /></i></div><div><span>Change products</span><i><b /></i></div><div><span>Make investments</span><i><b /></i></div></div><div className="trust-footer"><span>Every action has</span><b>Clear rules · Full history · Easy undo</b></div><AgentMessage>You decide what I can do automatically, what needs approval and what stays advice-only.</AgentMessage></>;
}

export function ConsumerProductDemo({ step, session }: { step: number; session: ConsumerSession }) {
  const answer = session.answers[`q${step}`];
  return <motion.section className="product-demo consumer-product-demo" key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label={`Consumer product demonstration, step ${step}`}>
    <div className="product-chrome"><div className="window-dots"><i /><i /><i /></div><span>CFA</span><small>Your financial life</small></div>
    <div className="consumer-demo-body">
      {step === 1 && <Fragmentation answer={answer} />}
      {step === 2 && <TimeBack answer={answer} />}
      {step === 3 && <OrganizedLife answer={answer} />}
      {step === 4 && <Advice answer={answer} />}
      {step === 5 && <FireGoal answer={answer} />}
      {step === 6 && <BankGap answer={answer} />}
      {step === 7 && <FavoriteApps answer={answer} />}
      {step === 8 && <AgentActions answer={answer} />}
      {step === 9 && <EarlyAccess answer={answer} />}
      {step === 10 && <Trust answer={answer} />}
    </div>
  </motion.section>;
}
