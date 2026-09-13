'use client';

import { useRef, useEffect, useState } from 'react';
import { ColorPicker } from '@/components/ColorPicker';
import { IconCardData } from './IconCard';
import { buildIconUrl } from '@/lib/api/client';

function getPreviewSvg(icon: IconCardData, color: string, size: number) {
  const displaySize = Math.min(size, 128);
  let svg = icon.svg;
  if (svg.includes('width=')) {
    svg = svg.replace(/width="[^"]*"/g, `width="${displaySize}"`);
  } else {
    svg = svg.replace('<svg ', `<svg width="${displaySize}" `);
  }
  if (svg.includes('height=')) {
    svg = svg.replace(/height="[^"]*"/g, `height="${displaySize}"`);
  } else {
    svg = svg.replace('<svg ', `<svg height="${displaySize}" `);
  }
  svg = svg.replace(/stroke="currentColor"/g, `stroke="#${color}"`);
  svg = svg.replace(/fill="currentColor"/g, `fill="#${color}"`);
  return svg;
}

export function IconPreviewModal({
  icon,
  onClose,
}: {
  icon: IconCardData | null;
  onClose: () => void;
}) {
  const [previewColor, setPreviewColor] = useState('7c9a82');
  const [previewSize, setPreviewSize] = useState(48);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [codeTab, setCodeTab] = useState('html');
  const [format, setFormat] = useState<'svg' | 'png' | 'webp'>('svg');
  const [formatOpen, setFormatOpen] = useState(false);
  const formatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) setFormatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!icon) return null;

  const iconUrl = buildIconUrl(icon.name, { color: previewColor, size: previewSize, format });

  const getSnippet = () => {
    const alt = icon.name;
    switch (codeTab) {
      case 'react':
        return `<img src="${iconUrl}" alt="${alt}" />`;
      case 'nextjs':
        return `import Image from 'next/image';\n\n<Image\n  src="${iconUrl}"\n  alt="${alt}"\n  width={${previewSize}}\n  height={${previewSize}}\n/>`;
      case 'vue':
        return `<template>\n  <img src="${iconUrl}" alt="${alt}" />\n</template>`;
      case 'svelte':
        return `<img src="${iconUrl}" alt="${alt}" />`;
      default:
        return `<img src="${iconUrl}" alt="${alt}" />`;
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(iconUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1200);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-bg-card border border-border-primary rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-bg-secondary hover:bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pb-4 flex items-center justify-center border-b border-border-primary bg-bg-secondary rounded-t-2xl">
          <div dangerouslySetInnerHTML={{ __html: getPreviewSvg(icon, previewColor, previewSize) }} />
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-1">{icon.name}</h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              {icon.source && <span className="badge badge-accent text-[10px]">{icon.source}</span>}
              <span>{icon.category}</span>
              {icon.tags?.length > 0 && (
                <>
                  <span>·</span>
                  <span>{icon.tags.slice(0, 4).join(', ')}</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Color</label>
              <div className="flex items-center gap-3">
                <ColorPicker value={previewColor} onChange={setPreviewColor} />
                <div className="flex gap-1.5 flex-wrap">
                  {['7c9a82', '3b82f6', 'ef4444', 'f59e0b', '8b5cf6', 'ec4899', '2c2825', 'f0ece6'].map(c => (
                    <button
                      key={c}
                      onClick={() => setPreviewColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all shrink-0 ${previewColor === c ? 'border-accent scale-110 ring-2 ring-accent/30' : 'border-transparent hover:scale-105'}`}
                      style={{ background: `#${c}` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-text-muted uppercase tracking-wider">Size</label>
                <span className="text-sm font-mono text-text-secondary">{previewSize}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={512}
                value={previewSize}
                onChange={e => setPreviewSize(Number(e.target.value))}
                className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
              />
              {previewSize > 128 && (
                <p className="text-[10px] text-text-muted mt-1.5">Preview capped at 128px — exported icon will be {previewSize}px</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Format</label>
            <div ref={formatRef} className="relative">
              <button
                onClick={() => setFormatOpen(!formatOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm bg-bg-secondary border border-border-primary rounded-lg hover:border-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${format === 'svg' ? 'bg-emerald-400' : format === 'png' ? 'bg-blue-400' : 'bg-purple-400'}`} />
                  <span className="uppercase font-medium text-text-primary">{format}</span>
                  <span className="text-xs text-text-muted">— {format === 'svg' ? 'Vector, scalable' : format === 'png' ? 'Raster, transparent bg' : 'Raster, small size'}</span>
                </div>
                <svg className={`w-4 h-4 text-text-muted transition-transform ${formatOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {formatOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-bg-card border border-border-primary rounded-lg shadow-xl z-10 overflow-hidden">
                  {[
                    { id: 'svg' as const, label: 'SVG', desc: 'Vector, scalable', color: 'bg-emerald-400' },
                    { id: 'png' as const, label: 'PNG', desc: 'Raster, transparent bg', color: 'bg-blue-400' },
                    { id: 'webp' as const, label: 'WebP', desc: 'Raster, small size', color: 'bg-purple-400' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFormat(f.id);
                        setFormatOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${format === f.id ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${f.color}`} />
                      <span className="font-medium uppercase">{f.label}</span>
                      <span className="text-xs text-text-muted">— {f.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">Code</label>
              <button onClick={copySnippet} className="text-xs text-accent hover:text-accent-hover transition-colors">
                {copiedSnippet ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex gap-1 mb-2">
              {(['html', 'react', 'nextjs', 'vue', 'svelte'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${codeTab === tab ? 'bg-accent text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'}`}
                >
                  {tab === 'html' ? 'HTML' : tab === 'nextjs' ? 'Next.js' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="code-block">
              <pre className="p-3 text-xs overflow-x-auto">
                <code>{getSnippet()}</code>
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={copyUrl} className="btn btn-primary flex-1">
              {copiedUrl ? '✓ URL Copied' : 'Copy URL'}
            </button>
            <a href={iconUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex-1 text-center">
              Open Raw
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
