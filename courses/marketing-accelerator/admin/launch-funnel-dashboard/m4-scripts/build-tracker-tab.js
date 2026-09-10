const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU';
const TAB_NAME = 'Funnel Tracker';

const weeks = [
  { label: 'w/c 3 Aug', phase: 'doors open',        website:{a:383,t:536}, typeform:{a:60,t:192}, starts:{a:29,t:105}, applicants:{a:5,t:21},  accepted:{a:0,t:5}, paid:{a:1,t:0} },
  { label: 'w/c 10 Aug', phase: 'selling',           website:{a:500,t:649}, typeform:{a:25,t:232}, starts:{a:13,t:128}, applicants:{a:10,t:26}, accepted:{a:2,t:6}, paid:{a:1,t:0} },
  { label: 'w/c 17 Aug', phase: 'selling',           website:{a:553,t:628}, typeform:{a:63,t:225}, starts:{a:48,t:124}, applicants:{a:15,t:25}, accepted:{a:0,t:5}, paid:{a:3,t:1} },
  { label: 'w/c 24 Aug', phase: 'talk build-up',     website:{a:null,t:446}, typeform:{a:null,t:160}, starts:{a:null,t:88}, applicants:{a:null,t:18}, accepted:{a:null,t:4}, paid:{a:null,t:2} },
  { label: 'w/c 31 Aug', phase: "talk week (Wed 2)", website:{a:null,t:292}, typeform:{a:null,t:104}, starts:{a:null,t:57}, applicants:{a:null,t:11}, accepted:{a:null,t:2}, paid:{a:null,t:3} },
  { label: 'w/c 7 Sep', phase: 'post-talk convert', website:{a:null,t:182}, typeform:{a:null,t:65}, starts:{a:null,t:36}, applicants:{a:null,t:7}, accepted:{a:null,t:2}, paid:{a:null,t:5} },
  { label: 'w/c 14 Sep', phase: 'external deadline', website:{a:null,t:522}, typeform:{a:null,t:187}, starts:{a:null,t:103}, applicants:{a:null,t:21}, accepted:{a:null,t:4}, paid:{a:null,t:6} },
  { label: 'w/c 21 Sep', phase: 'internal deadline', website:{a:null,t:275}, typeform:{a:null,t:98}, starts:{a:null,t:53}, applicants:{a:null,t:10}, accepted:{a:null,t:1}, paid:{a:null,t:6} },
  { label: 'w/c 28 Sep', phase: 'kickoff (Wed 30)',  website:{a:null,t:0}, typeform:{a:null,t:0}, starts:{a:null,t:0}, applicants:{a:null,t:0}, accepted:{a:null,t:0}, paid:{a:null,t:2} },
];

const WINDOW = { website: 3530, typeform: 1263, starts: 694, applicants: 139, accepted: 29, paid: 25 };

const DASHBOARD_URL = 'https://script.google.com/a/macros/up-world.co/s/AKfycbwhe-dZxFYLxCG2H77p9JtpHVMb69-8YmCZI51sJJTPXXVR95wot_6dPv_M79ExQUUq0g/exec';
const GA4_HOWTO = 'GA4 (TMA landing page, unique views)';
const TYPEFORM_HOWTO = 'Typeform analytics (page views)';
const STARTS_HOWTO = 'Typeform analytics (form starts)';
const APPLICANTS_HOWTO = 'Typeform / HubSpot (completed submissions)';
const ACCEPTED_HOWTO = 'HubSpot: Arranging interview + Interview scheduled + Interviewed — Awaiting Confirmation';
const PAID_HOWTO = 'HubSpot: entered Paid this week';

async function getClient() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  await client.authorize();
  return client;
}

function colLetter(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

const WEEK_START_COL = 4; // D
function weekTargetCol(i) { return colLetter(WEEK_START_COL + i * 2); }
function weekActualCol(i) { return colLetter(WEEK_START_COL + i * 2 + 1); }
const LAST_COL = colLetter(WEEK_START_COL + weeks.length * 2 - 1); // U

async function main() {
  const client = await getClient();

  const addSheetRes = await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    method: 'POST',
    data: { requests: [{ addSheet: { properties: { title: TAB_NAME, gridProperties: { rowCount: 25, columnCount: 25 } } } }] },
  });
  const newSheetId = addSheetRes.data.replies[0].addSheet.properties.sheetId;
  console.log('Created sheet', TAB_NAME, 'id', newSheetId);

  const rows = {};
  const set = (r, c, v) => { rows[r] = rows[r] || []; rows[r][c - 1] = v; };

  set(1, 1, 'The Marketing Accelerator — Funnel Tracker');
  set(2, 1, `Dashboard: ${DASHBOARD_URL}`);

  set(4, 1, 'TOTALS (window: 3 Aug – 28 Sep 2026)');
  set(5, 1, 'Description'); set(5, 2, 'Target (window)'); set(5, 3, 'Actual so far'); set(5, 4, '% to target');

  const actualCols = weeks.map((w, i) => weekActualCol(i));
  const sumActual = (row) => `=${actualCols.map((c) => `${c}${row}`).join('+')}`;

  set(6, 1, 'Applications completed'); set(6, 2, WINDOW.applicants); set(6, 3, sumActual(19)); set(6, 4, '=IF(B6=0,"",C6/B6)');
  set(7, 1, 'Accepted to interview'); set(7, 2, WINDOW.accepted); set(7, 3, sumActual(21)); set(7, 4, '=IF(B7=0,"",C7/B7)');
  set(8, 1, 'Paid'); set(8, 2, WINDOW.paid); set(8, 3, sumActual(23)); set(8, 4, '=IF(B8=0,"",C8/B8)');

  set(10, 1, 'WEEKLY BREAKDOWN');
  set(11, 1, 'Metric'); set(11, 2, 'How to find it'); set(11, 3, 'Overall target');
  weeks.forEach((w, i) => { set(11, WEEK_START_COL + i * 2, `${w.label} (${w.phase})`); });
  weeks.forEach((w, i) => { set(12, WEEK_START_COL + i * 2, 'Target'); set(12, WEEK_START_COL + i * 2 + 1, 'Actual'); });

  const ROW = { website: 13, convVT: 14, typeform: 15, convTS: 16, starts: 17, convSA: 18, applicants: 19, convAAc: 20, accepted: 21, convAcP: 22, paid: 23 };

  set(ROW.website, 1, 'Website views'); set(ROW.website, 2, GA4_HOWTO); set(ROW.website, 3, WINDOW.website);
  set(ROW.convVT, 1, '↳ conversion: website views → Typeform'); set(ROW.convVT, 2, '');
  set(ROW.typeform, 1, 'Typeform views'); set(ROW.typeform, 2, TYPEFORM_HOWTO); set(ROW.typeform, 3, WINDOW.typeform);
  set(ROW.convTS, 1, '↳ conversion: Typeform → form starts'); set(ROW.convTS, 2, '');
  set(ROW.starts, 1, 'Form starts'); set(ROW.starts, 2, STARTS_HOWTO); set(ROW.starts, 3, WINDOW.starts);
  set(ROW.convSA, 1, '↳ conversion: form starts → applicants'); set(ROW.convSA, 2, '');
  set(ROW.applicants, 1, 'Applicants'); set(ROW.applicants, 2, APPLICANTS_HOWTO); set(ROW.applicants, 3, WINDOW.applicants);
  set(ROW.convAAc, 1, '↳ conversion: applicants → accepted to interview'); set(ROW.convAAc, 2, '');
  set(ROW.accepted, 1, 'Accepted to interview'); set(ROW.accepted, 2, ACCEPTED_HOWTO); set(ROW.accepted, 3, WINDOW.accepted);
  set(ROW.convAcP, 1, '↳ conversion: accepted to interview → paid'); set(ROW.convAcP, 2, '');
  set(ROW.paid, 1, 'Paid'); set(ROW.paid, 2, PAID_HOWTO); set(ROW.paid, 3, WINDOW.paid);

  weeks.forEach((w, i) => {
    const tCol = weekTargetCol(i); const aCol = weekActualCol(i);
    const tColNum = WEEK_START_COL + i * 2; const aColNum = tColNum + 1;
    set(ROW.website, tColNum, w.website.t); set(ROW.website, aColNum, w.website.a);
    set(ROW.typeform, tColNum, w.typeform.t); set(ROW.typeform, aColNum, w.typeform.a);
    set(ROW.starts, tColNum, w.starts.t); set(ROW.starts, aColNum, w.starts.a);
    set(ROW.applicants, tColNum, w.applicants.t); set(ROW.applicants, aColNum, w.applicants.a);
    set(ROW.accepted, tColNum, w.accepted.t); set(ROW.accepted, aColNum, w.accepted.a);
    set(ROW.paid, tColNum, w.paid.t); set(ROW.paid, aColNum, w.paid.a);

    const wsA = `${aCol}${ROW.website}`, wsT = `${tCol}${ROW.website}`;
    const tfA = `${aCol}${ROW.typeform}`, tfT = `${tCol}${ROW.typeform}`;
    const stA = `${aCol}${ROW.starts}`, stT = `${tCol}${ROW.starts}`;
    const apA = `${aCol}${ROW.applicants}`, apT = `${tCol}${ROW.applicants}`;
    const acA = `${aCol}${ROW.accepted}`, acT = `${tCol}${ROW.accepted}`;
    const pdA = `${aCol}${ROW.paid}`, pdT = `${tCol}${ROW.paid}`;

    set(ROW.convVT, tColNum, `=IF(OR(${wsT}="",${wsT}=0),"",${tfT}/${wsT})`);
    set(ROW.convVT, aColNum, `=IF(OR(${wsA}="",${wsA}=0),"",${tfA}/${wsA})`);
    set(ROW.convTS, tColNum, `=IF(OR(${tfT}="",${tfT}=0),"",${stT}/${tfT})`);
    set(ROW.convTS, aColNum, `=IF(OR(${tfA}="",${tfA}=0),"",${stA}/${tfA})`);
    set(ROW.convSA, tColNum, `=IF(OR(${stT}="",${stT}=0),"",${apT}/${stT})`);
    set(ROW.convSA, aColNum, `=IF(OR(${stA}="",${stA}=0),"",${apA}/${stA})`);
    set(ROW.convAAc, tColNum, `=IF(OR(${apT}="",${apT}=0),"",${acT}/${apT})`);
    set(ROW.convAAc, aColNum, `=IF(OR(${apA}="",${apA}=0),"",${acA}/${apA})`);
    set(ROW.convAcP, tColNum, `=IF(OR(${acT}="",${acT}=0),"",${pdT}/${acT})`);
    set(ROW.convAcP, aColNum, `=IF(OR(${acA}="",${acA}=0),"",${pdA}/${acA})`);
  });

  const data = [];
  for (const [rowNum, arr] of Object.entries(rows)) {
    const values = arr.map((v) => (v === undefined ? '' : v));
    data.push({ range: `${TAB_NAME}!A${rowNum}:${LAST_COL}${rowNum}`, values: [values] });
  }

  await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`,
    method: 'POST',
    data: { valueInputOption: 'USER_ENTERED', data },
  });
  console.log('Values written.');
  console.log(JSON.stringify({ newSheetId }, null, 2));
}

main().catch((e) => {
  console.error('FAILED:', e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
