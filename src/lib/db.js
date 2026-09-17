// Robust offline persistence using LocalStorage with JSON parsing
const PREFIX = 'merola_v2_';

export async function getState(key, fallback) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

export async function setState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
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
