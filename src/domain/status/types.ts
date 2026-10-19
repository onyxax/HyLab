/**
 * Shared types for the uptime store.
 * Both backends (Postgres + local file) return exactly these shapes,
 * so the API and the UI never care where the data physically lives.
 */

export interface ProbeSample {
  service: string;
  ms: number;
  ok: boolean;
  detail?: string;
}

export interface RunMeta {
  status: string;
  avgMs: number;
  services?: unknown[];
}

export interface DayPoint {
  date: string; // YYYY-MM-DD
  ok: number;
  fail: number;
  samples: number;
  avgMs: number;
  uptime: number | null; // null when no probes were recorded that day
}

export interface MonthRollup {
  month: string; // YYYY-MM
  ok: number;
  fail: number;
  avgMs: number;
  uptime: number | null;
}

export interface Incident {
  date: string; // YYYY-MM-DD (start day)
  service: string;
  ok: number;
  fail: number;
  worstMs: number;
  lastFail: number | null;
  startedAt?: number | null;
  endedAt?: number | null;
  ongoing?: boolean;
}

/** Per-service uptime over a window. */
export interface ServiceStat {
  service: string;
  ok: number;
  fail: number;
  samples: number;
  avgMs: number;
  uptime: number | null; // null when the service was never probed in the window
}

/** Where the history is physically kept. */
export type StorageBackend = 'postgres' | 'file';

export interface UptimeStore {
  readonly backend: StorageBackend;
  record(samples: ProbeSample[], run?: RunMeta): Promise<void>;
  daily(days: number): Promise<DayPoint[]>;
  monthly(months: number): Promise<MonthRollup[]>;
  incidents(limit?: number): Promise<Incident[]>;
  uptime(days: number): Promise<number | null>;
  serviceStats(days: number): Promise<ServiceStat[]>;
  hasData(): Promise<boolean>;
}

export function utcDayKey(d: Date = new Date()): string {
  return d.toISOString().split('T')[0];
}

export function emptyDay(date: string): DayPoint {
  return { date, ok: 0, fail: 0, samples: 0, avgMs: 0, uptime: null };
}
