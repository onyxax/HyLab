import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border-primary">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="HyLab — Icons API" className="w-7 h-7 rounded-lg" />
            <span className="text-base font-bold font-[family-name:var(--font-outfit)] tracking-tight">HyLab</span>
            <span className="text-xs text-text-muted">v1.0 · MIT</span>
          </Link>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/browse" className="text-text-muted hover:text-text-primary transition-colors">Browse</Link>
            <Link href="/docs" className="text-text-muted hover:text-text-primary transition-colors">Docs</Link>
            <Link href="/about" className="text-text-muted hover:text-text-primary transition-colors">About</Link>
            <Link href="/status" className="text-text-muted hover:text-text-primary transition-colors">Status</Link>
            <span className="w-px h-4 bg-border-primary hidden md:block" aria-hidden="true" />
            <a href="https://github.com/onyxax/HyLab" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">GitHub</a>
            <a href="https://github.com/onyxax/HyLab/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">License</a>
          </nav>

          <a
            href="https://guns.lol/onyxax"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-bg-secondary border border-border-primary hover:border-accent/30 hover:bg-accent/[0.06] transition-all"
          >
            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">Built by</span>
            <span className="text-sm font-bold text-accent">onyxax</span>
            <svg className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <div className="mt-8 pt-6 border-t border-border-primary/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <span>© 2026 HyLab. Icons from Tabler, Lucide, Heroicons & others — respective licenses apply.</span>
          <span className="flex items-center gap-3">
            <a href="mailto:hello@hylab.dev" className="hover:text-text-primary transition-colors">Contact</a>
            <span>·</span>
            <span>Privacy & Terms: open source, no tracking.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
