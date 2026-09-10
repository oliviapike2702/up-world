/**
 * Project Plan web app — reads Liv's real project-tracker sheets and lets her
 * edit status directly (dropdown) and mark items done, writing straight back
 * to the source sheet. No Anthropic connector involved — this runs entirely
 * under Liv's own Google account once she deploys it.
 *
 * Sheets are read by HEADER NAME, not fixed column letters, so this survives
 * someone adding/reordering a column later. Rows are matched for writes by
 * (sheetKey, phase, task) — a natural composite key, since these trackers
 * don't have a dedicated ID column and we're not adding one for this build.
 */

const SHEETS = [
  {
    key: 'tma',
    label: 'Marketing Accelerator',
    id: '1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU',
    // TMA sheet has one clean header row: Phase | Task | Owner | When | Status | Link | Jul..Dec | Depends on / Notes
  },
  {
    key: 'bmbc',
    label: 'Brand Manager Bootcamp',
    id: '1rNqvrhukDBW9KF71cISa2cXP-bvGC3aZAPNJEJoAnXA',
    // BMBC sheet is messier: several stacked mini-tables, task text in column A,
    // section-divider rows marked "[merged] SECTION NAME". Handled defensively below.
  },
];

const STATUS_OPTIONS = ['Not started', 'Working on it', 'Partly done', 'Awaiting approval', 'Done'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Project Plan')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Returns { tasks: [...], generatedAt } for the web page to render. */
function getPlanData() {
  const tasks = [];
  SHEETS.forEach(function (cfg) {
    try {
      tasks.push.apply(tasks, readSheetTasks(cfg));
    } catch (e) {
      tasks.push({
        sheetKey: cfg.key,
        sheetLabel: cfg.label,
        phase: 'ERROR',
        task: 'Could not read this sheet: ' + e.message,
        owner: '',
        when: '',
        status: '',
        notes: '',
        error: true,
      });
    }
  });
  return { tasks: tasks, generatedAt: new Date().toISOString() };
}

function readSheetTasks(cfg) {
  const ss = SpreadsheetApp.openById(cfg.id);
  const sheet = ss.getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (values.length === 0) return [];

  const header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
  const col = {
    task: findCol(header, ['task']),
    phase: findCol(header, ['phase']),
    owner: findCol(header, ['owner', 'who']),
    when: findCol(header, ['when', 'due date', 'due']),
    status: findCol(header, ['status']),
    notes: findCol(header, ['depends on / notes', 'notes']),
  };

  const results = [];
  let currentPhase = '';

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const rawFirstCell = String(row[0] || '').trim();

    // Section-divider rows (BMBC-style): first cell starts with "[merged]" and
    // most of the row is otherwise empty — treat as a phase label, not a task.
    if (rawFirstCell.indexOf('[merged]') === 0) {
      currentPhase = rawFirstCell.replace('[merged]', '').trim();
      continue;
    }

    const taskCell = col.task >= 0 ? row[col.task] : row[0];
    const task = String(taskCell || '').trim();
    const owner = col.owner >= 0 ? String(row[col.owner] || '').trim() : '';
    const status = col.status >= 0 ? String(row[col.status] || '').trim() : '';

    // Skip genuinely blank rows and header-only rows.
    if (!task || (!owner && !status)) continue;

    const phase = col.phase >= 0 ? String(row[col.phase] || '').trim() || currentPhase : currentPhase;

    results.push({
      sheetKey: cfg.key,
      sheetLabel: cfg.label,
      phase: phase,
      task: task,
      owner: owner,
      when: col.when >= 0 ? String(row[col.when] || '').trim() : '',
      status: status,
      notes: col.notes >= 0 ? String(row[col.notes] || '').trim() : '',
    });
  }
  return results;
}

function findCol(headerRow, candidates) {
  for (let i = 0; i < headerRow.length; i++) {
    for (let c = 0; c < candidates.length; c++) {
      if (headerRow[i] === candidates[c]) return i;
    }
  }
  return -1;
}

/**
 * Updates the Status cell for one task, matched by (sheetKey, phase, task).
 * Returns { ok: true } or { ok: false, message } — never throws to the client.
 */
function updateTaskStatus(sheetKey, phase, task, newStatus) {
  const cfg = SHEETS.filter(function (s) { return s.key === sheetKey; })[0];
  if (!cfg) return { ok: false, message: 'Unknown sheet: ' + sheetKey };

  try {
    const ss = SpreadsheetApp.openById(cfg.id);
    const sheet = ss.getSheets()[0];
    const values = sheet.getDataRange().getValues();
    const header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
    const col = {
      task: findCol(header, ['task']),
      phase: findCol(header, ['phase']),
      status: findCol(header, ['status']),
    };
    if (col.status < 0) return { ok: false, message: 'No Status column found in ' + cfg.label };

    let currentPhase = '';
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const rawFirstCell = String(row[0] || '').trim();
      if (rawFirstCell.indexOf('[merged]') === 0) {
        currentPhase = rawFirstCell.replace('[merged]', '').trim();
        continue;
      }
      const rowTask = String((col.task >= 0 ? row[col.task] : row[0]) || '').trim();
      const rowPhase = col.phase >= 0 ? String(row[col.phase] || '').trim() || currentPhase : currentPhase;

      if (rowTask === task && rowPhase === phase) {
        sheet.getRange(r + 1, col.status + 1).setValue(newStatus);
        return { ok: true };
      }
    }
    return { ok: false, message: 'Could not find that row anymore — the sheet may have changed. Refresh and try again.' };
  } catch (e) {
    return { ok: false, message: 'Write failed: ' + e.message };
  }
}

function markDone(sheetKey, phase, task) {
  return updateTaskStatus(sheetKey, phase, task, 'Done');
}
