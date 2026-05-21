'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const currentImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const preview = previewRef.current;

    if (!cursor || !preview) return;

    // Move cursor and preview with mouse
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.03,
      });

      gsap.to(preview, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Handle hover effects for elements with data-preview
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const item = target.closest('[data-preview]');
      
      if (item) {
        const imageUrl = item.getAttribute('data-preview');
        if (imageUrl && currentImageRef.current) {
          currentImageRef.current.src = imageUrl;
          preview.classList.add('visible');
          cursor.classList.add('active');
        }
      } else {
        preview.classList.remove('visible');
        cursor.classList.remove('active');
      }
    };

    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={previewRef} className="cursor-image-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={currentImageRef} alt="Preview" />
      </div>
    </>
  );
}
