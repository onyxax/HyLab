'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useIcons } from '@/hooks/useIcons';
import { CategoryFilterCompact } from '@/components/icons/CategoryFilter';
import { IconGrid } from '@/components/icons/IconGrid';
import { buildIconUrl } from '@/lib/api/client';
import type { IconCardData } from '@/components/icons/IconCard';

export function BrowsePreviewSection() {
  const { categories } = useCategories();
  const { icons, category, setCategory, search, setSearch, loading } = useIcons({ limit: 36 });
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyIcon = (name: string) => {
    navigator.clipboard.writeText(buildIconUrl(name, {}));
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 1200);
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted mb-2">Catalog</div>
            <h2 className="text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-none font-[family-name:var(--font-outfit)]">Browse icons</h2>
            <p className="text-sm text-text-secondary mt-2">Click any icon to copy its URL — 36 shown, 18k available.</p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[360px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search 18,000+ icons…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 h-10 rounded-full border border-border-primary bg-bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
            </div>
            <Link href="/browse" className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full border border-border-primary bg-bg-card text-sm font-medium hover:bg-bg-secondary transition-colors whitespace-nowrap">View all →</Link>
          </div>
        </div>

        <div className="mb-6">
          <CategoryFilterCompact categories={categories} selected={category} onSelect={setCategory} />
        </div>

        <div className="rounded-2xl border border-border-primary bg-bg-card p-4 md:p-5">
          <IconGrid
            icons={icons as IconCardData[]}
            loading={loading}
            copiedName={copiedIcon}
            onCopy={copyIcon}
            variant="compact"
            skeletonCount={36}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
          <span>Click any icon to copy its API URL</span>
          <Link href="/browse" className="font-medium text-accent hover:text-accent-hover">Browse 18,039 →</Link>
        </div>
      </div>
    </section>
  );
}
