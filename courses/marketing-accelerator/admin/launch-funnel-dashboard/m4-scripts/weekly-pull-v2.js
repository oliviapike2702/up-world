// Weekly pull, v2 — writes into the new "Funnel Tracker" tab inside the Project Plan sheet.
//
// Built 25 Aug 2026 after discovering the old tracker's "Accepted to interview" weekly
// actuals (0, 2, 0) had never been computed by any script — grepped weekly-pull.js and
// found nothing, and no refresh-dashboard.js exists in this folder either. Those numbers
// were stale/hand-entered and drifted badly from reality (real count: 3, 7, 9). This script
// replaces that gap with a real HubSpot pull for all three CRM-sourced metrics.
//
// Six metrics, three sources:
//   Website views   — GA4, screenPageViews on /the-marketing-accelerator
//   Typeform views   — Typeform insights, cumulative visits, tracked as a delta against a
//                       local baseline file (Typeform's API has no date-range on visits)
//   Form starts      — Typeform responses, completed=false, date-ranged (true weekly figure)
//   Applicants        — Typeform: completed responses, real (non-test) only, date-ranged.
//                       Liv's call (25 Aug 2026): stay on Typeform even though HubSpot's Applied-
//                       stage entries were proven near-identical (5/11/15 vs 5/10/15) — she moves
//                       people around in HubSpot deals too much for stage-entry dates to stay a
//                       reliable count of genuine new applications.
//   Accepted to interview — HubSpot: union of hs_v2_date_entered_<Arranging interview> and
//                       hs_v2_date_entered_<Interview scheduled>. NOTE: the third accepted-tier
//                       stage, "Interviewed — Awaiting Confirmation" (5942479038, added this
//                       cohort), has NO entered-date property yet — HubSpot only generates one
//                       once a deal has been in the stage a while. Fallback below catches
//                       deals CURRENTLY sitting there who entered THIS week, which under-counts
//                       anyone who already moved on before the pull ran. Revisit once HubSpot
//                       generates hs_v2_date_entered_5942479038 for real.
//   Paid              — HubSpot: hs_v2_date_entered_<Paid stage>
//
// Usage: node weekly-pull-v2.js <weekStartISO e.g. 2026-08-24> [--write]
// Without --write, prints what it found and does not touch the Sheet.
const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU';
const TAB_NAME = 'Funnel Tracker';
const GA4_PROPERTY_ID = '342528552';
const GA4_PAGE_PATH = '/the-marketing-accelerator';
const TYPEFORM_FORM_ID = 'Ve2btZwn';
const BASELINE_PATH = path.join(__dirname, 'typeform-baseline.json');
const TEST_EMAIL_PATTERNS = [/@up-world\.co$/i, /oliviapike/i, /\+.*test/i, /^test/i];

function isTestSubmission(email, firstName) {
  if (!email && !firstName) return false;
  const hay = `${email || ''} ${firstName || ''}`;
  if (/^\s*test\s*$/i.test(firstName || '')) return true;
  return TEST_EMAIL_PATTERNS.some((re) => re.test(hay));
}

const HS_PIPELINE = '888214769';
const STAGE = {
  applied: '1251313895',
  arrangingInterview: '1338680530',
  interviewScheduled: '4650323174',
  interviewedAwaitingConfirmation: '5942479038',
  paid: '1251313898',
};

// Row 22 ("Interviews held") inserted 25 Aug 2026, after Accepted to interview — Liv wanted a
// count of interviews actually HAPPENED, distinct from Accepted (which just means the deal
// reached the interview stage, whether or not the interview has occurred yet). Shifted Paid
// from row 23 to row 24.
const METRIC_ROW = { website: 13, typeform: 15, starts: 17, applicants: 19, accepted: 21, interviewsHeld: 22, paid: 24 };
const WEEK_LABEL_ROW = 11;
const WEEK_START_COL_IDX = 3; // D, 0-indexed

function colLetter(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function weekLabelFor(date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `w/c ${date.getDate()} ${months[date.getMonth()]}`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

async function getSheetsClient() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  await client.authorize();
  return client;
}

async function getGA4Client() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/analytics.readonly'] });
  await client.authorize();
  return client;
}

async function findActualColumn(sheetsClient, weekStart) {
  const label = weekLabelFor(weekStart);
  const range = `${TAB_NAME}!D${WEEK_LABEL_ROW}:U${WEEK_LABEL_ROW}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await sheetsClient.request({ url, method: 'GET' });
  const row = (res.data.values && res.data.values[0]) || [];
  const idx = row.findIndex((cell) => (cell || '').startsWith(label));
  if (idx === -1) {
    throw new Error(`No week column found matching "${label}" in row ${WEEK_LABEL_ROW}. Row has: ${JSON.stringify(row)}`);
  }
  const actualColIdx = WEEK_START_COL_IDX + idx + 1; // idx is offset from D; actual col is target col + 1
  return colLetter(actualColIdx + 1);
}

async function pullGA4(startDate, endDate) {
  const client = await getGA4Client();
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensionFilter: { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: GA4_PAGE_PATH } } },
  };
  const res = await client.request({ url, method: 'POST', data: body });
  const rows = res.data.rows || [];
  return rows.length ? Number(rows[0].metricValues[0].value) : 0;
}

async function tfFetch(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Typeform ${res.status} on ${url}: ${await res.text()}`);
  return res.json();
}

function summariseResponses(items) {
  return items.map((it) => {
    const answers = it.answers || [];
    const email = (answers.find((a) => a.type === 'email') || {}).email || null;
    const texts = answers.filter((a) => a.type === 'text').map((a) => a.text);
    return { email, firstName: texts[0] || null, dealname: `${texts[0] || ''} ${texts[1] || ''}`.trim() };
  });
}

async function pullTypeform(startDate, endDate) {
  const token = fs.readFileSync(path.join(os.homedir(), '.typeform_key'), 'utf8').trim();
  const qs = `page_size=1000&since=${startDate}T00:00:00Z&until=${endDate}T23:59:59Z`;
  const [partial, completed, insights] = await Promise.all([
    tfFetch(token, `https://api.typeform.com/forms/${TYPEFORM_FORM_ID}/responses?${qs}&completed=false`),
    tfFetch(token, `https://api.typeform.com/forms/${TYPEFORM_FORM_ID}/responses?${qs}&completed=true`),
    tfFetch(token, `https://api.typeform.com/insights/${TYPEFORM_FORM_ID}/summary`),
  ]);
  const formStarts = partial.total_items ?? (partial.items || []).length;

  const completedReal = summariseResponses(completed.items || []).filter((r) => !isTestSubmission(r.email, r.firstName));

  const platforms = (insights.form && insights.form.platforms) || [];
  const cumulativeVisits = platforms.reduce((acc, p) => acc + (p.unique_visits || 0), 0);

  let baseline = {};
  if (fs.existsSync(BASELINE_PATH)) baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  const prevCumulative = baseline.cumulativeVisits ?? cumulativeVisits;
  const weeklyTypeformViews = Math.max(0, cumulativeVisits - prevCumulative);

  return {
    formStarts,
    applicants: completedReal.length,
    applicantNames: completedReal.map((r) => r.dealname),
    weeklyTypeformViews,
    cumulativeVisits,
    prevCumulative,
  };
}

function saveTypeformBaseline(cumulativeVisits, weekStart) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ cumulativeVisits, capturedAfterWeek: iso(weekStart) }, null, 2));
}

async function hsSearch(filters) {
  const key = fs.readFileSync(path.join(os.homedir(), '.hubspot_key'), 'utf8').trim();
  const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filterGroups: [{ filters }], properties: ['dealname', 'amount', 'dealstage'], limit: 100 }),
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

async function hsWeeklyStageEntries(stageId, startDate, endDate) {
  const d = await hsSearch([
    { propertyName: 'pipeline', operator: 'EQ', value: HS_PIPELINE },
    { propertyName: `hs_v2_date_entered_${stageId}`, operator: 'BETWEEN', value: `${startDate}T00:00:00Z`, highValue: `${endDate}T23:59:59Z` },
  ]);
  return d.results || [];
}

// Fallback for the new stage with no historical entered-date property: catches deals
// currently sitting there who entered THIS week (their generic current-stage-entry date).
async function hsCurrentlyInStageEnteredThisWeek(stageId, startDate, endDate) {
  const d = await hsSearch([
    { propertyName: 'pipeline', operator: 'EQ', value: HS_PIPELINE },
    { propertyName: 'dealstage', operator: 'EQ', value: stageId },
    { propertyName: 'hs_v2_date_entered_current_stage', operator: 'BETWEEN', value: `${startDate}T00:00:00Z`, highValue: `${endDate}T23:59:59Z` },
  ]);
  return d.results || [];
}

// "Interviews held" — real HubSpot Meetings titled "(The Marketing Accelerator)" whose start
// time falls in the week AND has already passed at pull time (so a meeting booked for later
// this week doesn't count as held yet). Excludes Liv's own internal test bookings ("Liv x liv").
async function pullInterviewsHeld(startDate, endDate) {
  const key = fs.readFileSync(path.join(os.homedir(), '.hubspot_key'), 'utf8').trim();
  const res = await fetch('https://api.hubapi.com/crm/v3/objects/meetings/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterGroups: [{ filters: [
        { propertyName: 'hs_meeting_start_time', operator: 'BETWEEN', value: `${startDate}T00:00:00Z`, highValue: `${endDate}T23:59:59Z` },
      ] }],
      properties: ['hs_meeting_title', 'hs_meeting_start_time'],
      limit: 100,
    }),
  });
  if (!res.ok) throw new Error(`HubSpot meetings ${res.status}: ${await res.text()}`);
  const d = await res.json();
  const now = new Date();
  const held = (d.results || []).filter((m) => {
    const title = m.properties.hs_meeting_title || '';
    const start = m.properties.hs_meeting_start_time ? new Date(m.properties.hs_meeting_start_time) : null;
    return title.includes('Marketing Accelerator') && !/liv\s*x\s*liv/i.test(title) && start && start < now;
  });
  return { count: held.length, titles: held.map((m) => m.properties.hs_meeting_title) };
}

async function pullHubSpot(startDate, endDate) {
  const [arranging, scheduled, awaitingConfirmation, paid] = await Promise.all([
    hsWeeklyStageEntries(STAGE.arrangingInterview, startDate, endDate),
    hsWeeklyStageEntries(STAGE.interviewScheduled, startDate, endDate),
    hsCurrentlyInStageEnteredThisWeek(STAGE.interviewedAwaitingConfirmation, startDate, endDate),
    hsWeeklyStageEntries(STAGE.paid, startDate, endDate),
  ]);

  const acceptedSeen = new Map();
  [...arranging, ...scheduled, ...awaitingConfirmation].forEach((r) => acceptedSeen.set(r.id, r.properties.dealname));

  return {
    accepted: acceptedSeen.size,
    acceptedNames: [...acceptedSeen.values()],
    paid: paid.length,
    paidNames: paid.map((r) => r.properties.dealname),
  };
}

async function writeActuals(sheetsClient, actualCol, values) {
  const data = Object.entries(METRIC_ROW)
    .filter(([key]) => values[key] !== undefined && values[key] !== null)
    .map(([key, row]) => ({ range: `${TAB_NAME}!${actualCol}${row}`, values: [[values[key]]] }));
  if (!data.length) { console.log('Nothing to write.'); return; }
  await sheetsClient.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
    method: 'POST',
    data: { valueInputOption: 'USER_ENTERED', data },
  });
  console.log('Written:', JSON.stringify(data, null, 2));
}

async function main() {
  const [, , weekStartArg, mode] = process.argv;
  if (!weekStartArg) {
    console.error('Usage: node weekly-pull-v2.js YYYY-MM-DD [--write]');
    process.exit(1);
  }
  const weekStart = new Date(`${weekStartArg}T00:00:00Z`);
  const weekEnd = addDays(weekStart, 6);
  const startDate = iso(weekStart);
  const endDate = iso(weekEnd);
  const write = mode === '--write';

  console.log(`Pulling ${startDate} → ${endDate} (${weekLabelFor(weekStart)})...`);

  const [website, typeform, hubspot, interviewsHeld] = await Promise.all([
    pullGA4(startDate, endDate),
    pullTypeform(startDate, endDate),
    pullHubSpot(startDate, endDate),
    pullInterviewsHeld(startDate, endDate),
  ]);

  const result = {
    website,
    typeform: typeform.weeklyTypeformViews,
    starts: typeform.formStarts,
    applicants: typeform.applicants,
    accepted: hubspot.accepted,
    interviewsHeld: interviewsHeld.count,
    paid: hubspot.paid,
  };

  console.log('\nPulled:', JSON.stringify(result, null, 2));
  console.log('\nApplicant names:', typeform.applicantNames);
  console.log('Accepted names:', hubspot.acceptedNames);
  console.log('Interviews held:', interviewsHeld.titles);
  console.log('Paid names:', hubspot.paidNames);
  console.log(`\nTypeform cumulative visits now: ${typeform.cumulativeVisits} (baseline was ${typeform.prevCumulative})`);

  if (!write) {
    console.log('\nDry run — nothing written. Re-run with --write to commit.');
    return;
  }

  const sheetsClient = await getSheetsClient();
  const actualCol = await findActualColumn(sheetsClient, weekStart);
  console.log(`Writing into column ${actualCol}...`);
  await writeActuals(sheetsClient, actualCol, result);
  saveTypeformBaseline(typeform.cumulativeVisits, weekStart);
  console.log('Typeform baseline updated.');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
