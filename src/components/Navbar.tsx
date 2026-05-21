'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const close = () => setIsMenuOpen(false);

  return (
    <>
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
          <Link href="/shop">Shop</Link>
          <Link href="/alchemy">The Alchemy</Link>
        </div>

        <Link href="/" className="nav-logo" onClick={close}>
          ETERNYX
        </Link>

        <div className="nav-icons">
          <Link href="/story" className="desktop-only">Our Story</Link>
          <Link href="/bespoke" className="desktop-only">Bespoke</Link>
          <button aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
        </div>
      </nav>

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
