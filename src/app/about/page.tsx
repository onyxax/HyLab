'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function AboutPage() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      {/* Hero — editorial, left-aligned, generous top */}
      <section className="pt-8 pb-10 px-6 border-b border-border-primary">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-card px-3 py-1 text-[11px] font-medium tracking-[0.06em] uppercase text-text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              About HyLab
            </div>
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[0.9] font-[family-name:var(--font-outfit)] text-wrap-balance">
              Open source icons
              <span className="block text-text-muted font-medium">for everyone.</span>
            </h1>
            <p className="text-[17px] leading-relaxed text-text-secondary max-w-[48ch] mt-4 text-pretty">
              HyLab curates <span className="font-medium text-text-primary">18,039</span> professional icons from the best open-source libraries and serves them through a single, fast API — no auth, no limits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/browse" className="btn btn-primary h-9 px-5 text-sm">Browse Icons</Link>
              <a href="https://github.com/onyxax/HyLab" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border-primary bg-bg-card text-sm font-medium hover:bg-bg-secondary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Right — manifesto card */}
          <div className="lg:pl-6">
            <div className="rounded-2xl border border-border-primary bg-bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border-primary bg-bg-secondary flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted">Manifesto</span>
                <span className="text-xs tabular text-text-muted">v1.0 · MIT</span>
              </div>
              <div className="p-5 space-y-4 text-sm leading-relaxed text-text-secondary">
                <p><span className="font-medium text-text-primary">Icons shouldn’t be hard.</span> No signup, no API key, no rate limits.</p>
                <p>One endpoint for 10 sources — customize with <code className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-primary font-mono text-xs">?color=&size=&format=</code> and ship.</p>
                <div className="pt-4 border-t border-border-primary grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-lg font-bold tabular">18,039</div><div className="text-[11px] uppercase tracking-wide text-text-muted">Icons</div></div>
                  <div className="border-l border-border-primary"><div className="text-lg font-bold tabular">3</div><div className="text-[11px] uppercase tracking-wide text-text-muted">Formats</div></div>
                  <div className="border-l border-border-primary"><div className="text-lg font-bold tabular">100%</div><div className="text-[11px] uppercase tracking-wide text-text-muted">Free</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1.7fr_0.9fr] gap-10 items-start">
        {/* Left column */}
        <div className="space-y-10">
          {/* Story */}
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">Story</span>
              <span className="h-px flex-1 bg-border-primary hidden sm:block" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-3">Why HyLab?</h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-text-secondary max-w-[60ch]">
              <p>Finding good icons shouldn’t require a signup or an API key. Whether you’re building a startup, a side project, or a design system — you deserve a fast, predictable way to get the right icon.</p>
              <p>HyLab was built for that. We aggregate Tabler, Lucide, Heroicons and more, normalize them, and expose a single edge-cached API. One URL, any color, size, or format — SVG for web, PNG/WebP for email and social.</p>
            </div>
          </section>

          {/* Features — 2 col editorial, not check list */}
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">Principles</span>
              <span className="h-px flex-1 bg-border-primary hidden sm:block" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { t: 'No auth', d: 'Start immediately. No signup, no keys.' },
                { t: 'Any format', d: 'SVG for web, PNG/WebP for raster.' },
                { t: 'Fully customizable', d: 'color, size, stroke — query params.' },
                { t: 'Search & browse', d: 'Fuzzy search across 14 categories.' },
                { t: 'Open source', d: 'Code on GitHub — fork or self-host.' },
                { t: 'Edge fast', d: 'Next.js + Vercel — ~42ms avg.' },
              ].map(item => (
                <div key={item.t} className="rounded-xl border border-border-primary bg-bg-card p-4">
                  <div className="text-sm font-semibold">{item.t}</div>
                  <div className="text-sm text-text-muted leading-relaxed mt-1">{item.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contributing */}
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">Contribute</span>
              <span className="h-px flex-1 bg-border-primary hidden sm:block" />
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
              <div className="px-4 h-9 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
                <span className="text-xs font-mono text-text-muted">Quick start</span>
                <a href="https://github.com/onyxax/HyLab" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-accent hover:text-accent-hover">GitHub →</a>
              </div>
              <pre className="p-4 overflow-x-auto text-[13px] leading-6 font-[family-name:var(--font-jetbrains)] text-text-secondary">{`# fork & clone
git clone https://github.com/onyxax/HyLab.git

# install
npm install

# dev
npm run dev`}</pre>
            </div>
          </section>
        </div>

        {/* Right column — stack & author */}
        <div className="space-y-6 lg:sticky lg:top-[80px]">
          <div className="rounded-xl border border-border-primary bg-bg-card p-4">
            <div className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted mb-3">Tech stack</div>
            <div className="space-y-2 text-sm">
              {[
                ['Next.js', 'Framework'],
                ['TypeScript', 'Language'],
                ['Tailwind', 'Styling'],
                ['Vercel', 'Hosting'],
                ['Lucide · Tabler', 'Icons'],
                ['Sharp', 'Raster'],
              ].map(([name, role]) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-border-primary/50 last:border-0">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs text-text-muted">{role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-text-primary text-bg-primary flex items-center justify-center font-bold">O</div>
              <div>
                <div className="font-semibold leading-none">onyxax</div>
                <div className="text-xs text-text-muted">Developer & Designer</div>
              </div>
              <a href="https://guns.lol/onyxax" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-medium px-3 py-1 rounded-full border border-border-primary hover:bg-bg-secondary transition-colors">Profile →</a>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">Building open tools for modern apps. HyLab is crafted with care for speed, simplicity, and openness.</p>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-secondary/50 p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Ready to build?</div>
              <div className="text-xs text-text-muted">18k icons in one URL</div>
            </div>
            <div className="flex gap-2">
              <Link href="/browse" className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-text-primary text-bg-primary text-xs font-semibold">Browse</Link>
              <Link href="/docs" className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-border-primary bg-bg-card text-xs font-medium">Docs</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
