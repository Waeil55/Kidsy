// Kidsy Full: a one-time purchase that unlocks Exams, Merola weekly words and Custom practice
// in the iPhone/iPad and Android apps. The web version stays fully free, so nothing is locked
// unless the app runs natively.
import { useSyncExternalStore } from 'react';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

export const PRODUCT_ID = 'com.agapecare.kidsy.full';
export const FALLBACK_PRICE = '$4.99';
// Route keys (first hash segment) that need Kidsy Full.
export const LOCKED_PAGES = { exam: 'Exams', g3pack: 'Merola weekly words', 'custom-lab': 'Custom practice' };

const KEY = 'kidsy_full_v1';
const isNative = () => !!(typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

let unlocked = (() => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } })();
let price = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
function setUnlocked(v) {
  unlocked = v;
  try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
  emit();
}

const owns = (purchases) => (purchases || []).some((p) => p.productIdentifier === PRODUCT_ID && (p.purchaseState === undefined || p.purchaseState === '1' || p.purchaseState === 'PURCHASED'));

export const isLocked = (pageKey) => isNative() && !unlocked && !!LOCKED_PAGES[pageKey];

export function usePremium() {
  const snap = useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => `${unlocked}|${price}`);
  const [u, p] = snap.split('|');
  return { native: isNative(), unlocked: u === 'true', price: p === 'null' ? FALLBACK_PRICE : p };
}

// Called once at start-up: loads the store price and re-checks what this Apple/Google account owns.
export async function initPremium() {
  if (!isNative()) return;
  try {
    const { product } = await NativePurchases.getProduct({ productIdentifier: PRODUCT_ID, productType: PURCHASE_TYPE.INAPP });
    if (product && product.priceString) { price = product.priceString; emit(); }
  } catch (e) { /* offline or product not live yet */ }
  try {
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
    if (owns(purchases)) setUnlocked(true);
  } catch (e) { /* keep the saved state */ }
}

// Returns 'ok' | 'cancelled' | 'error'.
export async function buyFull() {
  if (!isNative()) return 'error';
  try {
    const tx = await NativePurchases.purchaseProduct({ productIdentifier: PRODUCT_ID, productType: PURCHASE_TYPE.INAPP, quantity: 1 });
    if (tx && tx.productIdentifier === PRODUCT_ID && (tx.purchaseState === undefined || tx.purchaseState === '1' || tx.purchaseState === 'PURCHASED')) { setUnlocked(true); return 'ok'; }
    return 'error';
  } catch (e) {
    return /cancel/i.test(String(e && (e.message || e.code))) ? 'cancelled' : 'error';
  }
}

// Returns true when Kidsy Full was found on this account.
export async function restoreFull() {
  if (!isNative()) return false;
  try { await NativePurchases.restorePurchases(); } catch (e) { /* continue to the check */ }
  try {
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
    if (owns(purchases)) { setUnlocked(true); return true; }
  } catch (e) { /* fall through */ }
  return unlocked;
}

// A grown-up check before any purchase screen (required for apps used by children).
export function makeGrownUpQuestion(rand = Math.random) {
  const a = 13 + Math.floor(rand() * 7);   // 13..19
  const b = 12 + Math.floor(rand() * 8);   // 12..19 (two-digit × two-digit: hard for a child, easy with a calculator)
  return { text: `${a} × ${b}`, answer: a * b };
}
