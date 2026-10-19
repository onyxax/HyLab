'use client';

import { IconCardData } from './IconCard';

/**
 * Folder grouping for the icon grid (iPhone-style folders).
 * Siblings are linked through the stored `variants` field (same source as the
 * preview modal), so the grid and the modal always agree on family members.
 * Grouping is computed on the DISPLAYED set only and preserves result order —
 * filtering or paging never reshuffles existing cards.
 */

export type GridEntry =
  | { kind: 'single'; icon: IconCardData }
  | { kind: 'folder'; key: string; label: string; members: IconCardData[] };

// Same suffix rule as the build scripts (scripts/extract-all.js baseOf):
// sf-04-square-fill -> sf-04. Only used for the folder label.
function familyBase(name: string): string {
  const stripped = name.replace(/(?:-(?:circle-fill|square-fill|circle|square|slash|fill))+$/, '');
  if (stripped && stripped !== 'sf') return stripped;
  const m = name.match(/^sf-((?:circle|square|slash|fill))(?:-|$)/);
  return m ? `sf-${m[1]}` : name;
}

export function familyLabel(name: string): string {
  const base = familyBase(name);
  return base.replace(/^sf-/, '') || name;
}

export function groupGridEntries(icons: IconCardData[]): GridEntry[] {
  const byName = new Map(icons.map(i => [i.name, i]));
  const visited = new Set<string>();
  const entries: GridEntry[] = [];
  for (const icon of icons) {
    if (visited.has(icon.name)) continue;
    // BFS over variants present in this view (transitive closure).
    const members: IconCardData[] = [];
    const queue: IconCardData[] = [icon];
    visited.add(icon.name);
    while (queue.length) {
      const cur = queue.shift()!;
      members.push(cur);
      for (const vn of cur.variants ?? []) {
        if (!visited.has(vn) && byName.has(vn)) {
          visited.add(vn);
          queue.push(byName.get(vn)!);
        }
      }
    }
    if (members.length > 1) {
      members.sort((a, b) => icons.indexOf(a) - icons.indexOf(b));
      entries.push({ kind: 'folder', key: `folder-${members[0].name}`, label: familyLabel(members[0].name), members });
    } else {
      entries.push({ kind: 'single', icon });
    }
  }
  return entries;
}
