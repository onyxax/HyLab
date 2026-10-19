import { Pool, type PoolClient } from 'pg';
import {
  type DayPoint,
  type Incident,
  type MonthRollup,
  type ProbeSample,
  type RunMeta,
  type ServiceStat,
  type UptimeStore,
  emptyDay,
  utcDayKey,
} from './types';

/**
 * Postgres-backed uptime store (Supabase).
 *
 * Everything is real and permanent: daily aggregates per service, a run
 * log of every probe batch, and an incident log with open/close windows.
 * The connecting role (`hylab_status`) only has INSERT/SELECT/UPDATE on
 * the `hylab_status` schema — it cannot touch anything else.
 */

const SCHEMA = 'hylab_status';

let pool: Pool | null = null;
let poolFailed = false;

export function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  return url && url.trim() ? url.trim() : null;
}

function getPool(): Pool | null {
  if (poolFailed) return null;
  const url = databaseUrl();
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      // Serverless: one connection per warm instance is enough.
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    pool.on('error', () => {
      /* idle client errors are recoverable — pg will re-create the socket */
    });
  }
  return pool;
}

async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const p = getPool();
  if (!p) throw new Error('DATABASE_URL not configured');
  const client = await p.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

const UPSERT_DAILY = `
insert into ${SCHEMA}.daily (service, day, ok_count, fail_count, ms_sum, ms_max, last_fail_at)
values ($1, $2::date, $3, $4, $5, $6, $7)
on conflict (service, day) do update set
  ok_count     = ${SCHEMA}.daily.ok_count + excluded.ok_count,
  fail_count   = ${SCHEMA}.daily.fail_count + excluded.fail_count,
  ms_sum       = ${SCHEMA}.daily.ms_sum + excluded.ms_sum,
  ms_max       = greatest(${SCHEMA}.daily.ms_max, excluded.ms_max),
  last_fail_at = greatest(${SCHEMA}.daily.last_fail_at, excluded.last_fail_at),
  updated_at   = now()
`;

const OPEN_INCIDENT = `
insert into ${SCHEMA}.incidents (service, started_at, fail_count, detail)
select $1, now(), 1, $2
where not exists (
  select 1 from ${SCHEMA}.incidents where service = $1 and ended_at is null
)
`;

const COUNT_INCIDENT = `
update ${SCHEMA}.incidents
set fail_count = fail_count + 1, detail = $2
where service = $1 and ended_at is null
`;

const CLOSE_INCIDENT = `
update ${SCHEMA}.incidents
set ended_at = now()
where service = $1 and ended_at is null
`;

const INSERT_RUN = `
insert into ${SCHEMA}.runs (ran_at, status, avg_ms, ok_count, fail_count, services)
values ($1, $2, $3, $4, $5, $6::jsonb)
`;

const PRUNE_RUNS = `delete from ${SCHEMA}.runs where ran_at < now() - interval '30 days'`;

async function record(samples: ProbeSample[], run?: RunMeta): Promise<void> {
  const day = utcDayKey();
  const now = new Date().toISOString();

  await withClient(async c => {
    await c.query('begin');
    try {
      for (const s of samples) {
        await c.query(UPSERT_DAILY, [
          s.service,
          day,
          s.ok ? 1 : 0,
          s.ok ? 0 : 1,
          s.ms,
          s.ms,
          s.ok ? null : now,
        ]);

        if (s.ok) {
          await c.query(CLOSE_INCIDENT, [s.service]);
        } else {
          await c.query(OPEN_INCIDENT, [s.service, s.detail ?? null]);
          await c.query(COUNT_INCIDENT, [s.service, s.detail ?? null]);
        }
      }

      if (run) {
        await c.query(INSERT_RUN, [
          now,
          run.status,
          run.avgMs,
          samples.filter(s => s.ok).length,
          samples.filter(s => !s.ok).length,
          JSON.stringify(run.services ?? samples),
        ]);
        await c.query(PRUNE_RUNS);
      }

      await c.query('commit');
    } catch (err) {
      await c.query('rollback').catch(() => {});
      throw err;
    }
  });
}

async function daily(days: number): Promise<DayPoint[]> {
  const rows = await withClient(async c => {
    const res = await c.query<{
      date: string;
      ok: number;
      fail: number;
      ms_sum: string;
      ms_max: number;
    }>(
      `
      select to_char(day, 'YYYY-MM-DD') as date,
             sum(ok_count)::int   as ok,
             sum(fail_count)::int as fail,
             sum(ms_sum)::bigint  as ms_sum,
             max(ms_max)::int     as ms_max
      from ${SCHEMA}.daily
      where day >= (current_date - ($1::int - 1) * interval '1 day')
      group by day
      order by day
      `,
      [days]
    );
    return res.rows;
  });

  const map = new Map<string, DayPoint>();
  for (const r of rows) {
    const samples = r.ok + r.fail;
    map.set(r.date, {
      date: r.date,
      ok: r.ok,
      fail: r.fail,
      samples,
      avgMs: samples ? Math.round(Number(r.ms_sum) / samples) : 0,
      uptime: samples ? Math.round((r.ok / samples) * 1000) / 10 : null,
    });
  }

  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = utcDayKey(d);
    out.push(map.get(key) ?? emptyDay(key));
  }
  return out;
}

async function monthly(months: number): Promise<MonthRollup[]> {
  const rows = await withClient(async c => {
    const res = await c.query<{ month: string; ok: number; fail: number; ms_sum: string }>(
      `
      select to_char(date_trunc('month', day), 'YYYY-MM') as month,
             sum(ok_count)::int   as ok,
             sum(fail_count)::int as fail,
             sum(ms_sum)::bigint  as ms_sum
      from ${SCHEMA}.daily
      where day >= (date_trunc('month', current_date) - ($1::int - 1) * interval '1 month')
      group by 1
      order by 1
      `,
      [months]
    );
    return res.rows;
  });

  const byMonth = new Map(rows.map(r => [r.month, r]));
  const out: MonthRollup[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const ref = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${ref.getUTCFullYear()}-${String(ref.getUTCMonth() + 1).padStart(2, '0')}`;
    const row = byMonth.get(key);
    const samples = row ? row.ok + row.fail : 0;
    out.push({
      month: key,
      ok: row?.ok ?? 0,
      fail: row?.fail ?? 0,
      avgMs: samples ? Math.round(Number(row!.ms_sum) / samples) : 0,
      uptime: samples ? Math.round((row!.ok / samples) * 1000) / 10 : null,
    });
  }
  return out;
}

async function incidents(limit = 20): Promise<Incident[]> {
  const rows = await withClient(async c => {
    const res = await c.query<{
      date: string;
      service: string;
      ok: number;
      fail: number;
      worst_ms: number;
      last_fail: Date | null;
      started_at: Date;
      ended_at: Date | null;
      fail_count: number;
    }>(
      `
      select to_char(i.started_at at time zone 'utc', 'YYYY-MM-DD') as date,
             i.service,
             coalesce(d.ok_count, 0)::int    as ok,
             i.fail_count::int              as fail,
             coalesce(d.ms_max, 0)::int      as worst_ms,
             d.last_fail_at                 as last_fail,
             i.started_at,
             i.ended_at
      from ${SCHEMA}.incidents i
      left join ${SCHEMA}.daily d
        on d.service = i.service
       and d.day = (i.started_at at time zone 'utc')::date
      order by i.started_at desc
      limit $1
      `,
      [limit]
    );
    return res.rows;
  });

  return rows.map(r => ({
    date: r.date,
    service: r.service,
    ok: r.ok,
    fail: r.fail_count ?? r.fail,
    worstMs: r.worst_ms,
    lastFail: r.last_fail ? new Date(r.last_fail).getTime() : null,
    startedAt: new Date(r.started_at).getTime(),
    endedAt: r.ended_at ? new Date(r.ended_at).getTime() : null,
    ongoing: !r.ended_at,
  }));
}

async function uptime(days: number): Promise<number | null> {
  const points = await daily(days);
  const ok = points.reduce((a, d) => a + d.ok, 0);
  const fail = points.reduce((a, d) => a + d.fail, 0);
  if (!ok && !fail) return null;
  return Math.round((ok / (ok + fail)) * 1000) / 10;
}

async function serviceStats(days: number): Promise<ServiceStat[]> {
  const rows = await withClient(async c => {
    const res = await c.query<{ service: string; ok: number; fail: number; ms_sum: string }>(
      `
      select service,
             sum(ok_count)::int   as ok,
             sum(fail_count)::int as fail,
             sum(ms_sum)::bigint  as ms_sum
      from ${SCHEMA}.daily
      where day >= (current_date - ($1::int - 1) * interval '1 day')
      group by service
      order by service
      `,
      [days]
    );
    return res.rows;
  });

  return rows.map(r => {
    const samples = r.ok + r.fail;
    return {
      service: r.service,
      ok: r.ok,
      fail: r.fail,
      samples,
      avgMs: samples ? Math.round(Number(r.ms_sum) / samples) : 0,
      uptime: samples ? Math.round((r.ok / samples) * 1000) / 10 : null,
    };
  });
}

async function hasData(): Promise<boolean> {
  const rows = await withClient(async c => {
    const res = await c.query('select 1 from ' + SCHEMA + '.daily limit 1');
    return res.rows;
  });
  return rows.length > 0;
}

export const postgresStore: UptimeStore = {
  backend: 'postgres',
  record,
  daily,
  monthly,
  incidents,
  uptime,
  serviceStats,
  hasData,
};

/** Close the pool (used by scripts and tests). */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end().catch(() => {});
    pool = null;
  }
}
