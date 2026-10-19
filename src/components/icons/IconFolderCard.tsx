'use client';

import { IconCardData, normalizeForGrid } from './IconCard';

/**
 * iPhone-style folder card: 2×2 mini previews of the family members
 * plus a count badge. Clicking opens the first member (the preview
 * modal's Variants strip navigates the rest of the folder).
 */
export function IconFolderCard({
  label,
  members,
  selected,
  copied,
  onOpen,
}: {
  label: string;
  members: IconCardData[];
  selected?: boolean;
  copied?: boolean;
  onOpen?: (icon: IconCardData) => void;
}) {
  const minis = members.slice(0, 4);
  // Fill the card: 2 members → 2 large cells, 3 → 3 cells, 4+ → 2×2.
  const miniGrid = minis.length <= 2 ? 'grid-cols-2' : minis.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <button
      onClick={() => onOpen?.(members[0])}
      aria-label={`Folder ${label} with ${members.length} icons`}
      title={copied ? '✓ Copied' : members.map(m => m.name).join(', ')}
      className={`group relative aspect-square rounded-[14px] border bg-bg-card flex flex-col p-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 transition-colors ${
        selected || copied ? 'border-accent bg-accent-light ring-2 ring-accent/20' : 'border-border-primary hover:border-accent'
      }`}
    >
      <span className={`flex-1 grid ${miniGrid} gap-1 min-h-0 content-center`} aria-hidden="true">
        {minis.map(m => (
          <span
            key={m.name}
            className="block aspect-square w-full text-text-secondary group-hover:text-text-primary [&_svg]:w-full [&_svg]:h-full"
            dangerouslySetInnerHTML={{ __html: normalizeForGrid(m.svg) }}
          />
        ))}
      </span>
      <span className="mt-1.5 flex items-center justify-between gap-1 min-w-0">
        <span className="text-[10px] font-mono truncate text-text-muted">{label}</span>
        <span className="shrink-0 min-w-5 h-5 px-1 rounded-full bg-bg-secondary border border-border-primary text-[10px] font-mono tabular inline-flex items-center justify-center text-text-secondary">
          {members.length}
        </span>
      </span>
    </button>
  );
}
