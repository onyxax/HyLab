import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent/20 text-accent text-xs font-medium mb-6">
          404 — Not found
        </div>
        <h1 className="text-[40px] md:text-[48px] font-bold font-[family-name:var(--font-outfit)] tracking-[-0.02em] leading-[0.9] mb-4 text-wrap-balance">
          This page wandered
          <br />
          <span className="text-text-muted font-medium">off the grid.</span>
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8 max-w-[48ch] mx-auto">
          The icon, doc or page you&apos;re looking for doesn&apos;t exist. Check the URL or browse the full catalog.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/browse" className="btn btn-secondary">Browse icons</Link>
        </div>
        <div className="mt-10 flex justify-center opacity-40">
          <img src="/favicon.svg" alt="" aria-hidden="true" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}
