import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ETERNYX',
  description: 'Privacy Policy and Data Protection at ETERNYX Luxury Fragrances.',
};

export default function PrivacyPage() {
  return (
    <main className="policy-page-container">
      {/* Hero Header */}
      <section className="policy-hero">
        <p className="policy-eyebrow">Privacy & Security</p>
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-subtitle">
          At ETERNYX, your privacy is our priority. We are committed to safeguarding your personal information with absolute integrity and bank-grade security.
        </p>
      </section>

      {/* Main Content Area */}
      <section className="policy-content-section">
        <div className="policy-card">
          
          {/* Section 1 */}
          <div className="policy-section-block">
            <div className="policy-section-header">
              <span className="policy-section-num">01</span>
              <h2>Collection of Information</h2>
            </div>
            <p>
              At <strong>ETERNYX</strong>, your privacy is our priority. This policy describes how we collect, use, and protect your personal information when you visit{' '}
              <a href="https://www.eternyxfragrance.com" target="_blank" rel="noopener noreferrer" className="policy-link">
                www.eternyxfragrance.com
              </a>{' '}
              or purchase our artisanal olfactory creations.
            </p>
            <p>
              We collect personal information such as your <strong>name, shipping address, and email address</strong> to process your orders, manage your bespoke account, facilitate seamless order dispatch, and periodically send curated promotional notices regarding new limited editions.
            </p>
          </div>

          <div className="policy-divider" />

          {/* Section 2 */}
          <div className="policy-section-block">
            <div className="policy-section-header">
              <span className="policy-section-num">02</span>
              <h2>Data Protection & Security</h2>
            </div>
            <p>
              We implement industry-standard security measures, including <strong>Secure Socket Layer (SSL) encryption technology</strong>, to protect your personal and payment information during all digital transactions.
            </p>
            <p>
              Your payment details are securely processed through encrypted, certified financial gateways. <strong>We do not store full credit card or debit card numbers on our servers</strong> under any circumstance.
            </p>
          </div>

          <div className="policy-divider" />

          {/* Section 3 */}
          <div className="policy-section-block">
            <div className="policy-section-header">
              <span className="policy-section-num">03</span>
              <h2>Third-Party Disclosure</h2>
            </div>
            <p>
              We respect your trust. <strong>We do not sell, trade, rent, or lease your personal information</strong> to third parties for commercial gain or advertising.
            </p>
            <p>
              We may disclose your information only if strictly required by applicable legal authorities, lawful court orders, or governmental law enforcement agencies.
            </p>
          </div>

          <div className="policy-divider" />

          {/* Section 4 */}
          <div className="policy-section-block">
            <div className="policy-section-header">
              <span className="policy-section-num">04</span>
              <h2>Registered Boutique Office & Queries</h2>
            </div>
            <p>
              For questions regarding our privacy practices, data deletion requests, or order inquiries, you may reach our boutique concierges at:
            </p>
            <div className="address-box">
              <p className="address-line"><strong>ETERNYX Luxury Fragrances</strong></p>
              <p className="address-line">Jagdish Nagar, Bazar Tand, Road No. 2,</p>
              <p className="address-line">5th Building, 1st Floor, Ramgarh Cantt,</p>
              <p className="address-line">Jharkhand, Pincode 829122, India</p>
              <p className="address-line">Official Website:{' '}
                <a href="https://www.eternyxfragrance.com" target="_blank" rel="noopener noreferrer" className="policy-link">
                  www.eternyxfragrance.com
                </a>
              </p>
            </div>
          </div>

          <div className="policy-footer-actions">
            <Link href="/terms" className="policy-action-btn secondary">
              View Terms & Conditions
            </Link>
            <Link href="/contact" className="policy-action-btn primary">
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .policy-page-container {
          min-height: 100vh;
          background: #080808;
          color: #f5f5f5;
          padding: 140px 24px 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .policy-hero {
          max-width: 820px;
          text-align: center;
          margin-bottom: 50px;
        }

        .policy-eyebrow {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .policy-title {
          font-family: var(--font-cormorant, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 18px;
        }

        .policy-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.7;
          font-weight: 300;
          max-width: 650px;
          margin: 0 auto;
        }

        .policy-content-section {
          width: 100%;
          max-width: 860px;
        }

        .policy-card {
          background: rgba(18, 18, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 48px 40px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .policy-card {
            padding: 32px 20px;
          }
        }

        .policy-section-block {
          margin-bottom: 32px;
        }

        .policy-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .policy-section-num {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 4px;
          padding: 3px 8px;
          display: inline-block;
        }

        .policy-section-header h2 {
          font-family: var(--font-cormorant, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.45rem;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 0.03em;
          margin: 0;
        }

        .policy-section-block p {
          font-size: 0.92rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 12px;
          font-weight: 300;
        }

        .policy-section-block p:last-child {
          margin-bottom: 0;
        }

        .policy-section-block strong {
          color: #ffffff;
          font-weight: 500;
        }

        .address-box {
          background: rgba(255, 255, 255, 0.03);
          border-left: 2px solid #d4af37;
          padding: 16px 20px;
          border-radius: 0 6px 6px 0;
          margin-top: 14px;
        }

        .address-line {
          font-size: 0.88rem !important;
          color: rgba(255, 255, 255, 0.85) !important;
          margin-bottom: 6px !important;
          line-height: 1.6 !important;
        }

        .address-line:last-child {
          margin-bottom: 0 !important;
        }

        .policy-link {
          color: #d4af37;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease, opacity 0.2s ease;
        }

        .policy-link:hover {
          color: #f1d779;
        }

        .policy-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          margin: 32px 0;
        }

        .policy-footer-actions {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          flex-wrap: wrap;
        }

        .policy-action-btn {
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          text-align: center;
          text-decoration: none;
        }

        .policy-action-btn.primary {
          background: #d4af37;
          color: #080808;
          border: 1px solid #d4af37;
        }

        .policy-action-btn.primary:hover {
          background: #f1d779;
          border-color: #f1d779;
          transform: translateY(-1px);
        }

        .policy-action-btn.secondary {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .policy-action-btn.secondary:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </main>
  );
}
