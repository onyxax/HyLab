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

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-4">
              Open Source Icons
              <br />
              <span className="text-accent">for Everyone</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl">
              HyLab provides 18,000+ professional icons through a simple API. No auth, no limits, no catch. Just icons — your way.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-16">
            {[
              { value: '18,039', label: 'Icons' },
              { value: '3', label: 'Formats' },
              { value: '100%', label: 'Free' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold font-[family-name:var(--font-outfit)] text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-6">Why HyLab?</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Finding good icons shouldn&apos;t be hard. You shouldn&apos;t need to sign up, get an API key, or worry about rate limits just to use an icon.
              </p>
              <p>
                HyLab was created to solve this. We curate icons from the best open source libraries — Lucide and Tabler — and serve them through a single, fast API. Customize color, size, and format with query parameters. That&apos;s it.
              </p>
              <p>
                Whether you&apos;re building a startup, a side project, or a design system, HyLab has you covered.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-6">What Makes Us Different</h2>
            <div className="space-y-4">
              {[
                { title: 'No Authentication', desc: 'Start using the API immediately. No signup, no API keys, no friction.' },
                { title: 'Multiple Formats', desc: 'Get icons as SVG, PNG, or WebP. Perfect for any use case.' },
                { title: 'Full Customization', desc: 'Change color, size, and stroke width with simple query parameters.' },
                { title: 'Search & Browse', desc: 'Find the perfect icon with fuzzy search across 14 categories.' },
                { title: 'Open Source', desc: 'Every line of code is on GitHub. Contribute, fork, or self-host.' },
                { title: 'Blazing Fast', desc: 'Built on Next.js + Vercel edge network for global low-latency.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-6">Tech Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Next.js', role: 'Framework' },
                { name: 'TypeScript', role: 'Language' },
                { name: 'Tailwind', role: 'Styling' },
                { name: 'Vercel', role: 'Hosting' },
                { name: 'Lucide', role: 'Icons' },
                { name: 'Tabler', role: 'Icons' },
                { name: 'Sharp', role: 'Images' },
              ].map((tech) => (
                <div key={tech.name} className="card text-center py-4">
                  <div className="font-semibold text-sm">{tech.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{tech.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributing */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-4">Contributing</h2>
            <p className="text-text-secondary mb-6">
              HyLab is open source and community-driven. We welcome contributions of all kinds.
            </p>
            <div className="code-block">
              <div className="px-4 py-2 border-b border-border-primary">
                <span className="text-xs text-text-muted font-[family-name:var(--font-jetbrains)]">Quick Start</span>
              </div>
              <pre className="p-4 text-sm">
                <code>{`# Fork & clone
git clone https://github.com/onyxax/HyLab.git

# Install dependencies
npm install

# Start dev server
npm run dev`}</code>
              </pre>
            </div>
          </div>

          {/* Author */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-6">Created By</h2>
            <div className="card flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white text-xl font-bold font-[family-name:var(--font-outfit)]">
                O
              </div>
              <div>
                <h3 className="font-bold text-lg">onyxax</h3>
                <p className="text-sm text-text-muted">Developer & Designer</p>
                <a href="https://guns.lol/onyxax" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:text-accent-hover transition-colors mt-1 inline-block">
                  guns.lol/onyxax →
                </a>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-3">Ready to build?</h2>
            <p className="text-text-muted mb-6">Start using 18,000+ icons in seconds</p>
            <div className="flex gap-3 justify-center">
              <Link href="/browse" scroll={false} className="btn btn-primary">Browse Icons</Link>
              <Link href="/docs" scroll={false} className="btn btn-secondary">API Docs</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
