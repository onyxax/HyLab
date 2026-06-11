'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/docs', label: 'Docs' },
    { href: '/about', label: 'About' },
    { href: '/status', label: 'Status' },
  ];

  const activeIndex = links.findIndex(l => l.href === pathname);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className="max-w-5xl mx-auto relative">
        {/* Glow effect behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl blur-xl opacity-60" />

        <div className="relative flex items-center justify-between h-[68px] px-2 bg-bg-primary/80 backdrop-blur-2xl border border-border-primary/50 rounded-2xl shadow-lg shadow-black/5">
          {/* Logo */}
          <Link href="/" scroll={false} className="flex items-center gap-3 pl-3 pr-4 group">
            <img src="/favicon.svg" alt="HyLab" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-none">HyLab</span>
              <span className="text-[9px] text-text-muted font-medium tracking-[0.15em] uppercase leading-none mt-0.5">Icons API</span>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center relative rounded-xl p-1">
            {/* Sliding background */}
            {activeIndex >= 0 && (
              <div
                className="absolute top-1 bottom-1 bg-accent/10 border border-accent/20 rounded-lg transition-all duration-300 ease-out"
                style={{
                  left: `${activeIndex * (100 / links.length)}%`,
                  width: `${100 / links.length}%`,
                }}
              />
            )}

            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-accent'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 pr-2">
            <a
              href="https://github.com/onyxax/HyLab"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-secondary/80 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <ThemeToggle />
            <Link href="/docs" scroll={false} className="btn btn-primary text-sm py-2 px-5 rounded-xl hidden sm:flex">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
