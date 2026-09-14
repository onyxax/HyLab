'use client';

import { SearchInput } from '@/components/ui/Input';

export function BrowseHeader({
  totalAllIcons,
  categoriesCount,
  setsCount,
  search,
  setSearch,
}: {
  totalAllIcons: number;
  categoriesCount: number;
  setsCount: number;
  search: string;
  setSearch: (v: string) => void;
}) {
  return (
    <section className="pt-8 pb-6 px-6 border-b border-border-primary">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] tracking-[0.08em] uppercase font-semibold text-text-muted mb-2">Library</div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] leading-none font-[family-name:var(--font-outfit)]">Browse Icons</h1>
            <p className="text-sm text-text-secondary mt-2">
              <span className="tabular font-medium text-text-primary">{totalAllIcons.toLocaleString()}</span> icons
              <span className="mx-1.5 text-border-primary">·</span>
              {categoriesCount} categories
              <span className="mx-1.5 text-border-primary">·</span>
              {setsCount} families
            </p>
          </div>
          <div className="w-full lg:w-[400px] shrink-0">
            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Search by name, tag, or category…" />
            <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
              <span>Try</span>
              {['arrow', 'heart', 'settings'].map(q => (
                <button key={q} onClick={() => setSearch(q)} className="px-2 py-1 rounded-full bg-bg-secondary border border-border-primary hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors">
                  {q}
                </button>
              ))}
              <span className="hidden sm:inline">or press <span className="font-mono border border-border-primary rounded px-1">/</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
