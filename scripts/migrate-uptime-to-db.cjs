/**
 * One-off import: move the local `.data/uptime.json` history into the
 * Postgres store so no recorded probe is lost when switching backends.
 *
 * Usage: node scripts/migrate-uptime-to-db.cjs
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function readEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = { ...readEnvFile(path.join(process.cwd(), '.env.local')), ...process.env };
const url = env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL missing — set it in .env.local');
  process.exit(1);
}

const SRC = path.join(process.cwd(), '.data', 'uptime.json');
if (!fs.existsSync(SRC)) {
  console.error('No .data/uptime.json found — nothing to import.');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const rows = [];
for (const [service, days] of Object.entries(data.services || {})) {
  for (const [day, b] of Object.entries(days)) {
    rows.push({ service, day, ...b });
  }
}

(async () => {
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  try {
    await client.query('begin');
    for (const r of rows) {
      await client.query(
        `insert into hylab_status.daily (service, day, ok_count, fail_count, ms_sum, ms_max, last_fail_at)
         values ($1, $2::date, $3, $4, $5, $6, $7)
         on conflict (service, day) do update set
           ok_count = excluded.ok_count,
           fail_count = excluded.fail_count,
           ms_sum = excluded.ms_sum,
           ms_max = excluded.ms_max,
           last_fail_at = excluded.last_fail_at,
           updated_at = now()`,
        [r.service, r.day, r.ok, r.fail, r.msSum, r.msMax, r.lastFail ? new Date(r.lastFail).toISOString() : null]
      );
    }
    await client.query('commit');
    console.log(`Imported ${rows.length} day buckets into hylab_status.daily`);
  } catch (e) {
    await client.query('rollback').catch(() => {});
    console.error('Import failed:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
})();
