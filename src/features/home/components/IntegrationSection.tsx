import Link from 'next/link';

export function IntegrationSection() {
  return (
    <section className="py-16 px-6 border-y border-border-primary bg-bg-secondary/20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-[80px]">
          <div className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted mb-3">Integration</div>
          <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.02em] leading-[0.95] text-wrap-balance font-[family-name:var(--font-outfit)]">
            Works with any stack.
            <span className="block text-text-muted font-medium">No SDK required.</span>
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary max-w-[44ch] mt-4">
            Drop a URL into <span className="font-medium text-text-primary">HTML</span>, <span className="font-medium text-text-primary">React</span>, Vue, Svelte or plain CSS. Add <code className="px-1.5 py-0.5 rounded bg-bg-card border border-border-primary text-xs font-mono">?color=&amp;size=&amp;format=</code> to customize on the fly.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['HTML', 'React', 'Next.js', 'Vue', 'Svelte', 'Python', 'curl'].map(t => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-bg-card border border-border-primary text-xs text-text-secondary">{t}</span>
            ))}
          </div>
          <div className="mt-6 hidden lg:flex items-center gap-2 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tip — use <span className="font-mono text-text-secondary">?format=png&size=64</span> for emails
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 h-9 border-b border-border-primary bg-bg-secondary">
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">HTML — copy & paste</span>
              <span className="text-[11px] text-text-muted">no build step</span>
            </div>
            <pre className="p-4 overflow-x-auto"><code className="text-[13px] leading-6 font-[family-name:var(--font-jetbrains)] text-text-secondary">{`<img
  src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=24"
  alt="Home"
/>`}</code></pre>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 h-9 border-b border-border-primary bg-accent-light">
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-accent">React — zero deps</span>
              <span className="text-[11px] text-text-muted">client or server</span>
            </div>
            <pre className="p-4 overflow-x-auto"><code className="text-[13px] leading-6 font-[family-name:var(--font-jetbrains)] text-text-secondary">{`const Icon = ({ name }) => (
  <img src={\`https://hylab.vercel.app/api/icons/\${name}?color=7c9a82\`} alt={name} />
)`}</code></pre>
          </div>

          <div className="rounded-xl border border-border-primary bg-bg-card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border-primary flex items-center justify-center text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="text-sm">
              <div className="font-medium">Fast at the edge</div>
              <div className="text-xs text-text-muted">SVG immutable for a year, PNG/WebP via <span className="font-mono text-text-secondary">sharp</span>.</div>
            </div>
            <Link href="/docs" className="ml-auto text-xs font-medium text-accent hover:text-accent-hover">Docs →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
