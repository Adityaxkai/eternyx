'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: string;
  image: string;
  badge?: string | null;
  description?: string;
  top_notes?: string[];
  heart_notes?: string[];
  base_notes?: string[];
  sizes?: { size: string; stock: number }[];
  additional_images?: string[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const productDetails: Record<string, {
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizes: string[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}> = {
  'Silken Oud': {
    description: 'A rare encounter between East and West. Silken Oud captures the ancient mysticism of Agarwood — warm, resinous, and endlessly complex — wrapped in a silken veil of modern sophistication.',
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'],
    heartNotes: ['Agarwood (Oud)', 'Bulgarian Rose', 'Jasmine Sambac'],
    baseNotes: ['Sandalwood', 'Ambergris', 'White Musk'],
    sizes: ['50 ml', '100 ml', '200 ml'],
    reviews: [
      { author: 'Aryan M.', rating: 5, text: 'Absolutely divine. The oud is rich yet never overwhelming. A true luxury statement.', date: 'Apr 2026' },
      { author: 'Priya S.', rating: 5, text: 'I wear this to every important event. People always ask what I\'m wearing. Mesmerizing.', date: 'Mar 2026' },
      { author: 'Rohan K.', rating: 4, text: 'The sillage is incredible. Hours after wearing it, I still get compliments.', date: 'Feb 2026' },
    ]
  },
  'Noir Absolu': {
    description: 'Born from the darkest hours before dawn. Noir Absolu is an olfactory shadow — smoky, velvety, and impossibly elegant. For those who move in silence.',
    topNotes: ['Black Cardamom', 'Dark Incense', 'Violet Leaf'],
    heartNotes: ['Smoked Leather', 'Patchouli', 'Orris Root'],
    baseNotes: ['Black Oud', 'Vetiver', 'Labdanum'],
    sizes: ['50 ml', '100 ml', '200 ml'],
    reviews: [
      { author: 'Karan T.', rating: 5, text: 'The darkest, most sophisticated scent I own. It commands presence without saying a word.', date: 'May 2026' },
      { author: 'Siya R.', rating: 5, text: 'Unreal longevity. Applied in the morning, still present at midnight.', date: 'Apr 2026' },
    ]
  },
  'Lumière Rose': {
    description: 'The first light of a rose at dawn. Lumière Rose is radiant, feminine, and impossibly graceful — a declaration of soft power in its purest liquid form.',
    topNotes: ['Lychee', 'Pink Grapefruit', 'Aldehydes'],
    heartNotes: ['Bulgarian Rose', 'Peony', 'Magnolia'],
    baseNotes: ['White Musk', 'Cedarwood', 'Cashmeran'],
    sizes: ['30 ml', '50 ml', '100 ml'],
    reviews: [
      { author: 'Ananya P.', rating: 5, text: 'The most beautiful floral I have ever smelled. Delicate but with incredible depth.', date: 'May 2026' },
      { author: 'Meera L.', rating: 5, text: 'Like wearing a garden of roses in the most elegant way possible.', date: 'Mar 2026' },
    ]
  },
  'Vetiver Ghost': {
    description: 'Cold, mineral, and spectral. Vetiver Ghost evokes the grey silence of early winter mornings — austere in its beauty, haunting in its memory. A scent for the contemplative soul.',
    topNotes: ['Grey Pepper', 'Galbanum', 'Bergamot'],
    heartNotes: ['Haitian Vetiver', 'Cedarwood', 'Violet'],
    baseNotes: ['Iso E Super', 'Ambrette', 'Musk'],
    sizes: ['50 ml', '100 ml', '200 ml'],
    reviews: [
      { author: 'Vikram N.', rating: 5, text: 'Unlike anything else on the market. Cool, woody, and deeply intellectual.', date: 'Apr 2026' },
      { author: 'Dev S.', rating: 4, text: 'The vetiver is smoky and mineral — absolutely captivating on my skin.', date: 'Feb 2026' },
    ]
  },
  'Eternyx Noir': {
    description: 'The signature of silence. Eternyx Noir is the brand\'s most iconic creation — a masterwork of contrast where dark woods meet luminous warmth in a scent that defines an era.',
    topNotes: ['Black Truffle', 'Elemi', 'Cardamom'],
    heartNotes: ['Oud', 'Smoky Rose', 'Leather'],
    baseNotes: ['Ebony Wood', 'Ambergris', 'Vanilla Absolute'],
    sizes: ['50 ml', '100 ml', '200 ml'],
    reviews: [
      { author: 'Neel A.', rating: 5, text: 'This is what luxury smells like. Full stop. The most complex, beautiful scent.', date: 'May 2026' },
      { author: 'Riya M.', rating: 5, text: 'My signature scent since the day I tried it. Nothing comes close.', date: 'Jan 2026' },
    ]
  }
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const detailsColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState('100 ml');
  const [reviews, setReviews] = useState<{ author: string; rating: number; text: string; date: string }[]>([]);
  const { addToCart, setIsCartOpen } = useCart();

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const allImages = useMemo(() => {
    if (!product) return [];
    const images = [product.image];
    if (product.additional_images && Array.isArray(product.additional_images)) {
      product.additional_images.forEach(img => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    return images;
  }, [product]);

  // 1. Resolve product metadata & fallbacks
  const nameKey = product?.name || 'Silken Oud';
  const fallbackKey = Object.keys(productDetails).find(
    (key) => key.toLowerCase() === nameKey.toLowerCase()
  ) || 'Silken Oud';
  const fallbackDetails = productDetails[fallbackKey];

  const description = product?.description || fallbackDetails.description;
  const topNotes = product?.top_notes && product.top_notes.length > 0 ? product.top_notes : fallbackDetails.topNotes;
  const heartNotes = product?.heart_notes && product.heart_notes.length > 0 ? product.heart_notes : fallbackDetails.heartNotes;
  const baseNotes = product?.base_notes && product.base_notes.length > 0 ? product.base_notes : fallbackDetails.baseNotes;

  const sizes = useMemo(() => {
    return product?.sizes && product.sizes.length > 0
      ? product.sizes.map((s) => s.size)
      : fallbackDetails.sizes;
  }, [product, fallbackDetails.sizes]);

  // 2. Fetch reviews from Database or fallback
  useEffect(() => {
    if (!product) return;

    fetch(`/api/reviews?productName=${encodeURIComponent(product.name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedReviews = data.map((r: any) => ({
            author: r.customer,
            rating: Number(r.rating),
            text: r.comment,
            date: r.date || new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }));
          setReviews(mappedReviews);
        } else {
          setReviews(fallbackDetails.reviews);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product reviews:', err);
        setReviews(fallbackDetails.reviews);
      });
  }, [product, fallbackDetails]);

  // Bypass Lenis: scroll the details column from ANYWHERE in the modal
  useEffect(() => {
    const detailsEl = detailsColRef.current;
    const imageEl = imageColRef.current;
    if (!detailsEl || !product) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      detailsEl.scrollTop += e.deltaY;
    };

    detailsEl.addEventListener('wheel', onWheel, { passive: false, capture: true });
    imageEl?.addEventListener('wheel', onWheel, { passive: false, capture: true });

    return () => {
      detailsEl.removeEventListener('wheel', onWheel, { capture: true });
      imageEl?.removeEventListener('wheel', onWheel, { capture: true });
    };
  }, [product]);

  useEffect(() => {
    if (product && panelRef.current && overlayRef.current) {
      // Set default size for the product
      if (sizes?.[0]) {
        setSelectedSize(sizes[0]);
      }

      // Stop background scrolling
      const lenis = (window as any).lenis;
      lenis?.stop();
      document.body.style.overflow = 'hidden';

      // Animate In
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(panelRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.05 }
      );
    }

    return () => {
      // Restore scrolling when modal unmounts, only if the cart drawer is not currently open
      const lenis = (window as any).lenis;
      const isCartOpen = document.querySelector('.cart-drawer.open');
      if (!isCartOpen) {
        lenis?.start();
        document.body.style.overflow = '';
      }
    };
  }, [product]);

  const handleClose = () => {
    if (panelRef.current && overlayRef.current) {
      gsap.to(panelRef.current, { x: '100%', opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose });
    }
  };

  if (!product) return null;

  return (
    <div className="pm-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}>
      <div className="pm-panel" ref={panelRef} data-lenis-prevent>

        {/* Close Button */}
        <button className="pm-close" onClick={handleClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Left — Image */}
        <div className="pm-image-col" ref={imageColRef}>
          <div className="pm-image-wrap">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <Image
              src={activeImage || product.image}
              alt={product.name}
              width={500}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
              key={activeImage}
            />
          </div>
          
          {/* Thumbnails Strip if multiple images exist */}
          {allImages.length > 1 && (
            <div className="pm-thumbnails">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`pm-thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="pm-thumbnail-img"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Scent Pyramid */}
          <div className="pm-pyramid pm-pyramid-desktop">
            <p className="pm-section-label">Scent Pyramid</p>
            <div className="pm-notes-grid">
              <div className="pm-note-group">
                <span className="pm-note-type">Top</span>
                {topNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
              <div className="pm-note-group">
                <span className="pm-note-type">Heart</span>
                {heartNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
              <div className="pm-note-group">
                <span className="pm-note-type">Base</span>
                {baseNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="pm-details-col" ref={detailsColRef}>
          <p className="pm-category">{product.category}</p>
          <h2 className="pm-name">{product.name}</h2>
          <p className="pm-price">{product.price}</p>

          <p className="pm-description">{description}</p>

          {/* Scent Pyramid (Mobile Only) */}
          <div className="pm-pyramid pm-pyramid-mobile">
            <p className="pm-section-label">Scent Pyramid</p>
            <div className="pm-notes-grid">
              <div className="pm-note-group">
                <span className="pm-note-type">Top</span>
                {topNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
              <div className="pm-note-group">
                <span className="pm-note-type">Heart</span>
                {heartNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
              <div className="pm-note-group">
                <span className="pm-note-type">Base</span>
                {baseNotes.map(n => <span key={n} className="pm-note-tag">{n}</span>)}
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div className="pm-size-section">
            <p className="pm-section-label">Select Size</p>
            <div className="pm-sizes">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`pm-size-btn ${selectedSize === size ? 'pm-size-active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pm-actions">
            <button className="pm-btn-cart" onClick={(e) => addToCart(product, selectedSize, 1, { x: e.clientX, y: e.clientY })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Add to Cart
            </button>
            <button className="pm-btn-buy" onClick={(e) => {
              addToCart(product, selectedSize, 1, { x: e.clientX, y: e.clientY });
              setIsCartOpen(true);
              handleClose();
            }}>Buy Now</button>
          </div>

          {/* Divider */}
          <div className="pm-divider" />

          {/* Reviews */}
          <div className="pm-reviews">
            <p className="pm-section-label">Customer Reviews</p>
            <div className="pm-review-summary">
              <span className="pm-review-score">5.0</span>
              <div>
                <div className="pm-stars">★★★★★</div>
                <span className="pm-review-count">Based on {reviews.length} reviews</span>
              </div>
            </div>
            <div className="pm-review-list">
              {reviews.map((r, i) => (
                <div key={i} className="pm-review-card">
                  <div className="pm-review-header">
                    <div className="pm-review-avatar">{r.author ? r.author[0] : 'C'}</div>
                    <div>
                      <p className="pm-review-author">{r.author || 'Verified Customer'}</p>
                      <span className="pm-review-date">{r.date}</span>
                    </div>
                    <div className="pm-review-stars">{'★'.repeat(r.rating)}</div>
                  </div>
                  <p className="pm-review-text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
