import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CFA_ECONOMICS as E, currency } from '../data/economics';
import { generateThesis } from '../logic/thesis';
import type { Answers } from '../types/survey';

const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function AgentNote({ children }: { children: React.ReactNode }) {
  return <motion.div {...fade} className="agent-note"><span className="agent-star">✦</span><div><b>CFA</b><p>{children}</p></div></motion.div>;
}

function Money({ value, compact = false, positive = false }: { value: number; compact?: boolean; positive?: boolean }) {
  return <strong className={positive ? 'positive' : ''}>{positive ? '+' : ''}{currency(value, compact)}</strong>;
}

function Account({ label, value, tone = 'neutral', delay = 0 }: { label: string; value: number; tone?: string; delay?: number }) {
  return (
    <motion.div className={`account ${tone}`} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}>
      <span>{label}</span><Money value={value} />
    </motion.div>
  );
}

function HiddenRelationship({ answers }: { answers: Answers }) {
  const shareLabels: Record<string, string> = { under_20pct: '<20%', '20_40pct': '20%–40%', '40_60pct': '40%–60%', '60pct_plus': '60%+', not_sure: 'Not sure' };
  const customerLabels: Record<string, string> = { under_10k: '<10K', '10k_50k': '10K–50K', '50k_250k': '50K–250K', '250k_plus': '250K+', not_sure: 'Not sure' };
  const complete = answers.q1_primary_customer_share && answers.q1_primary_customers_over_10k;
  return <div className="demo-body relationship-demo">
    <div className="demo-title-row"><div><span className="overline">Illustrative household</span><h2>Sarah & David</h2></div><span className="income-pill">$250K income</span></div>
    <div className="bank-boundary">
      <div className="boundary-label">At your institution</div>
      <div className="accounts-grid"><Account label="Checking" value={E.checkingToday} /><Account label="Legacy savings" value={E.legacySavingsToday} /></div>
      <div className="visible-total"><span>Visible relationship</span><Money value={E.totalDepositsToday} compact /></div>
    </div>
    <motion.div className="outside-account" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 }}>
      <span><i /> Customer-connected view</span><div><small>External liquidity</small><Money value={E.externalCash} /></div>
    </motion.div>
    <AgentNote>I found {currency(E.externalCash, true)} of household cash outside this institution.</AgentNote>
    <motion.div {...fade} transition={{ delay: .45 }} className="household-case">
      <div className="household-case-heading">
        <div><span>Illustrative model assumption</span><b>If CFA earns the household's approval</b></div>
        <div className="suggested-move"><small>Suggested first move</small><strong>{currency(E.outsideCashReturned)}</strong></div>
      </div>
      <p className="assumption-copy">The model assumes CFA can demonstrate enough value for Sarah & David to bring half of their outside cash home—not that the funds move automatically.</p>
      <div className="household-benefits">
        <div><span className="benefit-check">✓</span><p><b>{E.outsideCashRatePaid.toFixed(2)}% competitive yield</b><small>vs. {E.outsideRate.toFixed(2)}% outside today</small></p></div>
        <div><span className="benefit-check">✓</span><p><b>One coordinated cash plan</b><small>Connected to bills and emergency savings</small></p></div>
        <div><span className="benefit-check">✓</span><p><b>Household stays in control</b><small>CFA proposes; Sarah & David approve</small></p></div>
      </div>
    </motion.div>
    {complete && <motion.div {...fade} className="baseline-result">
      <div><span>Primary-bank customers</span><b>{shareLabels[answers.q1_primary_customer_share!]}</b></div>
      <div><span>Holding more than $10K</span><b>{customerLabels[answers.q1_primary_customers_over_10k!]}</b></div>
      <p>This establishes the scale of the addressable relationship base—not a forecast.</p>
    </motion.div>}
  </div>;
}

function CashOrganization({ viability }: { viability?: string }) {
  const viabilityLabels: Record<string, string> = {
    '10pct_5k_plus': '10% add >$5K', '10pct_10k_20k': '10% add $10K–$20K',
    '20pct_10k_plus': '20% add >$10K', '20pct_30k_plus': '20% add >$30K',
  };
  return <div className="demo-body cash-demo">
    <div className="demo-title-row"><div><span className="overline">Next payday</span><h2>Every dollar has a job</h2></div><span className="income-pill positive-bg">Paycheck received</span></div>
    <div className="timeline"><span className="active">Payday</span><i /><span className="active">Reserve</span><i /><span>Due date</span><i /><span>Settle</span></div>
    <div className="flow-source"><span>Today in checking</span><Money value={E.checkingToday} /></div>
    <div className="flow-lines"><i /><i /><i /></div>
    <div className="bucket-grid">
      <Account label="Operating checking" value={E.operatingCheckingWithCfa} tone="blue" delay={.1} />
      <Account label="Emergency target" value={E.emergencyFundWithCfa} tone="green" delay={.2} />
      <Account label="Bills reserved" value={E.billFloatWithCfa} tone="sand" delay={.3} />
    </div>
    <div className="due-list"><div><span>Mortgage</span><small>Reserved today · pays Sep 1</small><b>$3,400</b></div><div><span>Card</span><small>Reserved today · pays Sep 4</small><b>$2,186</b></div></div>
    <AgentNote>Keep money earning until it actually needs to leave.</AgentNote>
    {viability && <motion.div {...fade} className="viability-result"><div><span>Your viability case</span><b>{viabilityLabels[viability]}</b></div><div><span>CFA sample household</span><b className="positive">+{currency(E.incrementalDeposits)}</b></div></motion.div>}
  </div>;
}

function RelationshipPricing({ answer }: { answer?: string }) {
  const relationship = ['yes_relationship_economics', 'yes_selected_segments'].includes(answer ?? '');
  const strategy = relationship ? 'B' : answer ? 'A' : undefined;
  return <div className="demo-body pricing-demo">
    <div className="demo-title-row"><div><span className="overline">Savings review</span><h2>Protect margin—or the relationship?</h2></div><span className="risk-pill">Shopping risk</span></div>
    <div className="rate-compare"><div><span>Current savings</span><strong>0.01%</strong></div><span>vs</span><div><span>External alternative</span><strong>~3.30%</strong></div></div>
    <AgentNote>This customer can do materially better elsewhere.</AgentNote>
    <div className="strategy-grid">
      <motion.div className={`strategy ${strategy === 'A' ? 'chosen' : ''}`} animate={{ scale: strategy === 'A' ? 1.015 : 1 }}>
        <span>Strategy A</span><h3>Protect product margin</h3><div className="metric-bars"><label>Short-term margin<i style={{ width: '86%' }} /></label><label>Relationship depth<i style={{ width: '40%' }} /></label></div><small>External account remains attractive</small>
      </motion.div>
      <motion.div className={`strategy ${strategy === 'B' ? 'chosen' : ''}`} animate={{ scale: strategy === 'B' ? 1.015 : 1 }}>
        <span>Strategy B</span><h3>Protect the relationship</h3><div className="metric-bars"><label>Short-term margin<i style={{ width: '58%' }} /></label><label>Relationship depth<i style={{ width: '96%' }} /></label></div><small><b>+$857/yr</b> to household · $28.6K → $69.4K</small>
      </motion.div>
    </div>
  </div>;
}

const transactions = [
  ['Payroll', '+$6,875', 'bank'], ['Mortgage', '−$3,400', 'bank'], ['Grocery', '−$186', 'bank'],
  ['Venmo', '−$240', 'external'], ['Cash withdrawal', '−$180', 'external'], ['Streaming', '−$22', 'external'],
];

function PaymentRails({ ranked }: { ranked: string[] }) {
  return <div className="demo-body payments-demo">
    <div className="demo-title-row"><div><span className="overline">Transaction intelligence</span><h2>Capture more of the financial life</h2></div><span className="income-pill">$53K cardable</span></div>
    <div className="payments-layout">
      <div className="transaction-list">{transactions.map(([name, amount, rail], i) => <motion.div key={name} initial={{ opacity: 0, x: rail === 'external' ? 14 : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .04 }}><span className={`tx-icon ${rail}`}>{name[0]}</span><span>{name}<small>{rail === 'external' ? 'Cash / external rail' : 'Your institution'}</small></span><b>{amount}</b></motion.div>)}</div>
      <div className="rail-card"><span>Your Bank Card</span><b>Preferred where advantageous</b><div className="rail-benefits"><span>Household</span><strong>Rewards earned</strong><span>Institution</span><strong>More payment activity</strong></div></div>
    </div>
    <AgentNote>About {currency(E.annualExternalSpend, true)}/year of everyday spend is leaving your payment rails.</AgentNote>
    {ranked.length > 0 && <div className="priority-strip">Your priorities: {ranked.map((item, i) => <span key={item}>{i + 1} {item.replaceAll('_', ' ')}</span>)}</div>}
  </div>;
}

function CustomerAdvocate() {
  const [better, setBetter] = useState(false);
  return <div className="demo-body advocate-demo">
    <div className="demo-title-row"><div><span className="overline">Product fit review</span><h2>Can the agent work for the customer?</h2></div><span className="income-pill">Eligible product found</span></div>
    <div className="product-switch">
      <div className={!better ? 'active-product' : ''}><span>Current savings</span><strong>0.01%</strong><small>Legacy product</small></div>
      <motion.button type="button" onClick={() => setBetter(true)} whileTap={{ scale: .97 }} aria-label="Show the better eligible product">{better ? 'Selected' : 'Review option'} <span>→</span></motion.button>
      <div className={better ? 'active-product recommended' : 'recommended'}><span>Better eligible product</span><strong>2.50%</strong><small>Inside this institution</small></div>
    </div>
    <AnimatePresence mode="wait">{better ? <motion.div key="tradeoff" {...fade} className="tradeoff-card"><div><span>Customer impact</span><b className="positive">+{currency(E.relationshipRepricingGiveback)}/yr</b></div><div><span>Immediate margin impact</span><b>−{currency(E.relationshipRepricingGiveback)}/yr</b></div><div><span>Potential relationship impact</span><b>Deeper relationship</b></div></motion.div> : <AgentNote>You're eligible for a better product at this bank.</AgentNote>}</AnimatePresence>
    <p className="demo-caption">Better for the customer. Potentially deeper for the bank.</p>
  </div>;
}

function Autonomy({ answer }: { answer?: string }) {
  const [approved, setApproved] = useState(false);
  const automatic = ['customer_rules', 'bank_customer_guardrails', 'high_autonomy'].includes(answer ?? '');
  const advisory = answer === 'insights_only';
  const permissions = [['Bill reservations', true], ['Internal transfers', true], ['External transfers', automatic], ['Product changes', false], ['Investment actions', false]] as const;
  return <div className="demo-body autonomy-demo">
    <div className="demo-title-row"><div><span className="overline">Paycheck received</span><h2>I prepared your next two weeks</h2></div><span className="safety-pill">Household controlled</span></div>
    <div className="plan-list"><div><span>Reserve for upcoming bills</span><b>$4,200</b></div><div><span>Move toward emergency fund</span><b>$1,600</b></div><div><span>Keep available in checking</span><b>$2,500</b></div></div>
    <div className="permissions"><span>Permissions</span>{permissions.map(([name, on]) => <div key={name}><small>{name}</small><i className={on ? 'toggle on' : 'toggle'}><b /></i></div>)}</div>
    {answer && <motion.div {...fade} className="operating-mode"><span>Configured operating model</span><b>{advisory ? 'Advisory only — no actions' : automatic ? 'Auto-approved within customer rules' : 'Explicit approval required'}</b></motion.div>}
    {!advisory && <motion.button type="button" className={`approve-plan ${approved ? 'approved' : ''}`} onClick={() => setApproved(true)} whileTap={{ scale: .98 }} disabled={approved}>{approved ? (automatic ? 'Actions completed within rules' : 'Plan approved') : automatic ? 'Run approved actions' : 'Approve this plan'}</motion.button>}
    <p className="demo-caption">CFA proposes. The household approves—or defines the rules.</p>
  </div>;
}

function BusinessCase({ answers }: { answers: Answers }) {
  const thesis = generateThesis(answers);
  return <div className="demo-body business-demo">
    <div className="demo-title-row"><div><span className="overline">Based on your selected priorities</span><h2>Your Institution's CFA Thesis</h2></div><span className="income-pill">Not a forecast</span></div>
    <div className="thesis-preview"><div><span>Primary opportunity</span><b>{thesis.primary_opportunity}</b></div><div><span>Relationship model</span><b>{thesis.relationship_economics}</b></div><div><span>Operating model</span><b>{thesis.operating_model}</b></div><div><span>Strategic fit</span><b>{thesis.strategic_fit}</b></div></div>
    <div className="deposit-transformation"><div><span>Today</span><Money value={E.totalDepositsToday} /></div><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}>→</motion.span><div><span>With CFA</span><Money value={E.totalDepositsWithCfa} /></div><div className="deposit-lift"><span>Modeled deposit lift</span><Money value={E.incrementalDeposits} positive /></div></div>
    <motion.div className="bank-value" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}><span>Illustrative incremental annual bank value</span><strong>+{currency(E.netBankValue)} <small>/ household</small></strong></motion.div>
    <p className="disclaimer">Illustrative economics based on the CFA Phase 1 model. Actual economics depend on institution, customer segment, pricing and adoption.</p>
  </div>;
}

export function ProductDemo({ step, answers }: { step: number; answers: Answers }) {
  return <motion.section className="product-demo" key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }} aria-label={`CFA product demonstration, step ${step}`}>
    <div className="product-chrome"><div className="window-dots"><i /><i /><i /></div><span>Your Institution</span><small>Illustrative household</small></div>
    {step === 1 && <HiddenRelationship answers={answers} />}
    {step === 2 && <CashOrganization viability={answers.q2_deposit_viability} />}
    {step === 3 && <RelationshipPricing answer={answers.q3_relationship_pricing} />}
    {step === 4 && <PaymentRails ranked={answers.q4_relationship_drivers} />}
    {step === 5 && <CustomerAdvocate />}
    {step === 6 && <Autonomy answer={answers.q6_autonomy} />}
    {step === 7 && <BusinessCase answers={answers} />}
  </motion.section>;
}
