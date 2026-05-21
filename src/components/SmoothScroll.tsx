'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose lenis globally so modal can stop/start it
    (window as any).lenis = lenis;

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      delete (window as any).lenis;
    };
  }, []);

  return null;
}
