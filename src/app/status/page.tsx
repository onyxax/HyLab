'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface CheckResult {
  time: number;
  ms: number;
  ok: boolean;
}

interface DayData {
  date: string;
  checks: CheckResult[];
  avgMs: number;
  uptime: number;
}

function getDayKey(d: Date) {
  return d.toISOString().split('T')[0];
}

function getDayLabel(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function loadHistory(): DayData[] {
  try {
    const raw = localStorage.getItem('hylab-uptime');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(data: DayData[]) {
  localStorage.setItem('hylab-uptime', JSON.stringify(data));
}

export default function StatusPage() {
  useScrollToTop();
  const [status, setStatus] = useState<'checking' | 'operational' | 'degraded' | 'down'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [history, setHistory] = useState<DayData[]>([]);

  const runCheck = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setResponseTime(data.avgResponseTime);
      setStatus(data.status);

      const today = getDayKey(new Date());
      const prev = loadHistory();
      const existing = prev.find(d => d.date === today);

      const newChecks = existing
        ? [...existing.checks, ...data.checks]
        : data.checks;

      const avgMs = Math.round(newChecks.reduce((a: number, c: CheckResult) => a + c.ms, 0) / newChecks.length);
      const okCount = newChecks.filter((c: CheckResult) => c.ok).length;
      const uptime = Math.round((okCount / newChecks.length) * 1000) / 10;

      const updated: DayData[] = [
        ...prev.filter(d => d.date !== today),
        { date: today, checks: newChecks, avgMs, uptime },
      ].slice(-7);

      saveHistory(updated);
      setHistory(updated);
    } catch {
      setStatus('down');
    }
  }, []);

  useEffect(() => {
    runCheck();
    const interval = setInterval(runCheck, 30000);
    return () => clearInterval(interval);
  }, [runCheck]);

  const services = [
    { name: 'API Endpoints', status },
    { name: 'SVG Generation', status },
    { name: 'PNG Conversion', status },
    { name: 'Search Engine', status },
  ];

  const last7 = (() => {
    const days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getDayKey(d);
      const found = history.find(h => h.date === key);
      days.push(found || {
        date: key,
        checks: [],
        avgMs: 0,
        uptime: i === 0 ? 100 : 0,
      });
    }
    return days;
  })();

  const overallUptime = (() => {
    const allChecks = history.flatMap(d => d.checks);
    if (allChecks.length === 0) return 100;
    const ok = allChecks.filter(c => c.ok).length;
    return Math.round((ok / allChecks.length) * 1000) / 10;
  })();

  const statusColor = {
    checking: 'bg-text-muted',
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  };

  const statusText = {
    checking: 'Checking...',
    operational: 'All Systems Operational',
    degraded: 'Partial Degradation',
    down: 'Service Disruption',
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">
            System Status
          </h1>
          <p className="text-text-secondary text-lg mb-10">
            Real-time status of HyLab API services
          </p>

          {/* Overall Status */}
          <div className="card mb-8">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${statusColor[status]} ${status === 'operational' ? 'animate-pulse' : ''}`} />
              <span className="text-lg font-semibold">{statusText[status]}</span>
            </div>
            {responseTime !== null && (
              <p className="text-sm text-text-muted mt-2">
                Response time: <span className="text-accent font-medium">{responseTime}ms</span>
              </p>
            )}
          </div>

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Services</h2>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.name} className="card flex items-center justify-between py-4">
                  <span className="font-medium">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusColor[service.status]}`} />
                    <span className="text-sm text-text-muted capitalize">{service.status === 'checking' ? 'Checking' : service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime */}
          <div className="mb-8">
            <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Uptime (Last 7 Days)</h2>
            <div className="card">
              <div className="flex items-end justify-between gap-2 h-32">
                {last7.map((day) => {
                  const height = day.checks.length === 0 ? 5 : Math.max(10, day.uptime);
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-accent/20 rounded-t-md relative group" style={{ height: `${height}%` }}>
                        <div className={`w-full rounded-t-md h-full ${day.uptime >= 99 ? 'bg-accent' : day.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-card border border-border-primary rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {day.uptime}% — {day.avgMs}ms
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{getDayLabel(new Date(day.date))}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
                <span className="text-sm text-text-muted">Overall uptime</span>
                <span className="text-sm font-semibold text-accent">{overallUptime}%</span>
              </div>
            </div>
          </div>

          {/* Incidents */}
          <div>
            <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Recent Incidents</h2>
            <div className="card text-center py-8">
              <svg className="w-12 h-12 mx-auto text-accent mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-text-secondary">No incidents reported</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
