'use client';

import { IconCard, IconCardData } from './IconCard';

export function IconGridSkeleton({ count = 48 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
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
}: {
  icons: IconCardData[];
  loading: boolean;
  selectedName?: string | null;
  copiedName?: string | null;
  onSelect?: (icon: IconCardData) => void;
  onCopy?: (name: string) => void;
  skeletonCount?: number;
}) {
  if (loading) return <IconGridSkeleton count={skeletonCount} />;
  if (icons.length === 0) return <IconGridEmpty />;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {icons.map((icon, i) => (
        <div
          key={`${icon.name}-${i}`}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(i * 12, 180)}ms`, animationFillMode: 'both' }}
        >
          <IconCard
            icon={icon}
            selected={selectedName === icon.name}
            copied={copiedName === icon.name}
            onSelect={onSelect}
            onCopy={onCopy}
          />
        </div>
      ))}
    </div>
  );
}
