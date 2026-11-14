import React, { useState } from 'react';
import { LuLockKeyhole, LuCheck, LuRotateCcw, LuSettings } from 'react-icons/lu';
import { usePremium, subscribe, restoreFull, manageSubscription, makeGrownUpQuestion, LOCKED_PAGES, PLANS, TRIAL_DAYS, TERMS_URL, PRIVACY_URL } from '../engine/premium.js';
import { Modal, toast, confetti } from '../ui/ui.jsx';

// Asks a grown-up a sum a child is unlikely to solve before any purchase, restore or store page.
export function GrownUpGate({ onPass, onClose }) {
  const [q, setQ] = useState(() => makeGrownUpQuestion());
  const [typed, setTyped] = useState('');
  const [wrong, setWrong] = useState(false);
  const check = (e) => {
    e.preventDefault();
    if (+typed === q.answer) return onPass();
    setWrong(true); setTyped(''); setQ(makeGrownUpQuestion());
  };
  return (
    <Modal title="Grown-ups only" onClose={onClose}>
      <p>Please ask a parent or teacher to answer this to continue.</p>
      <form className="col" onSubmit={check}>
        <label className="gate-q"><span>What is {q.text}?</span>
          <input inputMode="numeric" pattern="[0-9]*" autoFocus value={typed} onChange={(e) => setTyped(e.target.value.replace(/\D/g, ''))} aria-label={`What is ${q.text}?`} />
        </label>
        {wrong && <div className="tiny" role="alert">That's not right. Here's a new one.</div>}
        <div className="row wrap" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={!typed}>Continue</button>
        </div>
      </form>
    </Modal>
  );
}

// Runs an action behind the grown-up check.
function useGated() {
  const [pending, setPending] = useState(null);
  const gate = pending && <GrownUpGate onPass={() => { const f = pending; setPending(null); f(); }} onClose={() => setPending(null)} />;
  return [(fn) => setPending(() => fn), gate];
}

export function RestoreButton({ className = 'btn ghost' }) {
  const [busy, setBusy] = useState(false);
  const [ask, gate] = useGated();
  const run = async () => {
    setBusy(true);
    const ok = await restoreFull();
    setBusy(false);
    toast(ok ? 'Kidsy Full restored' : 'No active Kidsy Full subscription was found on this account', ok ? '✅' : 'ℹ️');
  };
  return <><button className={className} disabled={busy} onClick={() => ask(run)}><LuRotateCcw /> {busy ? 'Checking…' : 'Restore purchase'}</button>{gate}</>;
}

export function ManageButton({ className = 'btn ghost' }) {
  const [ask, gate] = useGated();
  const run = async () => { if (!(await manageSubscription())) toast('Open your App Store or Google Play account to manage subscriptions', 'ℹ️'); };
  return <><button className={className} onClick={() => ask(run)}><LuSettings /> Manage or cancel subscription</button>{gate}</>;
}

export default function Paywall({ page }) {
  const { priceOf, platform } = usePremium();
  const [plan, setPlan] = useState(PLANS[0]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ask, gate] = useGated();
  const store = platform === 'android' ? 'Google Play' : 'Apple ID';
  const buy = async () => {
    setBusy(true); setErr('');
    const r = await subscribe(plan);
    setBusy(false);
    if (r === 'ok') { confetti(); toast('Thank you! Everything is unlocked', '🎉'); }
    else if (r === 'error') setErr('The purchase did not go through. Please try again.');
  };
  const name = LOCKED_PAGES[page] || 'This part';
  return (
    <div className="paywall">
      <section className="card pw-card">
        <div className="pw-lock"><LuLockKeyhole /></div>
        <h1>{name} is part of Kidsy Full</h1>
        <p className="muted">Stories, levels and games stay free. Kidsy Full unlocks the rest for every child on this device.</p>
        <ul className="pw-list">
          {Object.values(LOCKED_PAGES).map((x) => <li key={x}><LuCheck /> {x}</li>)}
          <li><LuCheck /> No ads. Cancel any time.</li>
        </ul>
        <div className="pw-plans" role="radiogroup" aria-label="Choose a plan">
          {PLANS.map((p) => (
            <button key={p.id} role="radio" aria-checked={plan.id === p.id} className={`pw-plan ${plan.id === p.id ? 'on' : ''}`} onClick={() => setPlan(p)}>
              <b>{p.label}</b>
              <span className="pw-price">{priceOf(p)}<small> / {p.per}</small></span>
              {p.note && <span className="pw-note">{p.note}</span>}
            </button>
          ))}
        </div>
        <button className="btn pw-buy" disabled={busy} onClick={() => ask(buy)}>{busy ? 'Opening the store…' : `Start ${TRIAL_DAYS}-day free trial`}</button>
        <p className="tiny muted pw-terms">
          Free for {TRIAL_DAYS} days, then {priceOf(plan)} per {plan.per}. Payment is charged to your {store} account when the trial ends.
          The subscription renews automatically unless it is cancelled at least 24 hours before the end of the current period.
          You can manage or cancel it in your account settings. Any unused part of the free trial ends when you subscribe.
        </p>
        {err && <div className="tiny" role="alert">{err}</div>}
        <div className="row wrap" style={{ justifyContent: 'center' }}><RestoreButton /></div>
        <p className="tiny"><a href={TERMS_URL} target="_blank" rel="noreferrer">Terms of Use</a> · <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a></p>
      </section>
      {gate}
    </div>
  );
}
