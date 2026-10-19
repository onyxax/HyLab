import { promises as fs } from 'fs';
import path from 'path';
import {
  type DayPoint,
  type Incident,
  type MonthRollup,
  type ProbeSample,
  type RunMeta,
  type ServiceStat,
  type UptimeStore,
  utcDayKey,
} from './types';

/**
 * Local-file uptime store — the development fallback used when no
 * DATABASE_URL is configured. Same shape as the Postgres store, but the
 * data lives in `.data/uptime.json` on this machine only.
 */

interface DayBucket {
  date: string;
  ok: number;
  fail: number;
  msSum: number;
  msMax: number;
  lastFail: number | null;
}

interface StoreFile {
  version: 1;
  services: Record<string, Record<string, DayBucket>>;
}

const FILE = path.join(process.cwd(), '.data', 'uptime.json');
const RETENTION_DAYS = 400;

let cache: StoreFile | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function emptyStore(): StoreFile {
  return { version: 1, services: {} };
}

async function load(): Promise<StoreFile> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || parsed.version !== 1 || !parsed.services) throw new Error('bad store');
    cache = parsed;
  } catch {
    cache = emptyStore();
  }
  return cache;
}

function scheduleSave(store: StoreFile) {
  if (saveTimer) return;
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(store));
    } catch {
      // Read-only filesystem — memory still serves this instance.
    }
  }, 500);
}

async function record(samples: ProbeSample[], _run?: RunMeta): Promise<void> {
  const store = await load();
  const today = utcDayKey();
  const now = Date.now();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffKey = utcDayKey(cutoff);

  for (const item of samples) {
    if (!store.services[item.service]) store.services[item.service] = {};
    const days = store.services[item.service];
    if (!days[today]) {
      days[today] = { date: today, ok: 0, fail: 0, msSum: 0, msMax: 0, lastFail: null };
    }
    const b = days[today];
    if (item.ok) b.ok += 1;
    else {
      b.fail += 1;
      b.lastFail = now;
    }
    b.msSum += item.ms;
    if (item.ms > b.msMax) b.msMax = item.ms;
    for (const k of Object.keys(days)) {
      if (k < cutoffKey) delete days[k];
    }
  }
  scheduleSave(store);
}

function rollup(buckets: DayBucket[]) {
  const ok = buckets.reduce((a, b) => a + b.ok, 0);
  const fail = buckets.reduce((a, b) => a + b.fail, 0);
  const samples = ok + fail;
  const msSum = buckets.reduce((a, b) => a + b.msSum, 0);
  return {
    ok,
    fail,
    samples,
    avgMs: samples ? Math.round(msSum / samples) : 0,
    uptime: samples ? Math.round((ok / samples) * 1000) / 10 : null,
  };
}

async function daily(days: number): Promise<DayPoint[]> {
  const store = await load();
  const out: DayPoint[] = [];
  const serviceIds = Object.keys(store.services);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = utcDayKey(d);
    const buckets: DayBucket[] = [];
    for (const sid of serviceIds) {
      const b = store.services[sid][key];
      if (b) buckets.push(b);
    }
    if (!buckets.length) {
      out.push({ date: key, ok: 0, fail: 0, samples: 0, avgMs: 0, uptime: null });
      continue;
    }
    const r = rollup(buckets);
    out.push({ date: key, ok: r.ok, fail: r.fail, samples: r.samples, avgMs: r.avgMs, uptime: r.uptime });
  }
  return out;
}

async function monthly(months: number): Promise<MonthRollup[]> {
  const store = await load();
  const out: MonthRollup[] = [];
  const now = new Date();
  const serviceIds = Object.keys(store.services);
  for (let i = months - 1; i >= 0; i--) {
    const ref = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const prefix = `${ref.getUTCFullYear()}-${String(ref.getUTCMonth() + 1).padStart(2, '0')}`;
    let ok = 0;
    let fail = 0;
    let msSum = 0;
    for (const sid of serviceIds) {
      for (const [date, b] of Object.entries(store.services[sid])) {
        if (date.startsWith(prefix)) {
          ok += b.ok;
          fail += b.fail;
          msSum += b.msSum;
        }
      }
    }
    const samples = ok + fail;
    out.push({
      month: prefix,
      ok,
      fail,
      avgMs: samples ? Math.round(msSum / samples) : 0,
      uptime: samples ? Math.round((ok / samples) * 1000) / 10 : null,
    });
  }
  return out;
}

async function incidents(limit = 20): Promise<Incident[]> {
  const store = await load();
  const byDay = new Map<
    string,
    { ok: number; fail: number; worstMs: number; lastFail: number | null; services: string[] }
  >();
  for (const [sid, days] of Object.entries(store.services)) {
    for (const [date, b] of Object.entries(days)) {
      if (b.fail <= 0) continue;
      const cur = byDay.get(date) ?? { ok: 0, fail: 0, worstMs: 0, lastFail: null, services: [] };
      cur.ok += b.ok;
      cur.fail += b.fail;
      if (b.msMax > cur.worstMs) cur.worstMs = b.msMax;
      if (b.lastFail && (!cur.lastFail || b.lastFail > cur.lastFail)) cur.lastFail = b.lastFail;
      if (!cur.services.includes(sid)) cur.services.push(sid);
      byDay.set(date, cur);
    }
  }
  return [...byDay.entries()]
    .map(([date, v]) => ({
      date,
      service: v.services.join(', ') || 'all',
      ok: v.ok,
      fail: v.fail,
      worstMs: v.worstMs,
      lastFail: v.lastFail,
      startedAt: v.lastFail,
      endedAt: null,
      ongoing: false,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

async function uptime(days: number): Promise<number | null> {
  const points = await daily(days);
  const ok = points.reduce((a, d) => a + d.ok, 0);
  const fail = points.reduce((a, d) => a + d.fail, 0);
  if (!ok && !fail) return null;
  return Math.round((ok / (ok + fail)) * 1000) / 10;
}

async function serviceStats(days: number): Promise<ServiceStat[]> {
  const store = await load();
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const cutoffKey = utcDayKey(cutoff);

  const out: ServiceStat[] = [];
  for (const [service, daysMap] of Object.entries(store.services)) {
    let ok = 0;
    let fail = 0;
    let msSum = 0;
    for (const [date, b] of Object.entries(daysMap)) {
      if (date < cutoffKey) continue;
      ok += b.ok;
      fail += b.fail;
      msSum += b.msSum;
    }
    const samples = ok + fail;
    out.push({
      service,
      ok,
      fail,
      samples,
      avgMs: samples ? Math.round(msSum / samples) : 0,
      uptime: samples ? Math.round((ok / samples) * 1000) / 10 : null,
    });
  }
  return out.sort((a, b) => a.service.localeCompare(b.service));
}

async function hasData(): Promise<boolean> {
  const store = await load();
  return Object.values(store.services).some(days => Object.keys(days).length > 0);
}

export const fileStore: UptimeStore = {
  backend: 'file',
  record,
  daily,
  monthly,
  incidents,
  uptime,
  serviceStats,
  hasData,
};
