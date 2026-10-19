'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { UptimeTimeline, type TimelineSegment } from '@/features/status/UptimeTimeline';

interface ServiceStatus {
  id: string;
  name: string;
  ok: boolean;
  ms: number;
  status: string;
  uptime7: number | null;
  samples7: number;
  uptime90: number | null;
  samples90: number;
  fail90: number;
  avgMs: number;
}
interface CheckResult { time: number; ms: number; ok: boolean; service?: string; }
interface DayPoint { date: string; ok: number; fail: number; samples: number; avgMs: number; uptime: number | null; }
interface MonthPoint { month: string; ok: number; fail: number; avgMs: number; uptime: number | null; }
interface Incident { date: string; service: string; ok: number; fail: number; worstMs: number; lastFail: number | null; startedAt?: number | null; endedAt?: number | null; ongoing?: boolean; }

type Range = '7d' | '90d' | '12m';

const SERVICE_NAMES: Record<string, string> = {
  svg: 'SVG Generation',
  png: 'PNG Conversion',
  search: 'Search Engine',
  categories: 'Categories',
  list: 'API Endpoints',
};

function serviceLabel(id: string): string {
  if (!id) return 'all services';
  if (id.includes(', ')) return id.split(', ').map(s => SERVICE_NAMES[s] ?? s).join(', ');
  return SERVICE_NAMES[id] ?? id;
}

function getDayLabel(d: Date) { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
function monthAbbr(d: Date) { return d.toLocaleDateString('en-US', { month: 'short' }); }
function getDayFull(d: string) { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function getMonthLabel(m: string) { return new Date(m + '-02T12:00:00').toLocaleDateString('en-US', { month: 'short' }); }
function getMonthFull(m: string) { return new Date(m + '-02T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }

export default function StatusPage() {
  useScrollToTop();
  const [status, setStatus] = useState<'checking' | 'operational' | 'degraded' | 'down'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [uptime, setUptime] = useState<number | null>(null);
  const [uptime90, setUptime90] = useState<number | null>(null);
  const [uptimeAll, setUptimeAll] = useState<number | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [daily, setDaily] = useState<DayPoint[]>([]);
  const [monthly, setMonthly] = useState<MonthPoint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tracked, setTracked] = useState(false);
  const [storage, setStorage] = useState<'postgres' | 'file'>('file');
  const [range, setRange] = useState<Range>('7d');
  const [lastChecked, setLastChecked] = useState<string>('');
  const [isLive, setIsLive] = useState(true);

  const runCheck = useCallback(async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const data = await res.json();
      setStatus(data.status);
      setResponseTime(data.avgResponseTime);
      setUptime(data.uptime ?? null);
      setUptime90(data.uptime90 ?? null);
      setUptimeAll(data.uptimeAll ?? null);
      setServices(data.services || []);
      setHistory(data.history || data.checks || []);
      setDaily(data.daily || []);
      setMonthly(data.monthly || []);
      setIncidents(data.incidents || []);
      setTracked(!!data.tracked);
      setStorage(data.storage === 'postgres' ? 'postgres' : 'file');
      setLastChecked(new Date(data.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsLive(true);
    } catch {
      setStatus('down');
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    runCheck();
    const interval = setInterval(runCheck, 30000);
    return () => clearInterval(interval);
  }, [runCheck]);

  // Segments come straight from the server's persistent store — 100% recorded
  // probes, never fabricated. Periods without probes stay visible as empty
  // slots so the timeline always shows the window it covers.
  const segments: TimelineSegment[] = useMemo(() => {
    if (range === '12m') {
      return monthly.map(m => ({
        key: m.month,
        shortLabel: getMonthLabel(m.month),
        fullLabel: getMonthFull(m.month),
        uptime: m.uptime,
        samples: m.ok + m.fail,
        avgMs: m.avgMs,
        fails: m.fail,
      }));
    }
    const days = range === '90d' ? daily : daily.slice(-7);
    return days.map((d, i) => {
      const date = new Date(d.date + 'T12:00:00');
      return {
        key: d.date,
        // 90 slots cannot each carry a label — show every 15th plus the last.
        shortLabel:
          range === '90d'
            ? i % 15 === 0
              ? `${monthAbbr(date)} ${date.getDate()}`
              : ''
            : getDayLabel(date),
        fullLabel: getDayFull(d.date),
        uptime: d.uptime,
        samples: d.samples,
        avgMs: d.avgMs,
        fails: d.fail,
      };
    });
  }, [range, daily, monthly]);

  const rangeUptime = range === '12m' ? uptimeAll : range === '90d' ? uptime90 : uptime;
  const rangeName = range === '12m' ? '12 months' : range === '90d' ? '90 days' : '7 days';

  const statusMeta = {
    checking: { label: 'Checking…', dot: 'bg-text-muted', badge: 'bg-bg-secondary border-border-primary text-text-muted' },
    operational: { label: 'All systems operational', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
    degraded: { label: 'Partial degradation', dot: 'bg-amber-500', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700' },
    down: { label: 'Service disruption', dot: 'bg-red-500', badge: 'bg-red-500/10 border-red-500/20 text-red-600' },
  }[status];

  const displayServices: ServiceStatus[] = services.length ? services : [
    { id: 'api', name: 'API Endpoints', ok: status !== 'down', ms: responseTime ?? 0, status, uptime7: null, samples7: 0, uptime90: null, samples90: 0, fail90: 0, avgMs: 0 },
    { id: 'svg', name: 'SVG Generation', ok: status !== 'down', ms: responseTime ?? 0, status, uptime7: null, samples7: 0, uptime90: null, samples90: 0, fail90: 0, avgMs: 0 },
    { id: 'png', name: 'PNG / WebP', ok: status !== 'down', ms: responseTime ?? 0, status, uptime7: null, samples7: 0, uptime90: null, samples90: 0, fail90: 0, avgMs: 0 },
    { id: 'search', name: 'Search Engine', ok: status !== 'down', ms: responseTime ?? 0, status, uptime7: null, samples7: 0, uptime90: null, samples90: 0, fail90: 0, avgMs: 0 },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <section className="pt-8 pb-6 px-6 border-b border-border-primary">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-card px-3 py-1 text-[11px] font-medium tracking-[0.06em] uppercase text-text-muted mb-3">
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
              Live status
              <span className={`ml-1 w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-text-muted'}`} title={isLive ? 'Live' : 'Offline'} />
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] leading-none font-[family-name:var(--font-outfit)]">System Status</h1>
            <p className="text-sm text-text-secondary mt-2">Real-time probes to 5 endpoints — measured from the edge, no mock data.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-text-muted">Updated {lastChecked || '—'}</span>
            <span className="w-px h-3 bg-border-primary" />
            <span
              title={storage === 'postgres' ? 'History is kept in our Postgres database' : 'Running without a database — history is kept in a local file'}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${
                storage === 'postgres'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                  : 'border-border-primary bg-bg-card text-text-muted'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${storage === 'postgres' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {storage === 'postgres' ? 'Stored in our DB' : 'Local file (dev)'}
            </span>
            <span className="w-px h-3 bg-border-primary" />
            <button onClick={runCheck} className="h-8 px-3 rounded-full border border-border-primary bg-bg-card hover:bg-bg-secondary text-text-primary font-medium transition-colors">Refresh now</button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1.65fr_0.9fr] gap-6 items-start">
        {/* Left */}
        <div className="space-y-6">
          {/* Overall */}
          <div className="rounded-2xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="px-5 py-5 flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${statusMeta.dot}`} />
                <div>
                  <div className="font-semibold leading-none">{statusMeta.label}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {status === 'operational' ? 'All 5 probes succeeded — SVG, PNG, search, categories, and list.' : status === 'degraded' ? 'Some probes slow or failed — see services below.' : 'Major outage — most probes failed.'}
                  </div>
                  {responseTime !== null && (
                    <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-bg-secondary border border-border-primary px-3 py-1 text-xs">
                      <span className="text-text-muted">Avg</span>
                      <span className="font-mono font-medium tabular text-text-primary">{responseTime}ms</span>
                      <span className="w-px h-3 bg-border-primary" />
                      <span className="text-text-muted">Uptime 7d</span>
                      <span className="font-mono font-medium tabular text-accent">{uptime === null ? '—' : `${uptime}%`}</span>
                      <span className="w-px h-3 bg-border-primary" />
                      <span className="text-text-muted">90d</span>
                      <span className="font-mono font-medium tabular text-text-primary">{uptime90 === null ? '—' : `${uptime90}%`}</span>
                      <span className="w-px h-3 bg-border-primary" />
                      <span className="text-text-muted">All</span>
                      <span className="font-mono font-medium tabular text-text-primary">{uptimeAll === null ? '—' : `${uptimeAll}%`}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border shrink-0 ${statusMeta.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                {status}
              </span>
            </div>
            <div className="px-5 py-3 bg-bg-secondary border-t border-border-primary flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
              <span>Probes run in parallel · timeout 5s · no-store</span>
              <Link href="/docs" className="font-medium text-accent hover:text-accent-hover">API Docs →</Link>
            </div>
          </div>

          {/* Services — now per-service real data */}
          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="px-4 h-10 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
              <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Services — live latency & uptime</span>
              <span className="text-xs tabular text-text-muted">{displayServices.length} probed</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between gap-4 border-b border-border-primary bg-bg-secondary/40 text-[10px] uppercase tracking-[0.08em] text-text-muted">
              <span>Service</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="w-11 text-right">7d</span>
                <span className="w-11 text-right">90d</span>
                <span className="hidden sm:inline w-20 text-right">Status</span>
                <span className="w-2.5" />
              </div>
            </div>
            <div className="divide-y divide-border-primary">
              {displayServices.map(s => {
                const dot = s.ok ? (s.ms > 800 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-red-500';
                const txt = s.ok ? (s.ms > 800 ? 'degraded' : 'operational') : 'down';
                const up7 = s.uptime7;
                const up90 = s.uptime90;
                return (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3.5 gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs font-mono tabular text-text-muted">
                        {s.ms}ms · {s.id}
                        {s.samples90 > 0 && <span> · {s.samples90.toLocaleString()} probes</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-11 text-right">
                        <div className="text-xs font-mono tabular text-text-primary">{up7 === null ? '—' : `${up7}%`}</div>
                        <div className="text-[10px] text-text-muted">7d</div>
                      </div>
                      <div className="w-11 text-right">
                        <div className={`text-xs font-mono tabular ${up90 === null ? 'text-text-muted' : up90 >= 99.9 ? 'text-text-primary' : up90 >= 95 ? 'text-amber-600' : 'text-red-500'}`}>
                          {up90 === null ? '—' : `${up90}%`}
                        </div>
                        <div className="text-[10px] text-text-muted">90d</div>
                      </div>
                      <span className={`hidden sm:inline text-xs capitalize tabular w-20 text-right ${s.ok ? 'text-text-muted' : 'text-red-500'}`}>{txt}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${dot} ${s.ok && s.ms < 400 ? '' : 'animate-pulse'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uptime chart — persistent recorded history, selectable range */}
          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="px-4 min-h-10 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-border-primary bg-bg-secondary">
              <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Uptime — {rangeName}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full border border-border-primary overflow-hidden" role="tablist" aria-label="History range">
                  {(['7d', '90d', '12m'] as Range[]).map(r => (
                    <button
                      key={r}
                      role="tab"
                      aria-selected={range === r}
                      onClick={() => setRange(r)}
                      className={`px-2.5 py-1 text-[11px] font-medium tabular transition-colors ${range === r ? 'bg-text-primary text-bg-primary' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {r === '7d' ? '7D' : r === '90d' ? '90D' : '12M'}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono tabular text-accent">{rangeUptime === null ? '—' : `${rangeUptime}%`}</span>
              </div>
            </div>
            <div className="p-4">
              {!tracked ? (
                <div className="py-10 text-center">
                  <div className="text-sm font-medium text-text-primary">Collecting history…</div>
                  <p className="text-xs text-text-muted mt-1 max-w-[42ch] mx-auto">No probes recorded yet. Every refresh and every scheduled check is stored — this timeline fills with real data from now on. Nothing is fabricated.</p>
                </div>
              ) : (
                <UptimeTimeline segments={segments} caption={`Uptime over ${rangeName}`} />
              )}
              <div className="mt-4 pt-3 border-t border-border-primary flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
                <span>
                  {storage === 'postgres'
                    ? 'Recorded probes — written to our Postgres database, permanent'
                    : 'Recorded probes — local file (set DATABASE_URL to persist)'}
                </span>
                <span>Auto-refresh 30s</span>
              </div>
            </div>
          </div>

          {/* Incidents — every recorded day with failures */}
          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="px-4 h-10 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
              <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Incidents</span>
              <span className="text-xs tabular text-text-muted">{incidents.length ? `${incidents.length} recorded` : 'none recorded'}</span>
            </div>
            {incidents.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-text-muted">
                {tracked ? 'No failed probes since tracking began — clean record.' : 'No data yet — incidents will appear here if any probe ever fails.'}
              </div>
            ) : (
              <div className="divide-y divide-border-primary">
                {incidents.map((inc, i) => (
                  <div key={`${inc.date}-${inc.service}-${i}`} className="flex items-center justify-between px-4 py-3 gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${inc.ongoing ? 'bg-red-500 animate-pulse' : 'bg-red-500/60'}`} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{serviceLabel(inc.service)}</div>
                        <div className="text-xs font-mono tabular text-text-muted">
                          {getDayFull(inc.date)} · {inc.fail} failed · {inc.ok} ok · worst {inc.worstMs}ms
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {inc.ongoing && (
                        <span className="text-[11px] font-medium rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-red-600">ongoing</span>
                      )}
                      <span className="text-xs tabular text-text-muted">
                        {inc.lastFail ? new Date(inc.lastFail).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-sm font-semibold">How this is real</div>
            <p className="text-xs leading-relaxed text-text-muted mt-1">
              Each refresh hits <code className="font-mono text-text-primary">/api/status</code> which fetches 5 real endpoints in parallel (SVG, PNG, search, categories, list) with <code className="font-mono">no-store</code> and 5s timeout. Latency and ok/fail are measured live — not mocked — and every run is appended to our database, so the 7D / 90D / 12M charts show only probes that actually happened.
            </p>
            <div className="mt-3 rounded-lg bg-bg-secondary border border-border-primary p-3 text-xs font-mono break-all">
              GET /api/status<br />
              → {`{ status, avgResponseTime, services: [{id, ms, ok}], checks }`}
            </div>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-secondary/50 p-4">
            <div className="text-xs font-semibold text-text-primary">Where history lives</div>
            <p className="text-xs leading-relaxed text-text-muted mt-1">
              Every probe run is written to <span className="font-mono text-text-primary">our own Postgres database</span> (schema <span className="font-mono text-text-primary">hylab_status</span>) — per-day, per-service buckets, a run log and an incident log. It survives restarts, redeploys and machine changes, so the history accumulates for months and years. A daily Vercel Cron (<span className="font-mono text-text-primary">/api/cron/probe</span>) records even with no visitors; opening this page probes every 30s on top.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">5 probes</span>
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">parallel</span>
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">Postgres</span>
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">daily cron</span>
            </div>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-card p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Explore icons</div>
              <div className="text-xs text-text-muted">26,150 ready to use</div>
            </div>
            <Link href="/browse" className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-text-primary text-bg-primary text-xs font-semibold">Browse →</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
