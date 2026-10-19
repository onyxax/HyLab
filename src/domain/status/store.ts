import { databaseUrl, postgresStore } from './db';
import { fileStore } from './fileStore';
import {
  type DayPoint,
  type Incident,
  type MonthRollup,
  type ProbeSample,
  type RunMeta,
  type ServiceStat,
  type StorageBackend,
  type UptimeStore,
} from './types';

/**
 * Store facade.
 *
 * Postgres (Supabase) is the real home of the history. The local file is
 * only a development fallback — if the database is unreachable for a
 * moment we keep serving (and recording) from disk instead of failing
 * the status endpoint.
 */

const BREAK_COOLDOWN_MS = 30_000;
let brokenUntil = 0;

async function pick(): Promise<UptimeStore> {
  if (!databaseUrl()) return fileStore;
  if (Date.now() < brokenUntil) return fileStore;
  return postgresStore;
}

async function withFallback<T>(fn: (s: UptimeStore) => Promise<T>): Promise<T> {
  const store = await pick();
  if (store === fileStore) return fn(fileStore);
  try {
    return await fn(postgresStore);
  } catch (err) {
    brokenUntil = Date.now() + BREAK_COOLDOWN_MS;
    console.error('[status] postgres unavailable, falling back to local file:', err);
    return fn(fileStore);
  }
}

export async function recordProbes(items: ProbeSample[], run?: RunMeta): Promise<void> {
  await withFallback(s => s.record(items, run));
}

export async function getDaily(days: number): Promise<DayPoint[]> {
  return withFallback(s => s.daily(days));
}

export async function getMonthly(months: number): Promise<MonthRollup[]> {
  return withFallback(s => s.monthly(months));
}

export async function getIncidents(limit = 20): Promise<Incident[]> {
  return withFallback(s => s.incidents(limit));
}

export async function getUptime(days: number): Promise<number | null> {
  return withFallback(s => s.uptime(days));
}

export async function getServiceStats(days: number): Promise<ServiceStat[]> {
  return withFallback(s => s.serviceStats(days));
}

export async function hasAnyData(): Promise<boolean> {
  return withFallback(s => s.hasData());
}

/** Which backend is currently serving the history. */
export async function activeBackend(): Promise<StorageBackend> {
  if (!databaseUrl()) return 'file';
  if (Date.now() < brokenUntil) return 'file';
  return 'postgres';
}

export type { DayPoint, Incident, MonthRollup, ProbeSample, RunMeta, ServiceStat, StorageBackend };
