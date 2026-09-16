const CUSTOM_CARDS_KEY = 'merola_custom_cards_v1';
const GEMINI_KEY_STORAGE = 'merola_gemini_key_v1';
const PARENT_PIN_KEY = 'merola_parent_pin_v1';
const STATS_KEY = 'merola_stats_v1';

export function getStoredCustomCards() {
  try {
    const raw = localStorage.getItem(CUSTOM_CARDS_KEY) || localStorage.getItem('kidsy_custom_cards_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load custom cards:", e);
    return [];
  }
}

export function saveStoredCustomCards(cards) {
  try {
    localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error("Failed to save custom cards:", e);
  }
}

export function getGeminiApiKey() {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || "";
  } catch (e) {
    return "";
  }
}

export function setGeminiApiKey(key) {
  try {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } catch (e) {}
}

export function getParentPin() {
  try {
    return localStorage.getItem(PARENT_PIN_KEY) || "1234";
  } catch (e) {
    return "1234";
  }
}

export function setParentPin(pin) {
  try {
    localStorage.setItem(PARENT_PIN_KEY, pin);
  } catch (e) {}
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { highestStreak: 0, totalSolved: 0 };
  } catch (e) {
    return { highestStreak: 0, totalSolved: 0 };
  }
}

export function updateStoredStats(currentStreak) {
  try {
    const stats = getStoredStats();
    stats.totalSolved += 1;
    if (currentStreak > stats.highestStreak) {
      stats.highestStreak = currentStreak;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (e) {
    return { highestStreak: currentStreak, totalSolved: 1 };
  }
}
