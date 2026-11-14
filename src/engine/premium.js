// Kidsy Full: an auto-renewing subscription (monthly or yearly, 7-day free trial) that unlocks
// Exams, Merola weekly words and Custom practice in the iPhone/iPad and Android apps.
// The web version stays fully free, so nothing is locked unless the app runs natively.
import { useSyncExternalStore } from 'react';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

// Store product IDs. On Google Play each product needs one base plan with the matching id.
export const PLANS = [
  { id: 'com.agapecare.kidsy.yearly', basePlan: 'yearly', label: 'Yearly', per: 'year', fallback: '$19.99', note: 'Best value: save 44%' },
  { id: 'com.agapecare.kidsy.monthly', basePlan: 'monthly', label: 'Monthly', per: 'month', fallback: '$2.99', note: '' },
];
export const TRIAL_DAYS = 7;
export const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
export const PRIVACY_URL = 'https://waeil55.github.io/Kidsy/privacy.html';
// Route keys (first hash segment) that need Kidsy Full.
export const LOCKED_PAGES = { exam: 'Exams', g3pack: 'Merola weekly words', 'custom-lab': 'Custom practice' };

const KEY = 'kidsy_full_sub_v1';
const IDS = PLANS.map((p) => p.id);
export const isNative = () => !!(typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const platform = () => (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web');

// Saved locally so the app opens unlocked offline. The store is re-checked at every launch.
let unlocked = (() => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } })();
let prices = {};
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
function setUnlocked(v) {
  if (v === unlocked) return;
  unlocked = v;
  try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
  emit();
}

// True when a transaction is a live Kidsy Full subscription.
export function isActiveSub(t, now = Date.now()) {
  if (!t || !IDS.includes(t.productIdentifier)) return false;
  if (t.revocationDate) return false;
  if (t.isActive === true) return true;
  if (t.isActive === false) return false;
  if (['subscribed', 'inGracePeriod', 'inBillingRetryPeriod'].includes(t.subscriptionState)) return true;
  if (t.expirationDate) return Date.parse(t.expirationDate) > now;
  return t.purchaseState === '1'; // Google Play lists only current subscriptions
}

export const isLocked = (pageKey) => isNative() && !unlocked && !!LOCKED_PAGES[pageKey];

export function usePremium() {
  const snap = useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => `${unlocked}|${JSON.stringify(prices)}`);
  const i = snap.indexOf('|');
  const p = JSON.parse(snap.slice(i + 1));
  return { native: isNative(), platform: platform(), unlocked: snap.slice(0, i) === 'true', priceOf: (plan) => p[plan.id] || plan.fallback };
}

async function refreshOwnership() {
  const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS });
  setUnlocked((purchases || []).some((t) => isActiveSub(t)));
}

// Called once at start-up: loads store prices and re-checks the subscription.
export async function initPremium() {
  if (!isNative()) return;
  try {
    const { products } = await NativePurchases.getProducts({ productIdentifiers: IDS, productType: PURCHASE_TYPE.SUBS });
    const next = {};
    (products || []).forEach((p) => { if (p.priceString) next[p.identifier] = p.priceString; });
    if (Object.keys(next).length) { prices = next; emit(); }
  } catch (e) { /* offline or products not live yet: show fallback prices */ }
  try { await refreshOwnership(); } catch (e) { /* offline: keep the saved state */ }
}

// Returns 'ok' | 'cancelled' | 'error'.
export async function subscribe(plan) {
  if (!isNative()) return 'error';
  try {
    const tx = await NativePurchases.purchaseProduct({ productIdentifier: plan.id, planIdentifier: plan.basePlan, productType: PURCHASE_TYPE.SUBS, quantity: 1 });
    // A finished purchase of this plan counts (Android reports purchaseState '0' while a payment is pending).
    if (tx && tx.productIdentifier === plan.id && tx.isActive !== false && !tx.revocationDate && tx.purchaseState !== '0') { setUnlocked(true); return 'ok'; }
    try { await refreshOwnership(); } catch (e) { /* ignore */ }
    return unlocked ? 'ok' : 'error';
  } catch (e) {
    return /cancel/i.test(String(e && (e.message || e.code))) ? 'cancelled' : 'error';
  }
}

// Returns true when an active Kidsy Full subscription was found on this account.
export async function restoreFull() {
  if (!isNative()) return false;
  try { await NativePurchases.restorePurchases(); } catch (e) { /* continue to the check */ }
  try { await refreshOwnership(); } catch (e) { /* keep the saved state */ }
  return unlocked;
}

// Opens the App Store / Google Play page where the subscription can be changed or cancelled.
export async function manageSubscription() {
  try { await NativePurchases.manageSubscriptions(); return true; } catch (e) { return false; }
}

// A grown-up check before any purchase screen (required for apps used by children).
export function makeGrownUpQuestion(rand = Math.random) {
  const a = 13 + Math.floor(rand() * 7);   // 13..19
  const b = 12 + Math.floor(rand() * 8);   // 12..19 (two-digit × two-digit: hard for a child, easy with a calculator)
  return { text: `${a} × ${b}`, answer: a * b };
}
