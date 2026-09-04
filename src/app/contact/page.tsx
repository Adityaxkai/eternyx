'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('General');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type: inquiryType, message }),
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to dispatch inquiry.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-container">
      {/* Hero Header */}
      <section className="contact-hero">
        <p className="contact-eyebrow">Client Care</p>
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Whether seeking details on our collections, inquiring about bespoke formulation commissions, or requesting digital scent guidance, our online concierge is at your disposal.
        </p>
      </section>

      {/* Main Grid: Form Left, Concierge Right */}
      <section className="contact-grid-section">
        <div className="contact-grid">
          
          {/* Inquiry Form Card */}
          <div className="form-col">
            <div className="glass-card contact-card">
              <h2>Send an Inquiry</h2>
              <p className="card-desc">For digital assistance, complete the fields below.</p>
              
              {success ? (
                <div className="success-state">
                  <span className="success-icon">✓</span>
                  <h3>Inquiry Dispatched</h3>
                  <p>Thank you for contacting ETERNYX. A concierge representative will review your message and reply within 12 hours.</p>
                  <button className="reset-btn" onClick={() => setSuccess(false)}>Send Another Inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="con-name">Full Name</label>
                    <input 
                      id="con-name"
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Julian Vane"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="con-email">Email Address</label>
                    <input 
                      id="con-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="julian@vane.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="con-type">Inquiry Type</label>
                    <select 
                      id="con-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                    >
                      <option value="General">General & Scent Advice</option>
                      <option value="Bespoke">Bespoke Commissions</option>
                      <option value="Press">Press & Collaborations</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="con-message">Message</label>
                    <textarea 
                      id="con-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry in detail..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  {submitError && <p className="form-error">{submitError}</p>}
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Dispatch Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Digital Concierge Details */}
          <div className="boutiques-col">
            <h2 className="boutiques-title">Customer Concierge</h2>
            <p className="boutiques-desc">For order inquiries, digital advice, or custom consultations.</p>
            
            <div className="boutique-list">
              <div className="boutique-card glass-card">
                <div className="card-top">
                  <span className="boutique-city">Digital Support</span>
                  <h3 className="boutique-name">Online Client Care</h3>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Hours</span>
                    <p className="value">Monday – Saturday: 09:00 – 19:00 (GMT)</p>
                  </div>
                  <div className="detail-row">
                    <span className="label">Client Email</span>
                    <p className="value">concierge@eternyx.com</p>
                  </div>
                  <div className="detail-row">
                    <span className="label">Corporate</span>
                    <p className="value">info@eternyx.com</p>
                  </div>
                </div>
              </div>

              <div className="boutique-card glass-card">
                <div className="card-top">
                  <span className="boutique-city">Bespoke Guidance</span>
                  <h3 className="boutique-name">Virtual Consultations</h3>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Availability</span>
                    <p className="value">By reservation only. Schedule a virtual consultation using our bespoke booking form.</p>
                  </div>
                  <div className="detail-row">
                    <span className="label">Platform</span>
                    <p className="value">Private Zoom / Google Meet video sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style jsx>{`
        .contact-container {
          min-height: 100vh;
          background-color: #050505;
          padding: 140px 50px 80px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contact-hero {
          text-align: center;
          margin-bottom: 60px;
          max-width: 700px;
        }

        .contact-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .contact-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .contact-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          font-weight: 300;
        }

        .contact-grid-section {
          width: 100%;
          max-width: 1100px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 6px;
        }

        .contact-card {
          padding: 40px;
        }

        .contact-card h2 {
          font-size: 1.35rem;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 300;
        }

        .card-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 30px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          color: #fff;
          font-size: 0.85rem;
          font-family: inherit;
          border-radius: 2px;
          transition: all 0.2s;
        }

        .form-group select option {
          background: #0d0d0d;
          color: #fff;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255, 255, 255, 0.04);
        }

        .submit-btn {
          margin-top: 10px;
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .submit-btn:hover { opacity: 0.9; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-error {
          color: #f87171;
          font-size: 0.8rem;
          padding: 8px 12px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 4px;
        }

        .success-state {
          text-align: center;
          padding: 40px 0;
        }

        .success-icon {
          font-size: 2.5rem;
          color: #22c55e;
          display: block;
          margin-bottom: 16px;
        }

        .success-state h3 {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 10px;
        }

        .success-state p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .reset-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 8px 16px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          border-color: #fff;
        }

        .boutiques-title {
          font-size: 1.35rem;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 300;
        }

        .boutiques-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 30px;
        }

        .boutique-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .boutique-card {
          padding: 24px 30px;
          transition: border-color 0.3s;
        }

        .boutique-card:hover {
          border-color: rgba(212, 175, 55, 0.2);
        }

        .boutique-city {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #d4af37;
          display: block;
          margin-bottom: 4px;
        }

        .boutique-name {
          font-size: 1.1rem;
          color: #fff;
          font-weight: 400;
          margin-bottom: 16px;
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          gap: 20px;
        }

        @media (max-width: 480px) {
          .detail-row {
            flex-direction: column;
            gap: 4px;
          }
        }

        .detail-row .label {
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .detail-row .value {
          color: rgba(255, 255, 255, 0.7);
          text-align: right;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .detail-row .value {
            text-align: left;
          }
        }

        .phone-value {
          color: #d4af37 !important;
        }

        @media (max-width: 768px) {
          .contact-container {
            padding: 100px 24px 60px 24px;
          }
          .contact-title {
            font-size: 2rem;
          }
          .contact-card, .boutique-card {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}
