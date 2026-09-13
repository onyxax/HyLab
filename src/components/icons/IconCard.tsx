'use client';

import * as React from 'react';

export interface IconCardData {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source?: string;
}

export function IconCard({
  icon,
  selected,
  copied,
  onSelect,
  onCopy,
}: {
  icon: IconCardData;
  selected?: boolean;
  copied?: boolean;
  onSelect?: (icon: IconCardData) => void;
  onCopy?: (name: string) => void;
}) {
  return (
    <button
      onClick={() => (onSelect ? onSelect(icon) : onCopy?.(icon.name))}
      className={`group relative aspect-square rounded-[14px] border bg-bg-card hover:bg-accent-light flex items-center justify-center p-3 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 active:scale-[0.98] ${
        selected ? 'border-accent bg-accent-light ring-2 ring-accent/20' : 'border-border-primary hover:border-accent shadow-sm hover:shadow-tinted hover:-translate-y-[1px]'
      }`}
    >
      <div
        className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors duration-200 [&_svg]:w-full [&_svg]:h-full"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-bg-primary text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium z-10">
        {copied ? '✓ Copied' : icon.name}
      </div>
    </button>
  );
}
