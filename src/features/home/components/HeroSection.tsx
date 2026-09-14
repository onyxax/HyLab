'use client';

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="pt-10 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          <div className="lg:col-span-6 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-card px-3 py-1 text-[11px] font-medium tracking-[0.08em] uppercase text-text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Free & open source — MIT
            </div>

            <h1 className="font-[family-name:var(--font-outfit)] font-bold tracking-[-0.04em] leading-[0.85] text-wrap-balance">
              <span className="block text-[44px] md:text-[60px] lg:text-[68px]">The Icons API</span>
              <span className="block text-[44px] md:text-[60px] lg:text-[68px] text-text-muted font-[500]">for Modern Apps</span>
            </h1>

            <p className="mt-5 text-[17px] leading-relaxed text-text-secondary max-w-[46ch] text-pretty">
              <span className="font-semibold text-text-primary">18,039</span> icons from 10 sources. One endpoint.
              Any color, size, or format — no auth, no limits.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/docs" className="btn btn-primary h-10 px-6 text-[14px]">Get Started</Link>
              <Link href="/browse" className="btn btn-secondary h-10 px-6 text-[14px]">Browse Icons</Link>
              <a
                href="https://github.com/onyxax/HyLab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border-primary bg-bg-card text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 shrink-0 block" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                Star on GitHub
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-text-muted border-t border-border-primary pt-4 max-w-[46ch]">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />All systems operational</span>
              <span className="w-px h-3 bg-border-primary" aria-hidden="true" />
              <span>~42ms avg response</span>
              <span className="w-px h-3 bg-border-primary" aria-hidden="true" />
              <span>Cached at the edge</span>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-4">
            <div className="rounded-[16px] border border-border-primary bg-bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 h-10 border-b border-border-primary bg-bg-secondary">
                <div className="flex items-center gap-2.5">
                  <span className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10" />
                  </span>
                  <span className="ml-2 text-[11px] tracking-[0.08em] uppercase font-medium text-text-muted font-[family-name:var(--font-jetbrains)]">curl — hylab</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('curl "https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32"')}
                  className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-bg-tertiary"
                >
                  Copy
                </button>
              </div>

              <div className="px-5 py-5 bg-bg-card">
                <div className="font-[family-name:var(--font-jetbrains)] text-[13px] leading-6">
                  <div className="text-text-muted"># No install — just use the URL</div>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="text-accent">$</span>
                    <span className="text-[#98c379]">curl</span>
                    <span className="text-text-primary break-all">“https://hylab.vercel.app/api/icons/<span className="text-accent font-medium">home</span><span className="text-[#e5c07b]">?color=7c9a82&size=32</span>”</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-primary/60">
                    <div className="text-text-muted text-xs mb-2 font-[family-name:var(--font-jetbrains)] tracking-wide uppercase">HTML — drop in anywhere</div>
                    <div className="rounded-lg bg-bg-secondary border border-border-primary px-3 py-3 text-[13px] text-text-secondary overflow-x-auto">
                      <span className="text-text-muted">&lt;img src=</span><span className="text-accent">“https://hylab.vercel.app/api/icons/home?color=7c9a82”</span><span className="text-text-muted"> alt=”Home” /&gt;</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 h-10 bg-bg-secondary border-t border-border-primary flex items-center justify-between text-xs">
                <span className="text-text-muted">Works with React, Vue, Svelte, plain HTML</span>
                <Link href="/docs" className="font-medium text-accent hover:text-accent-hover">Docs →</Link>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                { k: '18,039', v: 'icons' },
                { k: '10', v: 'sources' },
                { k: '3', v: 'formats' },
              ].map(item => (
                <div key={item.v} className="rounded-xl border border-border-primary bg-bg-card py-3">
                  <div className="text-sm font-bold tabular tracking-tight">{item.k}</div>
                  <div className="text-[11px] tracking-[0.06em] uppercase text-text-muted">{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
