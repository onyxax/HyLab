'use client';

import { useEffect, useRef, useState } from 'react';
import { ColorPicker } from '@/components/ColorPicker';
import { IconCardData } from './IconCard';
import { buildIconUrl } from '@/lib/api/client';
import { customizeSvg } from '@/domain/icons/transforms/customizeSvg';

function getPreviewSvg(icon: IconCardData, color: string, size: number, stroke?: number) {
  const displaySize = Math.min(size, 256);
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

export function IconPreviewModal({ icon, onClose }: { icon: IconCardData | null; onClose: () => void }) {
  const [previewColor, setPreviewColor] = useState('7c9a82');
  const [previewSize, setPreviewSize] = useState(48);
  const [previewStroke, setPreviewStroke] = useState(2);
  const [format, setFormat] = useState<'svg' | 'png' | 'webp'>('svg');
  const [codeTab, setCodeTab] = useState<'html' | 'react' | 'url'>('html');
  const [copied, setCopied] = useState<string | null>(null);
  const [bg, setBg] = useState<'light' | 'dark' | 'check'>('check');
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
    }
  }, [icon?.name]);

  if (!icon) return null;

  const hasStroke = /stroke/i.test(icon.svg);
  const iconUrl = buildIconUrl(icon.name, { color: previewColor, size: previewSize, format, stroke: hasStroke ? previewStroke : undefined });
  const previewSvg = getPreviewSvg(icon, previewColor, previewSize, hasStroke ? previewStroke : undefined);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const download = async () => {
    try {
      const res = await fetch(iconUrl);
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
        className="relative w-full max-w-[860px] max-h-[90vh] rounded-2xl border border-border-primary bg-bg-card shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-200"
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
          <div className="flex-1 flex flex-col min-h-[260px] lg:min-h-[480px] border-b lg:border-b-0 lg:border-r border-border-primary">
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

          <div className={`flex-1 flex items-center justify-center p-8 ${bgClass} relative overflow-hidden`}>
            <div
              className="[&_svg]:w-full [&_svg]:h-full drop-shadow-sm"
              style={{ width: Math.min(previewSize, 256), height: Math.min(previewSize, 256), color: `#${previewColor}` }}
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          </div>

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
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col max-h-[50vh] lg:max-h-[520px] overflow-hidden">
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
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border-primary bg-bg-secondary flex gap-2 shrink-0">
            <button onClick={() => copy(iconUrl, 'url')} className="flex-1 h-9 rounded-full bg-text-primary text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity">
              {copied === 'url' ? '✓ Copied' : 'Copy URL'}
            </button>
            <button onClick={download} className="h-9 px-4 rounded-full bg-bg-card border border-border-primary text-sm font-medium hover:bg-bg-card-hover transition-colors">
              Download
            </button>
            <a href={iconUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-bg-card border border-border-primary flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-colors" aria-label="Open raw">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
