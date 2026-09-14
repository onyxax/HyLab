'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, IconListItem } from '@/lib/api/client';
import { useDebouncedValue } from './useDebouncedValue';

export interface UseIconsOptions {
  limit?: number;
  initialPage?: number;
  initialCategory?: string | null;
  initialSet?: string | null;
}

export function useIcons(opts: UseIconsOptions = {}) {
  const limit = opts.limit ?? 48;
  const [icons, setIcons] = useState<IconListItem[]>([]);
  const [category, setCategory] = useState<string | null>(opts.initialCategory ?? null);
  const [source, setSource] = useState<string | null>(opts.initialSet ?? null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(opts.initialPage ?? 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [category, source, debouncedSearch]);

  const fetchIcons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (debouncedSearch.trim()) {
        const res = await api.icons.search(debouncedSearch, { category: category ?? undefined, source: source ?? undefined });
        setIcons(res.data || []);
        setTotal(res.meta?.total ?? res.data?.length ?? 0);
        setTotalPages(1);
      } else {
        const res = await api.icons.list({ category: category ?? undefined, source: source ?? undefined, page, limit });
        setIcons(res.data || []);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 1);
      }
    } catch (e) {
      setError((e as Error).message);
      setIcons([]);
    } finally {
      setLoading(false);
    }
  }, [category, source, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchIcons();
  }, [fetchIcons]);

  return {
    icons,
    category,
    setCategory,
    source,
    setSource,
    search,
    setSearch,
    debouncedSearch,
    page,
    setPage,
    totalPages,
    total,
    loading,
    error,
    refresh: fetchIcons,
  };
}
