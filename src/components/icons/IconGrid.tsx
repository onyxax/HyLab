'use client';

import { IconCard, IconCardData, normalizeForGrid } from './IconCard';
import { IconFolderCard } from './IconFolderCard';
import { groupGridEntries, GridEntry } from './folders';

type GridVariant = 'default' | 'compact' | 'browse';

const GRID_CLASSES: Record<GridVariant, string> = {
  default: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3',
  compact: 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-3',
  browse: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3',
};

export function IconGridSkeleton({ count = 48, variant = 'default' }: { count?: number; variant?: GridVariant }) {
  return (
    <div className={GRID_CLASSES[variant]}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square skeleton rounded-xl" />
      ))}
    </div>
  );
}

export function IconGridEmpty() {
  return (
    <div className="text-center py-20">
      <svg
        className="w-16 h-16 mx-auto text-text-muted opacity-30 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-xl font-semibold font-[family-name:var(--font-outfit)] mb-2">No icons found</h3>
      <p className="text-text-muted">Try a different search term or category</p>
    </div>
  );
}

export function IconGrid({
  icons,
  loading,
  selectedName,
  copiedName,
  onSelect,
  onCopy,
  skeletonCount = 48,
  variant = 'default',
  familyMode = false,
}: {
  icons: IconCardData[];
  loading: boolean;
  selectedName?: string | null;
  copiedName?: string | null;
  onSelect?: (icon: IconCardData) => void;
  onCopy?: (name: string) => void;
  skeletonCount?: number;
  variant?: GridVariant;
  /** Family rows (one row per folder with members inline) — for
   *  folder-dominated sets like SF Symbols so the view feels dense. */
  familyMode?: boolean;
}) {
  if (loading) return <IconGridSkeleton count={skeletonCount} variant={variant} />;
  if (icons.length === 0) return <IconGridEmpty />;
  const entries = groupGridEntries(icons);
  if (familyMode) return <FamilyRows entries={entries} selectedName={selectedName} onSelect={onSelect} />;
  return (
    <div className={GRID_CLASSES[variant]}>
      {entries.map(entry =>
        entry.kind === 'folder' ? (
          <IconFolderCard
            key={entry.key}
            label={entry.label}
            members={entry.members}
            selected={selectedName != null && entry.members.some(m => m.name === selectedName)}
            copied={copiedName != null && entry.members.some(m => m.name === copiedName)}
            onOpen={onSelect ? icon => onSelect(icon) : onCopy ? () => onCopy(entry.members[0].name) : undefined}
          />
        ) : (
          <IconCard
            key={`${entry.icon.name}`}
            icon={entry.icon}
            selected={selectedName === entry.icon.name}
            copied={copiedName === entry.icon.name}
            onSelect={onSelect}
            onCopy={onCopy}
          />
        )
      )}
    </div>
  );
}

/**
 * Family rows — one dense row per folder: family name + count on the
 * left, every member directly clickable on the right. Built for
 * folder-dominated sets (SF Symbols) so the page feels full instead
 * of a sparse folder grid.
 */
function FamilyRows({
  entries,
  selectedName,
  onSelect,
}: {
  entries: GridEntry[];
  selectedName?: string | null;
  onSelect?: (icon: IconCardData) => void;
}) {
  return (
    <div className="divide-y divide-border-primary/70">
      {entries.map(entry => {
        const members = entry.kind === 'folder' ? entry.members : [entry.icon];
        const key = entry.kind === 'folder' ? entry.key : `single-${entry.icon.name}`;
        const label = entry.kind === 'folder' ? entry.label : entry.icon.name;
        return (
          <div key={key} className="flex items-center gap-3 py-2 first:pt-1 last:pb-1">
            <div className="w-28 sm:w-36 shrink-0 min-w-0">
              <div className="truncate text-[13px] font-semibold text-text-primary" title={members.map(m => m.name).join(', ')}>
                {label}
              </div>
              <div className="tabular text-[11px] text-text-muted">
                {members.length > 1 ? `${members.length} variants` : 'single'}
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5 flex-wrap min-w-0">
              {members.map(m => {
                const selected = selectedName === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => onSelect?.(m)}
                    aria-label={m.name}
                    title={m.name}
                    aria-pressed={selected}
                    className={`w-11 h-11 shrink-0 rounded-xl border p-2 block transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                      selected
                        ? 'border-accent bg-accent-light ring-1 ring-accent/30 text-accent'
                        : 'border-border-primary bg-bg-card text-text-secondary hover:text-text-primary hover:border-accent'
                    } [&_svg]:w-full [&_svg]:h-full`}
                    dangerouslySetInnerHTML={{ __html: normalizeForGrid(m.svg) }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
