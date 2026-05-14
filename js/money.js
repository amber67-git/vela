/**
 * money.js — Money / budget tracker module
 *
 * Responsibilities:
 *   - Add income / expense transactions
 *   - Monthly summary (income, expenses, balance)
 *   - Category breakdown progress bars
 *   - Recent transaction list with delete
 */

'use strict';

import { store } from './store.js';
import { $ }     from './app.js';

/* ─── State ─────────────────────────────────────────────────────────── */

let moneyType = 'income';   // 'income' | 'expense'

/* ─── Helpers ───────────────────────────────────────────────────────── */

function todayStr() { return new Date().toISOString().slice(0, 10); }

/**
 * Format a number as Korean Won.
 * @param {number} n
 * @returns {string}  e.g. "₩50,000"
 */
export function formatCurrency(n) {
  return `₩${Math.abs(n).toLocaleString()}`;
}

/** Filter transactions to the current calendar month. */
export function getThisMonthTx() {
  const now = new Date();
  const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return store.transactions.filter(t => t.date.startsWith(ym));
}

/* ─── Category metadata ─────────────────────────────────────────────── */

const CAT_LABELS = {
  food:          'Food & Dining',
  transport:     'Transport',
  shopping:      'Shopping',
  health:        'Health',
  education:     'Education / Tuition',
  entertainment: 'Entertainment',
  salary:        'Salary',
  other:         'Other',
};

const CAT_COLORS = {
  food:          '#ef4444',
  transport:     '#3b82f6',
  shopping:      '#8b5cf6',
  health:        '#22c55e',
  education:     '#f59e0b',
  entertainment: '#ec4899',
  salary:        '#22c55e',
  other:         '#9ca3af',
};

/* ─── Type toggle ───────────────────────────────────────────────────── */

export function setMoneyType(type) {
  moneyType = type;
  $('btn-income') ?.className = `money-type-btn income ${type === 'income'  ? 'active' : ''}`;
  $('btn-expense')?.className = `money-type-btn expense ${type === 'expense' ? 'active' : ''}`;
}

/* ─── CRUD ──────────────────────────────────────────────────────────── */

export function addTransaction() {
  const desc  = $('m-desc')?.value.trim();
  const amt   = parseFloat($('m-amt')?.value);
  const cat   = $('m-cat')?.value ?? 'other';
  const date  = $('m-date')?.value || todayStr();

  if (!desc || !amt) { alert('Enter description and amount'); return; }

  store.transactions.push({ id: Date.now(), desc, amt, type: moneyType, cat, date });
  store.persist('transactions');

  if ($('m-desc')) $('m-desc').value = '';
  if ($('m-amt'))  $('m-amt').value  = '';

  renderMoney();
  window.dispatchEvent(new CustomEvent('money:updated'));
}

export function deleteTransaction(id) {
  store.transactions = store.transactions.filter(t => t.id !== id);
  store.persist('transactions');
  renderMoney();
  window.dispatchEvent(new CustomEvent('money:updated'));
}

/* ─── Render ────────────────────────────────────────────────────────── */

export function renderMoney() {
  const month = getThisMonthTx();
  const inc   = month.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
  const exp   = month.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
  const bal   = inc - exp;

  // Summary stat cards
  if ($('m-income'))  $('m-income').textContent  = formatCurrency(inc);
  if ($('m-expense')) $('m-expense').textContent = formatCurrency(exp);
  if ($('m-balance')) {
    $('m-balance').textContent  = `${bal >= 0 ? '+' : '-'}${formatCurrency(bal)}`;
    $('m-balance').style.color  = bal >= 0 ? 'var(--accent)' : 'var(--danger)';
  }

  // Category expense breakdown
  const catExp = {};
  month.filter(t => t.type === 'expense').forEach(t => {
    catExp[t.cat] = (catExp[t.cat] ?? 0) + t.amt;
  });

  const bd = $('m-breakdown');
  if (bd) {
    if (!Object.keys(catExp).length) {
      bd.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:12px">No expenses this month</p>';
    } else {
      bd.innerHTML = Object.keys(catExp)
        .sort((a, b) => catExp[b] - catExp[a])
        .map(cat => {
          const pct   = exp ? Math.round(catExp[cat] / exp * 100) : 0;
          const color = CAT_COLORS[cat] ?? '#9ca3af';
          return `
            <div class="progress-wrap">
              <div class="progress-label">
                <span style="display:flex;align-items:center;gap:6px">
                  <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block"></span>
                  ${CAT_LABELS[cat] ?? cat}
                </span>
                <span>${formatCurrency(catExp[cat])} (${pct}%)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
              </div>
            </div>`;
        }).join('');
    }
  }

  // Recent transactions
  const ml = $('m-list');
  if (ml) {
    const recent = [...store.transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);

    if (!recent.length) {
      ml.innerHTML = '<p class="empty-msg">No transactions yet</p>';
    } else {
      ml.innerHTML = recent.map(t => `
        <div class="tx-item">
          <div class="tx-dot" style="background:${t.type === 'income' ? 'var(--accent)' : 'var(--danger)'}"></div>
          <div class="tx-info">
            <div class="tx-name">${t.desc}</div>
            <div class="tx-meta">${t.date} · ${CAT_LABELS[t.cat] ?? t.cat}</div>
          </div>
          <div class="tx-amt ${t.type}">
            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amt)}
          </div>
          <button class="btn-icon danger" onclick="window._money.deleteTransaction(${t.id})">
            <i class="ti ti-x"></i>
          </button>
        </div>`).join('');
    }
  }
}

/* ─── Expose to inline handlers ────────────────────────────────────── */
window._money = { setMoneyType, addTransaction, deleteTransaction };
