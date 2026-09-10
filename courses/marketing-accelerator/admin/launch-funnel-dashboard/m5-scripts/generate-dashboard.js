// M5 — dashboard generator, rebuilt 25 Aug 2026 against the new "Funnel Tracker" tab.
//
// The old standalone tracker Sheet (1YAbXlqY...) is retired — see the folder README. This
// script now reads the "Funnel Tracker" tab inside Liv's Project Plan sheet, which has a
// different shape: six stages only (website views, Typeform views, form starts, applicants,
// accepted to interview, paid — booked calls / offer made / confirmed-will-pay were dropped
// per Liv's request), metric rows going down, weeks as Target/Actual column pairs going
// across, and a TOTALS block with a live accumulated actual-so-far figure per stage.
//
// This is NOT a live-refreshing view: it is a snapshot as of the moment this script runs.
// Re-run it any time you want the dashboard to reflect the latest Sheet values, then
// re-publish the resulting HTML file. No Apps Script API access in this environment — see
// m5-dashboard-build.md for why a generated static file is the honest delivery mechanism.
//
// HubSpot paid-applicant name/company/role data isn't reachable from this portable script
// the way GA4/Typeform are, so it's pre-fetched by Claude and cached to hubspot-snapshot.json.
// Re-run that query and overwrite the JSON before re-running this script for fresh names.
//
// Every number in the output traces to a live read. Nothing is invented. Where there's
// genuinely no data yet, the dashboard says so explicitly rather than showing a fabricated
// or misleading zero/red state.

const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU';
const TAB = 'Funnel Tracker';

const BRAND_DIR = path.join(
  '/Users/oliviapike/Documents/Claude/Projects/.claude/skills/up-world-design/assets'
);
const OUT_PATH = path.join(__dirname, '..', 'm5-dashboard.html');
const HUBSPOT_SNAPSHOT_PATH = path.join(__dirname, 'hubspot-snapshot.json');
const PAID_GOAL = 25; // from M2/PRD

// Row 22 ("Interviews held") inserted 25 Aug 2026 — a count of interviews that actually
// happened, distinct from "Accepted to interview" (reaching the interview stage, whether or
// not the interview has occurred yet). No target, same as it was treated as "Booked calls" in
// the old sheet. Shifted Paid from row 23 to row 24.
const METRIC_ROW = { website: 13, typeform: 15, starts: 17, applicants: 19, accepted: 21, interviewsHeld: 22, paid: 24 };
const CONV_ROW_AFTER = { typeform: 14, starts: 16, applicants: 18, accepted: 20, paid: 23 }; // conversion INTO this stage, sheet-sourced (interviewsHeld has none — computed generically instead)
const STAGE_ORDER = ['website', 'typeform', 'starts', 'applicants', 'accepted', 'interviewsHeld', 'paid'];
const STAGE_LABEL = { website: 'Website views', typeform: 'Typeform views', starts: 'Form starts', applicants: 'Applicants', accepted: 'Accepted to interview', interviewsHeld: 'Interviews held', paid: 'Paid' };
const WEEK_LABEL_ROW = 11;
const WEEK_START_COL_IDX0 = 3; // D, 0-indexed
const NUM_WEEKS = 9;

async function getClient() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  return new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
}

async function readRange(client, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await client.request({ url, method: 'GET' });
  return res.data.values || [];
}

function num(v) {
  if (v === undefined || v === null || v === '') return null; // blank = no data, never zero
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmt(n, opts = {}) {
  if (n === null) return opts.blank || 'no data';
  if (opts.pct) return `${n.toFixed(0)}%`;
  return Math.round(n).toLocaleString('en-GB');
}

// Row cells are 0-indexed arrays as returned by the Sheets API; row[0] = col A.
function cell(row, colIdx0) { return row ? row[colIdx0] : undefined; }

async function main() {
  const client = await getClient();

  const rows = await readRange(client, `${TAB}!A1:U27`);
  const row = (n) => rows[n - 1] || []; // 1-indexed helper matching the sheet's own row numbers

  const weekLabelRow = row(WEEK_LABEL_ROW);
  const weekLabels = [];
  for (let i = 0; i < NUM_WEEKS; i++) {
    weekLabels.push((cell(weekLabelRow, WEEK_START_COL_IDX0 + i * 2) || '').toString());
  }

  function targetColIdx0(weekIdx) { return WEEK_START_COL_IDX0 + weekIdx * 2; }
  function actualColIdx0(weekIdx) { return WEEK_START_COL_IDX0 + weekIdx * 2 + 1; }

  function sumActual(metricRow) {
    let sum = 0, anyData = false;
    for (let i = 0; i < NUM_WEEKS; i++) {
      const v = num(cell(row(metricRow), actualColIdx0(i)));
      if (v !== null) { sum += v; anyData = true; }
    }
    return anyData ? sum : null;
  }

  const stages = STAGE_ORDER.map((key) => {
    const metricRow = METRIC_ROW[key];
    return {
      key,
      label: STAGE_LABEL[key],
      actual: sumActual(metricRow),
      target: num(cell(row(metricRow), 2)), // column C, overall target
    };
  });

  const anyRealActivity = stages.some((s) => s.actual !== null && s.actual > 0);
  const anyActualDataAtAll = stages.some((s) => s.actual !== null);

  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1];
    const cur = stages[i];
    cur.conversion = (prev.actual !== null && cur.actual !== null && prev.actual > 0) ? (cur.actual / prev.actual) * 100 : null;
    cur.targetConversion = (prev.target !== null && cur.target !== null && prev.target > 0) ? (cur.target / prev.target) * 100 : null;
  }
  stages[0].conversion = null;
  stages[0].targetConversion = null;

  for (const s of stages) {
    if (s.target === null) s.rag = 'no-target';
    else if (s.actual === null || (s.actual === 0 && !anyRealActivity)) s.rag = 'not-started';
    else {
      const ratio = s.actual / s.target;
      if (ratio >= 0.9) s.rag = 'green';
      else if (ratio >= 0.6) s.rag = 'amber';
      else s.rag = 'red';
    }
  }

  let hubspot = { paidDeals: [], currency: 'GBP', fetchedAt: null };
  if (fs.existsSync(HUBSPOT_SNAPSHOT_PATH)) hubspot = JSON.parse(fs.readFileSync(HUBSPOT_SNAPSHOT_PATH, 'utf8'));
  const paidDeals = hubspot.paidDeals || [];
  const revenueTotal = paidDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const currencySymbol = { GBP: '£', USD: '$', EUR: '€' }[hubspot.currency || 'GBP'] || '';
  const paidActualCount = stages.find((s) => s.key === 'paid').actual ?? 0;

  // Parse "w/c D Mon (phase)" into a Monday Date, for locating "this week".
  function parseWeekLabel(label) {
    const m = /w\/c\s+(\d+)\s+(\w+)/.exec(label || '');
    if (!m) return null;
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    return new Date(2026, months[m[2]], Number(m[1]));
  }
  function weekHasAnyActual(weekIdx) {
    return STAGE_ORDER.some((key) => num(cell(row(METRIC_ROW[key]), actualColIdx0(weekIdx))) !== null);
  }

  const today = new Date();
  let thisWeekIdx = -1, thisWeekIsFuture = false, usingPriorWeek = false;
  for (let i = 0; i < NUM_WEEKS; i++) {
    const start = parseWeekLabel(weekLabels[i]);
    const nextStart = i + 1 < NUM_WEEKS ? parseWeekLabel(weekLabels[i + 1]) : null;
    if (start && today >= start && (!nextStart || today < nextStart)) { thisWeekIdx = i; break; }
  }
  if (thisWeekIdx !== -1 && !weekHasAnyActual(thisWeekIdx)) {
    for (let back = thisWeekIdx - 1; back >= 0; back--) {
      if (weekHasAnyActual(back)) { thisWeekIdx = back; usingPriorWeek = true; break; }
    }
  }
  if (thisWeekIdx === -1) {
    const firstStart = parseWeekLabel(weekLabels[0]);
    if (firstStart && today < firstStart) { thisWeekIdx = 0; thisWeekIsFuture = true; }
  }

  // Pace badge — cumulative Paid actual-to-date vs cumulative Paid target-to-date, the only
  // stage with a genuine weekly (not window-total) pacing curve.
  let paceRag = null, paceLabel = '';
  if (thisWeekIdx !== -1 && !thisWeekIsFuture) {
    let cumActual = 0, cumTarget = 0, anyPaidDataToDate = false;
    for (let i = 0; i <= thisWeekIdx; i++) {
      const a = num(cell(row(METRIC_ROW.paid), actualColIdx0(i)));
      const t = num(cell(row(METRIC_ROW.paid), targetColIdx0(i)));
      if (a !== null) { cumActual += a; anyPaidDataToDate = true; }
      if (t !== null) cumTarget += t;
    }
    if (!anyPaidDataToDate) { paceRag = 'not-started'; paceLabel = 'Not started yet'; }
    else if (cumTarget === 0) { paceRag = cumActual > 0 ? 'green' : 'not-started'; paceLabel = cumActual > 0 ? 'Ahead of pace' : 'Not started yet'; }
    else {
      const ratio = cumActual / cumTarget;
      const pctLabel = fmt(ratio * 100, { pct: true });
      if (ratio >= 0.9) { paceRag = 'green'; paceLabel = `On track — ${pctLabel} of pace`; }
      else if (ratio >= 0.6) { paceRag = 'amber'; paceLabel = `At risk — ${pctLabel} of pace`; }
      else { paceRag = 'red'; paceLabel = `Off track — ${pctLabel} of pace`; }
    }
  }

  const realWeekLabels = weekLabels.filter((l) => parseWeekLabel(l) !== null);
  function shortDate(label) {
    const m = /w\/c\s+(\d+)\s+(\w+)/.exec(label || '');
    return m ? `${m[1]} ${m[2]}` : (label || '?');
  }
  const windowLabel = realWeekLabels.length ? `${shortDate(realWeekLabels[0])} – ${shortDate(realWeekLabels[realWeekLabels.length - 1])}` : '?';

  // Wins/Flags compare against pace-TO-DATE, not the full window-total target — comparing
  // week-3-of-9's actual against the whole window's target always reads as "behind" and isn't
  // useful this early. Liv's correction, 25 Aug 2026: "we still have a month to go so not
  // helpful." Cumulative target for weeks that have actually happened, same logic already used
  // for the Paid pace badge, now applied to every stage.
  function cumTargetToDate(metricRow) {
    if (thisWeekIdx === -1) return null;
    let sum = 0, any = false;
    for (let i = 0; i <= thisWeekIdx; i++) {
      const t = num(cell(row(metricRow), targetColIdx0(i)));
      if (t !== null) { sum += t; any = true; }
    }
    return any ? sum : null;
  }
  for (const s of stages) {
    const toDate = cumTargetToDate(METRIC_ROW[s.key]);
    s.paceTarget = toDate;
    if (toDate === null || s.actual === null) s.paceRag = s.rag; // fall back to window-total classification if pace can't be computed
    else {
      const ratio = toDate > 0 ? s.actual / toDate : (s.actual > 0 ? 2 : 0);
      if (ratio >= 0.9) s.paceRag = 'green';
      else if (ratio >= 0.6) s.paceRag = 'amber';
      else s.paceRag = 'red';
    }
  }

  const wins = [];
  const flags = [];
  if (anyRealActivity) {
    for (const s of stages) {
      if (s.paceRag === 'green') wins.push(`${s.label} is on pace — ${fmt(s.actual)} vs ${fmt(s.paceTarget)} target so far this window.`);
      if (s.paceRag === 'red') flags.push(`${s.label} is behind pace — ${fmt(s.actual)} vs ${fmt(s.paceTarget)} target so far this window.`);
    }
    const measured = stages.filter((s) => s.conversion !== null);
    if (measured.length) {
      const worst = measured.reduce((a, b) => (a.conversion < b.conversion ? a : b));
      flags.push(`Biggest drop-off: only ${fmt(worst.conversion, { pct: true })} convert into ${worst.label.toLowerCase()}.`);
      const best = measured.reduce((a, b) => (a.conversion > b.conversion ? a : b));
      if (best.key !== worst.key) wins.push(`${fmt(best.conversion, { pct: true })} convert into ${best.label.toLowerCase()} — the strongest step in the funnel right now.`);
    }
  }
  const revenueDealsCount = paidDeals.filter((d) => !d.nonRevenue).length;
  if (revenueTotal > 0) wins.push(`${currencySymbol}${revenueTotal.toLocaleString('en-GB')} banked so far from ${revenueDealsCount} paid space${revenueDealsCount === 1 ? '' : 's'}.`);
  if (!wins.length) wins.push('Nothing to report yet.');
  if (!flags.length) flags.push('No flags right now.');

  const generatedAt = new Date().toISOString();
  const figtreeCss = fs.readFileSync(path.join(BRAND_DIR, 'fonts', 'figtree-embed.css'), 'utf8');
  const roundelNavy = fs.readFileSync(path.join(BRAND_DIR, 'logos', 'up-world-roundel-navy-512.datauri.txt'), 'utf8').trim();

  function ragLabel(rag) {
    return { green: 'On track', amber: 'Watch', red: 'Behind', 'not-started': 'Not started yet', 'no-target': 'No target set' }[rag];
  }

  const MIN_WIDTH_PCT = 12;
  function scaledWidthPct(value, maxValue) {
    if (value === null || !maxValue) return 0;
    const raw = Math.sqrt(value / maxValue) * 100;
    return Math.max(MIN_WIDTH_PCT, Math.min(100, raw));
  }

  function funnelBar(stage, maxTarget) {
    const target = stage.target;
    const actual = stage.actual;
    const targetPctWidth = target !== null ? scaledWidthPct(target, maxTarget) : 0;
    const actualPctWidth = target !== null && actual !== null ? Math.min(100, (actual / target) * 100) : 0;
    const targetConvHtml = stage.targetConversion !== null ? `<span class="conv-target">target ${fmt(stage.targetConversion, { pct: true })}</span>` : '';
    const conversionHtml = stage.key === 'website' ? '' : `
        <div class="conv-badge-row">
          ${stage.conversion !== null ? `<span class="conv-actual">${fmt(stage.conversion, { pct: true })} conversion</span>` : `<span class="conv-actual conv-actual--muted">conversion not yet measurable</span>`}
          ${targetConvHtml}
        </div>`;
    return `
      <div class="funnel-stage">
        ${conversionHtml}
        <div class="stage-row">
          <div class="stage-label">${esc(stage.label)}</div>
          <div class="stage-status status--${stage.rag}">${ragLabel(stage.rag)}</div>
        </div>
        <div class="bar-track">
          ${target !== null ? `<div class="bar-ghost" style="width:${targetPctWidth}%"></div>` : ''}
          ${target !== null && actual !== null ? `<div class="bar-actual" style="width:${(actualPctWidth * targetPctWidth) / 100}%"></div>` : ''}
        </div>
        <div class="stage-figures">
          <span class="fig-actual">${stage.actual === null ? 'no data yet' : fmt(stage.actual)} actual</span>
          <span class="fig-target">${target === null ? 'no target set' : `vs ${fmt(target)} target (window total)`}</span>
        </div>
      </div>`;
  }

  const maxTarget = Math.max(...stages.filter((s) => s.target !== null).map((s) => s.target));

  const paidApplicantsSection = paidDeals.length === 0
    ? `<div class="empty-state empty-state--small"><div class="empty-title">No one's paid yet</div><p>The first names on the board will show up here the moment a deal hits the HubSpot "Paid" stage for this cohort.</p></div>`
    : `<ul class="paid-list">
        ${paidDeals.map((d) => `
          <li class="paid-card">
            <div class="paid-name">${esc(d.name)}</div>
            <div class="paid-meta">${esc(d.jobtitle || '')}${d.jobtitle && d.company ? ' · ' : ''}${esc(d.company || '')}</div>
            <div class="paid-amount">${d.nonRevenue ? 'Not counted toward paid target' : `${currencySymbol}${Number(d.amount || 0).toLocaleString('en-GB')}`}</div>
            ${d.amountFlag ? `<div class="paid-flag">${esc(d.amountFlag)}</div>` : ''}
          </li>`).join('')}
      </ul>`;

  function weekChipRag(actual, target) {
    if (target === null) return 'no-target';
    if (actual === null) return 'not-started';
    if (target === 0) return actual > 0 ? 'green' : 'not-started';
    const ratio = actual / target;
    if (ratio >= 0.9) return 'green';
    if (ratio >= 0.6) return 'amber';
    return 'red';
  }

  const weekChipDefs = thisWeekIdx !== -1 ? STAGE_ORDER.map((key, i) => {
    const metricRow = METRIC_ROW[key];
    const actual = num(cell(row(metricRow), actualColIdx0(thisWeekIdx)));
    const target = num(cell(row(metricRow), targetColIdx0(thisWeekIdx)));
    const convRow = CONV_ROW_AFTER[key];
    const conversion = convRow ? num(cell(row(convRow), actualColIdx0(thisWeekIdx))) : null;
    const targetConversion = convRow ? num(cell(row(convRow), targetColIdx0(thisWeekIdx))) : null;
    return {
      label: STAGE_LABEL[key], actual, target,
      conversion: conversion !== null ? conversion * 100 : null,
      targetConversion: targetConversion !== null ? targetConversion * 100 : null,
      rag: weekChipRag(actual, target),
    };
  }) : [];

  const thisWeekSection = thisWeekIdx === -1 ? '' : `
    <div class="section">
      <h2>${usingPriorWeek ? 'Last week' : 'This week'}</h2>
      <p class="section-note">
        ${thisWeekIsFuture ? `The window opens ${esc(weekLabels[thisWeekIdx])} — nothing to show yet.`
          : `${esc(weekLabels[thisWeekIdx])}${usingPriorWeek ? ' — this week has no data yet, showing the last completed week' : ''}`}
      </p>
      ${paceRag ? `<div class="pace-badge pace-badge--${paceRag}">${esc(paceLabel)}<span class="pace-sub">paid vs pacing curve to date</span></div>` : ''}
      <div class="week-chip-row">
        ${weekChipDefs.map((c) => `
          <div class="week-chip">
            <div class="week-chip-status status--${c.rag}"></div>
            <div class="week-chip-value">${c.actual === null ? '—' : fmt(c.actual)}</div>
            <div class="week-chip-label">${esc(c.label)}</div>
            <div class="week-chip-sub">${c.target === null ? 'no target' : `${fmt(c.actual === null ? null : (c.target ? (c.actual / c.target) * 100 : (c.actual > 0 ? 100 : 0)), { pct: true, blank: '—' })} of week target`}</div>
            ${(c.conversion !== null || c.targetConversion !== null) ? `<div class="week-chip-conv">${c.conversion !== null ? `${fmt(c.conversion, { pct: true })} conv.` : 'conv. n/a'}${c.targetConversion !== null ? ` <span class="week-chip-conv-target">(target ${fmt(c.targetConversion, { pct: true })})</span>` : ''}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>`;

  const html = `<meta charset="UTF-8">
<title>The Marketing Accelerator Sept 2026 — launch funnel dashboard</title>
<style>
${figtreeCss}

:root { --pink: #E8536E; --navy: #16173D; --white: #FFFFFF; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Figtree', sans-serif; background: #FAFAF8; color: var(--navy); -webkit-font-smoothing: antialiased; }
@media (prefers-color-scheme: dark) { body { background: var(--navy); color: var(--white); } }
:root[data-theme="dark"] body { background: var(--navy); color: var(--white); }
:root[data-theme="light"] body { background: #FAFAF8; color: var(--navy); }

.wrap { max-width: 960px; margin: 0 auto; padding: 32px 24px 64px; }
.header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.header img { width: 56px; height: 56px; flex-shrink: 0; }
.header h1 { font-weight: 800; font-size: 1.75rem; margin: 0 0 4px; text-wrap: balance; letter-spacing: -0.01em; }
.header .sub { font-weight: 600; color: var(--pink); margin: 0; }

.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 28px; }
.kpi-card { background: var(--white); border-radius: 14px; padding: 16px 18px; border: 1px solid rgba(22,23,61,0.08); }
:root[data-theme="dark"] .kpi-card { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.kpi-label { font-size: 0.78rem; font-weight: 600; opacity: 0.65; margin-bottom: 4px; }
.kpi-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.01em; }
.kpi-value .unit { font-size: 0.95rem; font-weight: 600; opacity: 0.6; margin-left: 3px; }

.callout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px; }
@media (max-width: 640px) { .callout-grid { grid-template-columns: 1fr; } }
.callout { border-radius: 14px; padding: 16px 18px; }
.callout-wins { background: rgba(30, 122, 74, 0.08); border: 1px solid rgba(30, 122, 74, 0.2); }
.callout-flags { background: rgba(232, 83, 110, 0.08); border: 1px solid rgba(232, 83, 110, 0.25); }
.callout-title { font-weight: 800; font-size: 0.95rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.callout-wins .callout-title { color: #1e7a4a; }
.callout-flags .callout-title { color: var(--pink); }
:root[data-theme="dark"] .callout-wins .callout-title { color: #6fd39c; }
.callout ul { margin: 0; padding-left: 18px; font-size: 0.88rem; line-height: 1.55; }
.callout li { margin-bottom: 4px; }

h2 { font-weight: 800; font-size: 1.15rem; margin: 0 0 4px; position: relative; display: inline-block; }
h2::after { content: ''; position: absolute; left: 0; right: -6px; bottom: -4px; height: 4px; background: var(--pink); border-radius: 2px; transform: rotate(-0.6deg); }
.section-note { font-size: 0.85rem; opacity: 0.7; margin: 10px 0 18px; }
.section { margin-bottom: 40px; }

.two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: start; }
@media (max-width: 800px) { .two-col { grid-template-columns: 1fr; } }

.funnel-stage { margin-bottom: 20px; }
.conv-badge-row { display: flex; gap: 8px; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; }
.conv-actual { font-size: 0.72rem; font-weight: 700; color: var(--pink); }
.conv-actual--muted { color: inherit; opacity: 0.5; font-weight: 500; }
.conv-target { font-size: 0.72rem; font-weight: 500; opacity: 0.55; }

.stage-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.stage-label { font-weight: 700; font-size: 0.95rem; }
.stage-status { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; }
.status--green { background: #1e7a4a; color: white; }
.status--amber { background: #c98a1a; color: white; }
.status--red { background: var(--pink); color: white; }
.status--not-started { background: rgba(22,23,61,0.1); color: var(--navy); }
:root[data-theme="dark"] .status--not-started { background: rgba(255,255,255,0.15); color: var(--white); }
.status--no-target { background: transparent; color: inherit; opacity: 0.55; border: 1px solid currentColor; }

.bar-track { position: relative; height: 16px; border-radius: 8px; background: rgba(22,23,61,0.06); overflow: hidden; }
:root[data-theme="dark"] .bar-track { background: rgba(255,255,255,0.08); }
.bar-ghost { position: absolute; top: 0; left: 0; bottom: 0; border: 2px dashed rgba(22,23,61,0.3); border-radius: 8px; background: transparent; }
:root[data-theme="dark"] .bar-ghost { border-color: rgba(255,255,255,0.4); }
.bar-actual { position: absolute; top: 0; left: 0; bottom: 0; background: var(--pink); border-radius: 8px; }
.stage-figures { display: flex; justify-content: space-between; font-size: 0.78rem; margin-top: 5px; opacity: 0.85; font-variant-numeric: tabular-nums; }
.fig-actual { font-weight: 700; }

.pace-badge { display: inline-flex; align-items: baseline; gap: 8px; font-weight: 800; font-size: 0.95rem; padding: 8px 16px; border-radius: 10px; margin-bottom: 14px; }
.pace-badge--green { background: rgba(30,122,74,0.12); color: #1e7a4a; }
.pace-badge--amber { background: rgba(201,138,26,0.14); color: #8a6110; }
.pace-badge--red { background: rgba(232,83,110,0.12); color: var(--pink); }
.pace-badge--not-started { background: rgba(22,23,61,0.06); color: var(--navy); opacity: 0.75; }
:root[data-theme="dark"] .pace-badge--green { color: #6fd39c; }
:root[data-theme="dark"] .pace-badge--amber { color: #ecb84a; }
:root[data-theme="dark"] .pace-badge--not-started { color: var(--white); }
.pace-sub { font-weight: 500; font-size: 0.78rem; opacity: 0.75; }

.week-chip-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
.week-chip { position: relative; background: var(--white); border: 1px solid rgba(22,23,61,0.08); border-radius: 10px; padding: 10px 8px; text-align: center; }
:root[data-theme="dark"] .week-chip { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.week-chip-status { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; }
.week-chip-status.status--green { background: #1e7a4a; }
.week-chip-status.status--amber { background: #c98a1a; }
.week-chip-status.status--red { background: var(--pink); }
.week-chip-status.status--not-started { background: rgba(22,23,61,0.25); }
.week-chip-status.status--no-target { background: transparent; border: 1px solid rgba(22,23,61,0.3); }
.week-chip-value { font-weight: 800; font-size: 1.05rem; }
.week-chip-label { font-size: 0.68rem; opacity: 0.65; margin-top: 2px; }
.week-chip-sub { font-size: 0.64rem; opacity: 0.55; margin-top: 4px; }
.week-chip-conv { font-size: 0.64rem; font-weight: 700; color: var(--pink); margin-top: 2px; }
.week-chip-conv-target { font-weight: 500; opacity: 0.7; color: inherit; }

.explainer { background: rgba(22,23,61,0.03); border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; font-size: 0.85rem; line-height: 1.6; }
:root[data-theme="dark"] .explainer { background: rgba(255,255,255,0.05); }
.explainer strong { color: var(--pink); }

.paid-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.paid-card { background: var(--white); border: 1px solid rgba(22,23,61,0.08); border-radius: 12px; padding: 12px 14px; }
:root[data-theme="dark"] .paid-card { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.paid-name { font-weight: 700; font-size: 0.92rem; }
.paid-meta { font-size: 0.78rem; opacity: 0.7; margin: 2px 0 6px; }
.paid-amount { font-size: 0.85rem; font-weight: 700; color: var(--pink); }
.paid-flag { font-size: 0.72rem; opacity: 0.65; margin-top: 4px; line-height: 1.4; }

.empty-state { border: 2px dashed rgba(22,23,61,0.22); border-radius: 12px; padding: 22px 18px; text-align: center; }
.empty-state--small { padding: 18px 14px; }
:root[data-theme="dark"] .empty-state { border-color: rgba(255,255,255,0.28); }
.empty-title { font-weight: 800; font-size: 1rem; margin-bottom: 6px; }
.empty-state p { font-size: 0.85rem; opacity: 0.75; max-width: 420px; margin: 0 auto; line-height: 1.5; }

footer { margin-top: 44px; font-size: 0.7rem; opacity: 0.55; border-top: 1px solid rgba(22,23,61,0.12); padding-top: 14px; }
:root[data-theme="dark"] footer { border-top-color: rgba(255,255,255,0.2); }
</style>

<div class="wrap">
  <div class="header">
    <img src="${roundelNavy}" alt="Up World">
    <div>
      <h1>The Marketing Accelerator — launch funnel</h1>
      <p class="sub">Sept 2026 cohort</p>
    </div>
  </div>

  <div class="explainer">
    <strong>How to read this page:</strong> <strong>Wins/Flags</strong> auto-summarise what's going well or needs attention — honestly neutral until there's real data.
    <strong>This week</strong> shows this week's raw numbers, each one's own status dot (green/amber/red/grey) against that week's slice of the target, and the conversion rate from the stage before it.
    <strong>Overall funnel</strong> is the whole selling window end-to-end (actual vs the full window target), with conversion between every stage.
    <strong>Paid so far</strong> is who's actually committed, to celebrate. A blank cell always means "no data yet" — never zero.
  </div>

  <div class="kpi-row">
    <div class="kpi-card"><div class="kpi-label">Goal</div><div class="kpi-value">${PAID_GOAL}<span class="unit">paid spaces</span></div></div>
    <div class="kpi-card"><div class="kpi-label">Paid so far</div><div class="kpi-value">${paidActualCount}<span class="unit">of ${PAID_GOAL}</span></div></div>
    <div class="kpi-card"><div class="kpi-label">Revenue booked</div><div class="kpi-value">${currencySymbol}${revenueTotal.toLocaleString('en-GB')}</div></div>
    <div class="kpi-card"><div class="kpi-label">Window</div><div class="kpi-value" style="font-size:1.05rem;">${windowLabel}</div></div>
  </div>

  <div class="callout-grid">
    <div class="callout callout-wins"><div class="callout-title">Wins</div><ul>${wins.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
    <div class="callout callout-flags"><div class="callout-title">Flags</div><ul>${flags.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
  </div>

  ${thisWeekSection}

  <div class="section">
    <div class="two-col">
      <div>
        <h2>Overall funnel</h2>
        <p class="section-note">
          Whole selling window (${windowLabel}), target ${PAID_GOAL} paid.
          ${anyActualDataAtAll ? ' Actual (pink, solid) vs target (outline).' : ' Nothing has started yet, so every stage below is genuinely at zero — shown as "not started" rather than a failing red status.'}
        </p>
        <div class="funnel">${stages.map((s) => funnelBar(s, maxTarget)).join('')}</div>
      </div>
      <div>
        <h2>Paid so far</h2>
        <p class="section-note">Who's in, to get excited about.</p>
        ${paidApplicantsSection}
      </div>
    </div>
  </div>

  <footer>
    Generated ${generatedAt} from a live read of "Funnel Tracker" inside the Project Plan sheet
    (docs.google.com/spreadsheets/d/${SHEET_ID})${hubspot.fetchedAt ? ` and a HubSpot pull at ${hubspot.fetchedAt}` : ''}.
    This is a snapshot, not an auto-refreshing view — re-run
    <code>node m5-scripts/generate-dashboard.js</code> to update it. Every number above
    traces directly to a live read at generation time; nothing here is invented.
  </footer>
</div>
`;

  fs.writeFileSync(OUT_PATH, html);
  console.log(`Written to ${OUT_PATH}`);
  console.log('Wins:', wins);
  console.log('Flags:', flags);
  console.log('Revenue total:', revenueTotal, 'Paid deals:', paidDeals.length);
}

main().catch((e) => {
  console.error('Dashboard generation failed:');
  console.error(e.response ? JSON.stringify(e.response.data, null, 2) : e.stack);
  process.exit(1);
});
