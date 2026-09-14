'use client';

import * as React from 'react';

export interface IconCardData {
  name: string;
  category: string;
  tags: string[];
  svg: string;
  source?: string;
}

function normalizeForGrid(svg: string): string {
  // للأيقونات بدون currentColor (مثل carbon المعبأة) — وحد اللون ليظهر مثل البقية في الشبكة
  if (!svg.toLowerCase().includes('currentcolor')) {
    if (!/fill\s*=/.test(svg)) {
      return svg.replace('<svg', '<svg fill="currentColor"');
    }
    // لو فيه fill ثابت مثل fill="#000" — بدله بـ currentColor
    return svg.replace(/fill\s*=\s*["'][^"']*["']/gi, (m) => (/none/i.test(m) ? m : 'fill="currentColor"'));
  }
  return svg;
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
  const displaySvg = normalizeForGrid(icon.svg);

  return (
    <button
      onClick={() => (onSelect ? onSelect(icon) : onCopy?.(icon.name))}
      aria-label={icon.name}
      title={icon.name}
      className={`group relative aspect-square rounded-[14px] border bg-bg-card flex items-center justify-center p-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
        selected ? 'border-accent bg-accent-light ring-2 ring-accent/20' : 'border-border-primary hover:border-border-hover hover:bg-bg-secondary'
      }`}
    >
      <div
        aria-hidden="true"
        className="w-6 h-6 text-text-secondary group-hover:text-text-primary [&_svg]:w-full [&_svg]:h-full"
        dangerouslySetInnerHTML={{ __html: displaySvg }}
      />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text-primary text-bg-primary text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium z-10" aria-hidden="true">
        {copied ? '✓ Copied' : icon.name}
      </div>
    </button>
  );
}
