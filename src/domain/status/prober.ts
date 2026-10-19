/**
 * Shared live prober — the same real measurement used by
 * /api/status (interactive) and /api/cron/probe (scheduled).
 */

export interface ProbeDef {
  id: string;
  name: string;
  path: string;
}

export interface ProbeResult extends ProbeDef {
  url: string;
  ok: boolean;
  ms: number;
  status: number;
  time: number;
}

export const PROBES: ProbeDef[] = [
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
    // البطء الشديد (>2500ms) يُحسب فشلاً لا نجاحاً بطيئاً
    const ok = res.ok && ms < 2500;
    return { ok, ms, status: res.status };
  } catch {
    return { ok: false, ms: Date.now() - start, status: 0 };
  }
}

export async function runProbes(origin: string): Promise<ProbeResult[]> {
  const now = Date.now();
  return Promise.all(
    PROBES.map(async p => {
      const url = `${origin}${p.path}`;
      const r = await probe(url);
      return { ...p, url, ...r, time: now };
    })
  );
}

export function summarize(results: ProbeResult[]): {
  status: 'operational' | 'degraded' | 'down';
  avgMs: number;
} {
  const allOk = results.every(r => r.ok);
  const someOk = results.some(r => r.ok);
  const avgMs = Math.round(results.reduce((a, r) => a + r.ms, 0) / results.length);
  const slow = avgMs > 800 || results.some(r => r.ms > 1500);
  let status: 'operational' | 'degraded' | 'down' = 'operational';
  if (!someOk) status = 'down';
  else if (!allOk || slow) status = 'degraded';
  return { status, avgMs };
}
