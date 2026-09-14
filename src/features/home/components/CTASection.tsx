import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto rounded-2xl border border-border-primary bg-bg-card px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-none font-[family-name:var(--font-outfit)]">Start building today</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-[52ch]">No signup. No API key. Just use it — 18,039 icons ready in one URL.</p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/docs" className="btn btn-primary h-10 px-6">Read the Docs</Link>
          <Link href="/browse" className="btn btn-secondary h-10 px-6">Browse Icons</Link>
        </div>
      </div>
    </section>
  );
}
