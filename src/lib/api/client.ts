// Unified API client — single source of truth for all frontend fetches.
// Prevents hardcoded fetch('/api/...') duplication across pages.

export type FetchIconsParams = {
  page?: number;
  limit?: number;
  category?: string;
};

export type IconListItem = {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source?: string;
};

export type CategoryItem = { id: string; name: string; count: number };
export type SetItem = { id: string; name: string; description: string; count: number };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  icons: {
    list: async (params: FetchIconsParams = {}) => {
      const sp = new URLSearchParams();
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.category) sp.set('category', params.category);
      const qs = sp.toString();
      const data = await fetchJson<{ success: boolean; data: IconListItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        `/api/icons${qs ? `?${qs}` : ''}`
      );
      return data;
    },
    search: async (query: string) => {
      const data = await fetchJson<{ success: boolean; data: IconListItem[]; meta: { total: number; query: string } }>(
        `/api/icons/search?q=${encodeURIComponent(query)}`
      );
      return data;
    },
    getByName: async (name: string, opts?: { color?: string; size?: number; stroke?: number; format?: string }) => {
      const sp = new URLSearchParams();
      if (opts?.color) sp.set('color', opts.color);
      if (opts?.size) sp.set('size', String(opts.size));
      if (opts?.stroke) sp.set('stroke', String(opts.stroke));
      if (opts?.format) sp.set('format', opts.format);
      const qs = sp.toString();
      const res = await fetch(`/api/icons/${name}${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error(`Icon "${name}" not found`);
      return res;
    },
    categories: async () => {
      const data = await fetchJson<{ success: boolean; data: CategoryItem[]; meta: { total: number; totalIcons: number } }>(
        '/api/icons/categories'
      );
      return data;
    },
    sets: async () => {
      const data = await fetchJson<{ success: boolean; data: SetItem[]; meta: { total: number } }>(
        '/api/icons/sets'
      );
      return data;
    },
  },
  status: {
    check: async () => {
      const data = await fetchJson<{ status: string; avgResponseTime: number; checks: unknown[] }>(
        '/api/status'
      );
      return data;
    },
  },
};

export function buildIconUrl(
  name: string,
  opts: { color?: string; size?: number; format?: string; stroke?: number }
) {
  // Always returns absolute URL for external use (copy/share)
  const base = 'https://hylab.vercel.app';
  const sp = new URLSearchParams();
  if (opts.color) sp.set('color', opts.color.replace(/^#/, ''));
  if (opts.size) sp.set('size', String(opts.size));
  if (opts.format && opts.format !== 'svg') sp.set('format', opts.format);
  if (opts.stroke) sp.set('stroke', String(opts.stroke));
  const qs = sp.toString();
  return `${base}/api/icons/${name}${qs ? `?${qs}` : ''}`;
}
