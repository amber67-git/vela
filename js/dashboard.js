/**
 * dashboard.js — Dashboard module
 *
 * Responsibilities:
 *   - Hero section (greeting + motivational phrase)
 *   - Summary cards linking to each module
 *   - Mini-widgets for diet, workout, money, classes
 */

'use strict';

import { store }                       from './store.js';
import { $ }                           from './app.js';
import { getDayTotals, getGoals,
         todayKey as dietToday }       from './diet.js';
import { todayTotals as workoutToday } from './workout.js';
import { getThisMonthTx,
         formatCurrency }              from './money.js';
import { getAvgGrade }                 from './classes.js';

/* ─── Motivational phrases (one per day of week) ────────────────────── */

const PHRASES = [
  'Every day is a fresh start — make this one count.',        // Sun
  'Small steps every day lead to big changes.',               // Mon
  'You don\'t have to be perfect, just consistent.',          // Tue
  'Progress, not perfection.',                                // Wed
  'Your only competition is who you were yesterday.',         // Thu
  'Discipline is choosing what you want most over right now.', // Fri
  'Take care of your body — it\'s the only place you live.',  // Sat
];

/* ─── Public API ────────────────────────────────────────────────────── */

export function renderDashboard() {
  _renderHero();
  _renderSummaryCards();
  _renderDietMini();
  _renderWorkoutMini();
  _renderMoneyMini();
  _renderClassesMini();
}

/* ─── Internal renderers ────────────────────────────────────────────── */

function _renderHero() {
  const h       = new Date().getHours();
  const salut   = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name    = store.profile.name;
  const phrase  = PHRASES[new Date().getDay()];

  const grEl = $('heroGreeting');
  const phEl = $('heroPhrase');
  if (grEl) grEl.textContent = name ? `${salut}, ${name}!` : salut;
  if (phEl) phEl.textContent = phrase;

  // Hero stats row
  const g        = getGoals();
  const diet     = getDayTotals(dietToday());
  const workout  = workoutToday();
  const monthTx  = getThisMonthTx();
  const balance  = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0)
                 - monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);

  const stEl = $('heroStats');
  if (!stEl) return;
  stEl.innerHTML = [
    { val: diet.cal,               lbl: 'kcal eaten today' },
    { val: workout.cal,            lbl: 'kcal burned today' },
    g.valid
      ? { val: Math.max(0, g.cal - diet.cal), lbl: 'kcal remaining' }
      : null,
    { val: formatCurrency(balance), lbl: 'month balance' },
  ].filter(Boolean).map(s => `
    <div class="hero-stat">
      <div class="hero-stat-val">${s.val}</div>
      <div class="hero-stat-lbl">${s.lbl}</div>
    </div>`).join('');
}

function _renderSummaryCards() {
  const g       = getGoals();
  const diet    = getDayTotals(dietToday());
  const workout = workoutToday();
  const monthTx = getThisMonthTx();
  const balance = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0)
                - monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);

  const grid = $('summaryGrid');
  if (!grid) return;

  const cards = [
    {
      page:  'diet',
      icon:  'ti-salad',
      bg:    '#d1fae5',
      color: '#065f46',
      label: 'Calories today',
      val:   diet.cal,
      sub:   g.valid ? `goal ${g.cal} kcal` : 'set goal in Profile',
    },
    {
      page:  'workout',
      icon:  'ti-heartbeat',
      bg:    '#fee2e2',
      color: '#991b1b',
      label: 'Burned today',
      val:   workout.cal,
      sub:   `${workout.count} exercise${workout.count !== 1 ? 's' : ''}`,
    },
    {
      page:  'money',
      icon:  'ti-wallet',
      bg:    '#fef3c7',
      color: '#92400e',
      label: 'Month balance',
      val:   formatCurrency(balance),
      sub:   `${monthTx.length} transaction${monthTx.length !== 1 ? 's' : ''}`,
      small: true,
    },
    {
      page:  'classes',
      icon:  'ti-school',
      bg:    '#ede9fe',
      color: '#5b21b6',
      label: 'Classes',
      val:   store.classes.length,
      sub:   store.classes.length ? `avg grade ${getAvgGrade()}` : 'no classes added',
    },
  ];

  grid.innerHTML = cards.map(c => `
    <div class="summary-card" onclick="window._app.showPage('${c.page}')">
      <div class="summary-card-icon" style="background:${c.bg}">
        <i class="ti ${c.icon}" style="color:${c.color};font-size:17px"></i>
      </div>
      <div class="summary-card-label">${c.label}</div>
      <div class="summary-card-val" style="${c.small ? 'font-size:15px' : ''}">${c.val}</div>
      <div class="summary-card-sub">${c.sub}</div>
    </div>`).join('');
}

function _renderDietMini() {
  const el = $('dash-diet');
  if (!el) return;

  const g    = getGoals();
  const diet = getDayTotals(dietToday());

  if (diet.cal === 0) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:16px">No meals logged today</p>';
    return;
  }

  const pct = g.valid ? Math.min(100, Math.round(diet.cal / g.cal * 100)) : 0;
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div>
        <div style="font-size:11px;color:var(--text-3)">Calories</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono)">${diet.cal}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-3)">C / P / F</div>
        <div style="font-size:12px;font-weight:500;font-family:var(--mono)">${diet.carb}g / ${diet.prot}g / ${diet.fat}g</div>
      </div>
    </div>
    ${g.valid ? `
      <div class="progress-wrap">
        <div class="progress-label">
          <span style="font-size:11px;color:var(--text-3)">Calories vs goal</span>
          <span style="font-size:11px;color:var(--text-3)">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;background:#ef4444"></div>
        </div>
      </div>` : ''}`;
}

function _renderWorkoutMini() {
  const el      = $('dash-workout');
  if (!el) return;

  const workout = workoutToday();

  if (!workout.count) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:16px">No workout logged today</p>';
    return;
  }

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div>
        <div style="font-size:11px;color:var(--text-3)">Burned</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono);color:var(--accent)">${workout.cal} kcal</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-3)">Duration</div>
        <div style="font-size:16px;font-weight:600;font-family:var(--mono)">${workout.minutes} min</div>
      </div>
    </div>
    ${workout.entries.slice(0, 2).map(e =>
      `<div style="font-size:12px;color:var(--text-2);padding:4px 0;border-bottom:1px solid var(--border)">
        ${e.ex} · ${e.time} min
      </div>`
    ).join('')}`;
}

function _renderMoneyMini() {
  const el      = $('dash-money');
  if (!el) return;

  const monthTx = getThisMonthTx();
  const inc     = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
  const exp     = monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div>
        <div style="font-size:11px;color:var(--text-3)">Income</div>
        <div style="font-size:14px;font-weight:600;font-family:var(--mono);color:var(--accent)">${formatCurrency(inc)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-3)">Expenses</div>
        <div style="font-size:14px;font-weight:600;font-family:var(--mono);color:var(--danger)">${formatCurrency(exp)}</div>
      </div>
    </div>
    ${!monthTx.length
      ? '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:8px">No transactions this month</p>'
      : ''}`;
}

function _renderClassesMini() {
  const el = $('dash-classes');
  if (!el) return;

  if (!store.classes.length) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:8px">No classes added yet</p>';
    return;
  }

  el.innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${store.classes.map(c => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;
                    background:var(--surface-2);border-radius:var(--radius-sm);
                    border-left:3px solid ${c.color}">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text)">${c.name}</div>
            <div style="font-size:11px;color:var(--text-3)">${c.schedule}</div>
          </div>
          ${c.grade ? `<span class="badge badge-green" style="margin-left:auto">${c.grade}%</span>` : ''}
        </div>`).join('')}
    </div>`;
}
