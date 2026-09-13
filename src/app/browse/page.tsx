'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useCategories } from '@/hooks/useCategories';
import { useIcons } from '@/hooks/useIcons';
import { CategoryFilter } from '@/components/icons/CategoryFilter';
import { IconGrid } from '@/components/icons/IconGrid';
import { IconPreviewModal } from '@/components/icons/IconPreviewModal';
import { SearchInput } from '@/components/ui/Input';
import { api } from '@/lib/api/client';
import type { IconCardData } from '@/components/icons/IconCard';

export default function BrowsePage() {
  useScrollToTop();
  const { categories } = useCategories();
  const { icons, category, setCategory, search, setSearch, page, setPage, totalPages, total, loading } = useIcons({ limit: 48 });
  const [selectedIcon, setSelectedIcon] = useState<IconCardData | null>(null);
  const [totalAllIcons, setTotalAllIcons] = useState(0);

  useEffect(() => {
    api.icons.list({ limit: 1 }).then(d => setTotalAllIcons(d.meta?.total || 0)).catch(() => {});
  }, []);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <section className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-3">Browse Icons</h1>
          <p className="text-text-secondary text-lg mb-8">
            {totalAllIcons.toLocaleString()} icons across {categories.length} categories
          </p>

          <div className="max-w-xl mb-6">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search by name, tag, or category..."
            />
          </div>

          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} totalCount={totalAllIcons} />
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <IconGrid icons={icons as IconCardData[]} loading={loading} selectedName={selectedIcon?.name ?? null} onSelect={setSelectedIcon} />

          {!loading && icons.length > 0 && totalPages > 1 && (
            <>
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {getPageNumbers().map((p, i) =>
                  typeof p === 'string' ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">···</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-accent text-white shadow-sm' : 'border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg border border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <p className="text-center text-xs text-text-muted mt-4">
                Page {page} of {totalPages} · {(page - 1) * 48 + 1}–{Math.min(page * 48, total)} of {total.toLocaleString()} icons
              </p>
            </>
          )}
        </div>
      </section>

      <IconPreviewModal icon={selectedIcon} onClose={() => setSelectedIcon(null)} />

      <Footer />
    </div>
  );
}
