'use client';

import { CategoryItem, SetItem } from '@/lib/api/client';

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
  return (
    <aside className="hidden lg:flex gap-4 sticky top-[80px] self-start">
      <div className="flex-1 rounded-2xl border border-border-primary bg-bg-card overflow-hidden shadow-sm">
        <div className="px-4 h-11 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
          <span className="text-sm font-bold tracking-[-0.01em] text-text-primary">Category</span>
          {category ? <button onClick={() => setCategory(null)} className="text-xs font-semibold text-accent">Clear</button> : <span className="text-xs tabular font-medium text-text-muted">{categories.length}</span>}
        </div>
        <div className="p-2.5">
          <button onClick={() => setCategory(null)} className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${!category ? 'bg-text-primary text-bg-primary font-semibold shadow-sm' : 'text-text-secondary hover:bg-bg-secondary'}`}>
            <span>All</span>
            <span className={`text-xs tabular font-medium ${!category ? 'text-bg-primary/70' : 'text-text-muted'}`}>{(source ? categories.reduce((a, c) => a + c.count, 0) : totalAllIcons).toLocaleString()}</span>
          </button>
          {categories.map(cat => {
            const active = category === cat.id;
            return (
              <button key={cat.id} onClick={() => setCategory(active ? null : cat.id)} className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${active ? 'bg-text-primary text-bg-primary font-semibold shadow-sm' : 'text-text-secondary hover:bg-bg-secondary'}`}>
                <span className="truncate pr-2 font-medium">{cat.name}</span>
                <span className={`text-xs tabular font-medium shrink-0 ${active ? 'text-bg-primary/70' : 'text-text-muted'}`}>{cat.count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-border-primary bg-bg-card overflow-hidden shadow-sm">
        <div className="px-4 h-11 flex items-center justify-between border-b border-border-primary bg-bg-secondary">
          <span className="text-sm font-bold tracking-[-0.01em] text-text-primary">Family</span>
          {source ? <button onClick={() => setSource(null)} className="text-xs font-semibold text-accent">Clear</button> : <span className="text-xs tabular font-medium text-text-muted">{sets.length}</span>}
        </div>
        <div className="p-2.5">
          <button onClick={() => setSource(null)} className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${!source ? 'bg-accent text-white font-semibold shadow-sm' : 'text-text-secondary hover:bg-bg-secondary'}`}>
            <span>All families</span>
            <span className={`text-xs tabular font-medium ${!source ? 'text-white/80' : 'text-text-muted'}`}>{(category ? sets.reduce((a, s) => a + s.count, 0) : totalAllIcons).toLocaleString()}</span>
          </button>
          {sets.map(s => {
            const active = source === s.id;
            return (
              <button key={s.id} onClick={() => setSource(active ? null : s.id)} className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${active ? 'bg-accent text-white font-semibold shadow-sm' : 'text-text-secondary hover:bg-bg-secondary'}`}>
                <span className="truncate pr-1 capitalize font-medium">{s.id}</span>
                <span className={`tabular shrink-0 text-xs font-medium ${active ? 'text-white/80' : 'text-text-muted'}`}>{s.count.toLocaleString()}</span>
              </button>
            );
          })}
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
  return (
    <div className="lg:hidden mb-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-text-muted shrink-0 w-12">Cat:</span>
        <div className="flex-1 -mr-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 w-max pr-6">
            <button onClick={() => setCategory(null)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${!category ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-card text-text-secondary border-border-primary'}`}>
              All · {(source ? categories.reduce((a, c) => a + c.count, 0) : totalAllIcons).toLocaleString()}
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setCategory(category === cat.id ? null : cat.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${category === cat.id ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-card text-text-secondary border-border-primary'}`}>{cat.name} · {cat.count}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-text-muted shrink-0 w-12">Family:</span>
        <div className="flex-1 -mr-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 w-max pr-6">
            <button onClick={() => setSource(null)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${!source ? 'bg-accent text-white border-accent' : 'bg-bg-card text-text-secondary border-border-primary'}`}>All · {(category ? sets.reduce((a, s) => a + s.count, 0) : totalAllIcons).toLocaleString()}</button>
            {sets.map(s => (
              <button key={s.id} onClick={() => setSource(source === s.id ? null : s.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${source === s.id ? 'bg-accent text-white border-accent' : 'bg-bg-card text-text-secondary border-border-primary'}`}>{s.id} · {s.count}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
