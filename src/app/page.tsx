'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Draggable } from 'gsap/dist/Draggable';
import ProductModal, { Product } from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

function TextReveal({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <span className={`scroll-reveal-text ${className}`}>
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} className="text-reveal-mask" style={{ marginRight: '0.22em' }}>
          <span className="text-reveal-word text-reveal-trigger-item">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

function CharacterReveal({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <span className={`scroll-reveal-chars ${className}`} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {text.split('').map((char, charIdx) => (
        <span key={charIdx} className="text-reveal-mask" style={{ display: 'inline-block' }}>
          <span className="text-reveal-word char-reveal-trigger-item" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}
function ReelCard({ reel }: { reel: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  // Helper to determine if the video is a direct play video link (like an .mp4)
  const isDirectVideo = (url: string) => {
    if (!url || url === '#') return false;
    if (url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com') || url.includes('youtube.com') || url.includes('youtu.be')) return false;
    return url.startsWith('http') || url.startsWith('/') || url.endsWith('.mp4');
  };

  const hasDirectVideo = isDirectVideo(reel.video);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasDirectVideo && videoRef.current && !useFallbackImage) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name !== 'AbortError') {
            console.warn("Video hover playback failed:", err);
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasDirectVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="reel-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'block', position: 'relative', cursor: 'default' }}
    >
      <div className="reel-thumb">
        {hasDirectVideo && !useFallbackImage ? (
          <video
            ref={videoRef}
            src={reel.video}
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setUseFallbackImage(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : (
          /* Render cover thumbnail or premium placeholder */
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              position: 'absolute', 
              inset: 0,
              zIndex: 1,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #161616 0%, #0d0d0d 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            {reel.image ? (
              <img
                src={reel.image}
                alt={reel.handle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Glassmorphic placeholder */
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  width: '80%',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {/* Instagram Icon */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(200,165,100,0.8)' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)' }}>Watch Reel</span>
              </div>
            )}
          </div>
        )}
        <div className="reel-overlay" style={{ zIndex: 2, pointerEvents: 'none' }}>
          <div 
            className="reel-play" 
            style={{ 
              opacity: isHovered ? (hasDirectVideo ? 0 : 1) : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)', 
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              alignSelf: 'center',
              marginTop: 'auto',
              marginBottom: 'auto'
            }}
          >
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
  );
}


export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const { addToCart } = useCart();
  const duoRef = useRef<HTMLDivElement>(null);
  const alchemyRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const alchemyHeaderRef = useRef<HTMLDivElement>(null);
  
  const heroContentRef = useRef<HTMLDivElement>(null);

  const LOCAL_BANNERS = [
    { image_url: "/images/wide-lineup.png", mobile_image_url: "/images/wide-lineup.png" },
    { image_url: "/images/wide-close.png", mobile_image_url: "/images/wide-close.png" },
    { image_url: "/images/wide-abstract.png", mobile_image_url: "/images/wide-abstract.png" }
  ];

  const LOCAL_PRODUCTS = [
    { name: "CANDY", category: "Eau de Parfum", price: "₹599", image: "/images/product-candy.png", badge: "BESTSELLER" },
    { name: "AFTER MEET", category: "Eau de Parfum", price: "₹599", image: "/images/product-after-meet.png", badge: "NEW" },
    { name: "AZURA", category: "Eau de Parfum", price: "₹599", image: "/images/product-azura.png", badge: null },
    { name: "MEMORABLE", category: "Eau de Parfum", price: "₹599", image: "/images/product-memorable.png", badge: "SIGNATURE" },
    { name: "CHERRY BLOW", category: "Eau de Parfum", price: "₹599", image: "/images/product-cherry-blow.png", badge: "LUXURY" },
  ];

  const [banners, setBanners] = useState<{ image_url: string; mobile_image_url: string }[]>(LOCAL_BANNERS);
  const [alchemyProducts, setAlchemyProducts] = useState<Product[]>(LOCAL_PRODUCTS);
  const [reels, setReels] = useState<{ handle: string; likes: string; product: string; image: string; video?: string }[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallel asynchronous fetching on mount
  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      })
      .catch(err => console.error('Failed to fetch banners:', err));

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p: any) => ({
            ...p,
            name: p.name,
            category: p.category,
            price: typeof p.price === 'number' ? `₹${p.price}` : p.price,
            image: p.image_url || '/images/hero.png',
            badge: p.badge || null
          }));
          setAlchemyProducts(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch products:', err));

    fetch('/api/reels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((r: any) => {
            return {
              handle: r.handle,
              likes: r.likes,
              product: r.product_tag,
              image: r.thumbnail_url || '',
              video: r.video_url || '#'
            };
          });
          setReels(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch reels:', err));
  }, []);



  // GSAP animation bindings
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768 && banners.length > 0) {
      setCurrentBanner(banners.length - 1);
    }

    const timer = setInterval(() => {
      if (banners.length > 0) {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }
    }, 5000);

    const ctx = gsap.context(() => {
      // 1. Entrance animation for Hero Content Text Subtitle & Title letters
      gsap.fromTo('.hero-subtitle', 
        { opacity: 0, letterSpacing: '0.1em' },
        { opacity: 1, letterSpacing: '0.4em', duration: 1.6, ease: "power3.out", delay: 0.3 }
      );

      gsap.to('.hero-title-reveal .char-reveal-trigger-item', {
        y: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.5
      });

      // 2. Parallax effect for Hero Content overlay
      gsap.to(heroContentRef.current, {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        yPercent: 30,
        ease: "none"
      });

      // 3. Parallax effect for Philosophy text
      gsap.to('.philosophy-text', {
        scrollTrigger: {
          trigger: '.philosophy-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -30,
        ease: "power1.out"
      });

      // 4. Parallax effect for Brand Statement Image
      gsap.fromTo('.brand-statement-right img',
        { y: -30, scale: 1.12 },
        {
          scrollTrigger: {
            trigger: '.brand-statement',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: 30,
          ease: "none"
        }
      );

      // 5. Scroll triggers for text reveals (word staggers)
      gsap.utils.toArray('.scroll-reveal-text').forEach((element: any) => {
        gsap.to(element.querySelectorAll('.text-reveal-trigger-item'), {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          },
          y: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "power3.out"
        });
      });

      // 6. Scroll triggers for character reveals
      gsap.utils.toArray('.scroll-reveal-chars').forEach((element: any) => {
        gsap.to(element.querySelectorAll('.char-reveal-trigger-item'), {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          },
          y: 0,
          duration: 1.4,
          stagger: 0.03,
          ease: "power4.out"
        });
      });

      // 7. Scroll triggers for general fade items
      gsap.utils.toArray('.scroll-fade-item').forEach((element: any) => {
        gsap.fromTo(element,
          { opacity: 0, y: 20 },
          {
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "bottom top",
              toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out"
          }
        );
      });

      // 8. Self-drawing gold dividers
      gsap.utils.toArray('.scroll-draw-line').forEach((line: any) => {
        gsap.to(line, {
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          },
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut"
        });
      });

      // 9. Floating Product Duo scroll triggered entrance (reveal on reaching alchemy)
      gsap.fromTo(duoRef.current,
        { xPercent: 100, x: 20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".alchemy",
            start: "top 70%",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          },
          xPercent: 0,
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          overwrite: "auto"
        }
      );

      gsap.fromTo(alchemyHeaderRef.current,
        { x: -50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: alchemyHeaderRef.current,
            start: "top 85%",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          },
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          overwrite: "auto"
        }
      );

      // Product Slider (Horizontal Drag + Wheel/Trackpad Scroll) - Desktop Only
      const isDesktop = window.innerWidth > 768;
      const track = scrollTrackRef.current;
      let onWheelHandler: ((e: WheelEvent) => void) | null = null;
      
      if (track && isDesktop) {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const minX = -(trackWidth - viewportWidth + 120);
        let currentX = 0;

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

        const onWheel = (e: WheelEvent) => {
          const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

          if (isHorizontal) {
            e.preventDefault();
            e.stopPropagation();

            currentX = Math.max(minX, Math.min(0, currentX - e.deltaX * 1.2));
            gsap.to(track, {
              x: currentX,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
        };

        onWheelHandler = onWheel;
        track.addEventListener('wheel', onWheel, { passive: false });
      }

      // Reels Track: Draggable + wheel - Desktop Only
      const reelsTrack = document.getElementById('reels-track');
      let onReelsWheelHandler: ((e: WheelEvent) => void) | null = null;
      
      if (reelsTrack && isDesktop) {
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
            reelsX = Math.max(reelsMinX, Math.min(0, reelsX - e.deltaX * 1.2));
            gsap.to(reelsTrack, { x: reelsX, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
          }
        };

        onReelsWheelHandler = onReelsWheel;
        reelsTrack.addEventListener('wheel', onReelsWheel, { passive: false });
      }

      (self as any).cleanups = {
        track: isDesktop ? track : null,
        onWheelHandler: isDesktop ? onWheelHandler : null,
        reelsTrack: isDesktop ? reelsTrack : null,
        onReelsWheelHandler: isDesktop ? onReelsWheelHandler : null
      };
    });

    return () => {
      clearInterval(timer);
      
      const cleanups = (ctx as any).cleanups;
      if (cleanups) {
        if (cleanups.track && cleanups.onWheelHandler) {
          cleanups.track.removeEventListener('wheel', cleanups.onWheelHandler);
        }
        if (cleanups.reelsTrack && cleanups.onReelsWheelHandler) {
          cleanups.reelsTrack.removeEventListener('wheel', cleanups.onReelsWheelHandler);
        }
      }
      ctx.revert();
    };
  }, [banners, alchemyProducts, reels]);

  // Card interactive 3D Tilt handlers (using trigger parent container to stop feedback shaking)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const trigger = e.currentTarget;
    const card = trigger.querySelector('.product-card') as HTMLDivElement;
    if (!card) return;

    const rect = trigger.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    
    card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
    
    const tiltX = -py * 16;
    const tiltY = px * 16;
    
    card.classList.add('tilting');
    gsap.to(card, {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const trigger = e.currentTarget;
    const card = trigger.querySelector('.product-card') as HTMLDivElement;
    if (!card) return;

    gsap.to(card, {
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
      onComplete: () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      }
    });
  };

  const availableTabs = Array.from(new Set(
    alchemyProducts.flatMap(p => {
      const tags: string[] = [];
      if (p.category) tags.push(p.category.toUpperCase().trim());
      if (p.badge) tags.push(p.badge.toUpperCase().trim());
      return tags;
    }).filter(Boolean)
  )).sort((a, b) => {
    const PREFERRED_TABS_ORDER = ['MENS', 'UNISEX', 'WOMEN', 'BESTSELLER'];
    const indexA = PREFERRED_TABS_ORDER.indexOf(a);
    const indexB = PREFERRED_TABS_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const tabProducts = alchemyProducts.filter(p => {
    const cat = p.category ? p.category.toUpperCase().trim() : '';
    const bdg = p.badge ? p.badge.toUpperCase().trim() : '';
    return cat === activeTab || bdg === activeTab;
  });

  const spotlightProducts = alchemyProducts.slice(0, 2);

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-image-carousel">
            {banners.map((banner, index) => (
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
                  src={isMobile && banner.mobile_image_url ? banner.mobile_image_url : banner.image_url} 
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
              <p className="category hero-subtitle">Defining Silence</p>
              <h1 className="hero-title-reveal">
                <CharacterReveal text="ETERNYX" />
              </h1>
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

        {/* Self-drawing Line Divider */}
        <div className="container">
          <div className="gold-divider scroll-draw-line" />
        </div>

        {/* Alchemy Section (Draggable Product Gallery) */}
        <section className="alchemy" ref={alchemyRef}>
          <div className="alchemy-header" ref={alchemyHeaderRef}>
            <p className="category">The Alchemy</p>
            <h2 className="scroll-reveal-text">
              <TextReveal text="Layers of an Immortal Scent" />
            </h2>
          </div>

          <div className="alchemy-fade-left" />
          <div className="alchemy-fade-right" />

          <div className="product-scroll-track" ref={scrollTrackRef}>
            {alchemyProducts.map((product, index) => (
              <div 
                className="product-card-trigger" 
                key={index} 
                onClick={() => setSelectedProduct(product)}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="product-card">
                  <div className="product-card-glare" />
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
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, '100 ml', 1, { x: e.clientX, y: e.clientY });
                        }}
                      >
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
              </div>
            ))}
          </div>
        </section>

        {/* Self-drawing Line Divider */}
        <div className="container">
          <div className="gold-divider scroll-draw-line" />
        </div>

        {/* Brand Statement Section */}
        <section className="brand-statement">
          <div className="brand-statement-left">
            <p className="brand-statement-eyebrow scroll-fade-item">Our Philosophy</p>
            <h2 className="brand-statement-headline scroll-reveal-text">
              <span className="text-reveal-mask" style={{ display: 'block' }}>
                <span className="text-reveal-word text-reveal-trigger-item">Silence</span>
              </span>
              <span className="text-reveal-mask" style={{ display: 'block' }}>
                <span className="text-reveal-word text-reveal-trigger-item">Is Luxury.</span>
              </span>
            </h2>
            <p className="brand-statement-body scroll-fade-item">
              We reject the noise of conventional fragrance. ETERNYX engineers scents that speak without words — complex, enduring, and impossibly refined. A sanctuary for those who know.
            </p>
            <a href="#" className="brand-statement-cta scroll-fade-item">
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

        {/* Self-drawing Line Divider */}
        <div className="container">
          <div className="gold-divider scroll-draw-line" />
        </div>

        {/* Tabbed Products Section */}
        {availableTabs.length > 0 && (
          <section className="tabbed-products-section">
            <div className="container">
              <div className="tabbed-header">
                <p className="category">Collections</p>
                <h2 className="scroll-reveal-text">
                  <TextReveal text="Curated Creations" />
                </h2>
              </div>
              
              <div className="tabs-nav scroll-fade-item">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="tab-grid" key={activeTab}>
                {tabProducts.map((product, index) => (
                  <div 
                    className="product-card-trigger" 
                    key={index} 
                    onClick={() => setSelectedProduct(product)}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    style={{ flex: 'unset' }}
                  >
                    <div className="product-card">
                      <div className="product-card-glare" />
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      <div className="product-card-img">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={320}
                          height={360}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="product-card-info">
                        <p className="product-card-category">{product.category}</p>
                        <h3 className="product-card-name">{product.name}</h3>
                        <p className="product-card-price">{product.price}</p>
                        <div className="product-card-actions">
                          <button className="btn-shop-now">Discover</button>
                          <button 
                            className="btn-add-cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, '100 ml', 1, { x: e.clientX, y: e.clientY });
                            }}
                          >
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
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Influencer Reels Section - only display if real reels added by admin */}
        {reels.length > 0 && (
          <>
            <div className="container">
              <div className="gold-divider scroll-draw-line" />
            </div>
            <section className="reels-section">
              <div className="reels-header">
                <div>
                  <p className="reels-eyebrow">As Seen On</p>
                  <h2 className="reels-title scroll-reveal-text">
                    <TextReveal text="Featured By Our Community" />
                  </h2>
                </div>
                <a href="#" className="reels-view-all">View All →</a>
              </div>
              <div className="reels-track-wrap">
                <div className="reels-track" id="reels-track">
                  {reels.map((reel, i) => (
                    <ReelCard reel={reel} key={i} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      
      {/* Floating Spotlight Duo */}
      <div className="hero-product-duo" ref={duoRef}>
        {spotlightProducts.map((product, index) => (
          <div 
            key={index}
            className="product-spotlight" 
            style={{ cursor: 'pointer' }} 
            onClick={() => setSelectedProduct(product)}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <button className="shop-now-mini">Shop Now</button>
          </div>
        ))}
      </div>
    </>
  );
}
