'use client';

import { CategoryItem, SetItem } from '@/lib/api/client';

/* ═══════════════════════════════════════════════════════════
   Filters — single compact card, no scrolling lists.
   Family = 2-column tile grid · Category = wrapping chips.
   Flat active states (solid fills, no glow).
   Order is stable by API contract: options never reshuffle,
   only counts update.
   ═══════════════════════════════════════════════════════════ */

export function DesktopFilters({
  categories,
  sets,
  category,
  source,
  setCategory,
  setSource,
  totalAllIcons,
}: {
  categories: CategoryItem[];
  sets: SetItem[];
  category: string | null;
  source: string | null;
  setCategory: (v: string | null) => void;
  setSource: (v: string | null) => void;
  totalAllIcons: number;
}) {
  const activeCount = (category ? 1 : 0) + (source ? 1 : 0);
  const clearAll = () => {
    setCategory(null);
    setSource(null);
  };

  return (
    <aside className="hidden lg:block sticky top-[80px] self-start rounded-[20px] border border-border-primary bg-bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 h-12 flex items-center justify-between border-b border-border-primary">
        <span className="text-sm font-bold tracking-[-0.01em] text-text-primary">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 text-[11px] tabular px-1.5 py-0.5 rounded-full bg-accent text-white font-semibold">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 ? (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            Clear all
          </button>
        ) : (
          <span className="text-xs tabular text-text-muted">{totalAllIcons.toLocaleString()} icons</span>
        )}
      </div>

      <div className="p-3.5 space-y-4">
        {/* Family — tile grid */}
        <div>
          <div className="label !text-[10px] px-1 mb-2">Family</div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setSource(null)}
              aria-pressed={!source}
              className={`col-span-2 flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                !source
                  ? 'bg-text-primary border-text-primary text-bg-primary'
                  : 'border-border-primary text-text-secondary hover:border-border-hover hover:text-text-primary'
              }`}
            >
              <span className="flex-1 text-left font-semibold">All families</span>
              <span className={`tabular text-[11px] ${!source ? 'text-bg-primary/70 font-semibold' : 'text-text-muted'}`}>
                {totalAllIcons.toLocaleString()}
              </span>
            </button>
            {sets.map(s => {
              const active = source === s.id;
              const name = s.id.charAt(0).toUpperCase() + s.id.slice(1);
              return (
                <button
                  key={s.id}
                  onClick={() => setSource(active ? null : s.id)}
                  aria-pressed={active}
                  title={`${name} — ${s.count.toLocaleString()} icons`}
                  className={`flex items-center gap-2 rounded-xl border px-2 py-[7px] min-w-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    active
                      ? 'bg-text-primary border-text-primary text-bg-primary'
                      : 'border-border-primary text-text-secondary hover:border-border-hover hover:text-text-primary'
                  } ${s.count === 0 && !active ? 'opacity-40' : ''}`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                      active ? 'bg-bg-primary/20 text-bg-primary' : 'bg-bg-secondary text-text-secondary'
                    }`}
                  >
                    {s.id.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block truncate text-[12px] leading-tight ${active ? 'font-semibold' : 'font-medium'}`}>{name}</span>
                    <span className={`block tabular text-[10px] leading-tight ${active ? 'text-bg-primary/70' : 'text-text-muted'}`}>
                      {s.count.toLocaleString()}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category — wrapping chips */}
        <div>
          <div className="label !text-[10px] px-1 mb-2">Category</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategory(null)}
              aria-pressed={!category}
              className={`px-3 py-[7px] rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                !category
                  ? 'bg-text-primary text-bg-primary border-text-primary font-semibold'
                  : 'bg-bg-card text-text-secondary border-border-primary hover:border-border-hover hover:text-text-primary'
              }`}
            >
              All
            </button>
            {categories.map(cat => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(active ? null : cat.id)}
                  aria-pressed={active}
                  title={`${cat.name} — ${cat.count.toLocaleString()} icons`}
                  className={`px-3 py-[7px] rounded-full text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    active
                      ? 'bg-text-primary text-bg-primary border-text-primary font-semibold'
                      : 'bg-bg-card text-text-secondary border-border-primary hover:border-border-hover hover:text-text-primary'
                  } ${cat.count === 0 && !active ? 'opacity-40' : ''}`}
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className={`ml-1.5 tabular ${active ? 'text-bg-primary/75' : 'text-text-muted'}`}>{cat.count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileFilters({
  categories,
  sets,
  category,
  source,
  setCategory,
  setSource,
  totalAllIcons,
}: {
  categories: CategoryItem[];
  sets: SetItem[];
  category: string | null;
  source: string | null;
  setCategory: (v: string | null) => void;
  setSource: (v: string | null) => void;
  totalAllIcons: number;
}) {
  const chip = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
      active
        ? 'bg-text-primary text-bg-primary border-text-primary'
        : 'bg-bg-card text-text-secondary border-border-primary'
    }`;

  return (
    <div className="lg:hidden mb-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="label !text-[10px] shrink-0 w-12">Cat:</span>
        <div className="flex-1 -mr-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 w-max pr-6">
            <button onClick={() => setCategory(null)} aria-pressed={!category} className={chip(!category)}>
              All · {(source ? categories.reduce((a, c) => a + c.count, 0) : totalAllIcons).toLocaleString()}
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setCategory(category === cat.id ? null : cat.id)} aria-pressed={category === cat.id} className={chip(category === cat.id)}>
                {cat.name} · {cat.count}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="label !text-[10px] shrink-0 w-12">Family:</span>
        <div className="flex-1 -mr-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 w-max pr-6">
            <button onClick={() => setSource(null)} aria-pressed={!source} className={chip(!source)}>All · {(category ? sets.reduce((a, s) => a + s.count, 0) : totalAllIcons).toLocaleString()}</button>
            {sets.map(s => (
              <button key={s.id} onClick={() => setSource(source === s.id ? null : s.id)} aria-pressed={source === s.id} className={chip(source === s.id)}>{s.id} · {s.count}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
