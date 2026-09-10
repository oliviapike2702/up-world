const { JWT } = require('google-auth-library');
const os = require('os');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(os.homedir(), '.ga4_key.json');

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/script.projects'],
  });

  const token = await client.getAccessToken();
  const res = await fetch('https://script.googleapis.com/v1/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'TMA Launch Funnel Dashboard (test)' }),
  });
  const body = await res.json();
  console.log('HTTP', res.status);
  console.log(JSON.stringify(body, null, 2));
}

main().catch((e) => console.error('FAILED:', e.message));
