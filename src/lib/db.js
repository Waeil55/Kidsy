import { generateChildrenSignatures, verifyChildIntegrity } from './security';

// Robust offline persistence using LocalStorage with cryptographic tamper verification
const PREFIX = 'merola_v2_';

export async function getState(key, fallback) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null || item === undefined) return fallback;
    const parsed = JSON.parse(item);

    // If reading children, verify cryptographic signatures against tampering
    if (key === 'children' && Array.isArray(parsed)) {
      try {
        const sigsItem = localStorage.getItem(PREFIX + 'children_sigs');
        const sigs = sigsItem ? JSON.parse(sigsItem) : null;

        if (sigs) {
          const validated = parsed.map((child) => {
            const storedSig = sigs[child.id];
            if (storedSig && !verifyChildIntegrity(child, storedSig)) {
              console.warn(`[Security Alert] Tampering detected on student ${child.id}! Sanitizing state.`);
              // Tampered! Reset cheated progress to safe state
              return {
                ...child,
                giftGoal: {
                  ...child.giftGoal,
                  progress: 0,
                  isUnlocked: false
                }
              };
            }
            return child;
          });
          return validated;
        } else {
          // Initialize signatures if not yet present
          const initialSigs = generateChildrenSignatures(parsed);
          localStorage.setItem(PREFIX + 'children_sigs', JSON.stringify(initialSigs));
        }
      } catch (secErr) {
        console.warn('[Security Guard Error]', secErr);
      }
    }

    return parsed;
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

export async function setState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));

    // If writing children, automatically sign payload
    if (key === 'children' && Array.isArray(value)) {
      try {
        const sigs = generateChildrenSignatures(value);
        localStorage.setItem(PREFIX + 'children_sigs', JSON.stringify(sigs));
      } catch (secErr) {
        console.warn('[Security Guard Sign Error]', secErr);
      }
    }
  } catch (e) {
    console.warn(`Error writing key ${key} to storage:`, e);
  }
}

export async function clearState() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error clearing storage:', e);
  }
}
