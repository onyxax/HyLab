'use client';

import { IconCard, IconCardData } from './IconCard';

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
}: {
  icons: IconCardData[];
  loading: boolean;
  selectedName?: string | null;
  copiedName?: string | null;
  onSelect?: (icon: IconCardData) => void;
  onCopy?: (name: string) => void;
  skeletonCount?: number;
  variant?: GridVariant;
}) {
  if (loading) return <IconGridSkeleton count={skeletonCount} variant={variant} />;
  if (icons.length === 0) return <IconGridEmpty />;
  return (
    <div className={GRID_CLASSES[variant]}>
      {icons.map((icon, i) => (
        <IconCard
          key={`${icon.name}-${i}`}
          icon={icon}
          selected={selectedName === icon.name}
          copied={copiedName === icon.name}
          onSelect={onSelect}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}
