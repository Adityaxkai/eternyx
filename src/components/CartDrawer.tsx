'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useRef, useState } from 'react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Cart Flow Steps: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: string; value: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Checkout Form States
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Reset checkout view when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      setAppliedDiscount(null);
      setPromoCode('');
      setPromoError('');
      setStep('cart');
    }
  }, [cartItems, step]);

  // Reset steps back to standard bag if drawer closes from success state
  useEffect(() => {
    if (!isCartOpen && step === 'success') {
      setStep('cart');
      setAppliedDiscount(null);
    }
  }, [isCartOpen, step]);

  // Close cart drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'Percentage') {
      return cartTotal * (appliedDiscount.value / 100);
    }
    if (appliedDiscount.type === 'Fixed Amount') {
      return Math.min(cartTotal, appliedDiscount.value);
    }
    return 0;
  };

  const discountAmount = getDiscountAmount();
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch(`/api/discounts/${cleanCode}`);
      const data = await res.json();

      if (res.ok) {
        setAppliedDiscount(data);
        setPromoCode('');
      } else {
        setPromoError(data.error || 'Invalid promo code');
      }
    } catch (err) {
      console.error('Apply promo code error:', err);
      setPromoError('Failed to apply promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !street || !city || !zip) {
      setCheckoutError('Please fill out all address fields.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');

    const payload = {
      email,
      name,
      address: {
        street,
        city,
        zip,
        country: 'United States'
      },
      items: cartItems.map(item => ({
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      discountCode: appliedDiscount?.code || null,
      total: finalTotal
    };

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setCreatedOrderId(data.id);
        setStep('success');
        clearCart();
        // Reset forms
        setEmail('');
        setName('');
        setStreet('');
        setCity('');
        setZip('');
      } else {
        setCheckoutError(data.error || 'Failed to process checkout');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Fulfillment processing error. Try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)} 
      />
      <div 
        ref={drawerRef}
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
      >
        <div className="cart-header">
          {step === 'checkout' ? (
            <button className="back-btn" onClick={() => setStep('cart')} aria-label="Go back to shopping bag">
              &larr; Back to Bag
            </button>
          ) : (
            <h2>Shopping Bag</h2>
          )}
          <button className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Step-based Content Switching */}
        {step === 'cart' && (
          <div className="cart-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <p>Your bag is empty.</p>
                <button className="shop-btn" onClick={() => setIsCartOpen(false)}>Shop Scent Collection</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <div className="item-header">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="item-category">{item.category}</p>
                          <p className="item-size">Size: {item.size}</p>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => removeFromCart(item.name, item.size)}
                          aria-label="Remove item"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>

                      <div className="item-footer">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.name, item.size, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.name, item.size, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="item-price">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="checkout-content">
            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <h3>Shipping Address</h3>
              {checkoutError && <p className="checkout-error">{checkoutError}</p>}
              
              <div className="checkout-field">
                <label htmlFor="chk-email">Email Address</label>
                <input
                  id="chk-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emma@example.com"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="chk-name">Full Name</label>
                <input
                  id="chk-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Emma Watson"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="chk-street">Street Address</label>
                <input
                  id="chk-street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Luxury Lane"
                  required
                />
              </div>

              <div className="checkout-row">
                <div className="checkout-field half">
                  <label htmlFor="chk-city">City</label>
                  <input
                    id="chk-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="checkout-field half">
                  <label htmlFor="chk-zip">ZIP Code</label>
                  <input
                    id="chk-zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label>Billing & Payment</label>
                <div className="mock-card-details">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Pre-authorized Live Demo Checkout</span>
                </div>
              </div>

              <div className="checkout-summary-mini">
                <span>Total amount due:</span>
                <strong>${finalTotal.toLocaleString()}</strong>
              </div>

              <button type="submit" className="checkout-btn" disabled={checkoutLoading}>
                {checkoutLoading ? 'Authorizing Payment...' : `Complete Purchase — $${finalTotal.toLocaleString()}`}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="success-content">
            <div className="success-card">
              <div className="success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>Scent Confirmed</h2>
              <p className="success-subheading">Your order will arrive in silence.</p>
              
              <div className="receipt-box">
                <p className="receipt-label">Order Reference</p>
                <p className="receipt-value">{createdOrderId}</p>
                <p className="receipt-label" style={{ marginTop: '15px' }}>Delivery Timelines</p>
                <p className="receipt-value" style={{ fontSize: '0.8rem', color: '#fff' }}>2 - 4 business days</p>
              </div>

              <button className="continue-shop-btn" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Step Cart Footers */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="promo-form">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE"
                disabled={promoLoading || !!appliedDiscount}
              />
              {appliedDiscount ? (
                <button type="button" onClick={handleRemovePromo} className="promo-btn remove">
                  Remove
                </button>
              ) : (
                <button type="submit" disabled={promoLoading || !promoCode.trim()} className="promo-btn">
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </form>
            {promoError && <p className="promo-error">{promoError}</p>}
            {appliedDiscount && (
              <p className="promo-success">
                Code <strong>{appliedDiscount.code}</strong> applied (
                {appliedDiscount.type === 'Percentage'
                  ? `${appliedDiscount.value}% off`
                  : appliedDiscount.type === 'Fixed Amount'
                  ? `$${appliedDiscount.value} off`
                  : 'Free Shipping'}
                )
              </p>
            )}

            <div className="cart-summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              {appliedDiscount && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span className="discount-amount">-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-price">${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="tax-shipping-info">
              {appliedDiscount?.type === 'Free Shipping' 
                ? 'Free shipping applied. Taxes calculated at checkout.' 
                : 'Shipping and taxes calculated at checkout.'}
            </p>
            <button className="checkout-btn" onClick={() => setStep('checkout')}>
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Bag
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 10000;
        }

        .cart-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: -420px;
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: #080808;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          z-index: 10001;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-drawer.open {
          transform: translateX(-420px);
        }

        @media (max-width: 420px) {
          .cart-drawer {
            right: -100%;
            max-width: 100%;
          }
          .cart-drawer.open {
            transform: translateX(-100%);
          }
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .cart-header h2 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #fff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .back-btn {
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .back-btn:hover {
          color: #fff;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: color 0.2s;
          padding: 5px;
        }

        .close-btn:hover {
          color: #fff;
        }

        .cart-content, .checkout-content, .success-content {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
        }

        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 20px;
          color: rgba(255, 255, 255, 0.4);
        }

        .empty-cart p {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.1rem;
        }

        .shop-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 10px 20px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s;
        }

        .shop-btn:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cart-item {
          display: flex;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .item-image {
          width: 80px;
          height: 100px;
          background: #111;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .item-header h3 {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: #fff;
          margin: 0 0 4px 0;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .item-category {
          font-size: 0.65rem;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .item-size {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .remove-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: color 0.2s;
          padding: 2px;
        }

        .remove-btn:hover {
          color: #ef4444;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.02);
        }

        .quantity-controls button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: color 0.2s, background 0.2s;
        }

        .quantity-controls button:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .quantity-controls span {
          width: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: #fff;
        }

        .item-price {
          font-size: 0.9rem;
          color: #fff;
          font-family: var(--font-serif);
        }

        /* Checkout Form Styling */
        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .checkout-form h3 {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 300;
          color: #fff;
          margin-bottom: 5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }

        .checkout-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checkout-field label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .checkout-field input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 12px;
          border-radius: 2px;
          font-family: inherit;
          font-size: 0.8rem;
        }

        .checkout-field input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .checkout-row {
          display: flex;
          gap: 15px;
        }

        .checkout-field.half {
          flex: 1;
        }

        .mock-card-details {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(212, 175, 55, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.15);
          padding: 12px;
          border-radius: 2px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .checkout-summary-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .checkout-summary-mini strong {
          color: #d4af37;
          font-size: 1.1rem;
          font-family: var(--font-serif);
        }

        .checkout-error {
          font-size: 0.75rem;
          color: #ef4444;
        }

        /* Success View Styling */
        .success-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .success-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 320px;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .success-card h2 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 300;
          color: #fff;
          margin-bottom: 10px;
        }

        .success-subheading {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
          margin-bottom: 30px;
        }

        .receipt-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 30px;
        }

        .receipt-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 6px;
        }

        .receipt-value {
          font-family: monospace;
          font-size: 1rem;
          color: #d4af37;
          letter-spacing: 1px;
        }

        .continue-shop-btn {
          width: 100%;
          background: transparent;
          border: 1px solid #d4af37;
          color: #d4af37;
          padding: 14px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-shop-btn:hover {
          background: #d4af37;
          color: #000;
        }

        /* Cart Footer Styles */
        .cart-footer {
          padding: 24px 30px 36px 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-shrink: 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .total-price {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: #fff;
          font-weight: 300;
        }

        .tax-shipping-info {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }

        .checkout-btn {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 14px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
          text-align: center;
          width: 100%;
        }

        .checkout-btn:hover:not(:disabled) {
          opacity: 0.95;
        }

        .checkout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-cart-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: color 0.2s;
          align-self: center;
          padding: 5px;
        }

        .clear-cart-btn:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .promo-form {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          width: 100%;
        }

        .promo-form input {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 8px 12px;
          font-size: 0.7rem;
          border-radius: 2px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .promo-form input:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.4);
        }

        .promo-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 8px 16px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .promo-btn:hover:not(:disabled) {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .promo-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .promo-btn.remove {
          border-color: rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .promo-btn.remove:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .promo-error {
          font-size: 0.7rem;
          color: #ef4444;
          margin: 0 0 12px 0;
          text-align: left;
        }

        .promo-success {
          font-size: 0.7rem;
          color: #d4af37;
          margin: 0 0 12px 0;
          text-align: left;
          letter-spacing: 0.05em;
        }

        .cart-summary-totals {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 10px 0 15px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 15px;
        }

        .discount-row {
          color: #d4af37;
          font-size: 0.95rem;
        }

        .discount-amount {
          font-family: var(--font-serif);
        }

        .total-row {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 10px;
        }
      `}</style>
    </>
  );
}
