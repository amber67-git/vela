/**
 * workout.js — Workout tracker module
 *
 * Responsibilities:
 *   - Workout library (filter, select, add / edit / delete)
 *   - Log entries (MET-based calorie estimation)
 *   - Weight log
 *   - Daily + weekly stats
 */

'use strict';

import { store } from './store.js';
import { $ }     from './app.js';

/* ─── Default workout library ───────────────────────────────────────── */

const BASE_EXERCISES = [
  { name: 'Running',         icon: 'ti-run',        dist: true,  met: 9.5, custom: false },
  { name: 'Walking',         icon: 'ti-walk',       dist: true,  met: 3.5, custom: false },
  { name: 'Cycling',         icon: 'ti-bike',       dist: true,  met: 8,   custom: false },
  { name: 'Swimming',        icon: 'ti-ripple',     dist: false, met: 7,   custom: false },
  { name: 'Weight training', icon: 'ti-barbell',    dist: false, met: 4,   custom: false },
  { name: 'Hiking',          icon: 'ti-mountain',   dist: true,  met: 6,   custom: false },
  { name: 'Pilates',         icon: 'ti-yoga',       dist: false, met: 3,   custom: false },
  { name: 'Stretching',      icon: 'ti-accessible', dist: false, met: 2.5, custom: false },
  { name: 'HIIT',            icon: 'ti-bolt',       dist: false, met: 8,   custom: false },
  { name: 'Dancing',         icon: 'ti-music',      dist: false, met: 5,   custom: false },
  { name: 'Treadmill',       icon: 'ti-run',        dist: true,  met: 8.5, custom: false },
  { name: 'Elliptical',      icon: 'ti-repeat',     dist: false, met: 5,   custom: false },
  { name: 'Stair climb',     icon: 'ti-stairs-up',  dist: false, met: 8,   custom: false },
  { name: 'Yoga',            icon: 'ti-yoga',       dist: false, met: 3,   custom: false },
  { name: 'Indoor cycling',  icon: 'ti-bike',       dist: false, met: 7,   custom: false },
  { name: 'Other workout',   icon: 'ti-activity',   dist: false, met: 4,   custom: false },
];

/* ─── Module state ──────────────────────────────────────────────────── */

let exercises   = _loadExercises();
let selectedEx  = null;
let exFilter    = '';
let editingName = null;  // name of exercise being edited in modal

function _loadExercises() {
  try {
    const saved = localStorage.getItem('ml_wExercises');
    return saved ? JSON.parse(saved) : BASE_EXERCISES.map(e => ({ ...e }));
  } catch { return BASE_EXERCISES.map(e => ({ ...e })); }
}

function _persistExercises() {
  try { localStorage.setItem('ml_wExercises', JSON.stringify(exercises)); } catch {}
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

function todayStr() { return new Date().toISOString().slice(0, 10); }

function bodyWeight() { return parseFloat(store.profile.weight) || 70; }

/**
 * Estimate calories burned via MET formula.
 * kcal = MET × body_weight_kg × duration_hours
 */
function kcalFor(ex, mins) {
  if (!mins || mins < 1) return 0;
  return Math.round(ex.met * bodyWeight() * (mins / 60));
}

function weekDates() {
  const now = new Date(), day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ─── Exercise list ─────────────────────────────────────────────────── */

export function buildExList() {
  const container = $('ex-items');
  if (!container) return;

  const filtered = exercises.filter(e => e.name.toLowerCase().includes(exFilter));
  const ec = $('ex-count');
  if (ec) ec.textContent = `${filtered.length} workouts`;

  if (!filtered.length) {
    container.innerHTML = `
      <div class="workout-item" style="cursor:default;color:var(--text-3)">
        <i class="ti ti-search-off"></i>
        <span class="workout-item-name">No results</span>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(ex => `
    <div class="workout-item ${selectedEx?.name === ex.name ? 'sel' : ''}"
         data-name="${ex.name}">
      <i class="ti ${ex.icon}"></i>
      <span class="workout-item-name">${ex.name}</span>
      <span class="workout-item-actions">
        <button class="btn-icon" data-action="edit" data-name="${ex.name}" title="Edit">
          <i class="ti ti-pencil"></i>
        </button>
        ${ex.custom ? `
        <button class="btn-icon danger" data-action="delete" data-name="${ex.name}" title="Delete">
          <i class="ti ti-trash"></i>
        </button>` : ''}
      </span>
    </div>`).join('');

  // Attach click handlers
  container.querySelectorAll('.workout-item').forEach(el => {
    el.addEventListener('click', () => selectEx(el.dataset.name));
  });
  container.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openEditModal(btn.dataset.name); });
  });
  container.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); deleteExercise(btn.dataset.name); });
  });
}

export function filterEx(val) {
  exFilter = val.toLowerCase();
  buildExList();
}

export function selectEx(name) {
  selectedEx = exercises.find(e => e.name === name);
  if (!selectedEx) return;
  buildExList();

  $('panel-empty')?.style.setProperty('display', 'none');
  $('panel-form')?.style.setProperty('display', 'block');
  if ($('p-icon')) $('p-icon').className = `ti ${selectedEx.icon}`;
  if ($('p-name')) $('p-name').textContent = selectedEx.name;
  if ($('p-sub'))  $('p-sub').textContent  = `MET ${selectedEx.met} · based on ${bodyWeight()} kg`;
  $('dist-field')?.style.setProperty('display', selectedEx.dist ? 'block' : 'none');
  recalcKcal();
}

export function recalcKcal() {
  if (!selectedEx) return;
  const mins = +($('f-time')?.value ?? 0);
  const k    = kcalFor(selectedEx, mins);
  if ($('p-kcal')) $('p-kcal').textContent = k ? `${k} kcal` : '—';
  if ($('p-note')) $('p-note').textContent = `MET ${selectedEx.met} · ${bodyWeight()} kg`;
}

/* ─── Log entries ───────────────────────────────────────────────────── */

export function addEntry() {
  if (!selectedEx) return;
  const mins = +($('f-time')?.value ?? 0);
  const date = $('f-date')?.value || todayStr();
  const dist = +($('f-dist')?.value ?? 0);

  if (!mins) { alert('Please enter a duration'); return; }

  store.wEntries.push({
    id:   Date.now(),
    ex:   selectedEx.name,
    icon: selectedEx.icon,
    time: mins,
    cal:  kcalFor(selectedEx, mins),
    date,
    dist,
  });
  store.persist('wEntries');

  if ($('f-time')) $('f-time').value = '';
  if ($('f-dist')) $('f-dist').value = '';
  recalcKcal();
  renderWorkout();
  window.dispatchEvent(new CustomEvent('workout:updated'));
}

export function deleteEntry(id) {
  store.wEntries = store.wEntries.filter(e => e.id !== id);
  store.persist('wEntries');
  renderWorkout();
  window.dispatchEvent(new CustomEvent('workout:updated'));
}

/* ─── Weight log ────────────────────────────────────────────────────── */

export function addWeight() {
  const val  = +($('wt-val')?.value ?? 0);
  const date = $('wt-date')?.value || todayStr();
  if (!val) { alert('Enter a weight value'); return; }

  store.wWeights = store.wWeights.filter(w => w.date !== date);
  store.wWeights.push({ date, val });
  store.wWeights.sort((a, b) => a.date.localeCompare(b.date));
  store.persist('wWeights');

  if ($('wt-val')) $('wt-val').value = '';
  renderWeightList();
}

export function deleteWeight(date) {
  store.wWeights = store.wWeights.filter(w => w.date !== date);
  store.persist('wWeights');
  renderWeightList();
}

export function renderWeightList() {
  const el = $('weight-list');
  if (!el) return;
  if (!store.wWeights.length) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-3);padding-top:8px">No weight entries yet</p>';
    return;
  }
  const rev = [...store.wWeights].reverse().slice(0, 6);
  el.innerHTML = '<hr class="divider">' + rev.map((w, i) => {
    const prev = rev[i + 1];
    let diff = '';
    if (prev) {
      const d = (w.val - prev.val).toFixed(1);
      const cls = d > 0 ? 'tup' : d < 0 ? 'tdn' : 'teq';
      diff = `<span class="wt-diff ${cls}">${d > 0 ? '▲' : d < 0 ? '▼' : '–'}${Math.abs(d)}</span>`;
    }
    return `
      <div class="wt-row">
        <div class="wt-date">${w.date}</div>
        <div class="wt-val">${w.val.toFixed(1)} kg${diff}</div>
        <button class="btn-icon danger" onclick="window._workout.deleteWeight('${w.date}')">
          <i class="ti ti-x"></i>
        </button>
      </div>`;
  }).join('');
}

/* ─── Render helpers ────────────────────────────────────────────────── */

export function renderDaily() {
  const date      = $('f-date')?.value || todayStr();
  const todayEnt  = store.wEntries.filter(e => e.date === date);
  const totalCal  = todayEnt.reduce((a, e) => a + e.cal, 0);
  const totalTime = todayEnt.reduce((a, e) => a + e.time, 0);

  if ($('s-time')) $('s-time').innerHTML = `${totalTime} <span style="font-size:14px;font-weight:400">min</span>`;
  if ($('s-cal'))  $('s-cal').innerHTML  = `${totalCal} <span style="font-size:14px;font-weight:400">kcal</span>`;
  if ($('s-ex'))   $('s-ex').textContent  = todayEnt.length;

  const tgt  = parseFloat(store.profile.caltarget) || 0;
  const tEl  = $('s-target');
  if (tEl) {
    tEl.innerHTML = tgt ? `${tgt} <span style="font-size:14px;font-weight:400">kcal</span>` : '—';
    tEl.style.color = tgt ? (totalCal >= tgt ? 'var(--accent)' : 'var(--blue)') : '';
  }

  const list = $('w-log-list');
  if (!list) return;
  if (!todayEnt.length) { list.innerHTML = '<p class="empty-msg">No exercises logged yet</p>'; return; }
  list.innerHTML = todayEnt.map(e => `
    <div class="log-entry">
      <div class="log-ico"><i class="ti ${e.icon}"></i></div>
      <div style="flex:1;min-width:0">
        <div class="log-name">${e.ex}</div>
        <div class="log-meta">${e.time} min${e.dist ? ` · ${e.dist} km` : ''}</div>
      </div>
      <div class="log-cal">${e.cal} kcal</div>
      <button class="btn-icon danger" onclick="window._workout.deleteEntry(${e.id})">
        <i class="ti ti-x"></i>
      </button>
    </div>`).join('');
}

export function renderWeekView() {
  const week     = weekDates();
  const weekCals = week.map(d => store.wEntries.filter(e => e.date === d).reduce((a, e) => a + e.cal, 0));
  const maxCal   = Math.max(...weekCals, 1);
  const today    = todayStr();
  const wAll     = $('w-week-all');
  if (!wAll) return;

  wAll.innerHTML = week.map((date, i) => {
    const dayE  = store.wEntries.filter(e => e.date === date);
    const cal   = weekCals[i];
    const mins  = dayE.reduce((a, e) => a + e.time, 0);
    const pct   = Math.round(cal / maxCal * 100);
    const isToday = date === today;

    const entries = dayE.length
      ? dayE.map(e => `
          <div class="log-entry">
            <div class="log-ico"><i class="ti ${e.icon}"></i></div>
            <div style="flex:1;min-width:0">
              <div class="log-name">${e.ex}</div>
              <div class="log-meta">${e.time} min${e.dist ? ` · ${e.dist} km` : ''}</div>
            </div>
            <div class="log-cal">${e.cal} kcal</div>
          </div>`).join('')
      : '<div class="week-no-entry">Rest day</div>';

    return `
      <div class="week-day-block">
        <div class="week-day-header">
          <span class="week-day-name ${isToday ? 'is-today' : ''}">
            ${DAYS[i]}${isToday ? ' · today' : ''}
            <span class="week-day-date">${date}</span>
          </span>
          <span class="week-day-stats">
            ${mins ? `${mins} min` : ''}${cal ? ` · ${cal} kcal` : ''}
          </span>
        </div>
        <div class="week-bar"><div class="week-bar-fill" style="width:${pct}%"></div></div>
        ${entries}
      </div>`;
  }).join('');
}

export function renderWorkout() {
  buildExList();
  renderDaily();
  renderWeekView();
  renderWeightList();
}

/* ─── Modal ─────────────────────────────────────────────────────────── */

export function openAddModal() {
  editingName = null;
  if ($('modal-title')) $('modal-title').textContent = 'Add custom workout';
  ['m-name','m-met'].forEach(id => { const e = $(id); if (e) e.value = ''; });
  if ($('m-dist')) $('m-dist').value = '0';
  $('ex-modal')?.classList.add('show');
}

function openEditModal(name) {
  const ex = exercises.find(e => e.name === name);
  if (!ex) return;
  editingName = name;
  if ($('modal-title')) $('modal-title').textContent = 'Edit workout';
  if ($('m-name')) $('m-name').value = ex.name;
  if ($('m-met'))  $('m-met').value  = ex.met;
  if ($('m-dist')) $('m-dist').value = ex.dist ? '1' : '0';
  $('ex-modal')?.classList.add('show');
}

export function closeModal() {
  $('ex-modal')?.classList.remove('show');
  editingName = null;
}

export function saveModalEx() {
  const name = $('m-name')?.value.trim();
  const met  = +($('m-met')?.value ?? 0);
  const dist = $('m-dist')?.value === '1';

  if (!name) { alert('Please enter a name'); return; }
  if (!met || met < 0.5) { alert('Please enter a valid MET value (e.g. 5.0)'); return; }

  if (editingName) {
    const idx = exercises.findIndex(e => e.name === editingName);
    if (idx > -1) {
      exercises[idx] = { ...exercises[idx], name, met, dist };
      if (selectedEx?.name === editingName) selectedEx = exercises[idx];
    }
  } else {
    if (exercises.find(e => e.name === name)) { alert('A workout with this name already exists'); return; }
    exercises.push({ name, icon: 'ti-activity', dist, met, custom: true });
  }

  _persistExercises();
  closeModal();
  buildExList();
}

function deleteExercise(name) {
  if (!confirm(`Delete "${name}" from the list?`)) return;
  exercises = exercises.filter(e => e.name !== name);
  _persistExercises();
  if (selectedEx?.name === name) {
    selectedEx = null;
    $('panel-empty')?.style.setProperty('display', 'flex');
    $('panel-form')?.style.setProperty('display', 'none');
  }
  buildExList();
}

/* ─── Today's totals (used by dashboard) ───────────────────────────── */

export function todayTotals() {
  const today = todayStr();
  const entries = store.wEntries.filter(e => e.date === today);
  return {
    cal:     entries.reduce((a, e) => a + e.cal, 0),
    minutes: entries.reduce((a, e) => a + e.time, 0),
    count:   entries.length,
    entries,
  };
}

/* ─── Expose to inline handlers ────────────────────────────────────── */
window._workout = {
  filterEx, selectEx, recalcKcal, addEntry, deleteEntry,
  addWeight, deleteWeight,
  openAddModal, closeModal, saveModalEx,
  buildExList, renderWorkout, renderDaily,
};
