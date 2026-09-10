const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU';
const GRID_ID = 1119754560;
const NUM_WEEKS = 9;

async function getClient() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  await client.authorize();
  return client;
}

function gr(sheetId, startRow, endRow, startCol, endCol) {
  return { sheetId, startRowIndex: startRow, endRowIndex: endRow, startColumnIndex: startCol, endColumnIndex: endCol };
}

async function main() {
  const client = await getClient();

  // 1. Clear every existing conditional format rule on this sheet
  const meta = await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets(properties(sheetId),conditionalFormats)`,
    method: 'GET',
  });
  const sheet = meta.data.sheets.find((s) => s.properties.sheetId === GRID_ID);
  const count = (sheet.conditionalFormats || []).length;
  const deleteRequests = [];
  for (let i = count - 1; i >= 0; i--) {
    deleteRequests.push({ deleteConditionalFormatRule: { sheetId: GRID_ID, index: i } });
  }
  if (deleteRequests.length) {
    await client.request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
      method: 'POST',
      data: { requests: deleteRequests },
    });
    console.log(`Cleared ${deleteRequests.length} existing rules.`);
  }

  // 2. Add graded bands: deep red / orange / amber / light green / deep green
  const bands = [
    { min: 1.15, max: null,  color: { red: 0.16, green: 0.55, blue: 0.22 } }, // deep green, comfortably ahead
    { min: 1.00, max: 1.15,  color: { red: 0.72, green: 0.88, blue: 0.72 } }, // light green, on/just above target
    { min: 0.85, max: 1.00,  color: { red: 1.00, green: 0.90, blue: 0.55 } }, // amber, close miss
    { min: 0.60, max: 0.85,  color: { red: 0.96, green: 0.70, blue: 0.42 } }, // orange, real miss
    { min: null, max: 0.60,  color: { red: 0.80, green: 0.24, blue: 0.24 } }, // deep red, well short
  ];

  const metricRowsWithTarget = [12, 14, 16, 18, 20, 22]; // 0-indexed rows: website, typeform, starts, applicants, accepted, paid
  const WEEK_START_COL = 3; // D, 0-indexed

  const addRequests = [];
  metricRowsWithTarget.forEach((r) => {
    const rowNum = r + 1;
    for (let i = 0; i < NUM_WEEKS; i++) {
      const targetColIdx = WEEK_START_COL + i * 2;
      const actualColIdx = targetColIdx + 1;
      const actualColLetter = String.fromCharCode(65 + actualColIdx);
      const targetColLetter = String.fromCharCode(65 + targetColIdx);
      const ratio = `(${actualColLetter}${rowNum}/${targetColLetter}${rowNum})`;
      const hasData = `AND(${actualColLetter}${rowNum}<>"",${targetColLetter}${rowNum}<>"",${targetColLetter}${rowNum}<>0)`;

      bands.forEach((band) => {
        const bounds = [];
        if (band.min !== null) bounds.push(`${ratio}>=${band.min}`);
        if (band.max !== null) bounds.push(`${ratio}<${band.max}`);
        const formula = `=AND(${hasData},${bounds.join(',')})`;
        addRequests.push({
          addConditionalFormatRule: {
            rule: {
              ranges: [gr(GRID_ID, r, r + 1, actualColIdx, actualColIdx + 1)],
              booleanRule: {
                condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: formula }] },
                format: { backgroundColor: band.color },
              },
            },
            index: 0,
          },
        });
      });
    }
  });

  await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    method: 'POST',
    data: { requests: addRequests },
  });
  console.log(`Added ${addRequests.length} graded rules.`);
}

main().catch((e) => {
  console.error('FAILED:', e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
