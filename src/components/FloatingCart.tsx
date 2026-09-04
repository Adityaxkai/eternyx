'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function FloatingCart() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Helper to spawn elegant golden comet trails behind the flying product circle
    const createTrailDot = (x: number, y: number) => {
      const dot = document.createElement('div');
      dot.className = 'cart-trail-dot';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      document.body.appendChild(dot);

      gsap.to(dot, {
        scale: 0.1,
        opacity: 0,
        y: '+=12', // gentle falling gravity drift
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      });
    };

    // Helper to spawn sharp luxury diamond stars bursting out from the cart on impact
    const createSparkleBurst = (centerX: number, centerY: number) => {
      for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'cart-sparkle';
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        document.body.appendChild(sparkle);

        // Disperse stars radially
        const angle = (i * 36 * Math.PI) / 180 + (Math.random() - 0.5) * 0.3;
        const distance = 35 + Math.random() * 45;
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;

        gsap.to(sparkle, {
          x: destX,
          y: destY,
          scale: Math.random() * 0.7 + 0.3,
          opacity: 0,
          rotation: Math.random() * 360,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => sparkle.remove(),
        });
      }
    };

    // Helper to trigger concentric ripple rings
    const createRippleRings = (parent: HTMLElement) => {
      // First ripple ring (solid gold)
      const ripple1 = document.createElement('div');
      ripple1.className = 'cart-ripple-ring ripple-1';
      parent.appendChild(ripple1);
      setTimeout(() => ripple1.remove(), 700);

      // Second ripple ring (dashed gold, slightly delayed)
      setTimeout(() => {
        const ripple2 = document.createElement('div');
        ripple2.className = 'cart-ripple-ring ripple-2';
        parent.appendChild(ripple2);
        setTimeout(() => ripple2.remove(), 750);
      }, 120);
    };

    const handleItemAdded = (e: Event) => {
      const customEvent = e as CustomEvent<{ coords: { x: number; y: number }; image: string }>;
      const { coords, image } = customEvent.detail;
      if (!coords || !image) return;

      const cartBtn = buttonRef.current;
      if (!cartBtn) return;

      // Create main flying particle element
      const particle = document.createElement('div');
      particle.className = 'fly-to-cart-particle';
      particle.style.left = `${coords.x}px`;
      particle.style.top = `${coords.y}px`;

      const img = document.createElement('img');
      img.src = image;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      particle.appendChild(img);

      document.body.appendChild(particle);

      // Get target floating cart center coordinates
      const rect = cartBtn.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      const startX = coords.x;
      const startY = coords.y;

      // Arching peak for parabolic path
      const midX = (startX + targetX) / 2 + (Math.random() - 0.5) * 120;
      const midY = Math.min(startY, targetY) - 160;

      let frameCount = 0;

      // Animate particle via GSAP
      const tl = gsap.timeline({
        onUpdate: () => {
          // Query current position on each tick
          const curX = startX + (gsap.getProperty(particle, 'x') as number);
          const curY = startY + (gsap.getProperty(particle, 'y') as number);

          frameCount++;
          if (frameCount % 2 === 0) {
            createTrailDot(curX, curY);
          }
        },
        onComplete: () => {
          particle.remove();

          // Scale bounce on the button
          gsap.fromTo(
            cartBtn,
            { scale: 1 },
            { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.out(2)' }
          );

          // Add expanding gold ripple rings and gold star sparkles burst
          createRippleRings(cartBtn);
          createSparkleBurst(targetX, targetY);
        },
      });

      // Launch trajectory curve
      tl.to(particle, {
        x: midX - startX,
        y: midY - startY,
        scale: 1.4,
        rotation: 120,
        duration: 0.35,
        ease: 'power1.out',
      }).to(particle, {
        x: targetX - startX,
        y: targetY - startY,
        scale: 0.15,
        rotation: 360,
        opacity: 0.2,
        duration: 0.45,
        ease: 'power2.in',
      });
    };

    window.addEventListener('eternyx_cart_item_added', handleItemAdded);
    return () => {
      window.removeEventListener('eternyx_cart_item_added', handleItemAdded);
    };
  }, [mounted]);

  if (pathname === '/checkout' || pathname?.startsWith('/admin')) return null;

  // Safe client-side count defaults
  const displayCount = mounted ? cartCount : 0;

  return (
    <>
      <button
        ref={buttonRef}
        id="floating-cart-trigger"
        className={`floating-cart ${displayCount > 0 ? 'has-items' : ''}`}
        onClick={() => setIsCartOpen(true)}
        aria-label="View Shopping Bag"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {displayCount > 0 && <span className="floating-cart-badge">{displayCount}</span>}
      </button>

      <style jsx>{`
        .floating-cart {
          position: fixed;
          bottom: 40px;
          left: 40px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100000;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.12);
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          animation: ambientBreathe 4s ease-in-out infinite;
        }

        .floating-cart:hover {
          border-color: rgba(212, 175, 55, 0.7);
          background: rgba(18, 18, 18, 0.95);
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.28);
        }

        .floating-cart.has-items::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px dashed rgba(212, 175, 55, 0.5);
          animation: spinOuterRing 12s linear infinite;
          pointer-events: none;
        }

        .floating-cart-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: #d4af37;
          color: #000000;
          font-size: 0.7rem;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
          animation: badgeGrow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes spinOuterRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes badgeGrow {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        @keyframes ambientBreathe {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.12);
            border-color: rgba(212, 175, 55, 0.25);
          }
          50% {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(212, 175, 55, 0.3);
            border-color: rgba(212, 175, 55, 0.55);
          }
        }

        @media (max-width: 768px) {
          .floating-cart {
            bottom: 30px;
            left: 30px;
            width: 54px;
            height: 54px;
          }
        }
      `}</style>

      {/* Global CSS Inject for Dynamic Elements */}
      <style jsx global>{`
        .fly-to-cart-particle {
          position: fixed;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid #d4af37;
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.85), inset 0 0 10px rgba(212, 175, 55, 0.5);
          z-index: 100002;
          pointer-events: none;
          overflow: hidden;
          background: #0c0c0c;
          transform: translate(-50%, -50%);
        }

        .cart-trail-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #d4af37 70%, rgba(212, 175, 55, 0) 100%);
          box-shadow: 0 0 10px #d4af37, 0 0 20px rgba(212, 175, 55, 0.75);
          z-index: 100001;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }

        .cart-sparkle {
          position: fixed;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, #ffffff 30%, #d4af37 100%);
          clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);
          box-shadow: 0 0 8px #d4af37;
          z-index: 100003;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }

        .cart-ripple-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          pointer-events: none;
        }

        .cart-ripple-ring.ripple-1 {
          border: 2px solid #d4af37;
          animation: cartRippleAnimation1 0.7s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .cart-ripple-ring.ripple-2 {
          border: 1px dashed rgba(212, 175, 55, 0.85);
          animation: cartRippleAnimation2 0.75s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes cartRippleAnimation1 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
          }
        }

        @keyframes cartRippleAnimation2 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3.0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
