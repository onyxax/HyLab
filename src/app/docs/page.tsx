'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { DocSidebar, MobileDocNav } from '@/features/docs/components/DocSidebar';
import { endpoints, customizationParams, codeExamples, iconSets, docNav } from '@/features/docs/data';

export default function DocsPage() {
  useScrollToTop();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeExample, setActiveExample] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [active, setActive] = useState('quick-start');

  useEffect(() => {
    fetch('/api/icons/categories').then(r => r.json()).then(d => setCategories(d.data || []));
  }, []);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll spy — لما تهبط، الزر الأبيض يتبع القسم الظاهر
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-90px 0px -55% 0px', threshold: 0.1 }
    );
    docNav.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <div className="border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border-primary bg-bg-card px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] uppercase text-text-muted">API v1.0</span>
                <span className="text-xs text-text-muted">No auth · CORS enabled · Edge cached</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.025em] leading-none font-[family-name:var(--font-outfit)]">Documentation</h1>
              <p className="text-sm text-text-secondary mt-2 max-w-[52ch]">Everything to integrate 18,039 icons — one endpoint, any color, size, or format. Copy, paste, ship.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs tabular text-text-muted">Base URL</span>
              <code className="px-3 py-1.5 rounded-full bg-bg-card border border-border-primary text-xs font-mono text-text-primary">https://hylab.vercel.app</code>
              <button onClick={() => copy('https://hylab.vercel.app', 'base')} className="text-xs font-medium text-accent hover:text-accent-hover px-2">{copied === 'base' ? 'Copied' : 'Copy'}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[200px_1fr] gap-8 items-start">
        <DocSidebar active={active} onNavigate={scrollTo} />
        <MobileDocNav active={active} onNavigate={scrollTo} />

        <div className="min-w-0 space-y-16">
          <section id="quick-start" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">01</span><h2 className="text-xl font-bold tracking-tight">Quick start</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="grid md:grid-cols-3 gap-3">
              {[{ n: '01', t: 'Get an icon', d: 'By name', code: 'GET /api/icons/home' },{ n: '02', t: 'Customize', d: 'Color, size, format', code: '?color=7c9a82&size=32' },{ n: '03', t: 'Use it', d: 'Any stack', code: '<img src="…/home?color=7c9a82" />' }].map(s => (
                <div key={s.n} className="rounded-xl border border-border-primary bg-bg-card p-4"><div className="text-[11px] font-mono tabular text-text-muted">{s.n}</div><div className="font-medium text-sm mt-1">{s.t}</div><div className="text-xs text-text-muted">{s.d}</div><code className="mt-3 block text-xs font-mono bg-bg-secondary border border-border-primary rounded-lg px-2.5 py-2 break-all">{s.code}</code></div>
              ))}
            </div>
          </section>

          <section id="endpoints" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">02</span><h2 className="text-xl font-bold tracking-tight">Endpoints</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="space-y-4">
              {endpoints.map((ep, i) => (
                <div key={i} className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
                  <div className="px-4 py-3 flex flex-wrap items-start justify-between gap-3 border-b border-border-primary bg-bg-secondary">
                    <div className="flex items-center gap-3 min-w-0"><span className="shrink-0 inline-flex items-center justify-center px-2 py-1 rounded-md bg-accent text-white text-[10px] font-bold tracking-wide">{ep.method}</span><code className="text-sm font-mono font-medium text-text-primary break-all">{ep.path}</code></div>
                    <button onClick={() => copy('https://hylab.vercel.app' + ep.example, 'ep' + i)} className="text-xs font-medium text-accent hover:text-accent-hover shrink-0">{copied === 'ep' + i ? 'Copied' : 'Copy URL'}</button>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-text-secondary">{ep.desc}</p>
                    {ep.params.length > 0 && <div className="mt-4"><div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-text-muted mb-2">Path params</div><div className="divide-y divide-border-primary border border-border-primary rounded-lg overflow-hidden">{ep.params.map((p, j) => (<div key={j} className="grid grid-cols-[110px_1fr] gap-3 px-3 py-2 text-sm"><code className="text-xs font-mono text-accent">{p.name} {p.req && <span className="text-accent">*</span>}</code><span className="text-xs text-text-secondary">{p.desc} <span className="text-text-muted">— {p.type}</span></span></div>))}</div></div>}
                    {ep.query.length > 0 && <div className="mt-4"><div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-text-muted mb-2">Query</div><div className="divide-y divide-border-primary border border-border-primary rounded-lg overflow-hidden">{ep.query.map((p, j) => (<div key={j} className="grid grid-cols-[110px_80px_1fr] gap-3 px-3 py-2 text-xs"><code className="font-mono text-accent">{p.name}</code><span className="text-text-muted font-mono">{p.def}</span><span className="text-text-secondary">{p.desc}</span></div>))}</div></div>}
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-bg-secondary border border-border-primary px-3 py-2"><span className="text-[11px] font-mono tracking-wide text-text-muted">EXAMPLE</span><code className="text-xs font-mono text-text-secondary break-all flex-1">{'https://hylab.vercel.app' + ep.example}</code></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="customization" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">03</span><h2 className="text-xl font-bold tracking-tight">Customization</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border-primary bg-bg-secondary flex items-center justify-between"><span className="text-xs font-medium">Query params for <code className="font-mono text-accent">/api/icons/:name</code></span><span className="text-xs text-text-muted">All optional</span></div>
              <div className="divide-y divide-border-primary">{customizationParams.map(r => (<div key={r.p} className="grid grid-cols-[90px_80px_90px_1fr] gap-3 px-4 py-3 text-xs"><code className="font-mono text-accent">{r.p}</code><span className="font-mono text-text-muted">{r.t}</span><span className="font-mono text-text-muted">{r.d}</span><span className="text-text-secondary">{r.desc}</span></div>))}</div>
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3">{[{ f: 'SVG', d: 'Vector, scalable — best for web' },{ f: 'PNG', d: 'Raster, transparent background' },{ f: 'WebP', d: 'Modern, smaller than PNG' }].map(x => (<div key={x.f} className="rounded-xl border border-border-primary bg-bg-card px-4 py-3"><div className="text-xs font-bold tracking-wide text-text-primary">{x.f}</div><div className="text-xs text-text-muted mt-1">{x.d}</div></div>))}</div>
          </section>

          <section id="examples" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">04</span><h2 className="text-xl font-bold tracking-tight">Code examples</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
              <div className="flex gap-1 p-2 border-b border-border-primary bg-bg-secondary overflow-x-auto">{codeExamples.map((ex, i) => (<button key={ex.title} onClick={() => setActiveExample(i)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${activeExample === i ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-card text-text-muted border-border-primary hover:text-text-primary'}`}>{ex.title}</button>))}</div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary"><span className="text-[11px] font-mono tracking-wide uppercase text-text-muted">{codeExamples[activeExample].title}</span><button onClick={() => copy(codeExamples[activeExample].code, 'code')} className="text-xs font-medium text-accent hover:text-accent-hover">{copied === 'code' ? 'Copied' : 'Copy'}</button></div>
              <pre className="p-4 overflow-x-auto text-[13px] leading-6"><code className="font-[family-name:var(--font-jetbrains)] text-text-secondary whitespace-pre">{codeExamples[activeExample].code}</code></pre>
            </div>
          </section>

          <section id="sets" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">05</span><h2 className="text-xl font-bold tracking-tight">Icon sets & categories</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="rounded-xl border border-border-primary bg-bg-card p-4"><div className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted mb-3">Sources — 10 libraries, 18,039 icons</div><div className="grid sm:grid-cols-2 gap-2">{iconSets.map(s => (<div key={s.name} className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary/50 px-3 py-2.5"><div><div className="text-sm font-medium">{s.name}</div><div className="text-xs text-text-muted">{s.desc}</div></div><span className="text-xs font-mono tabular font-medium text-text-primary">{s.count}</span></div>))}</div></div>
            {categories.length > 0 && <div className="mt-4 rounded-xl border border-border-primary bg-bg-card p-4"><div className="text-xs font-semibold tracking-[0.06em] uppercase text-text-muted mb-3">Categories</div><div className="grid sm:grid-cols-2 gap-2">{categories.map((c: any) => (<div key={c.id} className="flex items-center justify-between rounded-lg border border-border-primary px-3 py-2 text-sm"><span>{c.name}</span><span className="text-xs tabular text-text-muted">{c.count}</span></div>))}</div></div>}
          </section>

          <section id="ai" className="scroll-mt-24">
            <div className="flex items-baseline gap-3 mb-6"><span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted">06</span><h2 className="text-xl font-bold tracking-tight">AI agent prompt</h2><span className="h-px flex-1 bg-border-primary ml-4 hidden sm:block" /></div>
            <div className="rounded-xl border border-border-primary bg-bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border-primary bg-bg-secondary flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-xs font-medium">System prompt for Cursor, Copilot, Windsurf, Claude…</span><button onClick={() => copy(`You are an AI coding assistant that helps developers integrate icons using HyLab Icons API.

Base URL: https://hylab.vercel.app

Endpoints:
GET /api/icons/:name?color=7c9a82&size=32&format=svg&stroke=2
GET /api/icons?set=tabler&category=navigation&page=1&limit=20
GET /api/icons/search?q=arrow
GET /api/icons/categories?set=tabler
GET /api/icons/sets?category=navigation

Families (10): tabler (5093), remix (3229), carbon (2665), lucide (1582), phosphor (1512), iconoir (1383), boxicons (814), octicons (733), cssgg (704), heroicons (324)
Categories: navigation, action, communication, social, files, media, interface, status, commerce, charts, layout, development, weather, miscellaneous

Browse: /browse?set=tabler or /browse?set=tabler&category=navigation — shareable URL

Usage:
- List family only: GET /api/icons?set=phosphor
- Family + category: GET /api/icons?set=tabler&category=action
- Search: GET /api/icons/search?q=arrow
- Then return: https://hylab.vercel.app/api/icons/{name}?color={color}&size={size}
HTML: <img src="URL" alt="name" />
`, 'ai')} className="ml-auto text-xs font-medium text-accent hover:text-accent-hover">{copied === 'ai' ? 'Copied' : 'Copy'}</button></div>
              <pre className="p-4 overflow-x-auto text-xs leading-5 font-[family-name:var(--font-jetbrains)] text-text-secondary whitespace-pre-wrap">{`You are an AI coding assistant that helps developers integrate icons using HyLab Icons API.

Base URL: https://hylab.vercel.app

Endpoints:
GET /api/icons/:name?color=7c9a82&size=32&format=svg&stroke=2
GET /api/icons?set=tabler&category=navigation&page=1&limit=20
GET /api/icons/search?q=arrow
GET /api/icons/categories?set=tabler
GET /api/icons/sets?category=navigation

Families (10): tabler (5093), remix (3229), carbon (2665), lucide (1582), phosphor (1512), iconoir (1383), boxicons (814), octicons (733), cssgg (704), heroicons (324)
Categories: navigation, action, communication, social, files, media, interface, status, commerce, charts, layout, development, weather, miscellaneous

Browse: /browse?set=tabler or /browse?set=tabler&category=navigation — shareable URL

Usage:
- List family only: GET /api/icons?set=phosphor
- Family + category: GET /api/icons?set=tabler&category=action
- Search: GET /api/icons/search?q=arrow
- Then return: https://hylab.vercel.app/api/icons/{name}?color={color}&size={size}
HTML: <img src="URL" alt="name" />
`}</pre>
              <div className="px-4 py-3 bg-bg-secondary border-t border-border-primary text-xs text-text-muted">Add to <code className="font-mono text-text-primary">.cursorrules</code>, <code className="font-mono text-text-primary">AGENTS.md</code> or <code className="font-mono text-text-primary">.github/copilot-instructions.md</code></div>
            </div>
          </section>

          <div className="rounded-xl border border-border-primary bg-bg-secondary/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div><div className="font-medium">Rate limits & caching</div><div className="text-xs text-text-muted">Cache-Control: public, max-age=3600 · CORS * · PNG/WebP via sharp</div></div>
            <Link href="/browse" className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-text-primary text-bg-primary text-sm font-medium shrink-0">Browse 18k icons →</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
