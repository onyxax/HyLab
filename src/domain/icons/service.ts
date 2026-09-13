import { IconCategory, IconSet } from '@/types';
import { getAllIcons, searchIcons as repoSearch, getIconsByCategory, getTotalIcons } from './repository';

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

// Memoized derived data — computed once per server lifecycle
let _cachedCategories: IconCategory[] | null = null;
let _cachedSets: IconSet[] | null = null;

export function getCategories(): IconCategory[] {
  if (_cachedCategories) return _cachedCategories;
  const icons = getAllIcons();
  const map = new Map<string, number>();
  for (const icon of icons) {
    map.set(icon.category, (map.get(icon.category) || 0) + 1);
  }
  _cachedCategories = Array.from(map.entries())
    .map(([id, count]) => ({
      id,
      name: CATEGORY_NAMES[id] || id,
      count,
    }))
    .sort((a, b) => b.count - a.count);
  return _cachedCategories;
}

export function getSets(): IconSet[] {
  if (_cachedSets) return _cachedSets;
  const icons = getAllIcons();
  const sources = new Map<string, number>();
  for (const icon of icons) {
    sources.set(icon.source, (sources.get(icon.source) || 0) + 1);
  }
  _cachedSets = Array.from(sources.entries()).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    description: `${id} icon set`,
    count,
  }));
  return _cachedSets;
}

export function listIcons(opts: { page: number; limit: number; category?: string }) {
  const { page, limit, category } = opts;
  const all = category ? getIconsByCategory(category) : getAllIcons();
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
