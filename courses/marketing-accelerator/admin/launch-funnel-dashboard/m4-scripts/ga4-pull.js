// M4 pull test — GA4 pageviews for the TMA landing page, current week.
// Usage: node ga4-pull.js <weekStartISO> <weekEndISO>
const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');
const PROPERTY_ID = '342528552';
const PAGE_PATH = '/the-marketing-accelerator';

async function main() {
  const [, , startDate, endDate] = process.argv;
  if (!startDate || !endDate) {
    console.error('Usage: node ga4-pull.js YYYY-MM-DD YYYY-MM-DD');
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: { matchType: 'EXACT', value: PAGE_PATH },
      },
    },
  };

  const res = await client.request({ url, method: 'POST', data: body });
  const rows = res.data.rows || [];
  const views = rows.length ? Number(rows[0].metricValues[0].value) : 0;
  console.log(JSON.stringify({
    source: 'GA4',
    property: PROPERTY_ID,
    pagePath: PAGE_PATH,
    dateRange: { startDate, endDate },
    websiteViews: views,
    rawRowCount: rows.length,
  }, null, 2));
}

main().catch((e) => {
  console.error('GA4 pull failed:', e.response ? JSON.stringify(e.response.data) : e.message);
  process.exit(1);
});
