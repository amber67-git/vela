/**
 * diet.js — Diet tracker module
 *
 * Responsibilities:
 *   - Food library rendering + drag-and-drop
 *   - Add / edit / delete foods (with auto per-100g conversion)
 *   - Meal grid (7-day, collapsible, week offset navigation)
 *   - Macro progress bar (today only)
 *   - Week summary chart + diet analysis
 *   - Per-100g calculator panel
 */

'use strict';

import { store }                                from './store.js';
import { $ }                                    from './app.js';
import { detectCategory, CATEGORY_LABELS,
         CATEGORY_COLORS }                      from '../data/foods.js';

/* ─── State ─────────────────────────────────────────────────────────── */

let weekOffset    = 0;
let currentSearch = '';
let editingFoodId = null;
let dragFood      = null;   // food id dragged from library
let dragPlaced    = null;   // { date, meal, idx } of a placed item being moved
let collapsedDays = {};
let currentTab    = 'meals';

/* ─── Helpers ───────────────────────────────────────────────────────── */

/** Today's key in 'M/D' format. */
export function todayKey() {
  const n = new Date();
  return `${n.getMonth() + 1}/${n.getDate()}`;
}

/** Return an array of 7 date keys starting Monday of the given week offset. */
function weekDates(offset = 0) {
  const now = new Date(), day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
}

const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/** Ensure store.mealData has entries for every date in `dates`. */
function ensureWeekData(dates) {
  dates.forEach(d => {
    if (!store.mealData[d]) {
      store.mealData[d] = {};
      getMealNames().forEach(m => { store.mealData[d][m] = []; });
    }
  });
}

function getMealNames() {
  return store.profile.mealNames ?? ['Breakfast', 'Lunch', 'Dinner'];
}

/**
 * Read nutrition goals from the profile (hidden inputs are secondary).
 * @returns {{ cal, valid, carb, prot, fat }}
 */
export function getGoals() {
  const cal = store.profile.dietCal   || 2000;
  const rc  = store.profile.dietRCarb || 50;
  const rp  = store.profile.dietRProt || 30;
  const rf  = store.profile.dietRFat  || 20;
  const valid = (rc + rp + rf) === 100;
  return {
    cal,
    valid,
    carb: valid ? Math.round(cal * rc / 100 / 4) : null,
    prot: valid ? Math.round(cal * rp / 100 / 4) : null,
    fat:  valid ? Math.round(cal * rf / 100 / 9) : null,
  };
}

/**
 * Calculate macros for a food entry.
 * @param {{ per100: { cal, carb, prot, fat } }} food
 * @param {number} amount  grams
 */
export function calcMacros(food, amount) {
  const f = amount / 100;
  return {
    cal:  Math.round(food.per100.cal  * f),
    carb: Math.round(food.per100.carb * f * 10) / 10,
    prot: Math.round(food.per100.prot * f * 10) / 10,
    fat:  Math.round(food.per100.fat  * f * 10) / 10,
  };
}

/**
 * Sum all macros logged for a given date.
 * @param {string} date  'M/D' key
 */
export function getDayTotals(date) {
  const t = { cal: 0, carb: 0, prot: 0, fat: 0 };
  getMealNames().forEach(meal => {
    (store.mealData[date]?.[meal] ?? []).forEach(entry => {
      const food = window._foods?.find(f => f.id === entry.foodId);
      if (!food) return;
      const mc = calcMacros(food, entry.amount);
      t.cal += mc.cal; t.carb += mc.carb; t.prot += mc.prot; t.fat += mc.fat;
    });
  });
  return {
    cal:  Math.round(t.cal),
    carb: Math.round(t.carb * 10) / 10,
    prot: Math.round(t.prot * 10) / 10,
    fat:  Math.round(t.fat  * 10) / 10,
  };
}

/* ─── Macro progress bar ────────────────────────────────────────────── */

export function renderMacroBar() {
  const container = $('macroBar');
  if (!container) return;

  const g = getGoals();
  if (!g.valid) {
    container.innerHTML = `<div style="padding:12px 16px;font-size:12px;color:var(--danger);flex:1">
      Set C/P/F ratios in Profile → they must total 100%.
    </div>`;
    return;
  }

  const t = getDayTotals(todayKey());
  const macros = [
    { label: 'Calories (today)', val: t.cal,  goal: g.cal,  unit: 'kcal', cls: 'fill-cal'  },
    { label: 'Carbs',            val: t.carb, goal: g.carb, unit: 'g',    cls: 'fill-carb' },
    { label: 'Protein',          val: t.prot, goal: g.prot, unit: 'g',    cls: 'fill-prot' },
    { label: 'Fat',              val: t.fat,  goal: g.fat,  unit: 'g',    cls: 'fill-fat'  },
  ];

  container.innerHTML = macros.map(m => {
    const pct  = Math.min(100, Math.round(m.val / m.goal * 100));
    const rem  = Math.max(0, Math.round((m.goal - m.val) * 10) / 10);
    const over = m.val > m.goal;
    return `
      <div class="macro-card">
        <div class="mc-label">${m.label}</div>
        <div class="mc-nums">${m.val}
          <span style="font-weight:400;color:var(--text-3)"> / ${m.goal} ${m.unit}</span>
        </div>
        <div class="mc-rem" style="${over ? 'color:var(--danger)' : ''}">
          ${over ? `over by ${Math.round((m.val - m.goal) * 10) / 10} ${m.unit}` : `${rem} ${m.unit} left`}
        </div>
        <div class="track"><div class="fill ${m.cls}" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');
}

/* ─── Week navigation ───────────────────────────────────────────────── */

export function shiftWeek(dir) {
  weekOffset += dir;
  _updateWeekNavLabel();
  renderMealGrid();
  if (currentTab === 'week') renderWeekSummary();
}

function _updateWeekNavLabel() {
  const dates = weekDates(weekOffset);
  const label = weekOffset === 0 ? 'This week'
              : weekOffset === -1 ? 'Last week'
              : weekOffset === 1  ? 'Next week'
              : `Week of ${dates[0]}`;
  const el = $('weekNavLabel');
  if (el) el.textContent = `${label} (${dates[0]} – ${dates[6]})`;
}

/* ─── Tab switching ─────────────────────────────────────────────────── */

export function switchDietTab(tab) {
  currentTab = tab;
  ['meals', 'week'].forEach(t => {
    $(`tab${t.charAt(0).toUpperCase() + t.slice(1)}`)?.classList.toggle('active', t === tab);
    $(`view${t.charAt(0).toUpperCase() + t.slice(1)}`)?.style.setProperty('display', t === tab ? '' : 'none');
  });
  if (tab === 'week') renderWeekSummary();
}

/* ─── Food library ──────────────────────────────────────────────────── */

export function onSearch(val) {
  currentSearch = val;
  renderFoodList(val);
}

export function renderFoodList(filter = '') {
  const fl   = filter.toLowerCase();
  const list = (window._foods ?? []).filter(f => !fl || f.name.toLowerCase().includes(fl));
  const sorted = list.slice().sort((a, b) =>
    (store.usageCount[b.id] ?? 0) - (store.usageCount[a.id] ?? 0)
  );
  const hasFrequent = sorted.some(f => (store.usageCount[f.id] ?? 0) > 0);

  let html = '';
  let shownFreq = false, shownAll = false;

  if (!sorted.length) {
    html = `
      <div class="no-result-box">
        <div class="no-result-msg">"${filter}" not found in library</div>
        <button class="add-food-btn" onclick="window._diet.openAddForm()">
          <i class="ti ti-plus" style="font-size:13px;vertical-align:-1px"></i>
          Add "${filter}"
        </button>
      </div>`;
  } else {
    sorted.forEach(f => {
      const count = store.usageCount[f.id] ?? 0;
      if (hasFrequent && !filter) {
        if (count > 0 && !shownFreq) { html += '<div class="freq-header">Frequently used</div>'; shownFreq = true; }
        if (count === 0 && !shownAll) { html += '<div class="freq-header">All foods</div>'; shownAll = true; }
      }
      html += `
        <div class="food-item" draggable="true" data-id="${f.id}">
          <button class="food-item-edit-btn" onclick="event.stopPropagation();window._diet.editFood(${f.id})">✏️</button>
          <span class="cat-pill cat-${f.cat}">${f.cat}${f.custom ? ' ★' : ''}</span>
          <div class="fi-name">${f.name}</div>
          <div class="fi-meta">C ${f.per100.carb}g · P ${f.per100.prot}g · F ${f.per100.fat}g / 100g</div>
        </div>`;
    });
  }

  const fl2 = $('foodList');
  if (fl2) fl2.innerHTML = html;

  // Attach drag-start handlers
  document.querySelectorAll('.food-item').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragFood   = parseInt(el.dataset.id);
      dragPlaced = null;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      dragFood = null;
    });
  });

  _syncLibraryHeight();
}

function _syncLibraryHeight() {
  requestAnimationFrame(() => {
    const grid  = $('mealGrid');
    const leftCol = $('leftCol') ?? $('foodPanel');
    const fl    = $('foodList');
    if (!grid || !leftCol || !fl) return;
    const available = Math.max(120, Math.min(200, grid.offsetHeight - leftCol.offsetHeight + fl.offsetHeight));
    fl.style.maxHeight = `${available}px`;
  });
}

/* ─── Add / Edit food form ──────────────────────────────────────────── */

export function openAddForm() {
  editingFoodId = null;
  const set = (id, val) => { const e = $(id); if (e) e.value = val; };
  set('affName', currentSearch ?? '');
  set('affCat',  'other');
  ['affAmt','affCalTotal','affCarbTotal','affProtTotal','affFatTotal'].forEach(id => set(id, ''));
  const r = $('affPer100Result'); if (r) r.style.display = 'none';
  const s = document.querySelector('.aff-save'); if (s) s.textContent = 'Add to library';
  $('addFoodForm')?.classList.add('open');
  $('affName')?.focus();
}

export function closeAddForm() {
  editingFoodId = null;
  $('addFoodForm')?.classList.remove('open');
  const s = document.querySelector('.aff-save');
  if (s) s.textContent = 'Add to library';
}

export function editFood(id) {
  const food = (window._foods ?? []).find(f => f.id === id);
  if (!food) return;
  editingFoodId = id;

  const set = (elId, val) => { const e = $(elId); if (e) e.value = val; };
  set('affName',     food.name);
  set('affCat',      food.cat);
  set('affAmt',      100);
  set('affCalTotal', food.per100.cal);
  set('affCarbTotal',food.per100.carb);
  set('affProtTotal',food.per100.prot);
  set('affFatTotal', food.per100.fat);

  autoCalcPer100();
  const s = document.querySelector('.aff-save'); if (s) s.textContent = 'Update food';
  $('addFoodForm')?.classList.add('open');
  $('affName')?.focus();
}

export function onFoodNameInput(val) {
  autoCalcPer100();
  const catEl = $('affCat');
  if (catEl && catEl.value === 'other') {
    const detected = detectCategory(val);
    if (detected) catEl.value = detected;
  }
}

export function autoCalcPer100() {
  const amt  = parseFloat($('affAmt')?.value);
  const cal  = parseFloat($('affCalTotal')?.value)  || 0;
  const carb = parseFloat($('affCarbTotal')?.value) || 0;
  const prot = parseFloat($('affProtTotal')?.value) || 0;
  const fat  = parseFloat($('affFatTotal')?.value)  || 0;
  const res  = $('affPer100Result');
  if (!res) return;

  if (!amt || amt <= 0) { res.style.display = 'none'; return; }

  const f = 100 / amt;
  const set = (id, val) => { const e = $(id); if (e) e.textContent = val; };
  set('r100Cal',  Math.round(cal  * f));
  set('r100Carb', `${Math.round(carb * f * 10) / 10}g`);
  set('r100Prot', `${Math.round(prot * f * 10) / 10}g`);
  set('r100Fat',  `${Math.round(fat  * f * 10) / 10}g`);
  res.style.display = 'block';
}

function _getFormValues() {
  const raw = ($('affName')?.value ?? '').trim();
  const name = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
  const amt  = parseFloat($('affAmt')?.value) || 100;
  const f    = 100 / amt;
  return {
    name,
    cat:  $('affCat')?.value ?? 'other',
    cal:  Math.round((parseFloat($('affCalTotal')?.value)  || 0) * f),
    carb: Math.round((parseFloat($('affCarbTotal')?.value) || 0) * f * 10) / 10,
    prot: Math.round((parseFloat($('affProtTotal')?.value) || 0) * f * 10) / 10,
    fat:  Math.round((parseFloat($('affFatTotal')?.value)  || 0) * f * 10) / 10,
    def:  amt,
  };
}

export function saveFood() {
  if (editingFoodId !== null) { _updateFood(); return; }

  const v = _getFormValues();
  if (!v.name) return;

  if (!window._foods) window._foods = [];
  window._foods.push({
    id: store.nextFoodId++,
    name: v.name, cat: v.cat, unit: 'g', default: v.def,
    per100: { cal: v.cal, carb: v.carb, prot: v.prot, fat: v.fat },
    custom: true,
  });

  store.persist('nextFoodId');
  _persistFoods();
  closeAddForm();
  const fs = $('foodSearch'); if (fs) fs.value = '';
  currentSearch = '';
  renderFoodList('');
}

function _updateFood() {
  const food = (window._foods ?? []).find(f => f.id === editingFoodId);
  if (!food) return;
  const v = _getFormValues();
  if (v.name) food.name = v.name;
  Object.assign(food.per100, { cal: v.cal, carb: v.carb, prot: v.prot, fat: v.fat });
  food.cat     = v.cat;
  food.default = v.def;
  _persistFoods();
  closeAddForm();
  renderDiet();
}

function _persistFoods() {
  try { localStorage.setItem('ml_all_foods', JSON.stringify(window._foods)); } catch {}
}

/* ─── Per-100g calculator ───────────────────────────────────────────── */

export function runCalc() {
  const amt  = parseFloat($('cAmt')?.value);
  if (!amt || amt <= 0) return;
  const cal  = parseFloat($('cCal')?.value)  || 0;
  const carb = parseFloat($('cCarb')?.value) || 0;
  const prot = parseFloat($('cProt')?.value) || 0;
  const fat  = parseFloat($('cFat')?.value)  || 0;
  const f = 100 / amt;
  const set = (id, val) => { const e = $(id); if (e) e.textContent = val; };
  set('rCal',  Math.round(cal  * f));
  set('rCarb', `${Math.round(carb * f * 10) / 10}g`);
  set('rProt', `${Math.round(prot * f * 10) / 10}g`);
  set('rFat',  `${Math.round(fat  * f * 10) / 10}g`);
  $('calcResult')?.classList.add('show');
}

export function useCalcResult() {
  const cal = $('rCal')?.textContent;
  if (!cal || cal === '—') return;
  openAddForm();
  const set = (id, src) => { const e = $(id); if (e) e.value = ($(src)?.textContent ?? '').replace('g',''); };
  if ($('affAmt')) $('affAmt').value = 100;
  if ($('affCalTotal')) $('affCalTotal').value = cal;
  set('affCarbTotal', 'rCarb');
  set('affProtTotal', 'rProt');
  set('affFatTotal',  'rFat');
}

/* ─── Meal grid ─────────────────────────────────────────────────────── */

export function toggleDay(date) {
  collapsedDays[date] = !collapsedDays[date];
  renderMealGrid();
}

export function renderMealGrid() {
  const dates   = weekDates(weekOffset);
  ensureWeekData(dates);
  const today   = todayKey();
  const todayIdx = dates.indexOf(today);
  const meals   = getMealNames();
  const mg      = $('mealGrid');
  if (!mg) return;

  mg.innerHTML = dates.map((date, di) => {
    const isToday = date === today;
    const isPast  = todayIdx >= 0 && di < todayIdx;
    if (collapsedDays[date] === undefined) collapsedDays[date] = isPast;
    const collapsed = collapsedDays[date];

    let totalEntries = 0;
    meals.forEach(m => { totalEntries += (store.mealData[date]?.[m]?.length ?? 0); });

    const header = `
      <div class="date-row day-header" data-toggle-date="${date}">
        <span class="day-toggle">${collapsed ? '&#9654;' : '&#9660;'}</span>
        <span class="date-label">${date} (${DAYS_SHORT[di]})</span>
        ${isToday ? '<span class="today-badge">Today</span>' : ''}
        ${!isToday && totalEntries > 0
          ? `<span style="font-size:10px;color:var(--text-3);margin-left:6px">${totalEntries} item${totalEntries !== 1 ? 's' : ''}</span>`
          : ''}
      </div>`;

    const mealRowHtml = `<div class="meal-row">${meals.map(meal => {
      const entries = store.mealData[date]?.[meal] ?? [];
      const items = entries.map((entry, idx) => {
        const food = (window._foods ?? []).find(f => f.id === entry.foodId);
        if (!food) return '';
        const mc = calcMacros(food, entry.amount);
        return `
          <div class="placed-item" draggable="true"
            data-pfrom-date="${date}" data-pfrom-meal="${meal}" data-pfrom-idx="${idx}">
            <div class="pi-name-row">
              <span class="pi-name">${food.name}</span>
              <button class="pi-rm" data-date="${date}" data-meal="${meal}" data-idx="${idx}">×</button>
            </div>
            <div class="pi-kcal-row"><span class="pi-kcal-val">${mc.cal}</span> kcal</div>
            <div class="pi-cpf-row">
              <span class="pi-cpf-item">C <span class="pi-cpf-val">${mc.carb}g</span></span>
              <span class="pi-cpf-item">P <span class="pi-cpf-val">${mc.prot}g</span></span>
              <span class="pi-cpf-item">F <span class="pi-cpf-val">${mc.fat}g</span></span>
            </div>
            <div class="pi-amt-row">
              <input class="pi-amt" type="number" min="1" step="5" value="${entry.amount}"
                data-date="${date}" data-meal="${meal}" data-idx="${idx}"/>
              <span class="pi-unit">g</span>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="meal-col">
          <div class="meal-head">${meal}</div>
          <div class="meal-cell" data-date="${date}" data-meal="${meal}">
            ${items}
            ${entries.length === 0 ? '<div class="drop-hint">drop food here</div>' : ''}
          </div>
        </div>`;
    }).join('')}</div>`;

    return `
      <div>
        ${header}
        <div class="day-content" id="day-${date.replace('/','_')}"
             style="max-height:${collapsed ? '0' : '2000px'};">
          ${mealRowHtml}
        </div>
      </div>`;
  }).join('');

  _attachMealGridListeners();
  _syncLibraryHeight();
}

function _attachMealGridListeners() {
  // Day header toggle
  document.querySelectorAll('.day-header').forEach(hdr => {
    hdr.addEventListener('click', () => toggleDay(hdr.dataset.toggleDate));
  });

  // Placed-item drag
  document.querySelectorAll('.placed-item[draggable]').forEach(item => {
    item.addEventListener('dragstart', e => {
      dragPlaced = { date: item.dataset.pfromDate, meal: item.dataset.pfromMeal, idx: parseInt(item.dataset.pfromIdx) };
      dragFood   = null;
      item.classList.add('dragging-placed');
      e.dataTransfer.effectAllowed = 'move';
      e.stopPropagation();
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging-placed');
      dragPlaced = null;
    });
    item.addEventListener('dblclick', () => {
      const entry = store.mealData[item.dataset.pfromDate]?.[item.dataset.pfromMeal]?.[parseInt(item.dataset.pfromIdx)];
      if (entry) editFood(entry.foodId);
    });
  });

  // Meal cell drop targets
  document.querySelectorAll('.meal-cell').forEach(cell => {
    cell.addEventListener('dragover',  e => { e.preventDefault(); cell.classList.add('drag-over'); });
    cell.addEventListener('dragleave', ()  => cell.classList.remove('drag-over'));
    cell.addEventListener('drop', e => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const { date: toDate, meal: toMeal } = cell.dataset;

      if (dragPlaced) {
        const { date: fromDate, meal: fromMeal, idx: fromIdx } = dragPlaced;
        if (fromDate === toDate && fromMeal === toMeal) { dragPlaced = null; return; }
        const entry = store.mealData[fromDate][fromMeal].splice(fromIdx, 1)[0];
        (store.mealData[toDate][toMeal] = store.mealData[toDate][toMeal] || []).push(entry);
        dragPlaced = null;
        _saveAndRender();
        return;
      }

      if (!dragFood) return;
      const food = (window._foods ?? []).find(f => f.id === dragFood);
      if (!food) return;
      const amount = store.recentAmounts[food.id] ?? food.default;
      (store.mealData[toDate][toMeal] = store.mealData[toDate][toMeal] || []).push({ foodId: food.id, amount });
      store.usageCount[food.id] = (store.usageCount[food.id] ?? 0) + 1;
      dragFood = null;
      _saveAndRender();
    });
  });

  // Remove buttons
  document.querySelectorAll('.pi-rm').forEach(btn => {
    btn.addEventListener('click', () => {
      const { date, meal, idx } = btn.dataset;
      store.mealData[date][meal].splice(parseInt(idx), 1);
      _saveAndRender();
    });
  });

  // Amount inputs
  document.querySelectorAll('.pi-amt').forEach(inp => {
    inp.addEventListener('change', () => {
      const v = parseFloat(inp.value);
      if (v > 0) {
        const entry = store.mealData[inp.dataset.date][inp.dataset.meal][parseInt(inp.dataset.idx)];
        entry.amount = v;
        store.recentAmounts[entry.foodId] = v;
        _saveAndRender();
      }
    });
  });
}

function _saveAndRender() {
  store.persist('mealData', 'usageCount', 'recentAmounts');
  renderDiet();
  // Notify dashboard
  window.dispatchEvent(new CustomEvent('diet:updated'));
}

/* ─── Week summary ──────────────────────────────────────────────────── */

export function renderWeekSummary() {
  const g      = getGoals();
  const dates  = weekDates(weekOffset);
  ensureWeekData(dates);
  const totals = dates.map(d => getDayTotals(d));
  const today  = todayKey();
  const logged = totals.filter(t => t.cal > 0);
  const totalCal  = logged.reduce((s, t) => s + t.cal, 0);
  const avgCal    = logged.length ? Math.round(totalCal / logged.length) : 0;
  const weekTarget = g.valid ? g.cal * 7 : 0;
  const weekPct   = weekTarget ? Math.round(totalCal / weekTarget * 100) : 0;
  const onTrack   = g.valid ? totals.filter(t => t.cal > 0 && t.cal <= g.cal).length : 0;

  // Summary cards
  let html = `
    <div class="week-summary-grid" style="margin-bottom:16px">
      <div class="week-card">
        <div class="wc-label">Total this week</div>
        <div class="wc-val">${totalCal.toLocaleString()}<span style="font-size:13px;font-weight:400;color:var(--text-3)"> kcal</span></div>
        <div class="wc-sub">${logged.length} day${logged.length !== 1 ? 's' : ''} logged</div>
      </div>
      <div class="week-card">
        <div class="wc-label">Daily average</div>
        <div class="wc-val">${avgCal.toLocaleString()}<span style="font-size:13px;font-weight:400;color:var(--text-3)"> kcal</span></div>
        <div class="wc-sub">goal: ${g.cal || '--'} kcal/day</div>
      </div>
      <div class="week-card">
        <div class="wc-label">Weekly target</div>
        <div class="wc-val">${weekTarget ? weekTarget.toLocaleString() : '--'}<span style="font-size:13px;font-weight:400;color:var(--text-3)"> kcal</span></div>
        <div class="wc-sub">${weekTarget ? `${weekPct}% reached` : 'set goals first'}</div>
      </div>
      <div class="week-card">
        <div class="wc-label">Days on track</div>
        <div class="wc-val" style="color:${onTrack >= 5 ? 'var(--accent)' : onTrack >= 3 ? 'var(--warn)' : 'var(--danger)'}">
          ${g.valid ? `${onTrack} / 7` : '--'}
        </div>
        <div class="wc-sub">within calorie goal</div>
      </div>
    </div>`;

  // Grouped bar chart
  const metrics = [
    { key: 'cal',  label: 'Calories', unit: 'kcal', color: '#ef4444', goal: g.cal  },
    { key: 'carb', label: 'Carbs',    unit: 'g',    color: '#3b82f6', goal: g.carb },
    { key: 'prot', label: 'Protein',  unit: 'g',    color: '#22c55e', goal: g.prot },
    { key: 'fat',  label: 'Fat',      unit: 'g',    color: '#f59e0b', goal: g.fat  },
  ];
  const usePct = g.valid && g.cal;
  const yMax = 125, ySteps = [0, 25, 50, 75, 100, 125], chartH = 140;

  html += `
    <div class="chart-panel">
      <div class="chart-title">Weekly nutrition — all metrics</div>
      <div class="chart-sub">${DAYS_SHORT[0]} ${dates[0]} – ${DAYS_SHORT[6]} ${dates[6]}${usePct ? ' · % of daily goal' : ''}</div>
      <div style="position:relative;padding-left:36px;margin-top:16px">
        <div style="position:absolute;left:0;top:0;height:${chartH}px;display:flex;flex-direction:column;justify-content:space-between;pointer-events:none">
          ${ySteps.slice().reverse().map(l => `<div style="font-size:9px;color:var(--text-3);line-height:1;text-align:right;width:30px">${l}%</div>`).join('')}
        </div>
        <div style="height:${chartH}px;border-bottom:1.5px solid var(--border-2);border-left:0.5px solid var(--border);display:flex;align-items:flex-end;position:relative;background:var(--surface)">
          ${ySteps.map(s => s === 0 ? '' : `<div style="position:absolute;left:0;right:0;bottom:${s / yMax * 100}%;border-top:${s === 100 ? '2px dashed #ef4444' : '0.5px dashed var(--border)'};pointer-events:none;z-index:1"></div>`).join('')}
          ${dates.map((date, i) => {
            const t = totals[i];
            const isToday = date === today;
            return `<div style="flex:1;display:flex;align-items:flex-end;justify-content:center;gap:1px;height:100%;position:relative;padding:0 2px">
              ${metrics.map(m => {
                const raw = t[m.key] ?? 0;
                const pct = usePct && m.goal ? raw / m.goal * 100 : 0;
                const barH = Math.min(100, pct / yMax * 100);
                return `<div style="flex:1;max-width:12px;height:${barH}%;background:${t.cal > 0 ? m.color : 'transparent'};border-radius:2px 2px 0 0" title="${m.label}: ${raw}${m.unit === 'kcal' ? ' kcal' : 'g'} (${Math.round(pct)}%)"></div>`;
              }).join('')}
            </div>`;
          }).join('')}
        </div>
        <div style="display:flex;height:22px;align-items:center">
          ${dates.map((_, i) => `<div style="flex:1;text-align:center;font-size:10px;font-weight:${dates[i] === today ? '700' : '400'};color:${dates[i] === today ? 'var(--text)' : 'var(--text-3)'}">  ${DAYS_SHORT[i]}</div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;padding-left:36px">
        ${metrics.map(m => `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-2)"><div style="width:10px;height:10px;border-radius:2px;background:${m.color}"></div>${m.label}</div>`).join('')}
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-2)"><div style="width:18px;height:0;border-top:2px dashed #ef4444"></div>100% goal</div>
      </div>
    </div>`;

  // Category breakdown (stacked bar)
  const catCals = {};
  dates.forEach(date => {
    getMealNames().forEach(meal => {
      (store.mealData[date]?.[meal] ?? []).forEach(entry => {
        const food = (window._foods ?? []).find(f => f.id === entry.foodId);
        if (!food) return;
        const cat = food.cat || 'other';
        catCals[cat] = (catCals[cat] ?? 0) + calcMacros(food, entry.amount).cal;
      });
    });
  });

  const sortedCats   = Object.keys(catCals).sort((a, b) => catCals[b] - catCals[a]);
  const totalTracked = Object.values(catCals).reduce((s, v) => s + v, 0);

  if (sortedCats.length) {
    html += `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;margin-top:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">Weekly diet analysis</div>
        <div style="font-size:11px;color:var(--text-3);margin-bottom:14px">Calorie contribution by food type</div>
        <div style="height:28px;border-radius:6px;overflow:hidden;display:flex;margin-bottom:14px">
          ${sortedCats.map(cat => {
            const pct = totalTracked ? catCals[cat] / totalTracked * 100 : 0;
            if (pct < 1) return '';
            const c = CATEGORY_COLORS[cat] ?? '#9ca3af';
            return `<div style="flex:${pct};background:${c};position:relative;min-width:0" title="${CATEGORY_LABELS[cat] ?? cat}: ${Math.round(pct)}%">
              ${pct > 6 ? `<span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:9px;font-weight:600;color:#fff;white-space:nowrap">${Math.round(pct)}%</span>` : ''}
            </div>`;
          }).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${sortedCats.map(cat => {
            const pct = totalTracked ? Math.round(catCals[cat] / totalTracked * 100) : 0;
            if (pct < 1) return '';
            const c   = CATEGORY_COLORS[cat] ?? '#9ca3af';
            const tip = pct >= 30 ? ' · Main calorie source' : pct >= 15 ? ' · Significant portion' : pct <= 5 ? ' · Minor contribution' : '';
            return `<div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:2px;background:${c};flex-shrink:0"></div>
              <span style="font-size:12px;color:var(--text);min-width:130px">${CATEGORY_LABELS[cat] ?? cat}</span>
              <span style="font-size:12px;font-weight:600;color:${c};min-width:36px">${pct}%</span>
              <span style="font-size:11px;color:var(--text-3)">${catCals[cat]} kcal${tip}</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  const wp = $('weekPanel');
  if (wp) wp.innerHTML = html;
}

/* ─── Master render ─────────────────────────────────────────────────── */

export function renderDiet() {
  _updateWeekNavLabel();
  renderMacroBar();
  renderFoodList(currentSearch);
  renderMealGrid();
}

/* ─── Expose to inline handlers ────────────────────────────────────── */
window._diet = {
  openAddForm, closeAddForm, editFood, saveFood,
  onFoodNameInput, autoCalcPer100,
  runCalc, useCalcResult,
  shiftWeek, switchDietTab, toggleDay, onSearch,
  renderDiet, renderMacroBar, renderFoodList,
};
