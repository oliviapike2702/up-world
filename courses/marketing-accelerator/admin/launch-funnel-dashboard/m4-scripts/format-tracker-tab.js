const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const SHEET_ID = '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU';
const GRID_ID = 1119754560;
const NUM_WEEKS = 9;
const LAST_COL_INDEX = 21; // A=0 .. U=20, exclusive end = 21

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
  const requests = [];

  // Title row bold + bigger
  requests.push({ repeatCell: { range: gr(GRID_ID, 0, 1, 0, 1), cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } }, fields: 'userEnteredFormat.textFormat' } });

  // Section headers (TOTALS row 4 idx3, WEEKLY BREAKDOWN row 10 idx9) bold + shaded
  [3, 9].forEach((r) => {
    requests.push({ repeatCell: { range: gr(GRID_ID, r, r + 1, 0, LAST_COL_INDEX), cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.85, green: 0.85, blue: 0.9 } } }, fields: 'userEnteredFormat(textFormat,backgroundColor)' } });
  });

  // TOTALS header row (row 5, idx4) bold
  requests.push({ repeatCell: { range: gr(GRID_ID, 4, 5, 0, 4), cell: { userEnteredFormat: { textFormat: { bold: true } } }, fields: 'userEnteredFormat.textFormat' } });

  // Weekly breakdown header rows (11=idx10 week labels, 12=idx11 Target/Actual) bold
  requests.push({ repeatCell: { range: gr(GRID_ID, 10, 12, 0, LAST_COL_INDEX), cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.93, green: 0.93, blue: 0.96 } } }, fields: 'userEnteredFormat(textFormat,backgroundColor)' } });

  // Merge week label cells (row idx10) across each Target/Actual pair, cols starting at D (idx3)
  for (let i = 0; i < NUM_WEEKS; i++) {
    const startCol = 3 + i * 2;
    requests.push({ mergeCells: { range: gr(GRID_ID, 10, 11, startCol, startCol + 2), mergeType: 'MERGE_ALL' } });
  }

  // Overall target column (C, idx2) highlighted yellow for metric rows with a target
  const targetRows = [12, 14, 16, 18, 20, 22]; // idx for rows 13(website),15(typeform),17(starts),19(applicants),21(accepted),23(paid)
  targetRows.forEach((r) => {
    requests.push({ repeatCell: { range: gr(GRID_ID, r, r + 1, 2, 3), cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.95, blue: 0.6 }, textFormat: { bold: true } } }, fields: 'userEnteredFormat(backgroundColor,textFormat)' } });
  });
  // also TOTALS target column (B, idx1) rows 6-8 (idx5-7)
  requests.push({ repeatCell: { range: gr(GRID_ID, 5, 8, 1, 2), cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.95, blue: 0.6 }, textFormat: { bold: true } } }, fields: 'userEnteredFormat(backgroundColor,textFormat)' } });

  // Conversion rows italic + light grey
  const convRows = [13, 15, 17, 19, 21]; // idx for rows 14,16,18,20,22 (all conversion rows)
  convRows.forEach((r) => {
    requests.push({ repeatCell: { range: gr(GRID_ID, r, r + 1, 0, LAST_COL_INDEX), cell: { userEnteredFormat: { textFormat: { italic: true }, backgroundColor: { red: 0.97, green: 0.97, blue: 0.97 } } }, fields: 'userEnteredFormat(textFormat,backgroundColor)' } });
  });

  // Percent format for conversion actual/target cells across all week columns
  for (let i = 0; i < NUM_WEEKS; i++) {
    const startCol = 3 + i * 2;
    convRows.forEach((r) => {
      requests.push({ repeatCell: { range: gr(GRID_ID, r, r + 1, startCol, startCol + 2), cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.0%' } } }, fields: 'userEnteredFormat.numberFormat' } });
    });
  }
  requests.push({ repeatCell: { range: gr(GRID_ID, 5, 8, 3, 4), cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.0%' } } }, fields: 'userEnteredFormat.numberFormat' } });

  // Column widths: A wide, B wide, C medium, week cols narrower
  requests.push({ updateDimensionProperties: { range: { sheetId: GRID_ID, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 260 }, fields: 'pixelSize' } });
  requests.push({ updateDimensionProperties: { range: { sheetId: GRID_ID, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 260 }, fields: 'pixelSize' } });
  requests.push({ updateDimensionProperties: { range: { sheetId: GRID_ID, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 90 }, fields: 'pixelSize' } });
  requests.push({ updateDimensionProperties: { range: { sheetId: GRID_ID, dimension: 'COLUMNS', startIndex: 3, endIndex: LAST_COL_INDEX }, properties: { pixelSize: 70 }, fields: 'pixelSize' } });

  // Freeze first 3 columns and header rows up to row 12 (idx12, i.e. through Target/Actual header)
  requests.push({ updateSheetProperties: { properties: { sheetId: GRID_ID, gridProperties: { frozenColumnCount: 3, frozenRowCount: 12 } }, fields: 'gridProperties.frozenColumnCount,gridProperties.frozenRowCount' } });

  // Conditional formatting: green if Actual >= Target, red if Actual < Target, for each metric row w/ a target, across all week Actual columns. Auto-extends to future weeks by covering columns through U regardless of current data.
  const metricRowsWithTarget = [12, 14, 16, 18, 20, 22]; // idx rows: website, typeform, starts, applicants, accepted, paid
  metricRowsWithTarget.forEach((r) => {
    for (let i = 0; i < NUM_WEEKS; i++) {
      const targetColIdx = 3 + i * 2;
      const actualColIdx = targetColIdx + 1;
      const actualColLetter = String.fromCharCode(65 + actualColIdx);
      const targetColLetter = String.fromCharCode(65 + targetColIdx);
      const rowNum = r + 1; // 1-indexed for formula
      requests.push({
        addConditionalFormatRule: {
          rule: {
            ranges: [gr(GRID_ID, r, r + 1, actualColIdx, actualColIdx + 1)],
            booleanRule: {
              condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=AND(${actualColLetter}${rowNum}<>"",${actualColLetter}${rowNum}>=${targetColLetter}${rowNum})` }] },
              format: { backgroundColor: { red: 0.78, green: 0.94, blue: 0.78 } },
            },
          },
          index: 0,
        },
      });
      requests.push({
        addConditionalFormatRule: {
          rule: {
            ranges: [gr(GRID_ID, r, r + 1, actualColIdx, actualColIdx + 1)],
            booleanRule: {
              condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=AND(${actualColLetter}${rowNum}<>"",${actualColLetter}${rowNum}<${targetColLetter}${rowNum})` }] },
              format: { backgroundColor: { red: 0.96, green: 0.78, blue: 0.78 } },
            },
          },
          index: 0,
        },
      });
    }
  });

  const res = await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    method: 'POST',
    data: { requests },
  });
  console.log('Formatting applied.', requests.length, 'requests.');
}

main().catch((e) => {
  console.error('FAILED:', e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  process.exit(1);
});
