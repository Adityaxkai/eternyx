'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const ANNOUNCEMENTS = [
  'COMPLIMENTARY SHIPPING GLOBALLY ON ALL ORDERS',
  'SILENCE IS LUXURY • DISCOVER THE ALCHEMY COLLECTION',
  'EXPERIENCE TAILORED BESPOKE PERFUMERY'
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { setIsCartOpen, cartCount } = useCart();

  const close = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isSearchOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        {/* Slim Dynamic Announcement Bar */}
        <div className="announcement-bar">
          <div className="announcement-track">
            {ANNOUNCEMENTS.map((text, idx) => (
              <span
                key={text}
                className={`announcement-message ${idx === announcementIndex ? 'active' : ''}`}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        <nav className="navbar">
          {/* Hamburger Icon on Mobile/Tablet */}
          <button
            className="nav-hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          </button>

          <div className="nav-links">
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/alchemy" className="nav-link">The Alchemy</Link>
          </div>

          <Link href="/" className="nav-logo" onClick={close}>
            ETERNYX
          </Link>

          <div className="nav-icons">
            <Link href="/story" className="nav-link desktop-only">Our Story</Link>
            <Link href="/bespoke" className="nav-link desktop-only">Bespoke</Link>
            <button aria-label="Search" onClick={() => setIsSearchOpen(true)} className="nav-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            {pathname !== '/checkout' && (
              <button aria-label="Cart" onClick={() => setIsCartOpen(true)} className="cart-trigger-btn nav-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Immersive Search Modal Overlay */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <div className="search-container">
          <button
            className="search-close-btn"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="search-form-wrapper">
            <form action="/shop" method="GET" className="search-form">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ETERNYX..."
                className="search-input"
                autoComplete="off"
                autoFocus={isSearchOpen}
              />
            </form>
            <div className="search-suggestions">
              <p className="suggestions-title">SUGGESTED SEARCHES</p>
              <div className="suggestions-list">
                <Link href="/shop?q=alchemy" onClick={() => setIsSearchOpen(false)}>The Alchemy Collection</Link>
                <Link href="/shop?q=bespoke" onClick={() => setIsSearchOpen(false)}>Bespoke Perfumery</Link>
                <Link href="/shop?q=oud" onClick={() => setIsSearchOpen(false)}>Oud & Gold</Link>
                <Link href="/shop?q=gift" onClick={() => setIsSearchOpen(false)}>Curated Gift Sets</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        {/* Header row inside overlay: logo + close button */}
        <div className="mobile-menu-header">
          <Link href="/" className="mobile-menu-logo" onClick={close}>
            ETERNYX
          </Link>
          <button
            className="mobile-menu-close"
            onClick={close}
            aria-label="Close Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Gold divider */}
        <div className="mobile-menu-divider" />

        {/* Navigation links */}
        <nav className="mobile-menu-links">
          {[
            { href: '/shop', label: 'Shop Collection' },
            { href: '/alchemy', label: 'The Alchemy' },
            { href: '/story', label: 'Our Story' },
            { href: '/bespoke', label: 'Bespoke' },
            { href: '/journal', label: 'The Journal' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="mobile-menu-link"
              style={{ '--link-index': i } as React.CSSProperties}
            >
              <span className="mobile-menu-link-num">0{i + 1}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mobile-menu-footer">
          <div className="mobile-menu-socials">
            <a href="#" aria-label="Instagram">Instagram</a>
            <span className="mobile-menu-social-dot">·</span>
            <a href="#" aria-label="Pinterest">Pinterest</a>
            <span className="mobile-menu-social-dot">·</span>
            <a href="#" aria-label="TikTok">TikTok</a>
          </div>
          <p>© 2026 ETERNYX LUXURY. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
}
