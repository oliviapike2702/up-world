// M4 pull — Typeform funnel numbers for the TMA Sept 2026 form.
// Usage: node typeform-pull.js
//
// FIXED 2026-07-30: this script used to read response counts from
// `insights/{form}/summary`, which reported responses_count: 0 while the form
// genuinely had 6 completed submissions (4 real applicants + 2 tests). Anything
// downstream — the funnel Sheet, the dashboard, the weekly report — would have
// shown zero applications while real people were applying.
//
// Response counts now come from `/forms/{form}/responses`, which is the source of
// truth. `insights/summary` is still used, but ONLY for visit counts (which the
// responses endpoint doesn't provide).
//
// Two things to know about the numbers this returns:
//  1. Visit counts are CUMULATIVE since form creation — there is no date-range
//     parameter. A weekly figure must be a delta: this week's cumulative minus
//     last week's stored cumulative.
//  2. Responses ARE date-filterable, so completed/partial counts below are true
//     weekly figures when a range is supplied.
const os = require('os');
const path = require('path');
const fs = require('fs');
// Node 18+ has a built-in global fetch — no need for node-fetch.
const TOKEN_PATH = path.join(os.homedir(), '.typeform_key');
const FORM_ID = 'Ve2btZwn';

// Test/internal submissions to exclude from real applicant counts.
const TEST_EMAIL_PATTERNS = [/@up-world\.co$/i, /oliviapike/i, /\+.*test/i, /^test/i];

function isTest(email, firstName) {
  if (!email && !firstName) return false;
  const hay = `${email || ''} ${firstName || ''}`;
  if (/^\s*test\s*$/i.test(firstName || '')) return true;
  return TEST_EMAIL_PATTERNS.some((re) => re.test(hay));
}

async function tf(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Typeform ${res.status} on ${url}: ${text}`);
  }
  return res.json();
}

function summarise(items) {
  return items.map((it) => {
    const answers = it.answers || [];
    const email = (answers.find((a) => a.type === 'email') || {}).email || null;
    const texts = answers.filter((a) => a.type === 'text').map((a) => a.text);
    return {
      email,
      firstName: texts[0] || null,
      lastName: texts[1] || null,
      submittedAt: it.submitted_at || null,
      landedAt: it.landed_at || null,
      isTest: isTest(email, texts[0]),
    };
  });
}

async function main() {
  const token = fs.readFileSync(TOKEN_PATH, 'utf8').trim();
  const [, , since, until] = process.argv; // optional YYYY-MM-DD range

  const range = [];
  if (since) range.push(`since=${since}T00:00:00Z`);
  if (until) range.push(`until=${until}T23:59:59Z`);
  const qs = (extra) => [`page_size=1000`, extra, ...range].filter(Boolean).join('&');

  const [done, partial, insights] = await Promise.all([
    tf(token, `https://api.typeform.com/forms/${FORM_ID}/responses?${qs('completed=true')}`),
    tf(token, `https://api.typeform.com/forms/${FORM_ID}/responses?${qs('completed=false')}`),
    tf(token, `https://api.typeform.com/insights/${FORM_ID}/summary`),
  ]);

  const completed = summarise(done.items || []);
  const partials = summarise(partial.items || []);
  const realCompleted = completed.filter((r) => !r.isTest);

  const platforms = (insights.form && insights.form.platforms) || [];
  const visits = platforms.reduce(
    (acc, p) => {
      acc.total += p.total_visits || 0;
      acc.unique += p.unique_visits || 0;
      return acc;
    },
    { total: 0, unique: 0 }
  );

  // Partials carry no email and no answers — they are a timestamp only, so they
  // are countable but NOT contactable. Do not treat them as chaseable leads.
  const contactablePartials = partials.filter((p) => p.email);

  console.log(JSON.stringify({
    source: 'Typeform',
    formId: FORM_ID,
    dateRange: since || until ? { since: since || null, until: until || null } : 'all time',
    completedTotal: done.total_items ?? completed.length,
    completedReal: realCompleted.length,
    completedTests: completed.length - realCompleted.length,
    partialsTotal: partial.total_items ?? partials.length,
    partialsContactable: contactablePartials.length,
    visitsCumulativeAllTime: visits,
    note: 'visits are cumulative since form creation — compute weekly as a delta',
    realApplicants: realCompleted,
    partials,
  }, null, 2));
}

main().catch((e) => {
  console.error('Typeform pull failed:', e.message);
  process.exit(1);
});
