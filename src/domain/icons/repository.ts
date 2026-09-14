import type { Icon } from './schema';
import iconsData from '@/data/icons.json';

// Singleton repository — single owner of the 13MB JSON.
// All other modules must go through this, never import icons.json directly.

let _all: Icon[] | null = null;
let _byName: Map<string, Icon> | null = null;
let _byCategory: Map<string, Icon[]> | null = null;
let _bySource: Map<string, Icon[]> | null = null;

function ensureLoaded(): Icon[] {
  if (!_all) {
    _all = iconsData as Icon[];
    _byName = new Map(_all.map(i => [i.name, i]));
    _byCategory = new Map();
    _bySource = new Map();
    for (const icon of _all) {
      const list = _byCategory.get(icon.category);
      if (list) list.push(icon);
      else _byCategory.set(icon.category, [icon]);
      const sList = _bySource.get(icon.source);
      if (sList) sList.push(icon);
      else _bySource.set(icon.source, [icon]);
    }
  }
  return _all!;
}

export function getAllIcons(): Icon[] {
  return ensureLoaded();
}

export function getIconByName(name: string): Icon | undefined {
  ensureLoaded();
  return _byName!.get(name);
}

export function getIconsByCategory(category: string): Icon[] {
  ensureLoaded();
  return _byCategory!.get(category) ?? [];
}

export function getIconsBySource(source: string): Icon[] {
  ensureLoaded();
  return _bySource!.get(source) ?? [];
}

export function searchIcons(query: string): Icon[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const icons = ensureLoaded();
  // Linear scan — acceptable for 18k, but indexed via Map for future optimization.
  // Future: build inverted index on name/tags/category if needed.
  return icons.filter(icon =>
    icon.name.toLowerCase().includes(q) ||
    icon.tags.some(tag => tag.toLowerCase().includes(q)) ||
    icon.category.toLowerCase().includes(q)
  );
}

export function getTotalIcons(): number {
  return ensureLoaded().length;
}

// For testing / hot reload — allow clearing cache
export function __clearCache() {
  _all = null;
  _byName = null;
  _byCategory = null;
  _bySource = null;
}
