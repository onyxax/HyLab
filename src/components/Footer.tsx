import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border-primary bg-bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[1.4fr_0.9fr_0.9fr] gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/favicon.svg" alt="HyLab" className="w-8 h-8 rounded-lg" />
              <span className="text-[16px] font-bold tracking-tight font-[family-name:var(--font-outfit)]">HyLab</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-bg-card border border-border-primary text-text-muted font-mono">v1.0</span>
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary mt-3 max-w-[36ch]">
              The Icons API for modern apps — 18,039 icons from 10 families. One endpoint, any color, size, or format. Free and open source.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a href="https://github.com/onyxax/HyLab" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card border border-border-primary text-xs font-medium hover:border-border-hover transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                GitHub
              </a>
              <a href="https://hylab.vercel.app/api/status" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card border border-border-primary text-xs font-medium hover:border-border-hover transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Status
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="text-xs font-semibold tracking-[0.08em] uppercase text-text-muted mb-3">Explore</div>
            <nav className="space-y-2 text-sm">
              <Link href="/browse" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><span className="w-1 h-1 rounded-full bg-border-primary" /> Browse Icons</Link>
              <Link href="/docs" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><span className="w-1 h-1 rounded-full bg-border-primary" /> Documentation</Link>
              <Link href="/about" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><span className="w-1 h-1 rounded-full bg-border-primary" /> About</Link>
              <Link href="/status" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><span className="w-1 h-1 rounded-full bg-border-primary" /> System Status</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-semibold tracking-[0.08em] uppercase text-text-muted mb-3">Resources</div>
            <nav className="space-y-2 text-sm">
              <a href="https://github.com/onyxax/HyLab" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">GitHub <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>
              <a href="https://github.com/onyxax/HyLab/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">MIT License</a>
              <span className="flex items-center gap-2 text-text-muted text-xs mt-2">No tracking · No cookies</span>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-primary flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>© 2026 HyLab</span>
            <span className="w-px h-3 bg-border-primary" aria-hidden="true" />
            <span>Icons from Tabler, Lucide, Heroicons & others — respective licenses apply.</span>
          </div>
          <a href="https://guns.lol/onyxax" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-bg-card border border-border-primary hover:border-accent/30 transition-colors">
            <img src="/favicon.svg" alt="" className="w-5 h-5 rounded-full" aria-hidden="true" />
            <span className="text-xs text-text-muted">Built by</span>
            <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">onyxax</span>
            <svg className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
