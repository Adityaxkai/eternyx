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
}

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  disclaimer: 'ETERNYX fragrances are handcrafted in Grasse, France, using organically-sourced natural materials and pure botanical essences. Spontaneous scent dispersion and natural sediment are hallmarks of artisan quality. Free standard shipping applies to all orders above $250. Individual results and scent endurance may vary depending on ambient humidity and skin temperature.',
  copyright: '© 2026 ETERNYX Luxury. All rights reserved.',
  columns: [
    {
      title: 'Collections',
      links: [
        { label: 'Silken Oud', url: '/shop?q=Silken+Oud' },
        { label: 'Noir Absolu', url: '/shop?q=Noir+Absolu' },
        { label: 'Lumière Rose', url: '/shop?q=Lumiere+Rose' },
        { label: 'Vetiver Ghost', url: '/shop?q=Vetiver+Ghost' },
        { label: 'Shop All Fragrances', url: '/shop' }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Bespoke Scent Consultation', url: '#' },
        { label: 'Private Perfumery Masterclass', url: '#' },
        { label: 'Corporate Gifting', url: '#' },
        { label: 'Custom Bottle Engraving', url: '#' }
      ]
    },
    {
      title: 'Boutique Story',
      links: [
        { label: 'The Heritage', url: '#' },
        { label: 'Sourcing Grasse Essences', url: '#' },
        { label: 'Olfactory Scent Journal', url: '#' },
        { label: 'Sustainability & Ethos', url: '#' }
      ]
    },
    {
      title: 'Support & Store',
      links: [
        { label: 'Contact Boutique', url: '#' },
        { label: 'Shipping & Complimentary Returns', url: '#' },
        { label: 'Find a Boutique', url: '#' },
        { label: 'Olfactory FAQ', url: '#' }
      ]
    }
  ],
  bottomLinks: [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Sale', url: '#' },
    { label: 'Legal & Regulatory', url: '#' },
    { label: 'Site Map', url: '#' }
  ]
};

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [openColumn, setOpenColumn] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.footerConfig) {
          setConfig(data.footerConfig);
        } else if (data && data.footerText) {
          // If we only have plain footerText, merge it in
          setConfig((prev) => ({
            ...prev,
            copyright: data.footerText
          }));
        }
      })
      .catch((err) => console.error('Failed to load footer settings:', err));
  }, []);

  const toggleColumn = (idx: number) => {
    setOpenColumn(openColumn === idx ? null : idx);
  };

  const columns = config.columns || DEFAULT_FOOTER_CONFIG.columns || [];
  const bottomLinks = config.bottomLinks || DEFAULT_FOOTER_CONFIG.bottomLinks || [];

  return (
    <footer className="apple-footer">
      <div className="footer-inner">
        {/* Top Disclaimer / Fine Print */}
        {config.disclaimer && (
          <section className="footer-disclaimer">
            <p>{config.disclaimer}</p>
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
            <span className="developer-separator">|</span>
            <a 
              href="https://www.linkedin.com/in/adityakumarwork" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="dev-signature-link"
              title="Developer Portfolio"
            >
              Developer ✦
            </a>
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

        .developer-separator {
          margin: 0 10px;
          color: rgba(255, 255, 255, 0.15);
        }

        .dev-signature-link {
          color: rgba(255, 255, 255, 0.45) !important;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
          display: inline-block;
          font-weight: 400;
        }

        .dev-signature-link:hover {
          color: #d4af37 !important;
          transform: translateY(-1px);
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
        }
      `}</style>
    </footer>
  );
}
