import { IconData, IconSource } from './types';
import { categorizeIcon, generateTags, cleanSvg } from './utils';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

// Priority order — specific categories win over generic ones
// (e.g. house.fill is ["gaming","home"] -> navigation, not media;
// lock.fill is ["objects__tools","privacy__security"] -> interface).
// Unknown keys rank last (999), never first.
const SF_CATEGORY_PRIORITY = [
  'home', 'maps', 'arrows', 'transportation', 'automotive',
  'communication', 'commerce', 'camera__photos', 'gaming', 'media',
  'editing', 'text_formatting', 'keyboard', 'draw',
  'privacy__security', 'accessibility', 'devices', 'connectivity',
  'objects__tools', 'human', 'brands', 'math', 'indicies', 'variable',
  'shapes', 'weather', 'time', 'health', 'fitness', 'nature', 'whats_new',
];

function sfRank(c: string): number {
  const i = SF_CATEGORY_PRIORITY.indexOf(c);
  return i === -1 ? 999 : i;
}
const SF_CATEGORY_MAP: Record<string, string> = {
  arrows: 'navigation',
  automotive: 'navigation',
  transportation: 'navigation',
  maps: 'navigation',
  home: 'navigation',
  communication: 'communication',
  commerce: 'commerce',
  media: 'media',
  camera__photos: 'media',
  gaming: 'media',
  shapes: 'layout',
  objects__tools: 'layout',
  editing: 'action',
  text_formatting: 'action',
  keyboard: 'action',
  draw: 'action',
  privacy__security: 'interface',
  accessibility: 'interface',
  devices: 'interface',
  connectivity: 'interface',
  human: 'social',
  brands: 'social',
  math: 'charts',
  indicies: 'charts',
  variable: 'charts',
  time: 'miscellaneous',
  weather: 'weather',
  nature: 'miscellaneous',
  health: 'status',
  fitness: 'status',
  whats_new: 'miscellaneous',
};

interface SfPath {
  d: string;
  fillOpacity?: number;
}

interface SfIconData {
  iconName?: string;
  sourceName?: string;
  family?: string;
  viewBox?: string;
  svgPathData?: SfPath[];
  categories?: string[];
  keywords?: string[];
  style?: string;
  variants?: Record<string, string>;
}

function kebab(s: string): string {
  return s.toLowerCase().replace(/\./g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
}

function buildSfSvg(viewBox: string, paths: SfPath[]): string {
  const inner = paths
    .map(p => `<path d="${p.d}" fill="currentColor"${p.fillOpacity !== undefined && p.fillOpacity < 1 ? ` fill-opacity="${p.fillOpacity}"` : ''}/>`)
    .join('');
  return cleanSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="currentColor">${inner}</svg>`);
}

interface SfRaw {
  iconName: string;
  data: SfIconData;
}

export const sfsymbolsSource: IconSource = {
  id: 'sfsymbols',
  async fetch(): Promise<IconData[]> {
    const icons: IconData[] = [];
    const modDir = path.join(process.cwd(), 'node_modules', '@bradleyhodges', 'sfsymbols', 'dist', 'module');
    if (!fs.existsSync(modDir)) {
      console.error('SF Symbols package not found. Run: npm install @bradleyhodges/sfsymbols');
      return icons;
    }
    const files = fs.readdirSync(modDir).filter(f => /^sf.*\.js$/.test(f)).sort();

    // Pass 1 — load raw data (no naming decisions yet).
    const raws: SfRaw[] = [];
    const BATCH = 100;
    for (let i = 0; i < files.length; i += BATCH) {
      const batch = files.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map(async (file): Promise<SfRaw | null> => {
          try {
            const mod = await import(pathToFileURL(path.join(modDir, file)).href);
            const key = Object.keys(mod).find(k => k.startsWith('sf'));
            const data = (key ? (mod as Record<string, SfIconData>)[key] : null) as SfIconData | null;
            if (!data?.iconName || !data?.sourceName || !data?.svgPathData?.length || !data?.viewBox) return null;
            return { iconName: data.iconName, data };
          } catch {
            return null;
          }
        })
      );
      for (const r of results) if (r) raws.push(r);
      if ((i / BATCH) % 10 === 0 || i + BATCH >= files.length) {
        console.log(`  SF Symbols (load): ${Math.min(i + BATCH, files.length)}/${files.length}`);
      }
    }

    // Pass 2 — collision-safe unique names. Nothing is dropped:
    // first keeps sf-<source>, later ones fall back to the package
    // iconName (e.g. sfBrand11ty -> sf-brand-11ty), then -2/-3.
    const taken = new Set<string>();
    const iconNameToName = new Map<string, string>();
    const assigned: { raw: SfRaw; name: string }[] = [];
    for (const raw of raws) {
      const base = `sf-${kebab(raw.data.sourceName!)}`;
      let name = base;
      if (taken.has(name)) {
        const fromIcon = raw.iconName.replace(/^sf/i, '');
        name = `sf-${kebab(fromIcon)}`;
        let n = 2;
        while (taken.has(name)) name = `${base}-${n++}`;
      }
      taken.add(name);
      iconNameToName.set(raw.iconName, name);
      assigned.push({ raw, name });
    }

    // Pass 3 — build entries (variants resolved in pass 4).
    const built: { name: string; category: string; tags: string[]; svg: string; pkgVariants: string[] }[] = [];
    for (const { raw, name } of assigned) {
      const data = raw.data;
      const kebabName = kebab(data.sourceName!);
      const sfCats: string[] = Array.isArray(data.categories) ? data.categories : [];
      const ordered = [...sfCats].sort((a, b) => sfRank(a) - sfRank(b));
      let category = 'miscellaneous';
      for (const c of ordered) {
        if (SF_CATEGORY_MAP[c]) {
          category = SF_CATEGORY_MAP[c];
          break;
        }
      }
      if (category === 'miscellaneous') {
        const fallback = categorizeIcon(kebabName);
        if (fallback !== 'miscellaneous') category = fallback;
      }
      const tags = [
        ...generateTags(kebabName),
        ...sfCats.map(c => c.replace(/__/g, ' ').toLowerCase()),
        ...(Array.isArray(data.keywords) ? data.keywords.map(k => String(k).toLowerCase()) : []),
        data.style ? String(data.style).toLowerCase() : '',
      ]
        .filter((t, idx, arr) => t && t.length > 1 && arr.indexOf(t) === idx)
        .slice(0, 8);
      const pkgVariants = [
        ...new Set(
          Object.values(data.variants ?? {})
            .map(v => iconNameToName.get(String(v)))
            .filter((v): v is string => !!v && v !== name)
        ),
      ];
      built.push({ name, category, tags, svg: buildSfSvg(data.viewBox!, data.svgPathData!), pkgVariants });
    }

    // Pass 4 — folder grouping: family base (sf-04-square-fill -> sf-04)
    // plus byte-identical SVGs (brand duplicates like sf-11ty/sf-brand11ty).
    const baseOf = (n: string): string => {
      const stripped = n.replace(/(?:-(?:circle-fill|square-fill|circle|square|slash|fill))+$/, '');
      if (stripped && stripped !== 'sf') return stripped;
      const m = n.match(/^sf-((?:circle|square|slash|fill))(?:-|$)/);
      return m ? `sf-${m[1]}` : n;
    };
    const byBase = new Map<string, string[]>();
    for (const e of built) {
      const b = baseOf(e.name);
      if (!byBase.has(b)) byBase.set(b, []);
      byBase.get(b)!.push(e.name);
    }
    const bySvg = new Map<string, string[]>();
    for (const e of built) {
      if (!bySvg.has(e.svg)) bySvg.set(e.svg, []);
      bySvg.get(e.svg)!.push(e.name);
    }
    for (const e of built) {
      const family = (byBase.get(baseOf(e.name)) ?? []).filter(n => n !== e.name);
      const identical = (bySvg.get(e.svg) ?? []).filter(n => n !== e.name);
      const variants = [...new Set([...e.pkgVariants, ...family, ...identical])].sort();
      icons.push({
        name: e.name,
        category: e.category,
        tags: e.tags,
        svg: e.svg,
        source: 'sfsymbols',
        ...(variants.length ? { variants } : {}),
      });
    }
    return icons;
  },
};
