import { NextRequest, NextResponse } from 'next/server';
import { API } from '@/domain/icons/constants';

// تاريخ حي داخل الذاكرة — يبقى بين الطلبات الدافئة (warm) ويعطي uptime حقيقي أكثر من localStorage فقط
// على Vercel الـ serverless قد يعيد التشغيل، لكنه أفضل من لا شيء. للإنتاج الكامل نربطه بـ KV/R2.
const MAX_HISTORY = 500;
let memoryHistory: { time: number; ms: number; ok: boolean; service: string }[] = [];

type Probe = { id: string; name: string; path: string };

const PROBES: Probe[] = [
  { id: 'svg', name: 'SVG Generation', path: '/api/icons/home?color=7c9a82&size=24' },
  { id: 'png', name: 'PNG Conversion', path: '/api/icons/home?format=png&size=32' },
  { id: 'search', name: 'Search Engine', path: '/api/icons/search?q=arrow' },
  { id: 'categories', name: 'Categories', path: '/api/icons/categories' },
  { id: 'list', name: 'API Endpoints', path: '/api/icons?page=1&limit=1' },
];

async function probe(url: string, timeoutMs = 5000) {
  const start = Date.now();
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
    const ms = Date.now() - start;
    // نعتبر البطء الشديد (>1500ms) كـ degraded وليس ok كامل
    const ok = res.ok && ms < 2500;
    return { ok, ms, status: res.status };
  } catch {
    return { ok: false, ms: Date.now() - start, status: 0 };
  }
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const now = Date.now();

  // شغّل كل الفحوصات بالتوازي — هذا هو القياس الحقيقي
  const results = await Promise.all(
    PROBES.map(async p => {
      const url = `${origin}${p.path}`;
      const r = await probe(url);
      return { ...p, url, ...r, time: now };
    })
  );

  // احسب الحالة الإجمالية
  const allOk = results.every(r => r.ok);
  const someOk = results.some(r => r.ok);
  const avgMs = Math.round(results.reduce((a, r) => a + r.ms, 0) / results.length);
  const slow = avgMs > 800 || results.some(r => r.ms > 1500);

  let status: 'operational' | 'degraded' | 'down' = 'operational';
  if (!someOk) status = 'down';
  else if (!allOk || slow) status = 'degraded';

  // خزّن في الذاكرة للتاريخ
  for (const r of results) {
    memoryHistory.push({ time: now, ms: r.ms, ok: r.ok, service: r.id });
  }
  if (memoryHistory.length > MAX_HISTORY) memoryHistory = memoryHistory.slice(-MAX_HISTORY);

  // حوّل لشكل checks القديم للتوافق + خدمات مفصلة
  const checks = results.map(r => ({ time: now, ms: r.ms, ok: r.ok, service: r.id }));
  const services = results.map(r => ({
    id: r.id,
    name: r.name,
    ok: r.ok,
    ms: r.ms,
    status: r.ok ? (r.ms > 800 ? 'degraded' : 'operational') : 'down',
  }));

  // احسب uptime من الذاكرة لآخر 7 أيام (تقريبي)
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recent = memoryHistory.filter(h => h.time > sevenDaysAgo);
  const uptime = recent.length ? Math.round((recent.filter(h => h.ok).length / recent.length) * 1000) / 10 : 100;

  return NextResponse.json(
    {
      status,
      avgResponseTime: avgMs,
      uptime,
      services,
      checks,
      history: memoryHistory.slice(-100),
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
