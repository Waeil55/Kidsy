import React, { useState } from 'react';
import { LuLockKeyhole, LuCheck, LuRotateCcw } from 'react-icons/lu';
import { usePremium, buyFull, restoreFull, makeGrownUpQuestion, LOCKED_PAGES } from '../engine/premium.js';
import { Modal, toast, confetti } from '../ui/ui.jsx';

// Asks a grown-up a sum a child is unlikely to solve before any purchase or restore runs.
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

// Restore button for the paywall and Me page; runs behind the grown-up check.
export function RestoreButton({ className = 'btn ghost' }) {
  const [gate, setGate] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setGate(false); setBusy(true);
    const ok = await restoreFull();
    setBusy(false);
    toast(ok ? 'Kidsy Full restored' : 'No Kidsy Full purchase was found on this account', ok ? '✅' : 'ℹ️');
  };
  return (
    <>
      <button className={className} disabled={busy} onClick={() => setGate(true)}><LuRotateCcw /> {busy ? 'Checking…' : 'Restore purchase'}</button>
      {gate && <GrownUpGate onPass={run} onClose={() => setGate(false)} />}
    </>
  );
}

export default function Paywall({ page }) {
  const { price } = usePremium();
  const [gate, setGate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const buy = async () => {
    setGate(false); setBusy(true); setErr('');
    const r = await buyFull();
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
        <p className="muted">Stories, levels and games stay free. One purchase unlocks the rest, for every child on this device.</p>
        <ul className="pw-list">
          {Object.values(LOCKED_PAGES).map((x) => <li key={x}><LuCheck /> {x}</li>)}
          <li><LuCheck /> No ads and no subscription. Pay once, keep it forever.</li>
        </ul>
        <button className="btn pw-buy" disabled={busy} onClick={() => setGate(true)}>{busy ? 'Opening the store…' : `Unlock for ${price}`}</button>
        {err && <div className="tiny" role="alert">{err}</div>}
        <RestoreButton />
        <p className="tiny muted">Ask a grown-up to unlock. Purchases are handled by the App Store or Google Play.</p>
      </section>
      {gate && <GrownUpGate onPass={buy} onClose={() => setGate(false)} />}
    </div>
  );
}
