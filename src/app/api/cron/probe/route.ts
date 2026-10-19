import { NextRequest, NextResponse } from 'next/server';
import { runProbes, summarize } from '@/domain/status/prober';
import { recordProbes } from '@/domain/status/store';

/**
 * Scheduled probe — called by Vercel Cron (see vercel.json) so history
 * accumulates even when nobody has the status page open.
 * Protect with CRON_SECRET env var: /api/cron/probe?secret=... or
 * `Authorization: Bearer ...`. If CRON_SECRET is unset (local dev),
 * the route runs openly.
 */
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const required = process.env.CRON_SECRET;
  if (required) {
    const got =
      request.nextUrl.searchParams.get('secret') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (got !== required) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const origin = request.nextUrl.origin;
  const results = await runProbes(origin);
  const { status, avgMs } = summarize(results);
  await recordProbes(
    results.map(r => ({ service: r.id, ms: r.ms, ok: r.ok })),
    {
      status,
      avgMs,
      services: results.map(r => ({ id: r.id, name: r.name, ok: r.ok, ms: r.ms })),
    }
  );

  return NextResponse.json({
    ok: true,
    status,
    avgResponseTime: avgMs,
    recorded: results.length,
    timestamp: Date.now(),
  });
}
