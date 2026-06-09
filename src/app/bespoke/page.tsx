'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface Question {
  id: string;
  title: string;
  options: { value: string; label: string; description: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'vibe',
    title: 'Select your preferred atmosphere',
    options: [
      { value: 'nocturnal', label: 'Nocturnal', description: 'Dark, mysterious, incense-filled libraries and midnight rain.' },
      { value: 'sun-drenched', label: 'Sun-Drenched', description: 'Bright, warm, radiant dawn reflecting off stone terraces.' },
      { value: 'ethereal', label: 'Ethereal', description: 'Cool, mineral, silent fog rolling over grey mountains.' }
    ]
  },
  {
    id: 'intensity',
    title: 'What presence should your scent command?',
    options: [
      { value: 'skin', label: 'Skin Scent', description: 'Intimate, whisper-soft sillage designed only for those close to you.' },
      { value: 'moderate', label: 'Moderate', description: 'Balanced, elegant trace that drifts gracefully with motion.' },
      { value: 'bold', label: 'Intense', description: 'Commanding, rich projection that claims the space entirely.' }
    ]
  },
  {
    id: 'accord',
    title: 'Choose your preferred primary family accord',
    options: [
      { value: 'wood', label: 'Wood & Resins', description: 'Warm agarwood, cedar, smoke, and comforting spices.' },
      { value: 'citrus', label: 'Fresh & Mineral', description: 'Vibrant bergamot, grapefruit, aldehydes, and sea salt.' },
      { value: 'floral', label: 'Sensual Floral', description: 'Honeyed rose absolute, dark saffron, and night-blooming jasmine.' }
    ]
  }
];

const RECOMMENDATION_MAP: Record<string, {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}> = {
  'Silken Oud': {
    name: 'Silken Oud',
    category: 'Luxury Blend',
    price: '$220.00',
    image: '/images/product-silken-oud.png',
    description: 'An encounter between East and West. Deep Agarwood wrapped in saffron spice and Bulgarian Rose absolute.'
  },
  'Noir Absolu': {
    name: 'Noir Absolu',
    category: 'Eau de Parfum',
    price: '$195.00',
    image: '/images/product-noir-absolu.png',
    description: 'Olfactory shadow. Smoky leather, dark incense, and velvety orris root.'
  },
  'Lumière Rose': {
    name: 'Lumière Rose',
    category: 'Signature Scent',
    price: '$240.00',
    image: '/images/product-lumiere-rose.png',
    description: 'Soft power. Lychee, sparkling aldehydes, and rose absolute harvested at dawn.'
  },
  'Vetiver Ghost': {
    name: 'Vetiver Ghost',
    category: 'Limited Edition',
    price: '$280.00',
    image: '/images/product-vetiver-ghost.png',
    description: 'Spectrally cold. Grey pepper, Haitian vetiver, and crisp mineral musk.'
  },
  'Eternyx Noir': {
    name: 'Eternyx Noir',
    category: 'Eau de Parfum',
    price: '$180.00',
    image: '/images/product-noir-absolu.png',
    description: 'Olfactory signature of silence. Luminous cardamom combined with ebony woods.'
  }
};

export default function BespokePage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendedProduct, setRecommendedProduct] = useState<typeof RECOMMENDATION_MAP[string] | null>(null);

  // VIP Booking states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Paris');
  const [message, setMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSelectOption = (questionId: string, value: string) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate Match
      let matchName = 'Noir Absolu'; // Default
      
      const vibe = updatedAnswers['vibe'];
      const accord = updatedAnswers['accord'];
      const intensity = updatedAnswers['intensity'];

      if (vibe === 'nocturnal' && accord === 'wood') {
        matchName = 'Silken Oud';
      } else if (vibe === 'nocturnal' && accord === 'floral') {
        matchName = 'Eternyx Noir';
      } else if (vibe === 'ethereal' && intensity === 'skin') {
        matchName = 'Vetiver Ghost';
      } else if (vibe === 'sun-drenched' && accord === 'citrus') {
        matchName = 'Lumière Rose';
      } else if (vibe === 'nocturnal') {
        matchName = 'Noir Absolu';
      } else {
        matchName = 'Eternyx Noir';
      }

      setRecommendedProduct(RECOMMENDATION_MAP[matchName]);
      setStep(QUESTIONS.length);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setRecommendedProduct(null);
    setStep(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!recommendedProduct) return;
    
    // Map custom recommendation format to cart context structure
    const cartProduct = {
      name: recommendedProduct.name,
      category: recommendedProduct.category,
      price: recommendedProduct.price,
      image: recommendedProduct.image,
      badge: null
    };

    addToCart(cartProduct, '100 ml', 1, { x: e.clientX, y: e.clientY });
    setIsCartOpen(true);
  };

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, location, message }),
      });
      if (res.ok) {
        setBookingSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await res.json();
        setBookingError(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Network error. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="bespoke-container">
      {/* Editorial Header */}
      <section className="bespoke-hero">
        <p className="bespoke-eyebrow">Bespoke Experience</p>
        <h1 className="bespoke-title">The Custom Atelier</h1>
        <p className="bespoke-subtitle">
          Find your signature, or consult with our creators. We guide you to your exact olfactory match, or formulate a compound aligned exclusively to your character.
        </p>
      </section>

      {/* Scent Finder Widget */}
      <section className="scent-finder-section">
        <div className="glass-card finder-card">
          {step < QUESTIONS.length ? (
            <div className="wizard-step">
              <div className="step-progress">
                <span className="step-num">Step {step + 1} of {QUESTIONS.length}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>

              <h2 className="step-title">{QUESTIONS[step].title}</h2>

              <div className="options-grid">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    className="option-btn"
                    onClick={() => handleSelectOption(QUESTIONS[step].id, opt.value)}
                  >
                    <span className="opt-label">{opt.label}</span>
                    <span className="opt-desc">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            recommendedProduct && (
              <div className="recommendation-result">
                <p className="result-eyebrow">Your Olfactory Match</p>
                <div className="result-grid">
                  <div className="result-img-box">
                    <img src={recommendedProduct.image} alt={recommendedProduct.name} />
                  </div>
                  <div className="result-info">
                    <span className="result-category">{recommendedProduct.category}</span>
                    <h2 className="result-name">{recommendedProduct.name}</h2>
                    <p className="result-price">{recommendedProduct.price}</p>
                    <p className="result-desc">{recommendedProduct.description}</p>
                    
                    <div className="result-actions">
                      <button className="add-cart-btn" onClick={handleAddToCart}>
                        Add Match to Cart
                      </button>
                      <button className="reset-btn" onClick={handleReset}>
                        Retake Scent Finder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* VIP Booking Form */}
      <section className="booking-section">
        <div className="booking-grid">
          <div className="booking-text">
            <h2>Atelier Consultation</h2>
            <p>
              For individuals seeking absolute exclusivity, ETERNYX offers private formulation commissions at our salons in Grasse, Paris, and Tokyo. 
            </p>
            <p>
              In a private consult, our master perfumers spend three sessions mapping your sensory memories and skin chemistry to yield a singular recipe, registered under your name and preserved in our vault.
            </p>
            <div className="booking-addresses">
              <div className="addr-box">
                <strong>Grasse Laboratory</strong>
                <p>12 Rue de la Verrerie, 06130 Grasse</p>
              </div>
              <div className="addr-box">
                <strong>Parisian Atelier</strong>
                <p>42 Place des Vosges, 75003 Paris</p>
              </div>
            </div>
          </div>
          
          <div className="booking-form-col">
            <div className="glass-card booking-card">
              <h3>Request Consultation</h3>
              
              {bookingSuccess ? (
                <div className="booking-success">
                  <span className="success-icon">✓</span>
                  <h4>Request Received</h4>
                  <p>A client concierge will contact you discreetly within 24 hours to schedule your session.</p>
                  <button className="reset-btn-sub" onClick={() => setBookingSuccess(false)}>Book Another Session</button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="bespoke-form">
                  <div className="form-group">
                    <label htmlFor="cli-name">Full Name</label>
                    <input 
                      id="cli-name"
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Vance"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cli-email">Contact Email</label>
                    <input 
                      id="cli-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@vance.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cli-loc">Preferred Salon</label>
                    <select 
                      id="cli-loc"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="Paris">Paris Salon (Place des Vosges)</option>
                      <option value="Grasse">Grasse Laboratory (French Riviera)</option>
                      <option value="Tokyo">Tokyo Atelier (Aoyama)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cli-notes">Olfactory Direction / Notes</label>
                    <textarea 
                      id="cli-notes"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe any particular notes or sensory memories you wish to explore (optional)..."
                      rows={3}
                    />
                  </div>
                  {bookingError && <p className="form-error">{bookingError}</p>}
                  <button type="submit" className="submit-booking-btn" disabled={bookingLoading}>
                    {bookingLoading ? 'Submitting…' : 'Submit Reservation Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .bespoke-container {
          min-height: 100vh;
          background-color: #050505;
          padding: 140px 50px 80px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bespoke-hero {
          text-align: center;
          margin-bottom: 60px;
          max-width: 700px;
        }

        .bespoke-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .bespoke-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .bespoke-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          font-weight: 300;
        }

        .scent-finder-section {
          width: 100%;
          max-width: 900px;
          margin-bottom: 100px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 6px;
          padding: 40px;
        }

        .step-progress {
          margin-bottom: 30px;
        }

        .step-num {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          display: block;
          margin-bottom: 10px;
        }

        .bar-track {
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .bar-fill {
          height: 100%;
          background: #d4af37;
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .step-title {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 30px;
          font-weight: 300;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .option-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 24px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .option-btn:hover {
          background: rgba(212, 175, 55, 0.02);
          border-color: #d4af37;
        }

        .opt-label {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: #fff;
          font-weight: 400;
        }

        .opt-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.4;
        }

        .recommendation-result {
          text-align: center;
        }

        .result-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #d4af37;
          margin-bottom: 24px;
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          align-items: center;
          text-align: left;
        }

        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .result-img-box {
          height: 320px;
          background: #000;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .result-category {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
          display: block;
          margin-bottom: 8px;
        }

        .result-name {
          font-size: 2rem;
          color: #fff;
          margin-bottom: 6px;
          font-weight: 300;
        }

        .result-price {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: #d4af37;
          margin-bottom: 20px;
        }

        .result-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .result-actions {
          display: flex;
          gap: 16px;
        }

        .add-cart-btn {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px 24px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .add-cart-btn:hover {
          opacity: 0.9;
        }

        .reset-btn {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px 24px;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          border-color: #fff;
        }

        .booking-section {
          width: 100%;
          max-width: 1100px;
          margin-bottom: 40px;
        }

        .booking-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .booking-text h2 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .booking-text p {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.8;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .booking-addresses {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .addr-box strong {
          color: #fff;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 4px;
        }

        .addr-box p {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .booking-card h3 {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 24px;
          font-weight: 400;
        }

        .bespoke-form {
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

        .submit-booking-btn {
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

        .submit-booking-btn:hover { opacity: 0.9; }
        .submit-booking-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-error {
          color: #f87171;
          font-size: 0.8rem;
          padding: 8px 12px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 4px;
        }

        .booking-success {
          text-align: center;
          padding: 30px 0;
        }

        .success-icon {
          font-size: 2.5rem;
          color: #22c55e;
          display: block;
          margin-bottom: 16px;
        }

        .booking-success h4 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 10px;
        }

        .booking-success p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .reset-btn-sub {
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

        .reset-btn-sub:hover {
          border-color: #fff;
        }

        @media (max-width: 768px) {
          .bespoke-container {
            padding: 100px 24px 60px 24px;
          }
          .bespoke-title {
            font-size: 2rem;
          }
          .glass-card {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}
