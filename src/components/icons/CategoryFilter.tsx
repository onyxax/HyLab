'use client';

import { CategoryItem } from '@/lib/api/client';

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  totalCount,
}: {
  categories: CategoryItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  totalCount?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          !selected ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover bg-bg-card'
        }`}
      >
        All {totalCount !== undefined ? `(${totalCount.toLocaleString()})` : ''}
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(selected === cat.id ? null : cat.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selected === cat.id
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover bg-bg-card'
          }`}
        >
          {cat.name} ({cat.count})
        </button>
      ))}
    </div>
  );
}

// Compact variant for Home page
export function CategoryFilterCompact({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selected ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover'}`}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected === cat.id ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-border-hover'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
