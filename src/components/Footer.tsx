import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border-primary">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="HyLab" className="w-7 h-7 rounded-lg" />
            <span className="text-base font-bold font-[family-name:var(--font-outfit)]">HyLab</span>
            <span className="text-xs text-text-muted">v1.0</span>
          </Link>
          <a
            href="https://guns.lol/onyxax"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-bg-secondary border border-border-primary hover:border-accent/40 hover:bg-accent/5 transition-all"
          >
            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">Built by</span>
            <span className="text-sm font-bold text-accent group-hover:text-accent transition-colors">onyxax</span>
            <svg className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <span className="text-xs text-text-muted">MIT License</span>
        </div>
      </div>
    </footer>
  );
}
