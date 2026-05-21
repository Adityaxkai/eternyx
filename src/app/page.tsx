'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Draggable } from 'gsap/dist/Draggable';
import ProductModal, { Product } from '@/components/ProductModal';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const duoRef = useRef<HTMLDivElement>(null);
  const alchemyRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const alchemyHeaderRef = useRef<HTMLDivElement>(null);
  
  const heroContentRef = useRef<HTMLDivElement>(null);
  
  const banners = [
    "/images/wide-lineup.png",
    "/images/wide-close.png",
    "/images/wide-abstract.png"
  ];

  useEffect(() => {
    // On mobile viewports, show the last (abstract gold) slide first
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setCurrentBanner(2);
    }

    // Banner Timer
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    // Scroll Direction Global Logic
    let lastScrollY = window.scrollY;
    const ctx = gsap.context(() => {
      // Entrance Animation for Hero Text
      gsap.fromTo(heroContentRef.current, 
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "expo.in", delay: 0.6 }
      );

      // Start state: Hidden
      gsap.set(duoRef.current, { xPercent: 100, x: -100, opacity: 0 });
      gsap.set(alchemyHeaderRef.current, { x: -100, opacity: 0 }); // Hidden to the left

      let isShowing = false;

      ScrollTrigger.create({
        onUpdate: (self) => {
          const direction = self.direction;
          const scrollPos = window.scrollY;

          if (direction === 1 && scrollPos > 20) {
            if (!isShowing) {
              isShowing = true;
              // Simultaneous Appear on Scroll DOWN
              gsap.to([duoRef.current, alchemyHeaderRef.current], {
                x: 0,
                xPercent: 0,
                opacity: 1,
                duration: 0.8,
                ease: "expo.in",
                overwrite: "auto",
                stagger: 0.1
              });
            }
          } else if (direction === -1 || scrollPos <= 20) {
            if (isShowing || scrollPos <= 20) {
              isShowing = false;
              // Simultaneous Hide on Scroll UP or Top
              gsap.to(duoRef.current, {
                xPercent: 100,
                x: -100,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
              });
              gsap.to(alchemyHeaderRef.current, {
                x: -100,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
              });
            }
          }
        }
      });

      // Product Slider (Horizontal Drag + Wheel/Trackpad Scroll)
      const track = scrollTrackRef.current;
      if (track) {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const minX = -(trackWidth - viewportWidth + 120);
        let currentX = 0;

        // GSAP Draggable for click-drag
        Draggable.create(track, {
          type: "x",
          bounds: { minX, maxX: 0 },
          inertia: true,
          edgeResistance: 0.85,
          cursor: "grab",
          activeCursor: "grabbing",
          onDrag: function() { currentX = this.x; },
          onDragEnd: function() { currentX = this.x; }
        });

        // Wheel/Trackpad: horizontal swipe slides cards, vertical scroll passes through to page
        const onWheel = (e: WheelEvent) => {
          const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

          if (isHorizontal) {
            // Intercept horizontal swipe → slide cards
            e.preventDefault();
            e.stopPropagation();

            currentX = Math.max(minX, Math.min(0, currentX - e.deltaX));
            gsap.to(track, {
              x: currentX,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
          // Vertical scroll: do nothing, let the page scroll naturally
        };

        track.addEventListener('wheel', onWheel, { passive: false });
      }

      // Reels Track: Draggable + wheel
      const reelsTrack = document.getElementById('reels-track');
      if (reelsTrack) {
        const reelsWidth = reelsTrack.scrollWidth;
        const vw = window.innerWidth;
        const reelsMinX = -(reelsWidth - vw + 120);
        let reelsX = 0;

        Draggable.create(reelsTrack, {
          type: 'x',
          bounds: { minX: reelsMinX, maxX: 0 },
          inertia: true,
          edgeResistance: 0.85,
          cursor: 'grab',
          activeCursor: 'grabbing',
          onDrag: function() { reelsX = this.x; },
          onDragEnd: function() { reelsX = this.x; }
        });

        const onReelsWheel = (e: WheelEvent) => {
          const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
          if (isHorizontal) {
            e.preventDefault();
            e.stopPropagation();
            reelsX = Math.max(reelsMinX, Math.min(0, reelsX - e.deltaX));
            gsap.to(reelsTrack, { x: reelsX, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
          }
        };

        reelsTrack.addEventListener('wheel', onReelsWheel, { passive: false });
      }

      // Hover Interaction for Product Duo
      const duo = duoRef.current;
      if (duo) {
        const onEnter = () => {
          gsap.to(duo, {
            xPercent: 0,
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.in", // Dramatically slow start, fast end
            overwrite: "auto"
          });
        };

        const onLeave = () => {
          // If we are scrolling down, keep it visible
          // Otherwise, hide it
          if (window.scrollY < 100) {
            gsap.to(duo, {
              xPercent: 100,
              x: -100,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out", // Ease-out on exit as requested
              overwrite: "auto"
            });
          }
        };

        duo.addEventListener('mouseenter', onEnter);
        duo.addEventListener('mouseleave', onLeave);
      }
    });

    return () => {
      clearInterval(timer);
      ctx.revert();
    };
  }, [banners.length]);

  const perfumes = [
    { name: "Eternyx Noir", category: "Eau de Parfum", price: "$180", image: "/images/hero.png" },
    { name: "Silken Oud", category: "Luxury Blend", price: "$220", image: "/images/collection-1.png" },
    { name: "Celestial Amber", category: "Signature Scent", price: "$195", image: "/images/hero.png" },
    { name: "Midnight Rose", category: "Limited Edition", price: "$240", image: "/images/collection-1.png" },
  ];

  const alchemyProducts = [
    { name: "Silken Oud", category: "Luxury Blend", price: "$220", image: "/images/product-silken-oud.png", badge: "Bestseller" },
    { name: "Noir Absolu", category: "Eau de Parfum", price: "$195", image: "/images/product-noir-absolu.png", badge: null },
    { name: "Lumière Rose", category: "Signature Scent", price: "$240", image: "/images/product-lumiere-rose.png", badge: "New" },
    { name: "Vetiver Ghost", category: "Limited Edition", price: "$280", image: "/images/product-vetiver-ghost.png", badge: "Ltd. Edition" },
    { name: "Eternyx Noir", category: "Eau de Parfum", price: "$180", image: "/images/product-noir-absolu.png", badge: null },
  ];

  const reels = [
    { handle: "@aria.luxe", likes: "84K", product: "Silken Oud", image: "/images/reel-1.png" },
    { handle: "@noir.collective", likes: "31K", product: "Noir Absolu", image: "/images/reel-2.png" },
    { handle: "@scentedmornings", likes: "62K", product: "Lumière Rose", image: "/images/reel-3.png" },
    { handle: "@maison.de.parfum", likes: "47K", product: "Vetiver Ghost", image: "/images/reel-4.png" },
    { handle: "@eternyx.official", likes: "120K", product: "Eternyx Noir", image: "/images/reel-5.png" },
  ];

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-image-carousel">
            {banners.map((src, index) => (
              <div 
                key={index} 
                className={`hero-image ${index === currentBanner ? 'active' : ''} hero-image-${index}`}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <Image 
                  src={src} 
                  alt={`Eternyx Banner ${index + 1}`} 
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={100}
                  priority={index === 0}
                />
              </div>
            ))}

            <div className="carousel-dots">
              {banners.map((_, index) => (
                <button 
                  key={index} 
                  className={`dot ${index === currentBanner ? 'active' : ''}`}
                  onClick={() => setCurrentBanner(index)}
                />
              ))}
            </div>

            <div className="container hero-content" ref={heroContentRef}>
              <p className="category">Defining Silence</p>
              <h1>ETERNYX</h1>
            </div>
          </div>
        </section>

        <section className="philosophy-section">
          <div className="container">
            <p className="philosophy-text">
              A symphony of scents crafted for the discerning. Experience luxury in its purest, most silent form.
            </p>
          </div>
        </section>

        {/* Alchemy Section (Draggable Product Gallery) */}
        <section className="alchemy" ref={alchemyRef}>
          <div className="alchemy-header" ref={alchemyHeaderRef}>
            <p className="category">The Alchemy</p>
            <h2>Layers of an Immortal Scent</h2>
          </div>

          {/* Gradient fade edges */}
          <div className="alchemy-fade-left" />
          <div className="alchemy-fade-right" />

          <div className="product-scroll-track" ref={scrollTrackRef}>
            {alchemyProducts.map((product, index) => (
              <div className="product-card" key={index} onClick={() => setSelectedProduct(product)}>
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <div className="product-card-img">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={320}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="product-card-info">
                  <p className="product-card-category">{product.category}</p>
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-price">{product.price}</p>
                  <div className="product-card-actions">
                    <button className="btn-shop-now">Shop Now</button>
                    <button className="btn-add-cart">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Statement Section */}
        <section className="brand-statement">
          <div className="brand-statement-left">
            <p className="brand-statement-eyebrow">Our Philosophy</p>
            <h2 className="brand-statement-headline">
              Silence<br />Is Luxury.
            </h2>
            <p className="brand-statement-body">
              We reject the noise of conventional fragrance. ETERNYX engineers scents that speak without words — complex, enduring, and impossibly refined. A sanctuary for those who know.
            </p>
            <a href="#" className="brand-statement-cta">
              About Us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div className="brand-statement-right">
            <Image
              src="/images/brand-statement.png"
              alt="ETERNYX Luxury Perfumes"
              width={800}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Influencer Reels Section */}
        <section className="reels-section">
          <div className="reels-header">
            <div>
              <p className="reels-eyebrow">As Seen On</p>
              <h2 className="reels-title">Featured By Our Community</h2>
            </div>
            <a href="#" className="reels-view-all">View All →</a>
          </div>
          <div className="reels-track-wrap">
            <div className="reels-track" id="reels-track">
              {reels.map((reel, i) => (
                <div className="reel-card" key={i}>
                  <div className="reel-thumb">
                    <Image
                      src={reel.image}
                      alt={reel.handle}
                      width={400}
                      height={700}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="reel-overlay">
                      <div className="reel-play">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21"/>
                        </svg>
                      </div>
                      <div className="reel-info">
                        <span className="reel-product-tag">{reel.product}</span>
                        <p className="reel-handle">{reel.handle}</p>
                        <p className="reel-likes">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          {reel.likes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '100px 0', textAlign: 'center', opacity: 0.5 }}>
          <div className="container">
            <p>&copy; 2026 ETERNYX LUXURY. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </main>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <div className="hero-product-duo" ref={duoRef}>
        <div className="product-spotlight" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct({ name: 'Silken Oud', category: 'Luxury Blend', price: '$220', image: '/images/product-silken-oud.png', badge: 'Bestseller' })}>
          <img src="/images/product-silken-oud.png" alt="Silken Oud" />
          <h3>Silken Oud</h3>
          <p className="price">$220</p>
          <button className="shop-now-mini">Shop Now</button>
        </div>
        <div className="product-spotlight" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct({ name: 'Eternyx Noir', category: 'Eau de Parfum', price: '$180', image: '/images/product-noir-absolu.png', badge: null })}>
          <img src="/images/product-noir-absolu.png" alt="Eternyx Noir" />
          <h3>Eternyx Noir</h3>
          <p className="price">$180</p>
          <button className="shop-now-mini">Shop Now</button>
        </div>
      </div>
    </>
  );
}
