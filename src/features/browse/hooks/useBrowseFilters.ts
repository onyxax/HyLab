'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIcons } from '@/hooks/useIcons';
import { api, CategoryItem, SetItem } from '@/lib/api/client';

/**
 * Deep hook — single owner for browse filtering.
 * يجمع: URL sync + category + source + search + pagination في مكان واحد.
 * تغيير الفلتر هنا لا يكسر صفحة أخرى.
 */
export function useBrowseFilters(limit = 48) {
  const [sets, setSets] = useState<SetItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [totalAllIcons, setTotalAllIcons] = useState(0);
  const router = useRouter();

  const { icons, category, setCategory, source, setSource, search, setSearch, page, setPage, totalPages, total, loading } =
    useIcons({ limit });

  // initial totals
  useEffect(() => {
    api.icons.list({ limit: 1 }).then(d => setTotalAllIcons(d.meta?.total || 0)).catch(() => {});
  }, []);

  // dynamic counts — تتغير حسب الفلتر الآخر
  useEffect(() => {
    api.icons.categories({ set: source || undefined }).then(d => setCategories(d.data || [])).catch(() => {});
  }, [source]);

  useEffect(() => {
    api.icons.sets({ category: category || undefined }).then(d => setSets(d.data || [])).catch(() => {});
  }, [category]);

  // read URL on mount
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get('category');
    const s = sp.get('set') || sp.get('source');
    const q = sp.get('q');
    const p = Number(sp.get('page') || 1);
    if (c) setCategory(c);
    if (s) setSource(s);
    if (q) setSearch(q);
    if (Number.isFinite(p) && p > 1) setPage(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // write URL on change
  useEffect(() => {
    const sp = new URLSearchParams();
    if (category) sp.set('category', category);
    if (source) sp.set('set', source);
    if (search.trim()) sp.set('q', search.trim());
    if (page > 1) sp.set('page', String(page));
    const qs = sp.toString();
    const url = `/browse${qs ? `?${qs}` : ''}`;
    if (window.location.search !== `?${qs}` && window.location.search !== qs) {
      router.replace(url, { scroll: false });
    }
  }, [category, source, search, page, router]);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return {
    icons, category, setCategory, source, setSource, search, setSearch, page, setPage, totalPages, total, loading,
    categories, sets, totalAllIcons,
  };
}
