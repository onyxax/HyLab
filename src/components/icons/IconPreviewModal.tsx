'use client';

import { useEffect, useRef, useState } from 'react';
import { ColorPicker } from '@/components/ColorPicker';
import { IconCardData } from './IconCard';
import { api, buildIconUrl, buildIconPath } from '@/lib/api/client';
import { customizeSvg } from '@/domain/icons/transforms/customizeSvg';

function getPreviewSvg(icon: IconCardData, color: string, size: number, stroke?: number) {
  const displaySize = Math.min(size, 360);
  try {
    return customizeSvg(icon.svg, { color, size: displaySize, strokeWidth: stroke });
  } catch {
    // fallback — simple replace
    let svg = icon.svg;
    svg = svg.replace(/width="[^"]*"/g, `width="${displaySize}"`).replace(/height="[^"]*"/g, `height="${displaySize}"`);
    svg = svg.replace(/stroke="currentColor"/gi, `stroke="#${color}"`).replace(/fill="currentColor"/gi, `fill="#${color}"`);
    return svg;
  }
}

function getSvgPaths(svg: string): { d: string; len: number }[] {
  const out: { d: string; len: number }[] = [];
  const re = /<path\b[^>]*\bd="([^"]*)"[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) out.push({ d: m[1], len: m[1].length });
  return out;
}

/** Dim every path except the active one, so hovering a path tab highlights it in the preview. */
function highlightSvgPath(svg: string, active: number | null): string {
  if (active === null) return svg;
  let i = -1;
  return svg.replace(/<path\b[^>]*>/gi, (tag) => {
    i++;
    if (i === active) return tag;
    // NBSP-safe: match standalone opacity only, not fill-opacity.
    if (/(?:\s)opacity\s*=/.test(tag)) return tag;
    return tag.replace(/<path\b/, '<path opacity="0.2"');
  });
}

export function IconPreviewModal({ icon, onClose, onNavigate }: { icon: IconCardData | null; onClose: () => void; onNavigate?: (icon: IconCardData) => void }) {
  const [previewColor, setPreviewColor] = useState('7c9a82');
  const [previewSize, setPreviewSize] = useState(48);
  const [previewStroke, setPreviewStroke] = useState(2);
  const [format, setFormat] = useState<'svg' | 'png' | 'webp'>('svg');
  const [codeTab, setCodeTab] = useState<'html' | 'react' | 'url'>('html');
  const [copied, setCopied] = useState<string | null>(null);
  const [bg, setBg] = useState<'light' | 'dark' | 'check'>('check');
  const [activePath, setActivePath] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [variantIcons, setVariantIcons] = useState<IconCardData[] | null>(null);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!icon) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [icon, onClose]);

  useEffect(() => {
    if (icon) {
      setPreviewColor('7c9a82');
      setPreviewSize(48);
      setPreviewStroke(2);
      setFormat('svg');
      setCodeTab('html');
      setActivePath(null);
      setZoomed(false);
    }
  }, [icon?.name]);

  // Variants folder — fetch sibling icons (same family) for live mini previews.
  useEffect(() => {
    const names = icon?.variants;
    if (!icon || !names?.length) {
      setVariantIcons(null);
      setVariantsLoading(false);
      return;
    }
    let cancelled = false;
    setVariantsLoading(true);
    setVariantIcons(null);
    Promise.all(names.map(n => api.icons.meta(n).then(r => r.data).catch(() => null)))
      .then(list => {
        if (cancelled) return;
        setVariantIcons(list.filter((v): v is IconCardData => !!v));
      })
      .finally(() => {
        if (!cancelled) setVariantsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [icon?.name]);

  if (!icon) return null;

  const hasStroke = /stroke/i.test(icon.svg);
  const iconUrl = buildIconUrl(icon.name, { color: previewColor, size: previewSize, format, stroke: hasStroke ? previewStroke : undefined });
  // Same-origin URL for download/raw — absolute prod URLs break on localhost/previews.
  const downloadUrl = buildIconPath(icon.name, { color: previewColor, size: previewSize, format, stroke: hasStroke ? previewStroke : undefined });
  const svgPaths = getSvgPaths(icon.svg);
  const displaySize = zoomed ? 360 : Math.min(previewSize, 256);
  const previewSvg = highlightSvgPath(
    getPreviewSvg(icon, previewColor, displaySize, hasStroke ? previewStroke : undefined),
    activePath
  );

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const download = async () => {
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${icon.name}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(iconUrl, '_blank');
    }
  };

  const snippet = (() => {
    if (codeTab === 'react') return `<img src="${iconUrl}" alt="${icon.name}" width={${previewSize}} height={${previewSize}} />`;
    if (codeTab === 'url') return iconUrl;
    return `<img src="${iconUrl}" alt="${icon.name}" />`;
  })();

  const bgClass = bg === 'light' ? 'bg-white' : bg === 'dark' ? 'bg-[#0f0f0f]' : 'bg-[repeating-conic-gradient(#e5e0d8_0%_25%,#faf8f5_0%_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#2a2926_0%_25%,#1a1816_0%_50%)]';

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${icon.name} preview`}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-[1120px] max-h-[94vh] rounded-2xl border border-border-primary bg-bg-card shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar — title + close, no overlap */}
        <div className="h-10 flex items-center justify-between px-4 border-b border-border-primary bg-bg-card shrink-0">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="font-medium truncate">{icon.name}</span>
            <span className="hidden sm:inline text-text-muted">·</span>
            <span className="hidden sm:inline text-text-muted truncate">{icon.category}</span>
            {icon.source && <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-bg-secondary border border-border-primary text-[10px] font-medium">{icon.source}</span>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-secondary border border-border-primary flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-colors shrink-0 ml-3"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left — preview */}
          <div className="flex-1 flex flex-col min-h-[260px] lg:min-h-[600px] border-b lg:border-b-0 lg:border-r border-border-primary">
            <div className="px-4 h-9 flex items-center justify-between border-b border-border-primary bg-bg-secondary shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-muted">Preview</span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-bg-card border border-border-primary text-[11px] font-mono tabular text-text-muted">
                  {previewSize}×{previewSize} · {format.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['check', 'light', 'dark'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setBg(v)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${bg === v ? 'border-accent ring-2 ring-accent/20' : 'border-border-primary hover:border-border-hover'}`}
                    title={v === 'check' ? 'Checkerboard' : v}
                    style={{ background: v === 'check' ? 'repeating-conic-gradient(#e5e0d8 0% 25%, #faf8f5 0% 50%)' : v === 'light' ? '#fff' : '#0f0f0f' }}
                  />
                ))}
              </div>
            </div>

            {/* SVG Path Indexes — hover a tab to highlight that path in the preview */}
            {svgPaths.length > 1 && (
              <div className="flex items-stretch border-b border-border-primary bg-bg-card shrink-0 text-xs" onMouseLeave={() => setActivePath(null)}>
                <span className="px-4 flex items-center font-medium text-text-muted shrink-0">SVG Path Indexes</span>
                {svgPaths.map((_, i) => {
                  const isOn = activePath === i;
                  return (
                    <button
                      key={i}
                      onMouseEnter={() => setActivePath(i)}
                      onFocus={() => setActivePath(i)}
                      onBlur={() => setActivePath(null)}
                      className={`flex-1 py-2 font-mono tabular border-l border-border-primary transition-colors ${isOn ? 'bg-accent-light text-accent font-semibold' : 'text-text-secondary hover:bg-bg-secondary'}`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            )}

          <div
            className={`flex-1 flex items-center justify-center p-8 ${bgClass} relative overflow-auto ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setZoomed(z => !z)}
            title={zoomed ? 'Click to reset zoom' : 'Click to enlarge'}
          >
            <div
              className="[&_svg]:w-full [&_svg]:h-full drop-shadow-sm transition-all duration-200"
              style={{ width: displaySize, height: displaySize, color: `#${previewColor}` }}
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
            <span className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-bg-card/90 border border-border-primary text-[11px] text-text-muted pointer-events-none">
              {zoomed ? 'Click to reset' : 'Click to enlarge'}
            </span>
          </div>

          {/* Variants strip — full folder in fixed order, current highlighted in place.
              Deduplicated by name: stale siblings from the previous icon can
              overlap the new icon on navigation before refetch completes. */}
          {icon.variants && icon.variants.length > 0 && (
            <div className="flex items-stretch border-t border-border-primary bg-bg-card shrink-0">
              <span className="px-4 flex items-center text-xs font-medium text-text-muted shrink-0">Variants</span>
              <div className="flex-1 flex items-center gap-1.5 px-3 py-2 overflow-x-auto">
                {(() => {
                  // Only siblings of the CURRENT folder (stale results from the
                  // previous icon are excluded instantly, before refetch lands).
                  const allowed = new Set(icon.variants ?? []);
                  const folder = new Map<string, IconCardData>();
                  for (const v of variantIcons ?? []) {
                    if (v.name !== icon.name && allowed.has(v.name)) folder.set(v.name, v);
                  }
                  folder.set(icon.name, icon);
                  return [...folder.values()]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(v =>
                      v.name === icon.name ? (
                        <span
                          key={v.name}
                          title={v.name}
                          className="w-11 h-11 shrink-0 rounded-lg border border-accent bg-accent-light/50 p-1.5 block text-accent [&_svg]:w-full [&_svg]:h-full ring-1 ring-accent/30"
                          dangerouslySetInnerHTML={{ __html: getPreviewSvg(v, previewColor, 24) }}
                        />
                      ) : (
                        <button
                          key={v.name}
                          onClick={() => onNavigate?.(v)}
                          title={v.name}
                          className="w-11 h-11 shrink-0 rounded-lg border border-border-primary bg-bg-card p-1.5 block text-text-secondary hover:text-text-primary hover:border-accent [&_svg]:w-full [&_svg]:h-full transition-colors"
                          dangerouslySetInnerHTML={{ __html: getPreviewSvg(v, previewColor, 24) }}
                        />
                      )
                    );
                })()}
                {variantsLoading && (
                  <>
                    <span className="w-11 h-11 shrink-0 rounded-lg border border-border-primary skeleton" />
                    <span className="w-11 h-11 shrink-0 rounded-lg border border-border-primary skeleton" />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-3 bg-bg-secondary border-t border-border-primary flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2 text-text-muted truncate">
              <span className="hidden sm:inline">Tags:</span>
              <span className="truncate">{icon.tags?.slice(0, 4).join(' · ') || '—'}</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-text-muted tabular">
              <span className="w-2 h-2 rounded-full" style={{ background: `#${previewColor}` }} />
              {previewColor.toUpperCase()} · {previewStroke}px
            </span>
          </div>
        </div>

        {/* Right — controls */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col max-h-[50vh] lg:max-h-[660px] overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-visible p-5 space-y-5 overscroll-contain">
            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Color</label>
                <span className="text-xs font-mono tabular text-text-muted">#{previewColor.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <ColorPicker value={previewColor} onChange={setPreviewColor} />
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {['7c9a82', '2c2825', '3b82f6', 'ef4444', 'f59e0b', '10b981', '8b5cf6', 'ec4899'].map(c => (
                    <button
                      key={c}
                      onClick={() => setPreviewColor(c)}
                      className={`w-7 h-7 rounded-full border-2 shrink-0 transition-all ${previewColor === c ? 'border-accent scale-110 ring-2 ring-accent/20' : 'border-white dark:border-bg-card shadow-sm hover:scale-105'}`}
                      style={{ background: `#${c}` }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Size + Stroke — stroke hidden if icon doesn't support it */}
            <div className={`grid gap-4 ${hasStroke ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Size</label>
                  <span className="text-xs font-mono tabular">{previewSize}px</span>
                </div>
                <input type="range" min={16} max={512} step={8} value={previewSize} onChange={e => setPreviewSize(Number(e.target.value))} className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent" />
              </div>
              {hasStroke && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Stroke</label>
                    <span className="text-xs font-mono tabular">{previewStroke}px</span>
                  </div>
                  <input type="range" min={0.5} max={4} step={0.5} value={previewStroke} onChange={e => setPreviewStroke(Number(e.target.value))} className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent" />
                </div>
              )}
            </div>
            {previewSize > 256 && <p className="text-[11px] text-text-muted -mt-3">Preview capped at 256px — export is {previewSize}px.</p>}

            {/* Format */}
            <div>
              <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted mb-2 block">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['svg', 'png', 'webp'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`h-9 rounded-full border text-xs font-medium transition-colors ${format === f ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-card border-border-primary text-text-muted hover:text-text-primary hover:border-border-hover'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">{format === 'svg' ? 'Vector, infinite scale' : format === 'png' ? 'Raster, transparent background' : 'Modern, smaller file'}</p>
            </div>

            {/* Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Code</label>
                <div className="flex gap-1">
                  {(['html', 'react', 'url'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setCodeTab(t)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${codeTab === t ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-secondary border-border-primary text-text-muted hover:text-text-primary'}`}
                    >
                      {t === 'url' ? 'URL' : t === 'html' ? 'HTML' : 'React'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden">
                <div className="px-3 py-2 flex items-center justify-between border-b border-border-primary bg-bg-card">
                  <span className="text-[11px] font-mono text-text-muted">{codeTab === 'url' ? 'URL' : codeTab === 'html' ? 'HTML' : 'JSX'}</span>
                  <button onClick={() => copy(snippet, 'snippet')} className="text-xs font-medium text-accent hover:text-accent-hover">{copied === 'snippet' ? 'Copied' : 'Copy'}</button>
                </div>
                <pre className="p-3 text-xs leading-5 font-[family-name:var(--font-jetbrains)] text-text-secondary overflow-x-auto whitespace-pre-wrap break-all">{snippet}</pre>
              </div>
            </div>

            {/* SVG paths — index, size, copy */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">SVG paths</label>
                <span className="text-xs font-mono tabular text-text-muted">{svgPaths.length} {svgPaths.length === 1 ? 'path' : 'paths'}</span>
              </div>
              <div className="rounded-xl border border-border-primary bg-bg-secondary overflow-hidden divide-y divide-border-primary">
                {svgPaths.map((p, i) => (
                  <div key={i} className="px-3 py-2 flex items-center gap-2 bg-bg-card">
                    <span className="text-[11px] font-mono tabular text-text-muted shrink-0">#{i + 1}</span>
                    <code className="text-[11px] font-mono text-text-secondary truncate flex-1">d · {p.len} chars</code>
                    <button onClick={() => copy(p.d, `path-${i}`)} className="text-[11px] font-medium text-accent hover:text-accent-hover shrink-0">{copied === `path-${i}` ? 'Copied' : 'Copy d'}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border-primary bg-bg-secondary flex gap-2 shrink-0">
            <button onClick={() => copy(iconUrl, 'url')} className="flex-1 h-9 rounded-full bg-text-primary text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity">
              {copied === 'url' ? '✓ Copied' : 'Copy URL'}
            </button>
            <button onClick={download} className="h-9 px-4 rounded-full bg-bg-card border border-border-primary text-sm font-medium hover:bg-bg-card-hover transition-colors">
              Download
            </button>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-bg-card border border-border-primary flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-colors" aria-label="Open raw">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
