'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Single owner for theme — storage + data-theme + Context.
 * يعالج كل منطق الثيم في مكان واحد (لا تكرر في ThemeToggle أو layout).
 */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Sync for CSS :root fallback and color-scheme
  document.documentElement.style.colorScheme = theme;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  // احترام تفضيل النظام إذا لم يكن هناك حفظ
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);

    // استمع لتغير تفضيل النظام فقط إذا لم يختر المستخدم يدوياً
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const next: Theme = e.matches ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
      }
    };
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  const setThemeExplicit = useCallback((next: Theme) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeExplicit(next);
  }, [theme, setThemeExplicit]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeExplicit, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
