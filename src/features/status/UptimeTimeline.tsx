'use client';

import { useState } from 'react';

/**
 * Uptime timeline — a continuous segmented strip, the way real status
 * pages render history. One segment per day (or per month), coloured by
 * the real uptime recorded for that period. Days without probes stay
 * visible as an empty slot instead of disappearing, so the timeline never
 * lies about the window it covers.
 */

export interface TimelineSegment {
  key: string;
  shortLabel: string;
  fullLabel: string;
  uptime: number | null;
  samples: number;
  avgMs: number;
  fails: number;
}

function toneOf(uptime: number | null) {
  if (uptime === null) {
    return { bar: 'bg-bg-secondary ring-1 ring-inset ring-border-primary', word: 'no data' };
  }
  if (uptime >= 99.9) return { bar: 'bg-accent', word: 'operational' };
  if (uptime >= 95) return { bar: 'bg-amber-500', word: 'degraded' };
  return { bar: 'bg-red-500', word: 'outage' };
}

export function UptimeTimeline({ segments, caption }: { segments: TimelineSegment[]; caption?: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  const active = segments.find(s => s.key === selected) ?? null;
  const tracked = segments.filter(s => s.uptime !== null);
  const probes = tracked.reduce((a, s) => a + s.samples, 0);
  const fails = tracked.reduce((a, s) => a + s.fails, 0);
  const avg = tracked.length ? Math.round(tracked.reduce((a, s) => a + s.avgMs * s.samples, 0) / Math.max(1, probes)) : 0;

  return (
    <div>
      {/* Strip */}
      <div className="flex items-stretch gap-[2px] h-11" role="img" aria-label={caption ?? 'Uptime timeline'}>
        {segments.map(s => {
          const tone = toneOf(s.uptime);
          const isSel = s.key === selected;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelected(isSel ? null : s.key)}
              title={`${s.fullLabel} — ${s.uptime === null ? 'no probes recorded' : `${s.uptime}% · ${s.samples} probes · ${s.fails} failed · ${s.avgMs}ms avg`}`}
              aria-label={`${s.fullLabel}: ${s.uptime === null ? 'no probes recorded' : `${s.uptime}% uptime`}`}
              className={`flex-1 min-w-0 rounded-[3px] ${tone.bar} transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary ${
                isSel ? 'ring-2 ring-text-primary ring-offset-2 ring-offset-bg-card relative z-10' : ''
              }`}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-1.5 flex items-stretch gap-[2px] overflow-visible">
        {segments.map(s => (
          <div
            key={s.key}
            className="flex-1 min-w-0 text-[10px] tabular text-text-muted text-center leading-4 overflow-visible whitespace-nowrap"
          >
            {s.shortLabel}
          </div>
        ))}
      </div>

      {/* Detail of the selected slot (falls back to the last tracked one) */}
      <div className="mt-3 min-h-[18px] text-xs text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
        {active ? (
          <>
            <span className="font-medium text-text-primary">{active.fullLabel}</span>
            <span className="w-px h-3 bg-border-primary" />
            <span className="font-mono tabular">{active.uptime === null ? '—' : `${active.uptime}%`}</span>
            <span className="text-text-muted">
              {active.uptime === null ? 'no probes recorded' : `${active.samples} probes · ${active.fails} failed · ${active.avgMs}ms avg`}
            </span>
          </>
        ) : (
          <>
            <span className="text-text-muted">
              {tracked.length} of {segments.length} periods tracked
            </span>
            <span className="w-px h-3 bg-border-primary" />
            <span className="font-mono tabular">{probes.toLocaleString()} probes</span>
            <span className="w-px h-3 bg-border-primary" />
            <span className="font-mono tabular">{fails} failed</span>
            {avg > 0 && (
              <>
                <span className="w-px h-3 bg-border-primary" />
                <span className="font-mono tabular">{avg}ms avg</span>
              </>
            )}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-border-primary flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-accent" />Operational</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-amber-500" />Degraded</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-red-500" />Outage</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-bg-secondary ring-1 ring-inset ring-border-primary" />No probes</span>
        <span className="ml-auto">Click a slot for details</span>
      </div>
    </div>
  );
}
