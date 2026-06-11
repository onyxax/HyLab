'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function Home() {
  useScrollToTop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [icons, setIcons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchIcons();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const res = await fetch('/api/icons/categories');
    const data = await res.json();
    setCategories(data.data || []);
  };

  const fetchIcons = async () => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/icons?category=${selectedCategory}&limit=36`
      : '/api/icons?limit=36';
    const res = await fetch(url);
    const data = await res.json();
    setIcons(data.data || []);
    setLoading(false);
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) { fetchIcons(); return; }
    setLoading(true);
    const res = await fetch(`/api/icons/search?q=${searchQuery}`);
    const data = await res.json();
    setIcons(data.data || []);
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => { if (searchQuery) handleSearch(); }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, handleSearch]);

  const copyIcon = (name: string) => {
    navigator.clipboard.writeText(`https://hylab.vercel.app/api/icons/${name}`);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 1200);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 badge badge-accent mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            FREE & OPEN SOURCE
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-[1.05] mb-6">
            The Icons API
            <br />
            <span className="text-accent">for Modern Apps</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            <span className="font-semibold text-text-primary">18,000+</span> icons. One endpoint. Any color, size, or format.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/docs" className="btn btn-primary">Get Started</Link>
            <Link href="/browse" className="btn btn-secondary">Browse Icons</Link>
          </div>

          {/* Code Preview */}
          <div className="code-block text-left max-w-lg mx-auto">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e8706a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e5c07b]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#98c379]" />
                </div>
                <span className="text-xs text-text-muted ml-2 font-[family-name:var(--font-jetbrains)]">terminal</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=24"');
                }}
                className="text-xs text-text-muted hover:text-accent transition-colors font-[family-name:var(--font-jetbrains)]"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-[family-name:var(--font-jetbrains)]">
                <span className="text-accent">$</span>{' '}
                <span className="text-[#98c379]">curl</span>{' '}
                <span className="text-text-primary">"hylab.vercel.app/api/icons/home</span>
                <span className="text-[#e5c07b]">?color=7c9a82&amp;size=24</span>
                <span className="text-text-primary">"</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────── */}
      <section className="border-y border-border-primary">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '18,039', label: 'Icons' },
            { value: '14', label: 'Categories' },
            { value: '3', label: 'Formats' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold font-[family-name:var(--font-outfit)] text-accent mb-1">{s.value}</div>
              <div className="text-sm text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Browse ───────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">
              Browse Icons
            </h2>
            <p className="text-text-secondary">Click any icon to copy its URL</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 18,000+ icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-primary bg-bg-card text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedCategory ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Icons Grid */}
          <div className="bg-bg-card border border-border-primary rounded-2xl p-5">
            {loading ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-3">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="aspect-square skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-3">
                {icons.map((icon, i) => (
                  <button
                    key={`${icon.name}-${i}`}
                    onClick={() => copyIcon(icon.name)}
                    className="group relative aspect-square rounded-xl border border-border-primary hover:border-accent bg-bg-secondary hover:bg-accent-light flex items-center justify-center p-3 transition-all duration-200 cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors duration-200 [&_svg]:w-full [&_svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-bg-primary text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                      {copiedIcon === icon.name ? '✓ Copied' : icon.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-text-muted mt-4">
            Click any icon to copy its API URL
          </p>
        </div>
      </section>

      {/* ─── Integration ──────────────────────────── */}
      <section className="py-20 px-6 border-y border-border-primary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">
              Simple Integration
            </h2>
            <p className="text-text-secondary">Works with any stack</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="code-block">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
                <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">HTML</span>
              </div>
              <pre className="p-4">
                <code className="text-sm">{`<img
  src="https://hylab.vercel.app/api/icons/home
    ?color=7c9a82&size=24"
  alt="Home"
/>`}</code>
              </pre>
            </div>

            <div className="code-block">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
                <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">REACT</span>
              </div>
              <pre className="p-4">
                <code className="text-sm">{`const Icon = ({ name }) => (
  <img
    src={\`https://hylab.vercel.app/api/icons/\${name}\`}
    alt={name}
  />
);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-4">
            Start building today
          </h2>
          <p className="text-text-secondary mb-8">No signup. No API key. Just use it.</p>
          <Link href="/docs" className="btn btn-primary text-base px-8 py-3">Read the Docs</Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <Footer />
    </div>
  );
}
