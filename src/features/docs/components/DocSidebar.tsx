'use client';

import Link from 'next/link';
import { docNav } from '../data';

export function DocSidebar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  return (
    <aside className="hidden lg:block sticky top-[80px] self-start">
      <nav className="space-y-1" aria-label="Docs sections">
        {docNav.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${active === item.id ? 'bg-text-primary text-bg-primary font-medium' : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-6 rounded-xl border border-border-primary bg-bg-card p-4">
        <div className="text-xs font-semibold text-text-primary">Need an icon?</div>
        <p className="text-xs text-text-muted leading-relaxed mt-1">Search 18k icons in <Link href="/browse" className="text-accent hover:underline">Browse</Link> and copy its URL.</p>
      </div>
    </aside>
  );
}

export function MobileDocNav({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  return (
    <div className="lg:hidden -mx-6 px-6 overflow-x-auto scrollbar-none border-b border-border-primary pb-4 mb-2">
      <div className="flex gap-2 w-max">
        {docNav.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${active === item.id ? 'bg-text-primary text-bg-primary border-text-primary' : 'bg-bg-card text-text-muted border-border-primary'}`}>{item.label}</button>
        ))}
      </div>
    </div>
  );
}
