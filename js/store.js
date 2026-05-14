/**
 * store.js — Centralised localStorage state management
 *
 * All persistent state lives here. Each module imports what it needs.
 * Keys are namespaced under 'ml_' to avoid collisions.
 */

'use strict';

/* ─── Serialisation helpers ─────────────────────────────────────────── */

/**
 * Read a value from localStorage, returning `fallback` on missing / parse error.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Write a value to localStorage. Silently ignores quota errors.
 * @param {string} key
 * @param {unknown} value
 */
export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — ignore */ }
}

/* ─── Default profile ───────────────────────────────────────────────── */
export const DEFAULT_PROFILE = {
  name:          '',
  height:        '',
  weight:        '',
  age:           '',
  gender:        'female',
  activity:      'moderate',
  goalType:      'maintain',
  goalWeight:    '',
  weeklyChange:  '0.5',
  mealNames:     ['Breakfast', 'Lunch', 'Dinner'],
  darkMode:      false,
  caltarget:     '',   // workout kcal target
  dietCal:       2000,
  dietRCarb:     50,
  dietRProt:     30,
  dietRFat:      20,
};

/* ─── Reactive store ────────────────────────────────────────────────── */

/**
 * Central state object — modules mutate this directly.
 * Call store.persist(key) after mutations.
 */
export const store = {
  /* Profile */
  profile:       lsGet('ml_profile',      { ...DEFAULT_PROFILE }),

  /* Diet */
  mealData:      lsGet('ml_mealData',     {}),
  usageCount:    lsGet('ml_usageCount',   {}),
  recentAmounts: lsGet('ml_recentAmounts',{}),
  nextFoodId:    lsGet('ml_nextId',       200),

  /* Workout */
  wEntries:      lsGet('ml_wEntries',     []),
  wWeights:      lsGet('ml_wWeights',     []),

  /* Money */
  transactions:  lsGet('ml_transactions', []),

  /* Classes */
  classes:       lsGet('ml_classes',      []),

  /**
   * Persist one or more top-level keys back to localStorage.
   * @param {...string} keys  store property names
   */
  persist(...keys) {
    const keyMap = {
      profile:       'ml_profile',
      mealData:      'ml_mealData',
      usageCount:    'ml_usageCount',
      recentAmounts: 'ml_recentAmounts',
      nextFoodId:    'ml_nextId',
      wEntries:      'ml_wEntries',
      wWeights:      'ml_wWeights',
      transactions:  'ml_transactions',
      classes:       'ml_classes',
    };

    keys.forEach(k => {
      if (keyMap[k]) lsSet(keyMap[k], this[k]);
    });
  },

  /** Persist every key at once (e.g. after import). */
  persistAll() {
    this.persist(
      'profile', 'mealData', 'usageCount', 'recentAmounts',
      'nextFoodId', 'wEntries', 'wWeights', 'transactions', 'classes'
    );
  },
};
