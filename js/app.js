/**
 * app.js — Application entry point
 *
 * Responsibilities:
 *   - DOM-ready bootstrap
 *   - Page routing (showPage)
 *   - Shared DOM helper ($)
 *   - Cross-module event wiring
 *   - Initial data migration (food names → Title Case, old categories → new)
 */

'use strict';

import { store }                               from './store.js';
import { BASE_FOODS, detectCategory }          from '../data/foods.js';
import { applyDarkMode, syncDietInputs,
         renderProfile }                       from './profile.js';
import { renderDiet, todayKey }                from './diet.js';
import { renderWorkout }                       from './workout.js';
import { renderMoney }                         from './money.js';
import { renderClasses }                       from './classes.js';
import { renderDashboard }                     from './dashboard.js';

/* ─── Shared DOM helper ─────────────────────────────────────────────── */

/**
 * Shorthand for document.getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export function $(id) { return document.getElementById(id); }

/* ─── Food store (global mutable array) ────────────────────────────── */

window._foods = _initFoods();

function _initFoods() {
  try {
    const saved = localStorage.getItem('ml_all_foods');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge any new BASE_FOODS entries not yet in saved list
      BASE_FOODS.forEach(base => {
        if (!parsed.find(f => f.id === base.id)) parsed.push({ ...base });
      });
      return parsed;
    }
  } catch { /* ignore */ }
  return BASE_FOODS.map(f => ({ ...f }));
}

/** Migrate food names to Title Case and old category slugs to new ones. */
function _migrateFoods() {
  const catMap = { protein: 'meat', carb: 'grains', veggie: 'vegetables', fat: 'other', dish: 'meals', custom: 'other' };
  window._foods.forEach(f => {
    // Title-case name
    if (f.name) f.name = f.name.charAt(0).toUpperCase() + f.name.slice(1);
    // Remap legacy category
    if (catMap[f.cat]) f.cat = catMap[f.cat];
    // Auto-detect for better accuracy (only overrides if not already a valid new cat)
    const validCats = new Set(['meat','grains','dairy','vegetables','fruits','drinks','snacks','meals','other']);
    if (!validCats.has(f.cat)) f.cat = detectCategory(f.name);
  });
  try { localStorage.setItem('ml_all_foods', JSON.stringify(window._foods)); } catch {}
}

/* ─── Page routing ──────────────────────────────────────────────────── */

const PAGE_ORDER = ['dashboard', 'diet', 'workout', 'money', 'classes', 'profile'];
let _currentPage = 'dashboard';

export function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const pageEl = $(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const idx = PAGE_ORDER.indexOf(page);
  const tabs = document.querySelectorAll('.nav-tab');
  if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');

  _currentPage = page;

  // Render on-demand
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'diet':      renderDiet();      break;
    case 'workout':   renderWorkout();   break;
    case 'money':     renderMoney();     break;
    case 'classes':   renderClasses();   break;
    case 'profile':   renderProfile();   break;
  }
}

/* ─── Cross-module event bus ────────────────────────────────────────── */

/** Re-render dashboard mini-widgets whenever a module updates. */
function _onModuleUpdate() {
  if (_currentPage === 'dashboard') renderDashboard();
}

window.addEventListener('diet:updated',     _onModuleUpdate);
window.addEventListener('workout:updated',  _onModuleUpdate);
window.addEventListener('money:updated',    _onModuleUpdate);
window.addEventListener('classes:updated',  _onModuleUpdate);

/** After import or profile save, re-render current page. */
window.addEventListener('data:imported', () => showPage(_currentPage));
window.addEventListener('profile:saved', () => {
  if (_currentPage === 'diet') renderDiet();
  if (_currentPage === 'dashboard') renderDashboard();
});

/* ─── Bootstrap ─────────────────────────────────────────────────────── */

function _bootstrap() {
  // Apply persisted theme immediately (prevents flash)
  applyDarkMode();

  // Migrate food data
  _migrateFoods();

  // Sync profile goals → diet hidden inputs
  syncDietInputs();

  // Update MEALS from profile meal names
  // (diet.js reads store.profile.mealNames directly, but expose globally too)
  window._getMeals = () => store.profile.mealNames ?? ['Breakfast', 'Lunch', 'Dinner'];

  // Set default dates on workout/money form inputs
  const today = new Date().toISOString().slice(0, 10);
  ['f-date', 'wt-date', 'm-date'].forEach(id => {
    const el = $(id);
    if (el) el.value = today;
  });

  // Workout date change → refresh daily log
  $('f-date')?.addEventListener('change', () => {
    import('./workout.js').then(m => m.renderDaily());
  });

  // Close workout modal on backdrop click
  $('ex-modal')?.addEventListener('click', function(e) {
    if (e.target === this) import('./workout.js').then(m => m.closeModal());
  });

  // Render initial page
  showPage('dashboard');
}

// Expose for nav-tab onclick attributes
window._app = { showPage };

document.addEventListener('DOMContentLoaded', _bootstrap);
