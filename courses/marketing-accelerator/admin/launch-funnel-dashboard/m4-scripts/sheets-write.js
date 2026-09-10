// RETIRED 25 Aug 2026 — this Sheet is retired (title renamed "RETIRED — see Project Plan >
// Funnel Tracker tab", banner added). Use weekly-pull-v2.js instead, which writes into the
// new "Funnel Tracker" tab inside the Project Plan sheet. Left in place for reference only.
//
// M4 write mechanism — authenticate as the GA4/Sheets service account and write actuals
// into the existing TMA Launch Funnel Tracker Sheet's first tab ("Untitled" per M3's build
// notes — Liv may rename it to "Weekly Tracker" by hand, script does not depend on the name
// beyond this constant).
//
// UNBLOCKED 2026-07-19 — Liv enabled the Sheets API and shared the Sheet with the service
// account as Editor. Live-verified: read + write both confirmed working (row 5, w/c 20 Jul
// 2026, written with real GA4/Typeform pulls — all genuine zeros, no traffic yet).
//
// Column map (read live off the real header row, 2026-07-19 — do not assume, this was wrong
// in an earlier draft of this script which guessed a contiguous E:O range):
//   A launch_id | B Launch | C Week (w/c) | D Phase
//   E Website views ACTUAL   | F Website views TARGET
//   G Typeform views ACTUAL  | H Typeform views TARGET
//   I Form starts ACTUAL     | J Form starts TARGET
//   K Applicants ACTUAL      | L Applicants TARGET
//   M Booked calls ACTUAL (no target column)
//   N Accepted ACTUAL        | O Accepted TARGET
//   P Paid ACTUAL            | Q Paid TARGET (weekly) | R Paid cum TARGET | S Paid cum % goal
// Data rows 5-14 = the 10 tracker weeks (w/c 20 Jul 2026 -> w/c 22 Sep 2026), matched by the
// literal "w/c D MMM YYYY" text stored in column C — NOT an ISO date, so the pull script must
// format its target week the same way before matching.
const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE';
const TAB_NAME = 'Untitled';
const ACTUAL_COLS = { websiteViews: 'E', typeformViews: 'G', formStarts: 'I', applicants: 'K', bookedCalls: 'M', accepted: 'N', paid: 'P' };

function formatWeekLabel(date) {
  // Matches the sheet's literal format, e.g. "w/c 20 Jul 2026"
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `w/c ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function getClient() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  return new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function tryRead(client) {
  const range = `${TAB_NAME}!A1:S20`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await client.request({ url, method: 'GET' });
  console.log('READ OK. Rows 1-20:');
  console.log(JSON.stringify(res.data.values || res.data, null, 2));
}

// actuals: any subset of the ACTUAL_COLS keys. Only keys present are written — a metric that
// genuinely wasn't queried this run is left untouched (never overwritten with a fabricated
// value, and never blanked out if an earlier pull already populated it this week).
async function writeWeekRow(client, weekStartDate, actuals) {
  const weekLabel = formatWeekLabel(weekStartDate);

  const findRange = `${TAB_NAME}!C5:C14`;
  const findUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(findRange)}`;
  const findRes = await client.request({ url: findUrl, method: 'GET' });
  const weekCol = (findRes.data.values || []).map((r) => (r[0] || '').trim());
  const idx = weekCol.findIndex((v) => v === weekLabel);
  if (idx === -1) {
    throw new Error(`No row found for week label "${weekLabel}" in ${findRange}. Sheet has: ${JSON.stringify(weekCol)}`);
  }
  const row = 5 + idx;

  const data = Object.entries(actuals)
    .filter(([key]) => ACTUAL_COLS[key])
    .map(([key, value]) => ({
      range: `${TAB_NAME}!${ACTUAL_COLS[key]}${row}`,
      values: [[value]],
    }));

  if (!data.length) {
    console.log('No actuals provided — nothing to write.');
    return;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`;
  const res = await client.request({
    url,
    method: 'POST',
    data: { valueInputOption: 'USER_ENTERED', data },
  });
  console.log(`WRITE OK for ${weekLabel} (row ${row}):`, JSON.stringify(res.data, null, 2));
}

async function main() {
  const mode = process.argv[2] || 'read';
  const client = await getClient();
  if (mode === 'read') {
    await tryRead(client);
  } else if (mode === 'write') {
    // Real numbers only — wire in the actual GA4/Typeform/HubSpot pull results here before
    // running for real. This example call intentionally writes only the metrics actually
    // pulled live in the accompanying test run (all real, mostly-zero results).
    await writeWeekRow(client, new Date('2026-07-20'), {
      websiteViews: 0, typeformViews: 0, formStarts: 0, applicants: 0, bookedCalls: 0, accepted: 0, paid: 0,
    });
  } else {
    console.error('Usage: node sheets-write.js [read|write]');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Sheets call failed:');
  console.error(e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
