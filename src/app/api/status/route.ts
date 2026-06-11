import { NextResponse } from 'next/server';

export async function GET() {
  const checks: { time: number; ms: number; ok: boolean }[] = [];
  const now = Date.now();

  // Run 5 quick checks to measure real response times
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    try {
      const res = await fetch('https://hylab.vercel.app/api/icons/home', {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      checks.push({
        time: now - (4 - i) * 1000,
        ms: Date.now() - start,
        ok: res.ok,
      });
    } catch {
      checks.push({
        time: now - (4 - i) * 1000,
        ms: Date.now() - start,
        ok: false,
      });
    }
  }

  const avgMs = Math.round(checks.reduce((a, c) => a + c.ms, 0) / checks.length);
  const allOk = checks.every(c => c.ok);

  return NextResponse.json({
    status: allOk ? 'operational' : 'degraded',
    avgResponseTime: avgMs,
    checks,
    timestamp: now,
  });
}
