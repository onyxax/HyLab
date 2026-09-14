'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/docs', label: 'Docs' },
    { href: '/about', label: 'About' },
    { href: '/status', label: 'Status' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-primary bg-bg-primary">
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between gap-6">
          {/* Left — brand + desktop nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/favicon.svg" alt="HyLab" className="w-7 h-7 rounded-md" />
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight leading-none">HyLab</span>
                <span className="text-[9px] font-medium tracking-[0.13em] uppercase text-text-muted leading-none mt-[1px]">Icons API</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {links.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-2 text-[13px] tracking-[-0.01em] transition-colors relative ${
                      isActive
                        ? 'text-text-primary font-medium'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-text-primary" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/onyxax/HyLab"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors px-2.5 py-1.5"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden xl:inline">GitHub</span>
            </a>

            <span className="hidden lg:block w-px h-4 bg-border-primary mx-1" aria-hidden="true" />

            <ThemeToggle />

            <Link
              href="/docs"
              className="hidden sm:inline-flex items-center justify-center h-8 px-4 rounded-full bg-text-primary text-bg-primary text-[13px] font-semibold tracking-[-0.01em] hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-full border border-border-primary bg-bg-card text-text-muted hover:text-text-primary hover:border-border-hover transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-primary bg-bg-card">
            <nav className="max-w-6xl mx-auto px-6 py-3 flex flex-col" aria-label="Mobile">
              {links.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`py-2.5 text-sm border-b border-border-primary/50 last:border-0 flex items-center justify-between ${
                      isActive ? 'text-text-primary font-medium' : 'text-text-muted'
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />}
                  </Link>
                );
              })}
              <div className="pt-3 flex items-center gap-2">
                <a
                  href="https://github.com/onyxax/HyLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border-primary text-sm text-text-muted flex-1 justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
                <Link
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center h-9 rounded-full bg-text-primary text-bg-primary text-sm font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Spacer for fixed header */}
      <div className="h-[64px]" aria-hidden="true" />
    </>
  );
}
