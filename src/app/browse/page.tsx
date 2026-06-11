'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ColorPicker } from '@/components/ColorPicker';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function BrowsePage() {
  useScrollToTop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [icons, setIcons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIcons, setTotalIcons] = useState(0);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<any | null>(null);
  const [previewColor, setPreviewColor] = useState('7c9a82');
  const [previewSize, setPreviewSize] = useState(48);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [totalAllIcons, setTotalAllIcons] = useState(0);
  const [codeTab, setCodeTab] = useState('html');
  const [format, setFormat] = useState<'svg' | 'png' | 'webp'>('svg');
  const [formatOpen, setFormatOpen] = useState(false);
  const formatRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) setFormatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const LIMIT = 48;

  useEffect(() => {
    fetchCategories();
    fetch('/api/icons?page=1&limit=1')
      .then(r => r.json())
      .then(d => setTotalAllIcons(d.meta?.total || 0));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchIcons(page);
  }, [page, selectedCategory]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchIcons(1);
    }, 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery]);

  const fetchCategories = async () => {
    const res = await fetch('/api/icons/categories');
    const data = await res.json();
    setCategories(data.data || []);
  };

  const fetchIcons = async (p: number) => {
    setLoading(true);

    let url: string;
    if (searchQuery.trim()) {
      url = `/api/icons/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (selectedCategory) {
      url = `/api/icons?category=${selectedCategory}&page=${p}&limit=${LIMIT}`;
    } else {
      url = `/api/icons?page=${p}&limit=${LIMIT}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setIcons(data.data || []);
    setTotalIcons(data.meta?.total || data.data?.length || 0);
    setTotalPages(data.meta?.totalPages || 1);
    setLoading(false);
  };

  const copyIconUrl = (name: string) => {
    navigator.clipboard.writeText(iconUrl(name));
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 1200);
  };

  const iconUrl = (name: string) => `http://localhost:3000/api/icons/${name}?color=${previewColor}&size=${previewSize}&format=${format}`;

  const getSnippet = () => {
    if (!selectedIcon) return '';
    const url = iconUrl(selectedIcon.name);
    const alt = selectedIcon.name;
    switch (codeTab) {
      case 'react':
        return `<img src="${url}" alt="${alt}" />`;
      case 'nextjs':
        return `import Image from 'next/image';\n\n<Image\n  src="${url}"\n  alt="${alt}"\n  width={${previewSize}}\n  height={${previewSize}}\n/>`;
      case 'vue':
        return `<template>\n  <img src="${url}" alt="${alt}" />\n</template>`;
      case 'svelte':
        return `<img src="${url}" alt="${alt}" />`;
      default:
        return `<img src="${url}" alt="${alt}" />`;
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1200);
  };

  const getPreviewSvg = () => {
    if (!selectedIcon) return '';
    const displaySize = Math.min(previewSize, 128);
    let svg = selectedIcon.svg;
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
    svg = svg.replace(/stroke="currentColor"/g, `stroke="#${previewColor}"`);
    svg = svg.replace(/fill="currentColor"/g, `fill="#${previewColor}"`);
    return svg;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">
            Browse Icons
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            {totalAllIcons.toLocaleString()} icons across {categories.length} categories
          </p>

          {/* Search */}
          <div className="relative max-w-xl mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, tag, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-3.5 text-base rounded-xl border border-border-primary bg-bg-card text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-text-muted hover:text-text-primary bg-bg-secondary rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover bg-bg-card'
              }`}
            >
              All ({totalAllIcons.toLocaleString()})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover bg-bg-card'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Icons Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="aspect-square skeleton rounded-xl" />
              ))}
            </div>
          ) : icons.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-text-muted opacity-30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold font-[family-name:var(--font-outfit)] mb-2">No icons found</h3>
              <p className="text-text-muted">Try a different search term or category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {icons.map((icon, i) => (
                  <button
                    key={`${icon.name}-${i}`}
                    onClick={() => setSelectedIcon(icon)}
                    className={`group relative aspect-square rounded-xl border bg-bg-card hover:bg-accent-light flex items-center justify-center p-3 transition-all duration-200 cursor-pointer ${
                      selectedIcon?.name === icon.name
                        ? 'border-accent bg-accent-light ring-2 ring-accent/20'
                        : 'border-border-primary hover:border-accent'
                    }`}
                  >
                    <div
                      className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors duration-200 [&_svg]:w-full [&_svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-text-primary text-bg-primary text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium z-10">
                      {icon.name}
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-10">
                  {/* Prev */}
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-lg border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((p, i) =>
                    typeof p === 'string' ? (
                      <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">
                        ···
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          page === p
                            ? 'bg-accent text-white shadow-sm'
                            : 'border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-lg border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Page Info */}
              <p className="text-center text-xs text-text-muted mt-4">
                Page {page} of {totalPages} · {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, totalIcons)} of {totalIcons.toLocaleString()} icons
              </p>
            </>
          )}
        </div>
      </section>

      {/* Icon Detail Panel */}
      {selectedIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedIcon(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-bg-card border border-border-primary rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedIcon(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-bg-secondary hover:bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 pb-4 flex items-center justify-center border-b border-border-primary bg-bg-secondary rounded-t-2xl">
              <div
                className="transition-all duration-200"
                dangerouslySetInnerHTML={{ __html: getPreviewSvg() }}
              />
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-1">{selectedIcon.name}</h3>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="badge badge-accent text-[10px]">{selectedIcon.source}</span>
                  <span>·</span>
                  <span>{selectedIcon.category}</span>
                  {selectedIcon.tags?.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{selectedIcon.tags.slice(0, 4).join(', ')}</span>
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
                          className={`w-7 h-7 rounded-full border-2 transition-all shrink-0 ${
                            previewColor === c ? 'border-accent scale-110 ring-2 ring-accent/30' : 'border-transparent hover:scale-105'
                          }`}
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
                    min="16"
                    max="512"
                    value={previewSize}
                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
                  />
                  {previewSize > 128 && (
                    <p className="text-[10px] text-text-muted mt-1.5">
                      Preview is capped at 128px — the exported icon will be {previewSize}px
                    </p>
                  )}
                </div>
              </div>

              {/* Format selector */}
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
                      {([
                        { id: 'svg' as const, label: 'SVG', desc: 'Vector, scalable', color: 'bg-emerald-400' },
                        { id: 'png' as const, label: 'PNG', desc: 'Raster, transparent bg', color: 'bg-blue-400' },
                        { id: 'webp' as const, label: 'WebP', desc: 'Raster, small size', color: 'bg-purple-400' },
                      ]).map(f => (
                        <button
                          key={f.id}
                          onClick={() => { setFormat(f.id); setFormatOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                            format === f.id
                              ? 'bg-accent/10 text-accent'
                              : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                          }`}
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        codeTab === tab
                          ? 'bg-accent text-white'
                          : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                      }`}
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
                <button
                  onClick={() => copyIconUrl(selectedIcon.name)}
                  className="btn btn-primary flex-1"
                >
                  {copiedIcon === selectedIcon.name ? '✓ URL Copied' : 'Copy URL'}
                </button>
                <a
                  href={iconUrl(selectedIcon.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex-1 text-center"
                >
                  Open Raw
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
