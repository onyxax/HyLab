'use client';

export function BrowseToolbar({
  loading,
  search,
  category,
  source,
  total,
  page,
  totalPages,
  categories,
  onClear,
}: {
  loading: boolean;
  search: string;
  category: string | null;
  source: string | null;
  total: number;
  page: number;
  totalPages: number;
  categories: { id: string; name: string }[];
  onClear: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-sm">
          {loading ? <span className="text-text-muted">Loading…</span> : search.trim() ? (
            <span className="text-text-secondary"><span className="font-medium text-text-primary tabular">{total}</span> results for <span className="font-medium text-text-primary">“{search}”</span></span>
          ) : (
            <span className="text-text-secondary">
              <span className="font-medium text-text-primary tabular">{total.toLocaleString()}</span> icons
              {category && <> in <span className="font-medium text-text-primary">{categories.find(c => c.id === category)?.name ?? category}</span></>}
              {source && <> · <span className="font-medium text-text-primary capitalize">{source}</span></>}
              <span className="mx-1.5 text-border-primary">·</span>page {page} of {totalPages}
            </span>
          )}
        </div>
        {(category || source || search) && (
          <button onClick={onClear} className="text-xs font-medium text-accent hover:text-accent-hover">Clear filters →</button>
        )}
      </div>
      {(category || source) && !search.trim() && (
        <div className="flex flex-wrap gap-2 mb-4">
          {category && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-text-primary text-bg-primary text-xs">Category: {category}</span>}
          {source && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-white text-xs">Family: {source}</span>}
        </div>
      )}
    </>
  );
}
