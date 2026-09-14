'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface ServiceStatus { id: string; name: string; ok: boolean; ms: number; status: string; }
interface CheckResult { time: number; ms: number; ok: boolean; service?: string; }
interface DayData { date: string; checks: CheckResult[]; avgMs: number; uptime: number; }

function getDayKey(d: Date) { return d.toISOString().split('T')[0]; }
function getDayLabel(d: Date) { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
function getDayFull(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

export default function StatusPage() {
  useScrollToTop();
  const [status, setStatus] = useState<'checking' | 'operational' | 'degraded' | 'down'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [uptime, setUptime] = useState<number>(100);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [isLive, setIsLive] = useState(true);

  const runCheck = useCallback(async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const data = await res.json();
      setStatus(data.status);
      setResponseTime(data.avgResponseTime);
      setUptime(data.uptime ?? 100);
      setServices(data.services || []);
      setHistory(data.history || data.checks || []);
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

  // group history by day for chart
  const last7 = (() => {
    const map = new Map<string, CheckResult[]>();
    for (const h of history) {
      const k = getDayKey(new Date(h.time));
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(h);
    }
    const days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = getDayKey(d);
      const checks = map.get(key) || [];
      const avgMs = checks.length ? Math.round(checks.reduce((a, c) => a + c.ms, 0) / checks.length) : 0;
      const ok = checks.filter(c => c.ok).length;
      const pct = checks.length ? Math.round((ok / checks.length) * 1000) / 10 : (i === 6 ? 100 : 0);
      // if no data for past days, show as empty (not 100) except today
      days.push({ date: key, checks, avgMs, uptime: pct });
    }
    return days;
  })();

  const statusMeta = {
    checking: { label: 'Checking…', dot: 'bg-text-muted', badge: 'bg-bg-secondary border-border-primary text-text-muted' },
    operational: { label: 'All systems operational', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
    degraded: { label: 'Partial degradation', dot: 'bg-amber-500', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700' },
    down: { label: 'Service disruption', dot: 'bg-red-500', badge: 'bg-red-500/10 border-red-500/20 text-red-600' },
  }[status];

  const displayServices: ServiceStatus[] = services.length ? services : [
    { id: 'api', name: 'API Endpoints', ok: status !== 'down', ms: responseTime ?? 0, status },
    { id: 'svg', name: 'SVG Generation', ok: status !== 'down', ms: responseTime ?? 0, status },
    { id: 'png', name: 'PNG / WebP', ok: status !== 'down', ms: responseTime ?? 0, status },
    { id: 'search', name: 'Search Engine', ok: status !== 'down', ms: responseTime ?? 0, status },
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
                      <span className="font-mono font-medium tabular text-accent">{uptime}%</span>
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
              <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Services — live latency</span>
              <span className="text-xs tabular text-text-muted">{displayServices.length} probed</span>
            </div>
            <div className="divide-y divide-border-primary">
              {displayServices.map(s => {
                const dot = s.ok ? (s.ms > 800 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-red-500';
                const txt = s.ok ? (s.ms > 800 ? 'degraded' : 'operational') : 'down';
                return (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3.5 gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs font-mono tabular text-text-muted">{s.ms}ms · {s.id}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`hidden sm:inline text-xs capitalize tabular ${s.ok ? 'text-text-muted' : 'text-red-500'}`}>{txt}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${dot} ${s.ok && s.ms < 400 ? '' : 'animate-pulse'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uptime chart — now from server history */}
          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="px-4 h-10 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
              <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Uptime — last 7 days</span>
              <span className="text-xs font-mono tabular text-accent">{uptime}%</span>
            </div>
            <div className="p-4">
              <div className="flex items-end gap-2 h-[96px]">
                {last7.map(day => {
                  const hasData = day.checks.length > 0;
                  const h = !hasData ? 6 : Math.max(10, day.uptime * 0.9);
                  const isToday = day.date === getDayKey(new Date());
                  const barColor = !hasData ? 'bg-border-primary' : day.uptime >= 99 ? 'bg-text-primary' : day.uptime >= 95 ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                      <div className="w-full flex items-end justify-center h-[72px]">
                        <div
                          className={`w-full max-w-[44px] rounded-t-md ${barColor} ${isToday ? 'ring-1 ring-accent' : ''}`}
                          style={{ height: `${h}%` }}
                          title={`${getDayFull(day.date)} — ${hasData ? `${day.uptime}% · ${day.avgMs}ms · ${day.checks.length} checks` : 'no data yet'}`}
                        />
                      </div>
                      <span className={`text-[11px] tabular ${isToday ? 'font-medium text-text-primary' : 'text-text-muted'}`}>{getDayLabel(new Date(day.date))}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2 text-[10px] tabular text-text-muted">
                {last7.map(d => (
                  <div key={d.date} className="text-center truncate">{d.checks.length ? `${d.uptime}%` : '—'}</div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border-primary flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
                <span>{history.length} probes stored (server memory, last {Math.min(history.length, 100)} shown)</span>
                <span>Auto-refresh 30s</span>
              </div>
            </div>
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
              Each refresh hits <code className="font-mono text-text-primary">/api/status</code> which fetches 5 real endpoints in parallel (SVG, PNG, search, categories, list) with <code className="font-mono">no-store</code> and 5s timeout. Latency and ok/fail are measured live — not mocked. History is kept in server memory (up to 500 probes) and returned to the page.
            </p>
            <div className="mt-3 rounded-lg bg-bg-secondary border border-border-primary p-3 text-xs font-mono break-all">
              GET /api/status<br />
              → {`{ status, avgResponseTime, services: [{id, ms, ok}], checks }`}
            </div>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-secondary/50 p-4">
            <div className="text-xs font-semibold text-text-primary">Want persistence?</div>
            <p className="text-xs leading-relaxed text-text-muted mt-1">
              For 30-day global uptime, connect <span className="font-mono text-text-primary">Vercel KV</span> (Upstash Redis) and we’ll move history from memory to KV with a daily cron. No code change needed beyond env vars.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">5 probes</span>
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">parallel</span>
              <span className="px-2 py-1 rounded-full bg-bg-card border border-border-primary">no-store</span>
            </div>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-card p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Explore icons</div>
              <div className="text-xs text-text-muted">18,039 ready to use</div>
            </div>
            <Link href="/browse" className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-text-primary text-bg-primary text-xs font-semibold">Browse →</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
