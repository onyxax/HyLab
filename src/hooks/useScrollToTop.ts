'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
