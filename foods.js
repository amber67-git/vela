/* ─── Dashboard Hero ────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, var(--accent) 0%, #1a4532 100%);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  margin-bottom: 22px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30px; left: 20%;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}

.hero-greeting {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 6px;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

.hero-phrase {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  line-height: 1.35;
  margin-bottom: 14px;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.hero-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.hero-stat        { display: flex; flex-direction: column; gap: 2px; }
.hero-stat-val    { font-size: 18px; font-weight: 600; color: #fff; font-family: var(--mono); }
.hero-stat-lbl    { font-size: 11px; color: rgba(255,255,255,0.65); }

/* ─── Dashboard summary cards ───────────────────────────────────────── */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.15s;
}

.summary-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.summary-card-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.summary-card-label { font-size: 11px; color: var(--text-3); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.summary-card-val   { font-size: 20px; font-weight: 600; color: var(--text); font-family: var(--mono); }
.summary-card-sub   { font-size: 11px; color: var(--text-3); margin-top: 3px; }

/* ─── Diet – Macro bar ──────────────────────────────────────────────── */
.macro-bar {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 14px;
}

.macro-card {
  flex: 1;
  padding: 14px 16px;
  border-right: 1px solid var(--border);
  min-width: 0;
}

.macro-card:last-child { border-right: none; }

.mc-label {
  font-size: var(--font-size-xs);
  color: var(--text-2);
  margin-bottom: 3px;
  font-weight: 500;
}

.mc-nums {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mc-rem { font-size: var(--font-size-xs); color: var(--text-2); margin-bottom: 5px; }

.track { height: 5px; border-radius: 99px; background: var(--surface-3); overflow: hidden; }
.fill  { height: 100%; border-radius: 99px; transition: width 0.3s; }

/* Macro fill colors */
.fill-cal   { background: #ef4444; }
.fill-carb  { background: #3b82f6; }
.fill-prot  { background: #22c55e; }
.fill-fat   { background: #f59e0b; }

/* ─── Diet – Food library ───────────────────────────────────────────── */
.food-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-head {
  padding: 9px 13px;
  border-bottom: 1px solid var(--border);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-hint { font-size: 10px; color: var(--text-3); font-weight: 400; text-transform: none; letter-spacing: 0; }

.fsearch {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 7px 13px;
  font-size: var(--font-size-sm);
  background: var(--surface);
  color: var(--text);
  outline: none;
  font-family: var(--font);
}

.fsearch::placeholder { color: var(--text-3); }

.food-list { overflow-y: auto; }

.freq-header {
  padding: 5px 13px 3px;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.food-item {
  padding: 8px 13px;
  padding-right: 36px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
  user-select: none;
  transition: background 0.12s;
  position: relative;
}

.food-item:last-child { border-bottom: none; }
.food-item:hover      { background: var(--surface-2); }
.food-item:active     { cursor: grabbing; }

.fi-name { font-size: var(--font-size-sm); font-weight: 500; color: var(--text); }
.fi-meta { font-size: var(--font-size-xs); color: var(--text-2); margin-top: 2px; }

.food-item-edit-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: var(--font-size-xs);
  color: var(--text-3);
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--surface);
  line-height: 1.4;
}

/* Category pills */
.cat-pill {
  display: inline-block;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 99px;
  margin-bottom: 2px;
  font-weight: 500;
}

.cat-meat       { background: #fee2e2; color: #991b1b; }
.cat-grains     { background: #dbeafe; color: #1e40af; }
.cat-dairy      { background: #fef3c7; color: #92400e; }
.cat-vegetables { background: #d1fae5; color: #065f46; }
.cat-fruits     { background: #fef9c3; color: #854d0e; }
.cat-drinks     { background: #e0f2fe; color: #075985; }
.cat-snacks     { background: #ede9fe; color: #5b21b6; }
.cat-meals      { background: #e0e7ff; color: #3730a3; }
.cat-other      { background: #f3f4f6; color: #374151; }

/* No-result / add form */
.no-result-box { padding: 16px 13px; text-align: center; }
.no-result-msg { font-size: var(--font-size-sm); color: var(--text-3); margin-bottom: 10px; }
.add-food-btn  {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 6px 12px;
  border: 1px solid var(--border-2);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: background 0.12s;
  font-family: var(--font);
}

.add-food-btn:hover { background: var(--surface-2); }

/* Add/Edit food form */
.add-food-form {
  padding: 12px 13px;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
  display: none;
  flex-direction: column;
  gap: 8px;
}

.add-food-form.open { display: flex; }
.aff-title          { font-size: var(--font-size-sm); font-weight: 600; color: var(--text); margin-bottom: 2px; }
.aff-note           { font-size: var(--font-size-xs); color: var(--text-3); margin-bottom: 4px; }

.aff-row {
  display: flex;
  gap: 6px;
  align-items: center;
  width: 100%;
}

.aff-label {
  font-size: var(--font-size-xs);
  color: var(--text-2);
  width: 58px;
  min-width: 58px;
  text-align: right;
  flex-shrink: 0;
  padding-right: 4px;
}

.aff-input,
.aff-select {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  background: var(--surface);
  color: var(--text);
  font-family: var(--font);
  width: auto;
}

.aff-actions { display: flex; gap: 6px; margin-top: 4px; }

.aff-save {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 6px;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent-light);
  color: var(--accent-text);
  cursor: pointer;
  font-family: var(--font);
}

.aff-save:hover { filter: brightness(0.95); }

.aff-cancel {
  font-size: var(--font-size-sm);
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  font-family: var(--font);
}

/* Per-100g result box */
.per100-result {
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  display: none;
  margin-top: 2px;
}

.per100-result.show { display: block; }

.per100-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  text-align: center;
  margin-top: 6px;
}

/* ─── Diet – Calculator ─────────────────────────────────────────────── */
.calc-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 8px;
}

.calc-head {
  padding: 9px 13px;
  border-bottom: 1px solid var(--border);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calc-body { padding: 12px 13px; display: flex; flex-direction: column; gap: 8px; }

.calc-row { display: flex; gap: 6px; align-items: center; }
.calc-label {
  font-size: var(--font-size-xs);
  color: var(--text-2);
  width: 58px;
  min-width: 58px;
  text-align: right;
  flex-shrink: 0;
  padding-right: 4px;
}

.calc-input {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  background: var(--surface);
  color: var(--text);
  font-family: var(--font);
  width: auto;
}

.calc-unit { font-size: var(--font-size-xs); color: var(--text-3); flex-shrink: 0; }

.calc-btn {
  width: 100%;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 7px;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent-light);
  color: var(--accent-text);
  cursor: pointer;
  margin-top: 2px;
  font-family: var(--font);
}

.calc-result { background: var(--surface-2); border-radius: var(--radius-sm); padding: 10px 12px; display: none; }
.calc-result.show { display: block; }

.calc-use-btn {
  width: 100%;
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  margin-top: 8px;
  font-family: var(--font);
}

.calc-use-btn:hover { background: var(--surface-2); }

/* ─── Diet – Meal grid ──────────────────────────────────────────────── */
.meal-grid { display: flex; flex-direction: column; gap: 14px; }

.date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.day-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 99px;
  border: 1px solid var(--border-2);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-3);
  font-size: 12px;
  flex-shrink: 0;
  transition: background 0.12s;
  user-select: none;
}

.day-toggle:hover { background: var(--surface-2); }

.date-label  { font-size: var(--font-size-sm); font-weight: 600; color: var(--text-2); }
.today-badge { font-size: 10px; font-weight: 600; background: var(--accent-light); color: var(--accent-text); padding: 2px 8px; border-radius: 99px; }

.day-content { overflow: hidden; transition: max-height 0.25s ease; }

.meal-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 4px; }
.meal-col  { display: flex; flex-direction: column; }

.meal-head {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 7px 10px 6px;
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: var(--surface-2);
}

.meal-cell {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  min-height: 80px;
  padding: 8px;
  transition: border-color 0.15s, background 0.15s;
  flex: 1;
}

.meal-cell.drag-over { border-color: var(--accent); background: var(--accent-light); }

.placed-item {
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin-bottom: 6px;
  cursor: grab;
}

.placed-item:active           { cursor: grabbing; opacity: 0.6; }
.placed-item.dragging-placed  { opacity: 0.4; }

.pi-name-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; margin-bottom: 5px; }
.pi-name     { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.3; flex: 1; }
.pi-rm       { font-size: 15px; color: var(--text-3); cursor: pointer; line-height: 1; flex-shrink: 0; margin-left: 4px; border: none; background: none; }
.pi-rm:hover { color: var(--danger); }

.pi-kcal-row { font-size: var(--font-size-sm); color: var(--text-3); margin-bottom: 4px; }
.pi-kcal-val { font-weight: 500; color: var(--text-2); }
.pi-cpf-row  { display: flex; gap: 10px; margin-bottom: 6px; }
.pi-cpf-item { font-size: var(--font-size-xs); color: var(--text-3); }
.pi-cpf-val  { font-weight: 500; color: var(--text-2); }
.pi-amt-row  { display: flex; align-items: center; gap: 5px; }
.pi-unit     { font-size: var(--font-size-xs); color: var(--text-3); }

input.pi-amt {
  width: 60px;
  font-size: var(--font-size-sm);
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text-2);
  text-align: center;
  padding: 3px 6px;
}

.drop-hint { font-size: var(--font-size-xs); color: var(--text-3); text-align: center; padding: 18px 0; }
.dragging  { opacity: 0.45; }

/* ─── Diet – Week chart ─────────────────────────────────────────────── */
.week-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.week-card {
  background: var(--surface);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  border: 1px solid var(--border);
}

.wc-label { font-size: var(--font-size-xs); color: var(--text-2); margin-bottom: 4px; font-weight: 500; }
.wc-val   { font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 2px; font-family: var(--mono); }
.wc-sub   { font-size: var(--font-size-xs); color: var(--text-3); }

.chart-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 16px; }
.chart-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.chart-sub   { font-size: var(--font-size-xs); color: var(--text-3); margin-bottom: 16px; }

/* ─── Workout ───────────────────────────────────────────────────────── */
.workout-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.workout-list-header {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workout-search {
  padding: 7px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 7px;
}

.workout-search i { font-size: 15px; color: var(--text-3); flex-shrink: 0; }
.workout-search input {
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  outline: none;
  flex: 1;
  min-width: 0;
  padding: 0;
  font-family: var(--font);
  width: auto;
}

.workout-items { max-height: 360px; overflow-y: auto; }

.workout-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}

.workout-item:last-child    { border-bottom: none; }
.workout-item:hover         { background: var(--surface-2); }
.workout-item.sel           { background: var(--accent-light); }
.workout-item i             { font-size: 17px; color: var(--text-3); width: 20px; text-align: center; flex-shrink: 0; }
.workout-item.sel i         { color: var(--accent); }
.workout-item-name          { font-size: 13px; color: var(--text); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.workout-item.sel .workout-item-name { color: var(--accent-text); font-weight: 500; }
.workout-item-actions       { display: none; gap: 2px; }
.workout-item:hover .workout-item-actions { display: flex; }

.add-workout-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--blue);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  border-top: 1px solid var(--border);
  transition: background 0.1s;
  font-family: var(--font);
}

.add-workout-btn:hover { background: var(--blue-light); }

.log-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow); }

.panel-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 10px;
  color: var(--text-3);
}

.panel-placeholder i { font-size: 30px; }
.panel-placeholder p { font-size: 13px; }

.ex-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.ex-header-icon { width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--accent-light); display: flex; align-items: center; justify-content: center; }
.ex-header-icon i { font-size: 20px; color: var(--accent); }
.ex-title { font-size: 15px; font-weight: 500; }
.ex-sub   { font-size: var(--font-size-sm); color: var(--text-3); margin-top: 2px; }

.kcal-box {
  background: var(--accent-light);
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  margin-top: 12px;
}

.kcal-box .lbl  { font-size: var(--font-size-sm); color: var(--accent-text); }
.kcal-box .note { font-size: var(--font-size-xs); color: var(--accent); margin-top: 2px; }
.kcal-val       { font-size: 20px; font-weight: 600; color: var(--accent); font-family: var(--mono); }

.log-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }

.log-entry { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.log-entry:last-child { border-bottom: none; }

.log-ico      { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.log-ico i    { font-size: 15px; color: var(--accent); }
.log-name     { font-size: 13px; font-weight: 500; }
.log-meta     { font-size: var(--font-size-xs); color: var(--text-3); margin-top: 2px; }
.log-cal      { font-size: 13px; font-weight: 500; color: var(--accent); margin-left: auto; margin-right: 6px; white-space: nowrap; font-family: var(--mono); }

.week-day-block  { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 10px; box-shadow: var(--shadow); }
.week-day-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
.week-day-name   { font-size: 13px; font-weight: 500; }
.week-day-name.is-today { color: var(--accent); }
.week-day-date   { font-size: var(--font-size-xs); font-weight: 400; color: var(--text-3); margin-left: 5px; }
.week-day-stats  { font-size: var(--font-size-sm); color: var(--text-3); display: flex; gap: 8px; font-family: var(--mono); }
.week-bar        { height: 3px; background: var(--surface-3); }
.week-bar-fill   { height: 100%; background: var(--accent); transition: width 0.3s; }
.week-no-entry   { font-size: var(--font-size-sm); color: var(--text-3); padding: 10px 14px; }

.wt-row  { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--border); }
.wt-row:last-child { border-bottom: none; }
.wt-date { font-size: var(--font-size-sm); color: var(--text-3); width: 84px; flex-shrink: 0; }
.wt-val  { font-size: 13px; font-weight: 500; flex: 1; font-family: var(--mono); }
.wt-diff { font-size: var(--font-size-xs); margin-left: 5px; }
.tup { color: var(--danger); }
.tdn { color: var(--accent); }
.teq { color: var(--text-3); }

/* ─── Money ─────────────────────────────────────────────────────────── */
.money-type-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  transition: all 0.12s;
  font-family: var(--font);
}

.money-type-btn.income.active  { background: var(--accent-light); border-color: var(--accent); color: var(--accent-text); }
.money-type-btn.expense.active { background: var(--danger-light); border-color: var(--danger); color: var(--danger); }

.tx-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.tx-item:last-child { border-bottom: none; }
.tx-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.tx-info { flex: 1; min-width: 0; }
.tx-name { font-size: 13px; font-weight: 500; color: var(--text); }
.tx-meta { font-size: var(--font-size-xs); color: var(--text-3); margin-top: 2px; }
.tx-amt  { font-size: 13px; font-weight: 600; font-family: var(--mono); white-space: nowrap; }
.tx-amt.income  { color: var(--accent); }
.tx-amt.expense { color: var(--danger); }

/* ─── Classes ───────────────────────────────────────────────────────── */
.class-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 10px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  box-shadow: var(--shadow);
}

.class-color-bar { width: 4px; border-radius: 99px; min-height: 50px; flex-shrink: 0; }
.class-info      { flex: 1; min-width: 0; }
.class-name      { font-size: var(--font-size-md); font-weight: 600; color: var(--text); margin-bottom: 4px; }
.class-meta      { font-size: var(--font-size-sm); color: var(--text-3); margin-bottom: 6px; }

/* ─── Profile ───────────────────────────────────────────────────────── */
.profile-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  margin-bottom: 14px;
}

.profile-section-title {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.profile-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.profile-row:last-child { margin-bottom: 0; }
.profile-label  { font-size: var(--font-size-sm); color: var(--text-2); min-width: 120px; flex-shrink: 0; }
.profile-input,
.profile-select { flex: 1; min-width: 0; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 6px 10px; background: var(--surface); color: var(--text); font-family: var(--font); width: auto; }
.profile-unit   { font-size: var(--font-size-sm); color: var(--text-3); flex-shrink: 0; }

.profile-bmr-box { background: var(--surface-2); border-radius: var(--radius-sm); padding: 10px 14px; margin-top: 4px; }
.profile-bmr-row { display: flex; gap: 16px; flex-wrap: wrap; }
.profile-bmr-item { text-align: center; }
.profile-bmr-val  { font-size: 16px; font-weight: 600; color: var(--text); font-family: var(--mono); }
.profile-bmr-lbl  { font-size: 10px; color: var(--text-3); margin-top: 2px; }

/* Ratio inputs in diet goals section */
.ratio-row { display: grid; grid-template-columns: 52px 1fr 16px 44px; align-items: center; gap: 6px; margin-bottom: 8px; }
.ratio-name { font-size: var(--font-size-sm); font-weight: 500; }
.ratio-input {
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  background: var(--surface);
  color: var(--text);
  text-align: right;
  width: 100%;
  font-family: var(--font);
}

.ratio-pct    { font-size: var(--font-size-sm); color: var(--text-3); }
.ratio-grams  { font-size: var(--font-size-xs); color: var(--text-3); text-align: right; }
.ratio-total  { font-size: var(--font-size-xs); margin-top: 2px; text-align: right; }
.ratio-warn   { color: var(--danger); }
.ratio-ok     { color: var(--accent); }

/* ─── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 700px) {
  .macro-bar      { flex-wrap: wrap; }
  .macro-card     { flex: 0 0 50%; border-bottom: 1px solid var(--border); }
  .week-summary-grid { grid-template-columns: repeat(2, 1fr); }
  .meal-row       { grid-template-columns: 1fr; }
}
