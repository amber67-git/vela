/**
 * profile.js — Profile & app-settings module
 *
 * Responsibilities:
 *   - Render the Profile page
 *   - BMR / TDEE calculation (Mifflin-St Jeor)
 *   - Dark-mode toggle
 *   - Meal name customisation (syncs to store.profile.mealNames)
 *   - Save settings (persists to localStorage + syncs diet hidden inputs)
 *   - Export / import full backup JSON
 */

'use strict';

import { store } from './store.js';
import { $ }     from './app.js';

/* ─── Public API ────────────────────────────────────────────────────── */

/** Apply dark/light theme from store.profile.darkMode. */
export function applyDarkMode() {
  document.documentElement.setAttribute(
    'data-theme',
    store.profile.darkMode ? 'dark' : ''
  );
}

/** Build greeting string based on current hour. */
export function buildGreeting() {
  const h = new Date().getHours();
  const salutation = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return store.profile.name ? `${salutation}, ${store.profile.name} 👋` : salutation;
}

/**
 * Mifflin-St Jeor BMR.
 * @returns {number|null}  kcal/day or null if inputs incomplete
 */
export function calcBMR() {
  const { height, weight, age, gender } = store.profile;
  const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);
  if (!h || !w || !a) return null;
  return gender === 'male'
    ? (10 * w) + (6.25 * h) - (5 * a) + 5
    : (10 * w) + (6.25 * h) - (5 * a) - 161;
}

/**
 * TDEE = BMR × activity multiplier.
 * @returns {number|null}
 */
export function calcTDEE() {
  const bmr = calcBMR();
  if (!bmr) return null;
  const multipliers = {
    sedentary:  1.2,
    light:      1.375,
    moderate:   1.55,
    active:     1.725,
    veryactive: 1.9,
  };
  return Math.round(bmr * (multipliers[store.profile.activity] ?? 1.55));
}

/**
 * Suggested daily calorie intake given goal + weekly change rate.
 * @returns {number|null}
 */
export function calcSuggestedCal() {
  const tdee = calcTDEE();
  if (!tdee) return null;
  const { goalType, weeklyChange } = store.profile;
  const wc = parseFloat(weeklyChange) || 0.5;
  const delta = Math.round(wc * 1000 / 7);
  if (goalType === 'lose')   return tdee - delta;
  if (goalType === 'gain')   return tdee + delta;
  return tdee;
}

/** Sync goal values from profile into the diet module's hidden inputs. */
export function syncDietInputs() {
  const set = (id, val) => { const el = $(id); if (el) el.value = val; };
  set('calGoal', store.profile.dietCal   ?? 2000);
  set('rCarb',   store.profile.dietRCarb ?? 50);
  set('rProt',   store.profile.dietRProt ?? 30);
  set('rFat',    store.profile.dietRFat  ?? 20);
}

/* ─── Render ────────────────────────────────────────────────────────── */

/** Render the full profile page. */
export function renderProfile() {
  const el = $('profilePanel');
  if (!el) return;

  const p   = store.profile;
  const cal = p.dietCal   ?? 2000;
  const rc  = p.dietRCarb ?? 50;
  const rp  = p.dietRProt ?? 30;
  const rf  = p.dietRFat  ?? 20;

  el.innerHTML = `
    <!-- Basic -->
    <div class="profile-section">
      <div class="profile-section-title">Basic info</div>
      <div class="profile-row">
        <span class="profile-label">Name / Nickname</span>
        <input class="profile-input" id="pName" type="text" placeholder="e.g. Amber" value="${p.name}"/>
      </div>
    </div>

    <!-- Nutrition goals -->
    <div class="profile-section">
      <div class="profile-section-title">Nutrition goals</div>
      <div class="profile-row">
        <span class="profile-label">Calorie goal</span>
        <input class="profile-input" id="pCalGoal" type="number" min="500" max="5000" step="50" value="${cal}" oninput="window._profile.updateRatioGrams()"/>
        <span class="profile-unit">kcal / day</span>
      </div>
      <div style="margin:6px 0">
        <div class="ratio-row">
          <span class="ratio-name" style="color:#3b82f6">Carbs</span>
          <input class="ratio-input" id="pRCarb" type="number" min="0" max="100" value="${rc}" oninput="window._profile.updateRatioGrams()"/>
          <span class="ratio-pct">%</span>
          <span class="ratio-grams" id="pGCarb"></span>
        </div>
        <div class="ratio-row">
          <span class="ratio-name" style="color:#22c55e">Protein</span>
          <input class="ratio-input" id="pRProt" type="number" min="0" max="100" value="${rp}" oninput="window._profile.updateRatioGrams()"/>
          <span class="ratio-pct">%</span>
          <span class="ratio-grams" id="pGProt"></span>
        </div>
        <div class="ratio-row">
          <span class="ratio-name" style="color:#f59e0b">Fat</span>
          <input class="ratio-input" id="pRFat" type="number" min="0" max="100" value="${rf}" oninput="window._profile.updateRatioGrams()"/>
          <span class="ratio-pct">%</span>
          <span class="ratio-grams" id="pGFat"></span>
        </div>
        <div class="ratio-total" id="pRatioTotal"></div>
      </div>
    </div>

    <!-- Body info -->
    <div class="profile-section">
      <div class="profile-section-title">Body info — auto-calculates calorie goal</div>
      <div class="profile-row">
        <span class="profile-label">Height</span>
        <input class="profile-input" id="pHeight" type="number" placeholder="165" value="${p.height}" oninput="window._profile.updateBMR()"/>
        <span class="profile-unit">cm</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Weight</span>
        <input class="profile-input" id="pWeight" type="number" placeholder="60" value="${p.weight}" oninput="window._profile.updateBMR()"/>
        <span class="profile-unit">kg</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Age</span>
        <input class="profile-input" id="pAge" type="number" placeholder="25" value="${p.age}" oninput="window._profile.updateBMR()"/>
        <span class="profile-unit">years</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Gender</span>
        <select class="profile-select" id="pGender" onchange="window._profile.updateBMR()">
          <option value="female" ${p.gender === 'female' ? 'selected' : ''}>Female</option>
          <option value="male"   ${p.gender === 'male'   ? 'selected' : ''}>Male</option>
        </select>
      </div>
      <div class="profile-row">
        <span class="profile-label">Activity level</span>
        <select class="profile-select" id="pActivity" onchange="window._profile.updateBMR()">
          ${activityOptions(p.activity)}
        </select>
      </div>
      <div class="profile-bmr-box" id="bmrBox" style="display:none"></div>
    </div>

    <!-- Goal setting -->
    <div class="profile-section">
      <div class="profile-section-title">Goal setting</div>
      <div class="profile-row">
        <span class="profile-label">Goal type</span>
        <select class="profile-select" id="pGoalType" onchange="window._profile.updateBMR()">
          <option value="lose"     ${p.goalType === 'lose'     ? 'selected' : ''}>Lose weight</option>
          <option value="maintain" ${p.goalType === 'maintain' ? 'selected' : ''}>Maintain weight</option>
          <option value="gain"     ${p.goalType === 'gain'     ? 'selected' : ''}>Gain weight</option>
        </select>
      </div>
      <div class="profile-row">
        <span class="profile-label">Goal weight</span>
        <input class="profile-input" id="pGoalWeight" type="number" placeholder="55" value="${p.goalWeight}"/>
        <span class="profile-unit">kg</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Weekly change</span>
        <select class="profile-select" id="pWeeklyChange" onchange="window._profile.updateBMR()">
          ${weeklyChangeOptions(p.weeklyChange)}
        </select>
      </div>
      <div class="profile-row">
        <span class="profile-label">Workout target</span>
        <input class="profile-input" id="pCalTarget" type="number" placeholder="400" value="${p.caltarget}"/>
        <span class="profile-unit">kcal/day</span>
      </div>
    </div>

    <!-- App settings -->
    <div class="profile-section">
      <div class="profile-section-title">App settings</div>
      <div class="profile-row">
        <span class="profile-label">Dark mode</span>
        <label class="toggle">
          <input type="checkbox" id="pDarkMode" ${p.darkMode ? 'checked' : ''}
            onchange="store.profile.darkMode=this.checked; window._profile.applyDarkMode()"/>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="profile-row" style="align-items:flex-start">
        <span class="profile-label" style="padding-top:6px">Meal names</span>
        <div style="display:flex;flex-direction:column;gap:6px;flex:1">
          ${['Breakfast','Lunch','Dinner'].map((def, i) =>
            `<input class="profile-input" id="pMeal${i}" type="text" placeholder="${def}" value="${p.mealNames[i] ?? def}"/>`
          ).join('')}
        </div>
      </div>
      <div class="profile-row">
        <span class="profile-label">Data backup</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" onclick="window._profile.exportData()">Export backup</button>
          <label class="btn btn-secondary btn-sm" style="cursor:pointer">Import backup
            <input type="file" accept=".json" onchange="window._profile.importData(event)" style="display:none"/>
          </label>
        </div>
      </div>
    </div>

    <!-- Save -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <button class="btn btn-primary" onclick="window._profile.save()" style="padding:8px 20px">Save profile</button>
      <span id="profileSaveMsg" style="font-size:11px;color:var(--accent);opacity:0;transition:opacity .3s">Saved!</span>
    </div>`;

  updateRatioGrams();
  updateBMR();
}

/* ─── Internal helpers ──────────────────────────────────────────────── */

function activityOptions(current) {
  return [
    ['sedentary',  'Sedentary (desk job, no exercise)'],
    ['light',      'Light (1-3x/week)'],
    ['moderate',   'Moderate (3-5x/week)'],
    ['active',     'Active (6-7x/week)'],
    ['veryactive', 'Very active (athlete)'],
  ].map(([v, l]) => `<option value="${v}" ${current === v ? 'selected' : ''}>${l}</option>`).join('');
}

function weeklyChangeOptions(current) {
  return [
    ['0.25', '0.25 kg/week (gentle)'],
    ['0.5',  '0.5 kg/week (recommended)'],
    ['0.75', '0.75 kg/week'],
    ['1',    '1 kg/week (aggressive)'],
  ].map(([v, l]) => `<option value="${v}" ${current === v ? 'selected' : ''}>${l}</option>`).join('');
}

/** Recalculate gram targets from calorie + ratio inputs and update DOM. */
export function updateRatioGrams() {
  const cal = parseInt($('pCalGoal')?.value) || 0;
  const rc  = parseInt($('pRCarb')?.value)   || 0;
  const rp  = parseInt($('pRProt')?.value)   || 0;
  const rf  = parseInt($('pRFat')?.value)    || 0;
  const total = rc + rp + rf;
  const valid = total === 100;

  const rt = $('pRatioTotal');
  if (rt) {
    rt.textContent = valid ? 'Total: 100% — looks good' : `Total: ${total}% — must equal 100%`;
    rt.className   = `ratio-total ${valid ? 'ratio-ok' : 'ratio-warn'}`;
  }

  const setGram = (id, pct, div) => {
    const el = $(id);
    if (el) el.textContent = valid ? `${Math.round(cal * (pct / 100) / div)}g` : '—';
  };

  setGram('pGCarb', rc, 4);
  setGram('pGProt', rp, 4);
  setGram('pGFat',  rf, 9);

  updateBMR();
}

/** Recompute BMR/TDEE from current form inputs and refresh the display box. */
export function updateBMR() {
  // Snapshot current form values into a temporary profile for calculation
  const tmp = {
    height:       $('pHeight')?.value       ?? store.profile.height,
    weight:       $('pWeight')?.value       ?? store.profile.weight,
    age:          $('pAge')?.value          ?? store.profile.age,
    gender:       $('pGender')?.value       ?? store.profile.gender,
    activity:     $('pActivity')?.value     ?? store.profile.activity,
    goalType:     $('pGoalType')?.value     ?? store.profile.goalType,
    weeklyChange: $('pWeeklyChange')?.value ?? store.profile.weeklyChange,
  };

  const { height, weight, age, gender, activity, goalType, weeklyChange } = tmp;
  const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);
  const box = $('bmrBox');
  if (!box) return;

  if (!h || !w || !a) { box.style.display = 'none'; return; }

  const bmr = gender === 'male'
    ? (10 * w) + (6.25 * h) - (5 * a) + 5
    : (10 * w) + (6.25 * h) - (5 * a) - 161;

  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryactive: 1.9 };
  const tdee = Math.round(bmr * (mult[activity] ?? 1.55));

  const wc = parseFloat(weeklyChange) || 0.5;
  const delta = Math.round(wc * 1000 / 7);
  const suggested = goalType === 'lose' ? tdee - delta : goalType === 'gain' ? tdee + delta : tdee;

  box.style.display = 'block';
  box.innerHTML = `
    <div class="profile-bmr-row">
      <div class="profile-bmr-item">
        <div class="profile-bmr-val">${Math.round(bmr)}</div>
        <div class="profile-bmr-lbl">BMR (kcal)</div>
      </div>
      <div class="profile-bmr-item">
        <div class="profile-bmr-val">${tdee}</div>
        <div class="profile-bmr-lbl">TDEE (kcal)</div>
      </div>
      <div class="profile-bmr-item">
        <div class="profile-bmr-val" style="color:var(--accent)">${suggested}</div>
        <div class="profile-bmr-lbl">Suggested goal</div>
      </div>
    </div>
    <button class="btn btn-secondary btn-sm" style="margin-top:10px;font-size:11px"
      onclick="window._profile.applyBMR(${suggested})">
      Use ${suggested} kcal as my goal
    </button>`;
}

/** Copy a BMR-suggested value into the calorie-goal input. */
export function applyBMR(val) {
  const el = $('pCalGoal');
  if (el) { el.value = val; updateRatioGrams(); }
}

/** Collect all form values, update store, persist, and sync diet inputs. */
export function save() {
  const read = id => ($(`${id}`)?.value ?? '').trim();

  Object.assign(store.profile, {
    name:         read('pName'),
    height:       read('pHeight'),
    weight:       read('pWeight'),
    age:          read('pAge'),
    gender:       $('pGender')?.value       || store.profile.gender,
    activity:     $('pActivity')?.value     || store.profile.activity,
    goalType:     $('pGoalType')?.value     || store.profile.goalType,
    goalWeight:   read('pGoalWeight'),
    weeklyChange: $('pWeeklyChange')?.value || store.profile.weeklyChange,
    darkMode:     $('pDarkMode')?.checked   ?? store.profile.darkMode,
    caltarget:    read('pCalTarget'),
    dietCal:      parseInt($('pCalGoal')?.value)  || store.profile.dietCal,
    dietRCarb:    parseInt($('pRCarb')?.value)     || store.profile.dietRCarb,
    dietRProt:    parseInt($('pRProt')?.value)     || store.profile.dietRProt,
    dietRFat:     parseInt($('pRFat')?.value)      || store.profile.dietRFat,
    mealNames:    [0, 1, 2].map(i => $(`pMeal${i}`)?.value.trim() || store.profile.mealNames[i]),
  });

  store.persist('profile');
  applyDarkMode();
  syncDietInputs();

  // Flash saved message
  const msg = $('profileSaveMsg');
  if (msg) {
    msg.style.opacity = '1';
    setTimeout(() => { msg.style.opacity = '0'; }, 2500);
  }

  // Notify app to refresh greeting / dashboard
  window.dispatchEvent(new CustomEvent('profile:saved'));
}

/* ─── Export / Import ───────────────────────────────────────────────── */

/** Download a full-backup JSON file. */
export function exportData() {
  const payload = {
    version:      3,
    exportedAt:   new Date().toISOString(),
    profile:      store.profile,
    mealData:     store.mealData,
    usageCount:   store.usageCount,
    recentAmounts:store.recentAmounts,
    nextFoodId:   store.nextFoodId,
    foods:        window._foods ?? [],
    wEntries:     store.wEntries,
    wWeights:     store.wWeights,
    transactions: store.transactions,
    classes:      store.classes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: `vela-backup-${new Date().toISOString().slice(0, 10)}.json`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

/** Read a backup JSON and restore all store keys. */
export function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const p = JSON.parse(ev.target.result);
      if (p.profile)       store.profile       = Object.assign(store.profile, p.profile);
      if (p.mealData)      store.mealData       = p.mealData;
      if (p.usageCount)    store.usageCount     = p.usageCount;
      if (p.recentAmounts) store.recentAmounts  = p.recentAmounts;
      if (p.nextFoodId)    store.nextFoodId     = Math.max(store.nextFoodId, p.nextFoodId);
      if (p.wEntries)      store.wEntries       = p.wEntries;
      if (p.wWeights)      store.wWeights       = p.wWeights;
      if (p.transactions)  store.transactions   = p.transactions;
      if (p.classes)       store.classes        = p.classes;

      if (p.foods && window._foods) {
        p.foods.forEach(f => {
          const idx = window._foods.findIndex(x => x.id === f.id);
          if (idx === -1) window._foods.push(f); else window._foods[idx] = f;
        });
      }

      store.persistAll();
      applyDarkMode();
      syncDietInputs();
      window.dispatchEvent(new CustomEvent('data:imported'));
      alert('Backup restored successfully!');
    } catch {
      alert('Error: invalid backup file');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ─── Expose helpers to inline event handlers ───────────────────────── */
window._profile = {
  save, applyDarkMode, buildGreeting,
  exportData, importData,
  updateRatioGrams, updateBMR, applyBMR,
  renderProfile, syncDietInputs,
};
