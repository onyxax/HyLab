'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useCategories } from '@/hooks/useCategories';
import { useIcons } from '@/hooks/useIcons';
import { CategoryFilterCompact } from '@/components/icons/CategoryFilter';
import { buildIconUrl } from '@/lib/api/client';

export default function Home() {
  useScrollToTop();
  const { categories } = useCategories();
  const { icons, category, setCategory, search, setSearch, loading } = useIcons({ limit: 36 });
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyIcon = (name: string) => {
    navigator.clipboard.writeText(buildIconUrl(name, {}));
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 1200);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      {/* ─── Hero — asymmetric split, textured ───── */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden grain">
        {/* Subtle background photo */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://picsum.photos/seed/hylab-hero/1920/1080"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/0 via-bg-primary/60 to-bg-primary" />
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-24 left-[8%] w-[520px] h-[520px] bg-accent/[0.07] rounded-full blur-[80px]" />
          <div className="absolute top-48 right-[12%] w-[360px] h-[360px] bg-accent/[0.04] rounded-full blur-[60px]" />
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">
          {/* Left — editorial, left-aligned */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 badge badge-accent mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              FREE & OPEN SOURCE — MIT
            </div>

            <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-bold font-[family-name:var(--font-outfit)] tracking-[-0.03em] leading-[0.95] mb-5 text-wrap-balance">
              The Icons API
              <br />
              <span className="text-accent font-[600]">for Modern Apps</span>
            </h1>

            <p className="text-[17px] md:text-lg text-text-secondary leading-relaxed max-w-[52ch] mb-8">
              <span className="font-semibold text-text-primary tabular">18,039</span> icons from 10 sources. One endpoint.
              <br className="hidden md:block" />
              Any color, size, or format — no auth required.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/docs" className="btn btn-primary">Get Started</Link>
              <Link href="/browse" className="btn btn-secondary">Browse Icons</Link>
              <a
                href="https://github.com/onyxax/HyLab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors px-3 py-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                Star on GitHub
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> All systems operational</span>
              <span>·</span>
              <span>~42ms avg</span>
            </div>
          </div>

          {/* Right — code card with overlap */}
          <div className="relative lg:-mt-4">
            <div className="absolute -inset-3 bg-gradient-to-br from-accent/10 to-transparent rounded-[20px] blur-xl opacity-40" aria-hidden="true" />
            <div className="relative code-block text-left shadow-tinted overflow-hidden rounded-[16px] border border-border-primary/60 bg-bg-card">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary bg-bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e8706a] border border-black/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e5c07b] border border-black/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#98c379] border border-black/10" />
                  </div>
                  <span className="text-[11px] text-text-muted ml-2 font-[family-name:var(--font-jetbrains)] tracking-wide">terminal — zsh</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=24"');
                  }}
                  className="text-xs text-text-muted hover:text-accent transition-colors font-[family-name:var(--font-jetbrains)] px-2 py-1 rounded-md hover:bg-bg-tertiary"
                >
                  Copy
                </button>
              </div>
              <pre className="p-5 overflow-x-auto">
                <code className="text-[13px] leading-relaxed font-[family-name:var(--font-jetbrains)]">
                  <span className="text-text-muted"># No install — just use the URL</span>
                  {'\n'}
                  <span className="text-accent">$</span>{' '}
                  <span className="text-[#98c379]">curl</span>{' '}
                  <span className="text-text-primary">"https://hylab.vercel.app/api/icons/</span>
                  <span className="text-accent font-medium">home</span>
                  <span className="text-[#e5c07b]">?color=7c9a82&amp;size=32</span>
                  <span className="text-text-primary">"</span>
                  {'\n\n'}
                  <span className="text-text-muted">{'<!-- HTML -->'}</span>
                  {'\n'}
                  <span className="text-text-secondary">{'<img src="'}</span>
                  <span className="text-accent">https://hylab.vercel.app/api/icons/home?color=7c9a82</span>
                  <span className="text-text-secondary">{'" alt="Home" />'}</span>
                </code>
              </pre>
              <div className="px-4 py-3 bg-accent-light/50 border-t border-border-primary flex items-center justify-between">
                <span className="text-xs text-text-secondary">Drop into any project — React, Vue, plain HTML</span>
                <Link href="/docs" className="text-xs font-medium text-accent hover:text-accent-hover">Docs →</Link>
              </div>
            </div>
            {/* Floating mini stats */}
            <div className="hidden lg:flex absolute -bottom-6 -left-6 bg-bg-card border border-border-primary rounded-xl shadow-tinted px-4 py-3 gap-5">
              <div>
                <div className="text-[11px] tracking-widest text-text-muted uppercase">Icons</div>
                <div className="text-sm font-semibold tabular">18,039</div>
              </div>
              <div className="w-px bg-border-primary" />
              <div>
                <div className="text-[11px] tracking-widest text-text-muted uppercase">Sources</div>
                <div className="text-sm font-semibold">10</div>
              </div>
              <div className="w-px bg-border-primary" />
              <div>
                <div className="text-[11px] tracking-widest text-text-muted uppercase">Latency</div>
                <div className="text-sm font-semibold tabular">~42ms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats — asymmetric, not 3 equal columns ── */}
      <section className="border-y border-border-primary bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-[1.4fr_1fr_1fr] gap-6 items-center">
          <div className="flex items-baseline gap-4">
            <div className="text-4xl md:text-[42px] font-bold font-[family-name:var(--font-outfit)] tracking-[-0.02em] tabular text-accent leading-none">18,039</div>
            <div>
              <div className="text-sm font-semibold tracking-tight">icons</div>
              <div className="text-xs text-text-muted">from 10 sources · MIT/Apache/ISC</div>
            </div>
          </div>
          <div className="flex items-center gap-4 md:border-l md:border-border-primary md:pl-6">
            <div className="text-2xl font-bold tabular tracking-tight">14</div>
            <div className="text-sm text-text-secondary">categories</div>
            <span className="hidden md:block ml-auto w-px h-8 bg-border-primary" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold tabular tracking-tight">3</div>
            <div className="text-sm text-text-secondary">formats — SVG, PNG, WebP</div>
          </div>
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

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 18,000+ icons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-primary bg-bg-card text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <CategoryFilterCompact categories={categories} selected={category} onSelect={setCategory} />
          </div>

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
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-bg-primary text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                      {copiedIcon === icon.name ? '✓ Copied' : icon.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-text-muted mt-4">Click any icon to copy its API URL</p>
        </div>
      </section>

      {/* ─── Integration — broken grid, editorial ── */}
      <section className="py-16 md:py-20 px-6 border-y border-border-primary bg-bg-secondary/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="label mb-3">Integration</div>
            <h2 className="text-[32px] md:text-[38px] font-bold font-[family-name:var(--font-outfit)] tracking-[-0.02em] leading-[0.95] mb-4 text-wrap-balance">
              Works with any stack.
              <br />
              <span className="text-text-secondary font-medium">No SDK required.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-[48ch] mb-6">
              Drop a URL into <span className="text-text-primary font-medium">HTML</span>, <span className="text-text-primary font-medium">React</span>, Vue, Svelte or plain CSS. Add <code className="px-1.5 py-0.5 rounded bg-bg-card border border-border-primary text-xs font-mono">?color=&amp;size=&amp;format=</code> to customize on the fly.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['HTML', 'React', 'Next.js', 'Vue', 'Svelte', 'Python', 'curl'].map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-bg-card border border-border-primary text-text-secondary">{t}</span>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:pl-4">
            <div className="code-block rounded-[14px] shadow-tinted">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary bg-bg-secondary/40">
                <span className="text-[11px] tracking-widest text-text-muted uppercase font-medium">HTML</span>
                <span className="text-[11px] text-text-muted">copy & paste</span>
              </div>
              <pre className="p-4">
                <code className="text-sm">{`<img
  src="https://hylab.vercel.app/api/icons/home
    ?color=7c9a82&size=24"
  alt="Home"
/>`}</code>
              </pre>
            </div>

            <div className="code-block rounded-[16px] overflow-hidden border-accent/20 shadow-tinted">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary bg-accent-light/40">
                <span className="text-[11px] tracking-widest text-accent uppercase font-semibold">React</span>
                <span className="text-[11px] text-text-muted">zero deps</span>
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

            <div className="rounded-xl bg-bg-card border border-border-primary p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-accent">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="text-sm">
                <div className="font-medium">Tip — use PNG/WebP for emails</div>
                <div className="text-xs text-text-muted">Add <span className="font-mono text-text-secondary">?format=png&amp;size=64</span> for raster.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA — with ambient image ────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://picsum.photos/seed/hylab-cta/1920/800" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/40" />
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[32px] md:text-[40px] font-bold font-[family-name:var(--font-outfit)] tracking-[-0.02em] leading-[0.9] mb-4 text-wrap-balance">
            Start building today
          </h2>
          <p className="text-text-secondary mb-8 max-w-[50ch] mx-auto">No signup. No API key. Just use it — 18,039 icons ready in one URL.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/docs" className="btn btn-primary text-base px-8 py-3">Read the Docs</Link>
            <Link href="/browse" className="btn btn-secondary text-base px-8 py-3">Browse Icons</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
