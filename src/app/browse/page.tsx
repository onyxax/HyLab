'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { IconGrid } from '@/components/icons/IconGrid';
import { IconPreviewModal } from '@/components/icons/IconPreviewModal';
import { useBrowseFilters } from '@/features/browse/hooks/useBrowseFilters';
import { BrowseHeader } from '@/features/browse/components/BrowseHeader';
import { DesktopFilters, MobileFilters } from '@/features/browse/components/FilterPanels';
import { BrowseToolbar } from '@/features/browse/components/BrowseToolbar';
import type { IconCardData } from '@/components/icons/IconCard';

export default function BrowsePage() {
  useScrollToTop();
  const {
    icons, category, setCategory, source, setSource, search, setSearch, page, setPage, totalPages, total, loading,
    categories, sets, totalAllIcons,
  } = useBrowseFilters(48);

  const [selectedIcon, setSelectedIcon] = useState<IconCardData | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <BrowseHeader totalAllIcons={totalAllIcons} categoriesCount={categories.length} setsCount={sets.length} search={search} setSearch={setSearch} />

      <section className="py-4 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[400px_1fr] gap-5 items-start">
          <DesktopFilters categories={categories} sets={sets} category={category} source={source} setCategory={setCategory} setSource={setSource} totalAllIcons={totalAllIcons} />

          <div className="min-w-0">
            <MobileFilters categories={categories} sets={sets} category={category} source={source} setCategory={setCategory} setSource={setSource} totalAllIcons={totalAllIcons} />
            <BrowseToolbar loading={loading} search={search} category={category} source={source} total={total} page={page} totalPages={totalPages} categories={categories} onClear={() => { setCategory(null); setSource(null); setSearch(''); }} />

            <div className="rounded-2xl border border-border-primary bg-bg-card p-4 md:p-5">
              <IconGrid icons={icons as IconCardData[]} loading={loading} selectedName={selectedIcon?.name ?? null} onSelect={setSelectedIcon} />
            </div>

            {!loading && icons.length > 0 && totalPages > 1 && !search.trim() && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-primary pt-4">
                <span className="text-xs text-text-muted tabular">{(page - 1) * 48 + 1}–{Math.min(page * 48, total)} of {total.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-8 px-3 rounded-full border border-border-primary bg-bg-card text-sm text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
                  <span className="text-sm tabular font-medium min-w-[80px] text-center">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 px-3 rounded-full border border-border-primary bg-bg-card text-sm text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <IconPreviewModal icon={selectedIcon} onClose={() => setSelectedIcon(null)} />
      <Footer />
    </div>
  );
}
