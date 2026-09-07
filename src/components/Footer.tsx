'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterConfig {
  disclaimer?: string;
  copyright?: string;
  columns?: FooterColumn[];
  bottomLinks?: FooterLink[];
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  disclaimer: 'ETERNYX fragrances are handcrafted in Grasse, France, using organically-sourced natural materials and pure botanical essences. Spontaneous scent dispersion and natural sediment are hallmarks of artisan quality. Free standard shipping applies to all orders above $250. Individual results and scent endurance may vary depending on ambient humidity and skin temperature.',
  copyright: '© 2026 ETERNYX Luxury. All rights reserved.',
  columns: [
    {
      title: 'Collections',
      links: [
        { label: 'CANDY', url: '/shop?q=CANDY' },
        { label: 'AFTER MEET', url: '/shop?q=AFTER+MEET' },
        { label: 'AZURA', url: '/shop?q=AZURA' },
        { label: 'MEMORABLE', url: '/shop?q=MEMORABLE' },
        { label: 'Shop All Fragrances', url: '/shop' }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Bespoke Scent Consultation', url: '/bespoke' }
      ]
    },
    {
      title: 'Boutique Story',
      links: [
        { label: 'The Heritage', url: '/story' }
      ]
    },
    {
      title: 'Support & Store',
      links: [
        { label: 'Contact Boutique', url: '/contact' },
        { label: 'Shipping & Returns', url: '/terms#returns' }
      ]
    }
  ],
  bottomLinks: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms and Conditions', url: '/terms' },
    { label: 'Returns & Refunds', url: '/terms#returns' },
    { label: 'Shipping Info', url: '/terms#shipping' }
  ]
};

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [openColumn, setOpenColumn] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const newConfig: FooterConfig = {
            ...DEFAULT_FOOTER_CONFIG,
            instagramUrl: data.instagramUrl || '',
            facebookUrl: data.facebookUrl || '',
            twitterUrl: data.twitterUrl || '',
          };
          if (data.footerConfig) {
            newConfig.disclaimer = data.footerConfig.disclaimer ?? DEFAULT_FOOTER_CONFIG.disclaimer;
            newConfig.copyright = data.footerConfig.copyright ?? DEFAULT_FOOTER_CONFIG.copyright;
            newConfig.columns = data.footerConfig.columns ?? DEFAULT_FOOTER_CONFIG.columns;
            newConfig.bottomLinks = data.footerConfig.bottomLinks ?? DEFAULT_FOOTER_CONFIG.bottomLinks;
          } else if (data.footerText) {
            newConfig.copyright = data.footerText;
          }
          setConfig(newConfig);
        }
      })
      .catch((err) => console.error('Failed to load footer settings:', err));
  }, []);

  const toggleColumn = (idx: number) => {
    setOpenColumn(openColumn === idx ? null : idx);
  };

  const columns = (config.columns && config.columns.length > 0) 
    ? config.columns 
    : (DEFAULT_FOOTER_CONFIG.columns || []);

  const rawBottomLinks = (config.bottomLinks && config.bottomLinks.length > 0) 
    ? config.bottomLinks 
    : (DEFAULT_FOOTER_CONFIG.bottomLinks || []);

  const bottomLinks = rawBottomLinks.map((link) => {
    const l = link.label.toLowerCase();
    if (l.includes('privacy') && (!link.url || link.url === '#')) {
      return { ...link, url: '/privacy', label: 'Privacy Policy' };
    }
    if (l.includes('terms') && (!link.url || link.url === '#')) {
      return { ...link, url: '/terms', label: 'Terms and Conditions' };
    }
    if ((l.includes('refund') || l.includes('return') || l.includes('legal')) && (!link.url || link.url === '#')) {
      return { ...link, url: '/terms#returns', label: 'Returns & Refunds' };
    }
    if (l.includes('shipping') && (!link.url || link.url === '#')) {
      return { ...link, url: '/terms#shipping', label: 'Shipping Info' };
    }
    return link;
  });

  const disclaimer = config.disclaimer !== undefined && config.disclaimer !== '' 
    ? config.disclaimer 
    : DEFAULT_FOOTER_CONFIG.disclaimer;

  return (
    <footer className="apple-footer">
      <div className="footer-inner">
        {/* Top Disclaimer / Fine Print */}
        {disclaimer && (
          <section className="footer-disclaimer">
            <p>{disclaimer}</p>
          </section>
        )}

        {/* Directory Grid */}
        <nav className="footer-directory">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="directory-column">
              {/* Desktop Header */}
              <h3 className="directory-header-desktop">{col.title}</h3>
              
              {/* Mobile Header (Button) */}
              <button 
                className={`directory-header-mobile ${openColumn === colIdx ? 'expanded' : ''}`}
                onClick={() => toggleColumn(colIdx)}
                aria-expanded={openColumn === colIdx}
              >
                <span>{col.title}</span>
                <span className="accordion-icon" />
              </button>

              {/* Links list */}
              <ul className={`directory-links ${openColumn === colIdx ? 'open' : ''}`}>
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.url} className="footer-link-tag">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Social Profile links with original colors */}
        {(config.instagramUrl || config.facebookUrl || config.twitterUrl) && (
          <section className="footer-socials">
            <span className="socials-label">Follow Us</span>
            <div className="socials-icons-list">
              {config.instagramUrl && (
                <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon-svg">
                    <defs>
                      <radialGradient id="ig-grad-footer" cx="30%" cy="107%" r="130%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-footer)" />
                    <rect x="5" y="5" width="14" height="14" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="16.5" cy="7.5" r="1" fill="#fff" />
                  </svg>
                </a>
              )}
              {config.facebookUrl && (
                <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon facebook" title="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon-svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2" />
                    <path d="M16 12h-3v8h-3v-8H8v-3h2V7.2C10 5.25 11.25 4 13.5 4c1 0 1.85.07 2.1.1v2.44h-1.44c-1 0-1.16.47-1.16 1.14V9h2.5l-.5 3z" fill="#fff" />
                  </svg>
                </a>
              )}
              {config.twitterUrl && (
                <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-icon twitter" title="Twitter / X">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon-svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="#1DA1F2" />
                    <path d="M19 6.8c-.5.2-1.1.4-1.7.5.6-.4 1-1 1.2-1.7-.5.3-1.1.5-1.7.6a2.7 2.7 0 00-4.6 2.5A7.6 7.6 0 016.7 5.8a2.7 2.7 0 00.8 3.6c-.5 0-.9-.1-1.3-.3v.1a2.7 2.7 0 002.2 2.6c-.4.1-.8.1-1.2.1-.3 0-.6 0-.8-.1a2.7 2.7 0 002.5 1.9 5.4 5.4 0 01-4 1.1c1.3.8 2.8 1.3 4.4 1.3a7.7 7.7 0 007.7-7.7V9.6c.6-.5 1.1-1 1.5-1.6z" fill="#fff" />
                  </svg>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Base Copyright & Policies bar */}
        <section className="footer-base">
          <div className="base-left">
            <p className="copyright-text">{config.copyright || DEFAULT_FOOTER_CONFIG.copyright}</p>
          </div>
          <div className="base-middle">
            <div className="policy-links">
              {bottomLinks.map((link, idx) => (
                <Link key={idx} href={link.url} className="policy-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="base-right">
            <span className="locale-indicator">Grasse | English</span>
          </div>
        </section>
      </div>

      <style jsx>{`
        .apple-footer {
          background-color: #0d0d0d;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.45);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 0.72rem;
          line-height: 1.6;
          padding: 36px 0 24px 0;
          position: relative;
          z-index: 100;
        }

        .footer-inner {
          max-width: 1024px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Disclaimer Section */
        .footer-disclaimer {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .footer-disclaimer p {
          margin: 0;
          letter-spacing: -0.01em;
          text-align: justify;
        }

        /* Directory Grid */
        .footer-directory {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding-bottom: 24px;
        }

        .directory-column h3 {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .directory-header-desktop {
          display: block;
        }

        .directory-header-mobile {
          display: none;
        }

        .directory-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .directory-links li {
          margin-bottom: 8px;
        }

        :global(.apple-footer .footer-link-tag) {
          color: rgba(255, 255, 255, 0.5) !important;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        :global(.apple-footer .footer-link-tag:hover) {
          color: #d4af37 !important;
        }

        /* Base Bar */
        .footer-socials {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .socials-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .socials-icons-list {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, filter 0.25s ease;
          border-radius: 5px;
          overflow: hidden;
        }

        .social-icon:hover {
          transform: translateY(-2px) scale(1.08);
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.2));
        }

        .social-icon-svg {
          display: block;
        }

        .footer-base {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .base-left {
          order: 1;
        }

        .base-middle {
          order: 2;
        }

        .base-right {
          order: 3;
          font-weight: 500;
        }

        .copyright-text {
          margin: 0;
        }



        .policy-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0 16px;
        }

        :global(.apple-footer .policy-link) {
          color: rgba(255, 255, 255, 0.5) !important;
          text-decoration: none;
          transition: color 0.2s;
        }

        :global(.apple-footer .policy-link:hover) {
          color: #d4af37 !important;
        }

        .locale-indicator {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Mobile Responsive Viewport (<= 768px) */
        @media (max-width: 768px) {
          .apple-footer {
            padding: 24px 0 20px 0;
          }

          .footer-directory {
            grid-template-columns: 1fr;
            gap: 0;
            border-bottom: none;
            padding-bottom: 8px;
          }

          .directory-header-desktop {
            display: none;
          }

          .directory-header-mobile {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            background: none;
            border: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.76rem;
            font-family: inherit;
            font-weight: 500;
            padding: 12px 0;
            cursor: pointer;
            text-align: left;
          }

          .accordion-icon {
            position: relative;
            width: 8px;
            height: 8px;
          }

          .accordion-icon::before,
          .accordion-icon::after {
            content: '';
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            transition: transform 0.25s ease;
          }

          /* Plus sign */
          .accordion-icon::before {
            top: 3.5px;
            left: 0;
            width: 8px;
            height: 1px;
          }
          .accordion-icon::after {
            top: 0;
            left: 3.5px;
            width: 1px;
            height: 8px;
          }

          .directory-header-mobile.expanded .accordion-icon::after {
            transform: rotate(90deg) scaleY(0);
          }
          
          .directory-header-mobile.expanded .accordion-icon::before {
            transform: rotate(180deg);
          }

          .directory-links {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), padding 0.35s ease;
            padding-left: 10px;
          }

          .directory-links.open {
            max-height: 250px; /* Safe expanded limit */
            padding-top: 10px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .directory-links li {
            margin-bottom: 8px;
          }

          .footer-base {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding-top: 16px;
          }

          .base-left {
            order: 2;
          }

          .base-middle {
            order: 1;
            width: 100%;
          }

          .base-right {
            order: 3;
            margin-top: 4px;
          }

          .policy-links {
            gap: 6px 12px;
          }

          .footer-socials {
            padding: 14px 0;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }
        }
      `}</style>
    </footer>
  );
}
