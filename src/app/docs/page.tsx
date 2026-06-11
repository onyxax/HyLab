'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const endpoints = [
  {
    method: 'GET',
    path: '/api/icons',
    desc: 'List all icons with pagination and optional category filter',
    params: [],
    query: [
      { name: 'page', type: 'number', def: '1', desc: 'Page number' },
      { name: 'limit', type: 'number', def: '50', desc: 'Items per page (max 100)' },
      { name: 'category', type: 'string', def: '', desc: 'Filter by category slug' },
    ],
    example: '/api/icons?page=1&limit=20&category=navigation',
  },
  {
    method: 'GET',
    path: '/api/icons/:name',
    desc: 'Get a single icon by name with optional customization',
    params: [
      { name: 'name', type: 'path', req: true, desc: 'Icon name (e.g., home, search, heart)' },
    ],
    query: [
      { name: 'color', type: 'string', def: 'currentColor', desc: 'Hex color without # (e.g., 7c9a82)' },
      { name: 'size', type: 'number', def: '24', desc: 'Size in pixels (1-512)' },
      { name: 'stroke', type: 'number', def: '2', desc: 'Stroke width (0.5-4)' },
      { name: 'format', type: 'string', def: 'svg', desc: 'Output format: svg, png, or webp' },
    ],
    example: '/api/icons/home?color=7c9a82&size=32&format=svg',
  },
  {
    method: 'GET',
    path: '/api/icons/search',
    desc: 'Search icons by name, tags, or category',
    params: [
      { name: 'q', type: 'query', req: true, desc: 'Search query string' },
    ],
    query: [],
    example: '/api/icons/search?q=arrow',
  },
  {
    method: 'GET',
    path: '/api/icons/categories',
    desc: 'List all categories with icon counts',
    params: [],
    query: [],
    example: '/api/icons/categories',
  },
  {
    method: 'GET',
    path: '/api/icons/sets',
    desc: 'List all icon sets (sources) with counts',
    params: [],
    query: [],
    example: '/api/icons/sets',
  },
];

const customizationParams = [
  { p: 'color', t: 'string', d: 'currentColor', desc: 'Hex color without # prefix. Applied to stroke and fill.' },
  { p: 'size', t: 'number', d: '24', desc: 'Width and height in pixels. Range: 1-512.' },
  { p: 'stroke', t: 'number', d: '2', desc: 'Stroke width for SVG icons. Range: 0.5-4.' },
  { p: 'fill', t: 'boolean', d: 'false', desc: 'Fill the icon shape instead of stroke-only.' },
  { p: 'format', t: 'string', d: 'svg', desc: 'Output format. Supports svg, png, and webp.' },
];

const codeExamples = [
  {
    title: 'HTML',
    code: '<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32" alt="Home" />',
  },
  {
    title: 'React',
    code: [
      'const Icon = ({ name, color = "7c9a82", size = 24 }) => {',
      '  const [svg, setSvg] = useState("");',
      '',
      '  useEffect(() => {',
      '    fetch(`/api/icons/${name}?color=${color}&size=${size}`)',
      '      .then(res => res.text())',
      '      .then(setSvg);',
      '  }, [name, color, size]);',
      '',
      '  return <span dangerouslySetInnerHTML={{ __html: svg }} />;',
      '};',
      '',
      '<Icon name="home" color="7c9a82" size={32} />',
    ].join('\n'),
  },
  {
    title: 'Next.js',
    code: [
      '// app/icon/[name]/route.ts',
      'import { NextResponse } from "next/server";',
      '',
      'export async function GET(',
      '  request: Request,',
      '  { params }: { params: { name: string } }',
      ') {',
      '  const url = new URL(request.url);',
      '  const color = url.searchParams.get("color") || "7c9a82";',
      '  const size = url.searchParams.get("size") || "24";',
      '',
      '  const res = await fetch(',
      '    `https://hylab.vercel.app/api/icons/${params.name}?color=${color}&size=${size}`',
      '  );',
      '',
      '  return new NextResponse(await res.blob(), {',
      '    headers: {',
      '      "Content-Type": "image/svg+xml",',
      '      "Cache-Control": "public, max-age=86400",',
      '    },',
      '  });',
      '}',
    ].join('\n'),
  },
  {
    title: 'Vue',
    code: [
      '<template>',
      '  <span v-html="svg" />',
      '</template>',
      '',
      '<script setup>',
      'import { ref, onMounted, watch } from "vue";',
      '',
      'const props = defineProps({',
      '  name: String,',
      '  color: { type: String, default: "7c9a82" },',
      '  size: { type: Number, default: 24 },',
      '});',
      '',
      'const svg = ref("");',
      '',
      'const loadIcon = async () => {',
      '  const res = await fetch(',
      '    `/api/icons/${props.name}?color=${props.color}&size=${props.size}`',
      '  );',
      '  svg.value = await res.text();',
      '};',
      '',
      'onMounted(loadIcon);',
      'watch(() => props.name, loadIcon);',
      '</script>',
    ].join('\n'),
  },
  {
    title: 'Svelte',
    code: [
      '<script>',
      '  export let name;',
      '  export let color = "7c9a82";',
      '  export let size = 24;',
      '',
      '  let svg = "";',
      '',
      '  $: fetch(`/api/icons/${name}?color=${color}&size=${size}`)',
      '    .then(r => r.text())',
      '    .then(t => svg = t);',
      '</script>',
      '',
      '<span>{@html svg}</span>',
    ].join('\n'),
  },
  {
    title: 'cURL',
    code: [
      '# Get SVG',
      'curl "https://hylab.vercel.app/api/icons/home?color=7c9a82"',
      '',
      '# Get PNG',
      'curl "https://hylab.vercel.app/api/icons/home?format=png&size=64"',
      '',
      '# Search',
      'curl "https://hylab.vercel.app/api/icons/search?q=arrow"',
      '',
      '# List categories',
      'curl "https://hylab.vercel.app/api/icons/categories"',
      '',
      '# List icon sets',
      'curl "https://hylab.vercel.app/api/icons/sets"',
    ].join('\n'),
  },
  {
    title: 'Python',
    code: [
      'import requests',
      '',
      '# Get a single icon',
      'res = requests.get(',
      '    "https://hylab.vercel.app/api/icons/home",',
      '    params={"color": "7c9a82", "size": "32"}',
      ')',
      'svg_content = res.text',
      '',
      '# Search icons',
      'res = requests.get(',
      '    "https://hylab.vercel.app/api/icons/search",',
      '    params={"q": "arrow"}',
      ')',
      'icons = res.json()["data"]',
      '',
      '# Get PNG',
      'res = requests.get(',
      '    "https://hylab.vercel.app/api/icons/home",',
      '    params={"format": "png", "size": "64"}',
      ')',
      'with open("icon.png", "wb") as f:',
      '    f.write(res.content)',
    ].join('\n'),
  },
];

const iconSets = [
  { name: 'Tabler', count: '5,093', desc: 'MIT Licensed, consistent stroke style' },
  { name: 'Remix', count: '3,229', desc: 'Fills + lines variants' },
  { name: 'Carbon', count: '2,665', desc: 'IBM Design Language' },
  { name: 'Lucide', count: '1,582', desc: 'Feather Icons successor' },
  { name: 'Phosphor', count: '1,512', desc: '6 weight variants' },
  { name: 'Iconoir', count: '1,383', desc: 'Open source, no frameworks' },
  { name: 'BoxIcons', count: '814', desc: 'Simple line icons' },
  { name: 'CSS.gg', count: '704', desc: 'Pure CSS icons' },
  { name: 'Octicons', count: '733', desc: 'GitHub Primer icons' },
  { name: 'Heroicons', count: '324', desc: 'Tailwind CSS icons' },
];

export default function DocsPage() {
  useScrollToTop();
  const [activeExample, setActiveExample] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'customization' | 'examples' | 'sets'>('endpoints');

  useEffect(() => {
    fetch('/api/icons/categories').then(r => r.json()).then(d => setCategories(d.data || []));
  }, []);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-accent">v1.0</span>
              <span className="badge badge-neutral">FREE</span>
              <span className="badge badge-neutral">NO AUTH</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">
              Documentation
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-6">
              Everything you need to integrate 18,000+ icons into your project.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => scrollTo('quick-start')} className="btn btn-primary text-sm py-2 px-5">Quick Start</button>
              <button onClick={() => scrollTo('api-reference')} className="btn btn-outline text-sm py-2 px-5">API Reference</button>
            </div>
          </div>

          {/* Quick Start */}
          <section id="quick-start" className="mb-14">
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-5">Quick Start</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Get an icon', desc: 'Fetch any icon by its name', url: 'https://hylab.vercel.app/api/icons/home' },
                { step: '2', title: 'Customize it', desc: 'Add color, size, and format parameters', url: 'https://hylab.vercel.app/api/icons/home?color=7c9a82&size=32&format=svg' },
                { step: '3', title: 'Use it', desc: 'Drop it into your HTML, React, or any framework', code: '<img src="https://hylab.vercel.app/api/icons/home?color=7c9a82" alt="Home" />' },
              ].map((item, i) => (
                <div key={i} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-accent-light text-accent flex items-center justify-center text-sm font-bold font-[family-name:var(--font-outfit)]">{item.step}</span>
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <div className="code-block">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
                      <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">URL</span>
                      <button onClick={() => copy(item.url || item.code || '', 'qs' + i)} className="text-xs text-text-muted hover:text-accent transition-colors">
                        {copied === 'qs' + i ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4"><code className="text-sm text-text-secondary break-all">{item.url || item.code}</code></pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div id="api-reference" className="mb-8">
            <div className="flex gap-1 p-1 bg-bg-secondary/50 rounded-xl border border-border-primary/30 w-fit">
              {([
                { id: 'endpoints' as const, label: 'Endpoints' },
                { id: 'customization' as const, label: 'Customization' },
                { id: 'examples' as const, label: 'Code Examples' },
                { id: 'sets' as const, label: 'Icon Sets' },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={'px-4 py-2 text-sm font-medium rounded-lg transition-all ' + (activeTab === tab.id ? 'bg-bg-card text-accent shadow-sm border border-border-primary/40' : 'text-text-muted hover:text-text-primary')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <section id="endpoints" className="space-y-4">
              {endpoints.map((ep, i) => (
                <div key={i} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="badge badge-accent">{ep.method}</span>
                    <code className="text-sm font-[family-name:var(--font-jetbrains)] text-text-secondary">{ep.path}</code>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">{ep.desc}</p>

                  {ep.params.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Parameters</h4>
                      <div className="border border-border-primary rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead><tr className="bg-bg-secondary border-b border-border-primary">
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Name</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Type</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Required</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Description</th>
                          </tr></thead>
                          <tbody>{ep.params.map((p, j) => (
                            <tr key={j} className="border-b border-border-primary last:border-0">
                              <td className="py-2 px-3 font-[family-name:var(--font-jetbrains)] text-xs text-accent">{p.name}</td>
                              <td className="py-2 px-3 text-xs text-text-secondary">{p.type}</td>
                              <td className="py-2 px-3 text-xs">{p.req ? <span className="text-accent">Yes</span> : <span className="text-text-muted">No</span>}</td>
                              <td className="py-2 px-3 text-xs text-text-secondary">{p.desc}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {ep.query.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Query Parameters</h4>
                      <div className="border border-border-primary rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead><tr className="bg-bg-secondary border-b border-border-primary">
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Name</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Type</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Default</th>
                            <th className="text-left py-2 px-3 text-xs text-text-muted">Description</th>
                          </tr></thead>
                          <tbody>{ep.query.map((p, j) => (
                            <tr key={j} className="border-b border-border-primary last:border-0">
                              <td className="py-2 px-3 font-[family-name:var(--font-jetbrains)] text-xs text-accent">{p.name}</td>
                              <td className="py-2 px-3 text-xs text-text-secondary">{p.type}</td>
                              <td className="py-2 px-3 text-xs text-text-muted">{p.def || '—'}</td>
                              <td className="py-2 px-3 text-xs text-text-secondary">{p.desc}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="code-block">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
                      <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">EXAMPLE</span>
                      <button onClick={() => copy('https://hylab.vercel.app' + ep.example, 'ep' + i)} className="text-xs text-text-muted hover:text-accent transition-colors">
                        {copied === 'ep' + i ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4"><code className="text-sm text-text-secondary">{'https://hylab.vercel.app' + ep.example}</code></pre>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Customization Tab */}
          {activeTab === 'customization' && (
            <section id="customization">
              <div className="card">
                <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Customization Parameters</h3>
                <p className="text-sm text-text-secondary mb-4">
                  All customization options are applied via query parameters on the{' '}
                  <code className="text-accent font-[family-name:var(--font-jetbrains)]">/api/icons/:name</code> endpoint.
                </p>
                <div className="border border-border-primary rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-bg-secondary border-b border-border-primary">
                      <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider">Parameter</th>
                      <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider">Default</th>
                      <th className="text-left py-3 px-4 text-xs text-text-muted uppercase tracking-wider">Description</th>
                    </tr></thead>
                    <tbody>
                      {customizationParams.map((r, i) => (
                        <tr key={i} className="border-b border-border-primary last:border-0">
                          <td className="py-3 px-4 font-[family-name:var(--font-jetbrains)] text-xs text-accent">{r.p}</td>
                          <td className="py-3 px-4 text-xs text-text-secondary">{r.t}</td>
                          <td className="py-3 px-4 text-xs text-text-muted">{r.d}</td>
                          <td className="py-3 px-4 text-xs text-text-secondary">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">Supported Output Formats</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { format: 'SVG', mime: 'image/svg+xml', desc: 'Scalable, small size, perfect for web' },
                      { format: 'PNG', mime: 'image/png', desc: 'Raster, supports transparency' },
                      { format: 'WebP', mime: 'image/webp', desc: 'Modern, smaller files than PNG' },
                    ].map((f) => (
                      <div key={f.format} className="p-3 rounded-lg bg-bg-secondary/50 border border-border-primary/30">
                        <span className="text-sm font-bold text-accent">{f.format}</span>
                        <p className="text-xs text-text-muted mt-1">{f.desc}</p>
                        <p className="text-[10px] text-text-muted mt-1 font-[family-name:var(--font-jetbrains)]">{f.mime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Code Examples Tab */}
          {activeTab === 'examples' && (
            <section id="examples">
              <div className="card">
                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border-primary">
                  {codeExamples.map((ex, i) => (
                    <button key={i} onClick={() => setActiveExample(i)} className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all ' + (activeExample === i ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary border border-border-primary')}>
                      {ex.title}
                    </button>
                  ))}
                </div>
                <div className="code-block">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
                    <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">{codeExamples[activeExample].title.toUpperCase()}</span>
                    <button onClick={() => copy(codeExamples[activeExample].code, 'code')} className="text-xs text-text-muted hover:text-accent transition-colors">
                      {copied === 'code' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto"><code className="text-sm">{codeExamples[activeExample].code}</code></pre>
                </div>
              </div>
            </section>
          )}

          {/* Icon Sets Tab */}
          {activeTab === 'sets' && (
            <section id="sets">
              <div className="card">
                <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Icon Sets</h3>
                <p className="text-sm text-text-secondary mb-6">
                  HyLab aggregates icons from 10 popular open-source icon libraries, totaling 18,000+ icons.
                  All icons are served through a single unified API.
                </p>
                <div className="space-y-3">
                  {iconSets.map((set) => (
                    <div key={set.name} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/30 border border-border-primary/30 hover:border-accent/30 transition-colors">
                      <div>
                        <span className="text-sm font-medium">{set.name}</span>
                        <p className="text-xs text-text-muted">{set.desc}</p>
                      </div>
                      <span className="badge badge-accent">{set.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {categories.length > 0 && (
                <div className="card mt-6">
                  <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-4">Categories</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/30 border border-border-primary/30">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className="text-xs text-text-muted">{cat.count} icons</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* AI Agent Prompt */}
          <section className="mt-14">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)]">AI Agent Prompt</h3>
                  <p className="text-xs text-text-muted">Copy this prompt to any AI coding assistant</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-4">
                Use this prompt to teach any AI agent (Cursor, Copilot, Windsurf, Claude, etc.) how to fetch and use icons from HyLab API in your project.
              </p>

              <div className="code-block">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
                  <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">SYSTEM PROMPT</span>
                  <button
                    onClick={() => copy(`You are an AI coding assistant that helps developers integrate icons into their projects using the HyLab Icons API.

## HyLab API Reference

Base URL: https://hylab.vercel.app

### Endpoints

1. **Get Icon by Name**
   GET /api/icons/:name
   - color (query): Hex color without # (e.g., 7c9a82)
   - size (query): Size in pixels 1-512 (default: 24)
   - stroke (query): Stroke width 0.5-4 (default: 2)
   - format (query): svg, png, or webp (default: svg)
   - fill (query): true/false - fill icon instead of stroke

2. **Search Icons**
   GET /api/icons/search?q=keyword
   Returns icons matching name, tags, or category.

3. **List Categories**
   GET /api/icons/categories

4. **List Icon Sets**
   GET /api/icons/sets

5. **List All Icons (Paginated)**
   GET /api/icons?page=1&limit=50&category=navigation

### How to Use

When a developer asks for an icon:
1. Search for the icon using /api/icons/search?q={keyword}
2. Return the full URL: https://hylab.vercel.app/api/icons/{name}?color={color}&size={size}
3. For HTML: <img src="URL" alt="name" />
4. For React/Next.js: Use fetch() or <img> tag with the URL
5. For CSS background: url('URL')

### Example Responses

Developer: "I need a home icon"
Response: https://hylab.vercel.app/api/icons/home?color=7c9a82&size=24

Developer: "Add a search icon to my navbar"
Response: Use this in your component:
<img src="https://hylab.vercel.app/api/icons/search?color=ffffff&size=20" alt="Search" />

Developer: "I need a red heart icon in PNG format"
Response: https://hylab.vercel.app/api/icons/heart?color=ef4444&size=48&format=png

### Available Categories
navigation, action, communication, social, files, media, interface, status, commerce, charts, layout, development, weather, miscellaneous

Always provide the complete, working URL. Never use placeholder domains.`, 'ai-prompt')}
                  >
                    {copied === 'ai-prompt' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto"><code className="text-sm text-text-secondary whitespace-pre-wrap">{`You are an AI coding assistant that helps developers integrate icons into their projects using the HyLab Icons API.

## HyLab API Reference

Base URL: https://hylab.vercel.app

### Endpoints

1. **Get Icon by Name**
   GET /api/icons/:name
   - color (query): Hex color without # (e.g., 7c9a82)
   - size (query): Size in pixels 1-512 (default: 24)
   - stroke (query): Stroke width 0.5-4 (default: 2)
   - format (query): svg, png, or webp (default: svg)
   - fill (query): true/false - fill icon instead of stroke

2. **Search Icons**
   GET /api/icons/search?q=keyword
   Returns icons matching name, tags, or category.

3. **List Categories**
   GET /api/icons/categories

4. **List Icon Sets**
   GET /api/icons/sets

5. **List All Icons (Paginated)**
   GET /api/icons?page=1&limit=50&category=navigation

### How to Use

When a developer asks for an icon:
1. Search for the icon using /api/icons/search?q={keyword}
2. Return the full URL: https://hylab.vercel.app/api/icons/{name}?color={color}&size={size}
3. For HTML: <img src="URL" alt="name" />
4. For React/Next.js: Use fetch() or <img> tag with the URL
5. For CSS background: url('URL')

### Example Responses

Developer: "I need a home icon"
Response: https://hylab.vercel.app/api/icons/home?color=7c9a82&size=24

Developer: "Add a search icon to my navbar"
Response: Use this in your component:
<img src="https://hylab.vercel.app/api/icons/search?color=ffffff&size=20" alt="Search" />

Developer: "I need a red heart icon in PNG format"
Response: https://hylab.vercel.app/api/icons/heart?color=ef4444&size=48&format=png

### Available Categories
navigation, action, communication, social, files, media, interface, status, commerce, charts, layout, development, weather, miscellaneous

Always provide the complete, working URL. Never use placeholder domains.`}</code></pre>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 font-medium mb-1">Pro Tip</p>
                <p className="text-xs text-text-secondary">Add this prompt to your project's <code className="text-accent">.cursorrules</code>, <code className="text-accent">AGENTS.md</code>, or <code className="text-accent">.github/copilot-instructions.md</code> file so the AI always knows how to use HyLab.</p>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="mt-14">
            <div className="card">
              <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-3">Rate Limits & Caching</h3>
              <div className="space-y-3 text-sm text-text-secondary">
                <p>All API responses include <code className="text-accent font-[family-name:var(--font-jetbrains)]">Cache-Control: public, max-age=3600</code> headers.</p>
                <p>CORS is enabled for all origins. No API key or authentication required.</p>
                <p>PNG and WebP conversions use Sharp for high-performance image processing on the server.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
