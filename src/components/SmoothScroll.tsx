'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (typeof window === 'undefined' || isAdmin) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Expose lenis globally so modal can stop/start it
    (window as any).lenis = lenis;

    // Synchronize Lenis with ScrollTrigger and toggle is-scrolling class
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
      }
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 120);
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      document.body.classList.remove('is-scrolling');
      lenis.destroy();
      gsap.ticker.remove(raf);
      delete (window as any).lenis;
    };
  }, [isAdmin]);

  return null;
}
