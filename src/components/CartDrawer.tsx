'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent SSR/hydration Styled-JSX mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: string; value: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [isPromoExpanded, setIsPromoExpanded] = useState(false);

  // Toggle scroll locks whenever cart drawer is opened
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isCartOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      const isProductModalOpen = document.querySelector('.pm-overlay');
      if (!isProductModalOpen) {
        lenis?.start();
        document.body.style.overflow = '';
      }
    }
    return () => {
      const isProductModalOpen = document.querySelector('.pm-overlay');
      if (!isProductModalOpen) {
        lenis?.start();
        document.body.style.overflow = '';
      }
    };
  }, [isCartOpen]);

  // Reset promo when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setAppliedDiscount(null);
      setPromoCode('');
      setPromoError('');
    }
  }, [cartItems]);

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

  if (!mounted) return null;

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
          <h2>Shopping Bag</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-content" data-lenis-prevent>
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
                    <div className="item-header-row">
                      <div className="item-titles">
                        <h3>{item.name}</h3>
                        <p className="item-category">{item.category} • {item.size}</p>
                      </div>
                      <button 
                        className="item-remove-link" 
                        onClick={() => removeFromCart(item.name, item.size)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="item-footer-row">
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
                      <p className="item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Accordion */}
            <div className="promo-accordion">
              <button 
                type="button" 
                className="promo-toggle-btn"
                onClick={() => setIsPromoExpanded(!isPromoExpanded)}
              >
                <span>{appliedDiscount ? 'Promo Code Applied' : 'Have a Promo Code?'}</span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  style={{ 
                    transform: isPromoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div className={`promo-collapse-content ${isPromoExpanded || appliedDiscount ? 'expanded' : ''}`}>
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
                      ? `₹${appliedDiscount.value} off`
                      : 'Free Shipping'}
                    )
                  </p>
                )}
              </div>
            </div>

            <div className="cart-summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {appliedDiscount && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span className="discount-amount">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-price">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="tax-shipping-info">
              {appliedDiscount?.type === 'Free Shipping' 
                ? 'Free shipping applied. Taxes calculated at checkout.' 
                : 'Shipping and taxes calculated at checkout.'}
            </p>
            <button 
              className="checkout-btn" 
              onClick={() => {
                setIsCartOpen(false);
                router.push(appliedDiscount ? `/checkout?promo=${appliedDiscount.code}` : '/checkout');
              }}
            >
              <span>Proceed to Checkout</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
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
          z-index: 100001;
        }

        .cart-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: #080808;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          z-index: 100002;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cart-drawer.open {
          transform: translateX(0);
        }

        @media (max-width: 420px) {
          .cart-drawer {
            right: 0;
            max-width: 100%;
            transform: translateX(100%);
          }
          .cart-drawer.open {
            transform: translateX(0);
          }
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
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
          overflow-x: hidden;
          padding: 20px 24px;
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
          gap: 16px;
        }

        .cart-item {
          display: flex;
          flex-direction: row;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .cart-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-image {
          width: 80px;
          height: 100px;
          background: #111;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.04);
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

        .item-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .item-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-header-row h3 {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: #fff;
          margin: 0;
          font-weight: 300;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }

        .item-category {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          font-family: var(--font-sans);
          letter-spacing: 0.01em;
        }

        .item-remove-link {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.68rem;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .item-remove-link:hover {
          color: #ef4444;
        }

        .item-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.02);
          height: 24px;
        }

        .quantity-controls button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          width: 22px;
          height: 100%;
          cursor: pointer;
          font-size: 0.8rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .quantity-controls button:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .quantity-controls span {
          width: 16px;
          text-align: center;
          font-size: 0.72rem;
          color: #fff;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-price {
          font-size: 0.9rem;
          color: #fff;
          font-family: var(--font-serif);
          font-weight: 300;
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
          width: 100%;
          box-sizing: border-box;
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

        .checkout-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
          margin-bottom: 5px;
        }

        .checkout-header-row h3 {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .auth-link-btn {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.7rem;
          text-decoration: underline;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: color 0.2s;
        }

        .auth-link-btn:hover {
          color: #fff;
        }

        .auth-status-bar {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .auth-logout-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.7rem;
          text-decoration: underline;
          cursor: pointer;
          margin-left: 8px;
          padding: 0;
          font-family: inherit;
        }

        .auth-logout-btn:hover {
          color: #f87171;
        }

        .auth-subtext {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: -10px;
          margin-bottom: 20px;
        }

        .switch-auth-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.6);
          width: 100%;
          padding: 12px;
          font-size: 0.7rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 10px;
          border-radius: 2px;
          transition: all 0.2s;
        }

        .switch-auth-btn:hover {
          border-color: #fff;
          color: #fff;
        }

        .save-account-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 4px;
          padding: 18px;
          margin: 20px 0;
          text-align: left;
          width: 100%;
        }

        .save-account-form h4 {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: #fff;
          margin: 0 0 6px 0;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        .save-account-form p {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .save-form-row {
          display: flex;
          gap: 10px;
        }

        .save-form-row input {
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 10px;
          font-size: 0.75rem;
          border-radius: 2px;
        }

        .save-form-row input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .save-form-row button {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 10px 16px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .save-form-row button:hover {
          opacity: 0.9;
        }

        .save-success-msg {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #d4af37;
          padding: 10px 0;
          line-height: 1.4;
          text-align: center;
        }

        .save-error-msg {
          font-size: 0.7rem;
          color: #ef4444;
          margin-top: 0;
          margin-bottom: 8px;
        }

        /* Cart Footer Styles */
        .cart-footer {
          padding: 12px 20px 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          background: #050505;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .summary-row span:last-child {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 400;
        }

        .total-price {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #d4af37;
          font-weight: 300;
        }

        .tax-shipping-info {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .checkout-btn {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
          padding: 13px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .checkout-btn:hover:not(:disabled) {
          background: transparent;
          color: #d4af37;
          border-color: #d4af37;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
        }

        .checkout-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-cart-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: center;
          padding: 2px;
          margin-top: 4px;
        }

        .clear-cart-btn:hover {
          color: #ef4444;
        }

        /* Promo Accordion */
        .promo-accordion {
          display: flex;
          flex-direction: column;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 6px;
          margin-bottom: 2px;
        }

        .promo-toggle-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          cursor: pointer;
          width: 100%;
          font-family: inherit;
          transition: color 0.2s;
        }

        .promo-toggle-btn:hover {
          color: #d4af37;
        }

        .promo-collapse-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          opacity: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .promo-collapse-content.expanded {
          max-height: 80px;
          opacity: 1;
          padding-top: 4px;
        }

        .promo-form {
          display: flex;
          gap: 6px;
          width: 100%;
        }

        .promo-form input {
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 6px 10px;
          font-size: 0.65rem;
          border-radius: 2px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: inherit;
        }

        .promo-form input:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.3);
        }

        .promo-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 6px 12px;
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
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
          font-size: 0.65rem;
          color: #ef4444;
          margin: 0 0 4px 0;
          text-align: left;
        }

        .promo-success {
          font-size: 0.65rem;
          color: #d4af37;
          margin: 0 0 4px 0;
          text-align: left;
          letter-spacing: 0.05em;
        }

        .cart-summary-totals {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 4px 0 6px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 8px;
        }

        .discount-row {
          color: #d4af37;
          font-size: 0.85rem;
        }

        .discount-amount {
          font-family: var(--font-serif);
        }

        .total-row {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 6px;
          margin-top: 2px;
        }

        .total-row span:first-child {
          font-weight: 500;
          color: #fff;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
}
