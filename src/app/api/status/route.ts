import { NextRequest, NextResponse } from 'next/server';
import { API } from '@/domain/icons/constants';
import { runProbes, summarize } from '@/domain/status/prober';
import {
  recordProbes,
  getDaily,
  getMonthly,
  getIncidents,
  getUptime,
  getServiceStats,
  hasAnyData,
  activeBackend,
} from '@/domain/status/store';

// Live history (last 100 raw checks) for the "right now" feel;
// the persistent history comes from the Postgres store.
const MAX_HISTORY = 100;
let memoryHistory: { time: number; ms: number; ok: boolean; service: string }[] = [];

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const now = Date.now();

  // القياس الحقيقي — 5 فحوصات متوازية بلا كاش
  const results = await runProbes(origin);
  const { status, avgMs } = summarize(results);

  for (const r of results) {
    memoryHistory.push({ time: now, ms: r.ms, ok: r.ok, service: r.id });
  }
  if (memoryHistory.length > MAX_HISTORY) memoryHistory = memoryHistory.slice(-MAX_HISTORY);

  // السجل الحقيقي الدائم — قاعدة بيانات عندنا، يبقى بعد إعادة التشغيل
  // وإعادة النشر ويتاكم شهوراً وسنين.
  await recordProbes(
    results.map(r => ({ service: r.id, ms: r.ms, ok: r.ok })),
    {
      status,
      avgMs,
      services: results.map(r => ({ id: r.id, name: r.name, ok: r.ok, ms: r.ms })),
    }
  );

  const checks = results.map(r => ({ time: now, ms: r.ms, ok: r.ok, service: r.id }));

  const [daily90, monthly12, incidents, uptime7, uptime90, uptimeAll, tracked, storage, svc7, svc90] = await Promise.all([
    getDaily(90),
    getMonthly(12),
    getIncidents(20),
    getUptime(7),
    getUptime(90),
    getUptime(400),
    hasAnyData(),
    activeBackend(),
    getServiceStats(7),
    getServiceStats(90),
  ]);

  // Per-service uptime over the tracked windows — shown on every row.
  const stat7 = new Map(svc7.map(s => [s.service, s]));
  const stat90 = new Map(svc90.map(s => [s.service, s]));
  const services = results.map(r => {
    const s7 = stat7.get(r.id);
    const s90 = stat90.get(r.id);
    return {
      id: r.id,
      name: r.name,
      ok: r.ok,
      ms: r.ms,
      status: r.ok ? (r.ms > 800 ? 'degraded' : 'operational') : 'down',
      uptime7: s7?.uptime ?? null,
      samples7: s7?.samples ?? 0,
      uptime90: s90?.uptime ?? null,
      samples90: s90?.samples ?? 0,
      fail90: s90?.fail ?? 0,
      avgMs: s90?.avgMs ?? 0,
    };
  });

  const trackedDays = daily90.filter(d => d.samples > 0).length;
  const totalProbes = daily90.reduce((a, d) => a + d.samples, 0);

  return NextResponse.json(
    {
      status,
      avgResponseTime: avgMs,
      uptime: uptime7,
      uptime90,
      uptimeAll,
      tracked,
      storage,
      trackedDays,
      totalProbes,
      services,
      checks,
      history: memoryHistory.slice(-100),
      daily: daily90,
      monthly: monthly12,
      incidents,
      timestamp: now,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': API.CORS_ORIGIN,
      },
    }
  );
}
