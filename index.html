/**
 * classes.js — Class / tuition tracker module
 *
 * Responsibilities:
 *   - Add / edit / delete classes
 *   - Grade tracking with weighted average
 *   - Tuition summary
 *   - Class card rendering
 */

'use strict';

import { store } from './store.js';
import { $ }     from './app.js';

/* ─── Helpers ───────────────────────────────────────────────────────── */

function formatCurrency(n) { return `₩${Math.abs(n).toLocaleString()}`; }

/**
 * Weighted average grade across all classes that have a grade.
 * Weight = credit hours.
 * @returns {string}  e.g. "87%" or "—"
 */
export function getAvgGrade() {
  const graded = store.classes.filter(c => c.grade && c.credits);
  if (!graded.length) return '—';
  const totalCredits   = graded.reduce((a, c) => a + c.credits, 0);
  const weightedSum    = graded.reduce((a, c) => a + parseFloat(c.grade) * c.credits, 0);
  return `${Math.round(weightedSum / totalCredits)}%`;
}

/** Grade → letter mapping. */
function gradeToLetter(pct) {
  const n = parseFloat(pct);
  if (isNaN(n))  return '';
  if (n >= 95)   return 'A+';
  if (n >= 90)   return 'A';
  if (n >= 85)   return 'B+';
  if (n >= 80)   return 'B';
  if (n >= 75)   return 'C+';
  if (n >= 70)   return 'C';
  if (n >= 65)   return 'D+';
  if (n >= 60)   return 'D';
  return 'F';
}

/** CSS colour string based on grade percentage. */
function gradeColor(pct) {
  const n = parseFloat(pct);
  if (isNaN(n))  return 'var(--text-3)';
  if (n >= 80)   return 'var(--accent)';
  if (n >= 70)   return 'var(--warn)';
  return 'var(--danger)';
}

/* ─── CRUD ──────────────────────────────────────────────────────────── */

export function addClass() {
  const name = $('cl-name')?.value.trim();
  if (!name) { alert('Enter a class name'); return; }

  const obj = {
    name,
    credits:  parseInt($('cl-credits')?.value)  || 3,
    color:    $('cl-color')?.value               || '#2d6a4f',
    schedule: $('cl-schedule')?.value.trim()     || '',
    room:     $('cl-room')?.value.trim()         || '',
    prof:     $('cl-prof')?.value.trim()         || '',
    grade:    $('cl-grade')?.value               || '',
    tuition:  parseFloat($('cl-tuition')?.value) || 0,
    notes:    $('cl-notes')?.value.trim()        || '',
  };

  const idx = store.classes.findIndex(c => c.name === name);
  if (idx >= 0) store.classes[idx] = obj;
  else          store.classes.push(obj);

  store.persist('classes');
  if ($('cl-name')) $('cl-name').value = '';
  renderClasses();
  window.dispatchEvent(new CustomEvent('classes:updated'));
}

export function editClass(name) {
  const c = store.classes.find(x => x.name === name);
  if (!c) return;
  const set = (id, val) => { const e = $(id); if (e) e.value = val ?? ''; };
  set('cl-name',     c.name);
  set('cl-credits',  c.credits);
  set('cl-color',    c.color);
  set('cl-schedule', c.schedule);
  set('cl-room',     c.room);
  set('cl-prof',     c.prof);
  set('cl-grade',    c.grade);
  set('cl-tuition',  c.tuition || '');
  set('cl-notes',    c.notes);
  $('cl-name')?.focus();
}

export function deleteClass(name) {
  if (!confirm(`Delete "${name}"?`)) return;
  store.classes = store.classes.filter(c => c.name !== name);
  store.persist('classes');
  renderClasses();
  window.dispatchEvent(new CustomEvent('classes:updated'));
}

/* ─── Render ────────────────────────────────────────────────────────── */

export function renderClasses() {
  // Summary stats
  const totCredits = store.classes.reduce((a, c) => a + c.credits, 0);
  const totTuition = store.classes.reduce((a, c) => a + c.tuition, 0);

  if ($('c-credits')) $('c-credits').textContent = totCredits;
  if ($('c-avg'))     $('c-avg').textContent     = getAvgGrade();
  if ($('c-tuition')) $('c-tuition').textContent = formatCurrency(totTuition);

  // Class cards
  const list = $('c-list');
  if (!list) return;

  if (!store.classes.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-school"></i>
        <p>No classes added yet</p>
      </div>`;
    return;
  }

  list.innerHTML = store.classes.map(c => {
    const letter = gradeToLetter(c.grade);
    const gColor = gradeColor(c.grade);

    return `
      <div class="class-card">
        <div class="class-color-bar" style="background:${c.color}"></div>
        <div class="class-info">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
            <div class="class-name">${c.name}</div>
            ${c.grade ? `
              <span class="badge" style="background:var(--surface-2);color:${gColor};font-size:12px">
                ${c.grade}% ${letter ? `(${letter})` : ''}
              </span>` : ''}
          </div>

          <div class="class-meta">
            ${c.schedule ? `<span><i class="ti ti-clock" style="font-size:12px;vertical-align:-1px"></i> ${c.schedule}</span>&nbsp;&nbsp;` : ''}
            ${c.room     ? `<span><i class="ti ti-door"  style="font-size:12px;vertical-align:-1px"></i> ${c.room}</span>&nbsp;&nbsp;`     : ''}
            ${c.prof     ? `<span><i class="ti ti-user"  style="font-size:12px;vertical-align:-1px"></i> ${c.prof}</span>`                  : ''}
          </div>

          ${c.grade ? `
            <div class="progress-wrap" style="margin-bottom:6px">
              <div class="progress-track">
                <div class="progress-fill"
                  style="width:${Math.min(100, parseFloat(c.grade))}%;background:${gColor}">
                </div>
              </div>
            </div>` : ''}

          ${c.notes ? `
            <div style="font-size:11px;color:var(--text-3);margin-bottom:6px">
              <i class="ti ti-note" style="font-size:11px;vertical-align:-1px"></i> ${c.notes}
            </div>` : ''}

          <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
            <span style="font-size:11px;color:var(--text-3)">${c.credits} credit${c.credits !== 1 ? 's' : ''}</span>
            ${c.tuition ? `<span class="badge badge-warn">${formatCurrency(c.tuition)}</span>` : ''}
            <div style="margin-left:auto;display:flex;gap:4px">
              <button class="btn-icon" onclick="window._classes.editClass('${c.name.replace(/'/g, "\\'")}')">
                <i class="ti ti-pencil"></i>
              </button>
              <button class="btn-icon danger" onclick="window._classes.deleteClass('${c.name.replace(/'/g, "\\'")}')">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ─── Expose to inline handlers ────────────────────────────────────── */
window._classes = { addClass, editClass, deleteClass };
