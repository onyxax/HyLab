import { IconCategory, IconSet } from '@/types';
import { getAllIcons, searchIcons as repoSearch, getIconsByCategory, getIconsBySource, getTotalIcons } from './repository';

// Service layer — orchestrates repository + business rules.
// API routes should call service, never repository directly (for pagination, caching, etc.)

const CATEGORY_NAMES: Record<string, string> = {
  navigation: 'Navigation',
  action: 'Action',
  communication: 'Communication',
  social: 'Social',
  files: 'Files',
  media: 'Media',
  interface: 'Interface',
  status: 'Status',
  commerce: 'Commerce',
  charts: 'Charts',
  layout: 'Layout',
  development: 'Development',
  weather: 'Weather',
  miscellaneous: 'Miscellaneous',
};

// Memoized base data — for unfiltered fast path
let _cachedCategories: IconCategory[] | null = null;
let _cachedSets: IconSet[] | null = null;

export function getCategories(filter?: { source?: string }): IconCategory[] {
  if (!filter?.source) {
    if (_cachedCategories) return _cachedCategories;
    const icons = getAllIcons();
    const map = new Map<string, number>();
    for (const icon of icons) map.set(icon.category, (map.get(icon.category) || 0) + 1);
    _cachedCategories = Array.from(map.entries())
      .map(([id, count]) => ({ id, name: CATEGORY_NAMES[id] || id, count }))
      .sort((a, b) => b.count - a.count);
    return _cachedCategories;
  }
  // Filtered by source — dynamic counts
  const icons = getIconsBySource(filter.source!);
  const map = new Map<string, number>();
  for (const icon of icons) map.set(icon.category, (map.get(icon.category) || 0) + 1);
  // include zero-count categories for completeness
  const allCats = getCategories();
  return allCats.map(c => ({ ...c, count: map.get(c.id) || 0 })).sort((a, b) => b.count - a.count);
}

export function getSets(filter?: { category?: string }): IconSet[] {
  if (!filter?.category) {
    if (_cachedSets) return _cachedSets;
    const icons = getAllIcons();
    const sources = new Map<string, number>();
    for (const icon of icons) sources.set(icon.source, (sources.get(icon.source) || 0) + 1);
    _cachedSets = Array.from(sources.entries()).map(([id, count]) => ({
      id, name: id.charAt(0).toUpperCase() + id.slice(1), description: `${id} icon set`, count,
    }));
    return _cachedSets;
  }
  const icons = getIconsByCategory(filter.category!);
  const map = new Map<string, number>();
  for (const icon of icons) map.set(icon.source, (map.get(icon.source) || 0) + 1);
  const allSets = getSets();
  return allSets.map(s => ({ ...s, count: map.get(s.id) || 0 })).sort((a, b) => b.count - a.count);
}

export function listIcons(opts: { page: number; limit: number; category?: string; source?: string }) {
  const { page, limit, category, source } = opts;
  let all: ReturnType<typeof getAllIcons>;
  if (category && source) {
    // تقاطع الفئتين — فلترة دقيقة
    const byCat = new Set(getIconsByCategory(category).map(i => i.name));
    all = getIconsBySource(source).filter(i => byCat.has(i.name));
  } else if (category) {
    all = getIconsByCategory(category);
  } else if (source) {
    all = getIconsBySource(source);
  } else {
    all = getAllIcons();
  }
  const total = all.length;
  const offset = (page - 1) * limit;
  const data = all.slice(offset, offset + limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function searchIcons(query: string) {
  return repoSearch(query);
}

export function __clearServiceCache() {
  _cachedCategories = null;
  _cachedSets = null;
}

export { getTotalIcons };
