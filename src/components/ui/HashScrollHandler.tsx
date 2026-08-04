'use client';

import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function HashScrollHandler() {
  useIsomorphicLayoutEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      
      if (el) {
        // Native hash jump is usually handled by the browser, but just in case layout shifts
        // (like lazy loaded images or Framer Motion), we actively pin the scroll position.
        const tryScroll = (attempts = 0) => {
          const navbarHeight = 88;
          // Calculate exact Y position
          const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: y, behavior: 'auto' });
          
          // Retry more times over a longer period (1.5 seconds) to wait for all images to load
          if (attempts < 15) {
            setTimeout(() => tryScroll(attempts + 1), 100);
          } else {
            // Remove the hash without triggering a page reload
            // This ensures a manual refresh later will start at the top (Beranda)
            window.history.replaceState(null, '', '/');
          }
        };
        tryScroll();
      }
    };

    // Run on mount
    handleHash();

    // Also run when the hash changes (e.g. clicking navbar links while already on the page)
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return null;
}
