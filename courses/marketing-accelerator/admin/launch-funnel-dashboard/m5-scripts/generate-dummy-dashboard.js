// Presentation mock-up — same rendering logic and layout as generate-dashboard.js, but fed
// hand-built ILLUSTRATIVE data instead of a live Sheet/HubSpot read. For sharing with a course
// audience as a "what week 3 might look like" example. Clearly banner-tagged throughout so it's
// never mistaken for the real, live dashboard (m5-dashboard.html).

const fs = require('fs');
const path = require('path');

const BRAND_DIR = path.join(
  '/Users/oliviapike/Documents/Claude/Projects/.claude/skills/up-world-design/assets'
);
const OUT_PATH = path.join(__dirname, '..', 'funnel-dashboard-mockup.html');
const PAID_GOAL = 25;

function num(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fmt(n, opts = {}) {
  if (n === null) return opts.blank || 'no data';
  if (opts.pct) return `${n.toFixed(0)}%`;
  return Math.round(n).toLocaleString('en-GB');
}

const COLS = {
  weekLabel: 2, phase: 3,
  websiteActual: 4, websiteTarget: 5,
  typeformActual: 6, typeformTarget: 7,
  startsActual: 8, startsTarget: 9,
  applicantsActual: 10, applicantsTarget: 11,
  bookedActual: 12,
  acceptedActual: 13, acceptedTarget: 14,
  paidActual: 15, paidTargetWeekly: 16, paidCumTarget: 17, paidCumPct: 18,
};

// ---- Hand-built illustrative "week 3" Sheet snapshot (real column shape, fake numbers) ----
const weekRows = [
  // launch_id, Launch, Week, Phase, webA, webT, tfA, tfT, startsA, startsT, appA, appT, bookedA, accA, accT, paidA, paidTw, paidCum, paidCumPct
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 3 Aug 2026', 'doors open', 620, 581, 190, 208, 95, 114, 15, 23, 4, 3, 5, 0, 0, 0, '0%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 10 Aug 2026', 'early bird', 750, 704, 230, 252, 120, 138, 20, 28, 6, 4, 6, 0, 0, 0, '0%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 17 Aug 2026', 'early bird', 830, 681, 240, 244, 115, 134, 19, 27, 5, 3, 6, 1, 3, 1, '4%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 24 Aug 2026', 'early bird close', '', 484, '', 173, '', 95, '', 19, '', '', 4, '', 2, '', '20%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 31 Aug 2026', 'mid', '', 317, '', 113, '', 62, '', 12, '', '', 3, '', 5, '', '40%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 7 Sep 2026', 'closing', '', 197, '', 71, '', 39, '', 8, '', '', 2, '', 5, '', '60%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 14 Sep 2026', 'doors close', '', 566, '', 202, '', 112, '', 22, '', '', 3, '', 5, '', '80%'],
  ['tma-sep-2026', 'TMA Sept 2026', 'w/c 22 Sep 2026', 'kickoff', '', 0, '', 0, '', 0, '', 0, '', '', 0, '', 5, '', '100%'],
];
const totalRow = ['', '', 'WINDOW TOTAL (target)', '', '', 3530, '', 1263, '', 694, '', 139, '', '', 29, '', 25, 25, '100%'];
const caveat = "MOCK-UP — illustrative sample data for a presentation, not a real reported result. CAVEAT (as on the live tracker): 25 paid is a genuine stretch (~19% above our best cohort ever). The funnel targets are grounded in real recent ad-era campaigns, so hitting the traffic numbers won't be the hard part — converting that traffic into paid at a strong rate will be. Judge this tracker on conversion rate and on Paid, not on raw funnel size.";

const hubspot = {
  currency: 'GBP',
  fetchedAt: null,
  paidDeals: [
    { name: 'Jamie Ellis', jobtitle: 'Marketing Manager', company: 'BrightLoop', amount: 1490 },
  ],
};

const applicantHeaderRow = ['Name', 'Email', 'Current stage', 'Days in stage'];
const applicantRows = [
  ['Priya Shah', 'priya@example.com', 'Arranging interview', '2'],
  ['Tom Fielding', 'tom@example.com', 'Applied', '4'],
  ['Jamie Ellis', 'jamie@example.com', 'Paid', '—'],
  ['Nina Kaur', 'nina@example.com', 'More info needed', '1'],
];

// ---- Same processing as the live script ----
function sumActual(colIdx) {
  let sum = 0, anyData = false;
  for (const row of weekRows) {
    const v = num(row[colIdx]);
    if (v !== null) { sum += v; anyData = true; }
  }
  return anyData ? sum : null;
}

const stages = [
  { key: 'website', label: 'Website views', actual: sumActual(COLS.websiteActual), target: num(totalRow[5]) },
  { key: 'typeform_views', label: 'Typeform views', actual: sumActual(COLS.typeformActual), target: num(totalRow[7]) },
  { key: 'form_starts', label: 'Form starts', actual: sumActual(COLS.startsActual), target: num(totalRow[9]) },
  { key: 'applicants', label: 'Applicants', actual: sumActual(COLS.applicantsActual), target: num(totalRow[11]) },
  { key: 'booked_calls', label: 'Booked calls', actual: sumActual(COLS.bookedActual), target: null },
  { key: 'accepted', label: 'Accepted', actual: sumActual(COLS.acceptedActual), target: num(totalRow[14]) },
  { key: 'paid', label: 'Paid', actual: sumActual(COLS.paidActual), target: num(totalRow[17]) },
];

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

const paidDeals = hubspot.paidDeals;
const revenueTotal = paidDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
const currencySymbol = { GBP: '£', USD: '$', EUR: '€' }[hubspot.currency || 'GBP'] || '';

const thisWeekIndex = 2; // "w/c 17 Aug 2026" — pretend today sits inside this week
const thisWeekRow = weekRows[thisWeekIndex];
const thisWeekIsFuture = false;

let cumActual = 0, anyPaidDataToDate = false;
for (let i = 0; i <= thisWeekIndex; i++) {
  const v = num(weekRows[i][COLS.paidActual]);
  if (v !== null) { cumActual += v; anyPaidDataToDate = true; }
}
const cumTarget = num(thisWeekRow[COLS.paidCumTarget]);
let paceRag, paceLabel;
if (!anyPaidDataToDate) { paceRag = 'not-started'; paceLabel = 'Not started yet'; }
else if (cumTarget === null || cumTarget === 0) { paceRag = cumActual > 0 ? 'green' : 'not-started'; paceLabel = cumActual > 0 ? 'Ahead of pace' : 'Not started yet'; }
else {
  const ratio = cumActual / cumTarget;
  const pctLabel = fmt(ratio * 100, { pct: true });
  if (ratio >= 0.9) { paceRag = 'green'; paceLabel = `On track — ${pctLabel} of pace`; }
  else if (ratio >= 0.6) { paceRag = 'amber'; paceLabel = `At risk — ${pctLabel} of pace`; }
  else { paceRag = 'red'; paceLabel = `Off track — ${pctLabel} of pace`; }
}

const wins = [];
const flags = [];
for (const s of stages) {
  if (s.rag === 'green') wins.push(`${s.label} is on track — ${fmt(s.actual)} vs ${fmt(s.target)} target.`);
  if (s.rag === 'red') flags.push(`${s.label} is behind pace — ${fmt(s.actual)} vs ${fmt(s.target)} target.`);
}
const measured = stages.filter((s) => s.conversion !== null);
if (measured.length) {
  const worst = measured.reduce((a, b) => (a.conversion < b.conversion ? a : b));
  flags.push(`Biggest drop-off: only ${fmt(worst.conversion, { pct: true })} convert into ${worst.label.toLowerCase()}.`);
  const best = measured.reduce((a, b) => (a.conversion > b.conversion ? a : b));
  if (best.key !== worst.key) wins.push(`${fmt(best.conversion, { pct: true })} convert into ${best.label.toLowerCase()} — the strongest step in the funnel right now.`);
}
if (revenueTotal > 0) {
  wins.push(`${currencySymbol}${revenueTotal.toLocaleString('en-GB')} banked so far from ${paidDeals.length} paid space${paidDeals.length === 1 ? '' : 's'}.`);
}

const generatedAt = new Date(2026, 7, 17).toISOString(); // fixed illustrative date, not "now"

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

const applicantSection = `<table class="data-table">
     <thead><tr>${applicantHeaderRow.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
     <tbody>${applicantRows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
   </table>`;

const paidApplicantsSection = `<ul class="paid-list">
    ${paidDeals.map((d) => `
      <li class="paid-card">
        <div class="paid-name">${esc(d.name)}</div>
        <div class="paid-meta">${esc(d.jobtitle || '')}${d.jobtitle && d.company ? ' · ' : ''}${esc(d.company || '')}</div>
        <div class="paid-amount">${currencySymbol}${Number(d.amount || 0).toLocaleString('en-GB')}</div>
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
const weekChipDefs = [
  { label: 'Website views', actualIdx: COLS.websiteActual, targetIdx: COLS.websiteTarget },
  { label: 'Typeform views', actualIdx: COLS.typeformActual, targetIdx: COLS.typeformTarget },
  { label: 'Form starts', actualIdx: COLS.startsActual, targetIdx: COLS.startsTarget },
  { label: 'Applicants', actualIdx: COLS.applicantsActual, targetIdx: COLS.applicantsTarget },
  { label: 'Booked calls', actualIdx: COLS.bookedActual, targetIdx: null },
  { label: 'Accepted', actualIdx: COLS.acceptedActual, targetIdx: COLS.acceptedTarget },
  { label: 'Paid', actualIdx: COLS.paidActual, targetIdx: COLS.paidTargetWeekly },
].map((def, i, arr) => {
  const actual = num(thisWeekRow[def.actualIdx]);
  const target = def.targetIdx === null ? null : num(thisWeekRow[def.targetIdx]);
  const prevActual = i === 0 ? null : num(thisWeekRow[arr[i - 1].actualIdx]);
  const conversion = (prevActual !== null && actual !== null && prevActual > 0) ? (actual / prevActual) * 100 : null;
  const prevTarget = (i === 0 || arr[i - 1].targetIdx === null) ? null : num(thisWeekRow[arr[i - 1].targetIdx]);
  const targetConversion = (prevTarget !== null && target !== null && prevTarget > 0) ? (target / prevTarget) * 100 : null;
  return { ...def, actual, target, conversion, targetConversion, rag: weekChipRag(actual, target) };
});

const thisWeekSection = `
  <div class="section">
    <h2>This week</h2>
    <p class="section-note">${esc(thisWeekRow[COLS.weekLabel])} (${esc(thisWeekRow[COLS.phase] || '')})</p>
    <div class="pace-badge pace-badge--${paceRag}">${esc(paceLabel)}<span class="pace-sub">paid vs pacing curve to date</span></div>
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
<title>MOCK-UP — The Marketing Accelerator Sept 2026 launch funnel</title>
<style>
${figtreeCss}

:root { --pink: #E8536E; --navy: #16173D; --white: #FFFFFF; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Figtree', sans-serif; background: #FAFAF8; color: var(--navy); -webkit-font-smoothing: antialiased; }
@media (prefers-color-scheme: dark) { body { background: var(--navy); color: var(--white); } }
:root[data-theme="dark"] body { background: var(--navy); color: var(--white); }
:root[data-theme="light"] body { background: #FAFAF8; color: var(--navy); }

.mock-banner { background: var(--navy); color: #fff; text-align: center; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.04em; padding: 10px 16px; }
.mock-banner span { color: #FF95A8; }

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

.caveat-box { background: rgba(232, 83, 110, 0.06); border-left: 4px solid var(--pink); padding: 12px 16px; border-radius: 6px; font-size: 0.86rem; line-height: 1.5; margin-bottom: 10px; opacity: 0.9; }
:root[data-theme="dark"] .caveat-box { background: rgba(232,83,110,0.12); }

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

.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.data-table th, .data-table td { border: 1px solid rgba(22,23,61,0.12); padding: 6px 8px; text-align: left; }
:root[data-theme="dark"] .data-table th, :root[data-theme="dark"] .data-table td { border-color: rgba(255,255,255,0.18); }
.data-table th { background: var(--navy); color: white; font-weight: 700; }

.paid-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.paid-card { background: var(--white); border: 1px solid rgba(22,23,61,0.08); border-radius: 12px; padding: 12px 14px; }
:root[data-theme="dark"] .paid-card { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.paid-name { font-weight: 700; font-size: 0.92rem; }
.paid-meta { font-size: 0.78rem; opacity: 0.7; margin: 2px 0 6px; }
.paid-amount { font-size: 0.85rem; font-weight: 700; color: var(--pink); }

footer { margin-top: 44px; font-size: 0.7rem; opacity: 0.55; border-top: 1px solid rgba(22,23,61,0.12); padding-top: 14px; }
:root[data-theme="dark"] footer { border-top-color: rgba(255,255,255,0.2); }
</style>

<div class="mock-banner">MOCK-UP <span>·</span> ILLUSTRATIVE SAMPLE DATA <span>·</span> NOT A REAL REPORTED RESULT</div>

<div class="wrap">
  <div class="header">
    <img src="${roundelNavy}" alt="Up World">
    <div>
      <h1>The Marketing Accelerator — launch funnel</h1>
      <p class="sub">Sept 2026 cohort</p>
    </div>
  </div>

  <div class="explainer">
    <strong>How to read this page:</strong> <strong>Wins/Flags</strong> auto-summarise what's going well or needs attention.
    <strong>This week</strong> shows this week's raw numbers, each one's own status dot (green/amber/red/grey) against that week's slice of the target, and the conversion rate from the stage before it.
    <strong>Overall funnel</strong> is the whole selling window end-to-end (actual vs the full window target), with conversion between every stage.
    <strong>Paid so far</strong> is who's actually committed, to celebrate.
  </div>

  <div class="kpi-row">
    <div class="kpi-card"><div class="kpi-label">Goal</div><div class="kpi-value">${PAID_GOAL}<span class="unit">paid spaces</span></div></div>
    <div class="kpi-card"><div class="kpi-label">Paid so far</div><div class="kpi-value">${paidDeals.length}<span class="unit">of ${PAID_GOAL}</span></div></div>
    <div class="kpi-card"><div class="kpi-label">Revenue booked</div><div class="kpi-value">${currencySymbol}${revenueTotal.toLocaleString('en-GB')}</div></div>
    <div class="kpi-card"><div class="kpi-label">Window</div><div class="kpi-value" style="font-size:1.05rem;">3 Aug – 22 Sep</div></div>
  </div>

  <div class="callout-grid">
    <div class="callout callout-wins"><div class="callout-title">Wins</div><ul>${wins.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
    <div class="callout callout-flags"><div class="callout-title">Flags</div><ul>${flags.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
  </div>

  <div class="caveat-box">${esc(caveat)}</div>

  ${thisWeekSection}

  <div class="section">
    <div class="two-col">
      <div>
        <h2>Overall funnel</h2>
        <p class="section-note">Whole selling window (3 Aug – 22 Sep), target 25 paid. Actual (pink, solid) vs target (outline).</p>
        <div class="funnel">${stages.map((s) => funnelBar(s, maxTarget)).join('')}</div>
      </div>
      <div>
        <h2>Paid so far</h2>
        <p class="section-note">Who's in, to get excited about.</p>
        ${paidApplicantsSection}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Applicant detail</h2>
    <p class="section-note">Sample rows — illustrative only.</p>
    ${applicantSection}
  </div>

  <footer>
    MOCK-UP generated ${generatedAt} — every number on this page is illustrative sample data for
    presentation purposes. The real, live-data version of this dashboard (fed by GA4, Typeform and
    HubSpot) is shared with the Up World team separately.
  </footer>
</div>
`;

fs.writeFileSync(OUT_PATH, html);
console.log(`Written to ${OUT_PATH}`);
