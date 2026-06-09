'use client';

import { useState, useEffect } from 'react';

type Tab = 'General' | 'Branding' | 'Shipping' | 'Taxes' | 'Notifications';

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('General');

  // ── General ──
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [maintenance, setMaintenance] = useState(false);

  // ── Branding ──
  const [primaryColor, setPrimaryColor] = useState('#d4af37');
  const [tagline, setTagline] = useState('');
  const [footerText, setFooterText] = useState('');

  // ── Shipping ──
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('250');
  const [standardRate, setStandardRate] = useState('15');
  const [expressRate, setExpressRate] = useState('35');
  const [shippingOrigin, setShippingOrigin] = useState('');

  // ── Taxes ──
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState('0');
  const [taxLabel, setTaxLabel] = useState('VAT');
  const [taxIncluded, setTaxIncluded] = useState(false);

  // ── Notifications ──
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyNewReview, setNotifyNewReview] = useState(false);
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyNewInquiry, setNotifyNewInquiry] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStoreName(data.storeName || 'Eternyx Luxury Fragrances');
          setEmail(data.email || 'support@eternyx.com');
          setPhone(data.phone || '+1 (555) 123-4567');
          setCurrency(data.currency || 'USD');
          setMaintenance(Boolean(data.maintenance));
          setPrimaryColor(data.primaryColor || '#d4af37');
          setTagline(data.tagline || 'The Art of Invisible Luxury');
          setFooterText(data.footerText || '© 2025 Eternyx. All rights reserved.');
          setFreeShippingThreshold(data.freeShippingThreshold || '250');
          setStandardRate(data.standardRate || '15');
          setExpressRate(data.expressRate || '35');
          setShippingOrigin(data.shippingOrigin || 'Grasse, France');
          setTaxEnabled(Boolean(data.taxEnabled));
          setTaxRate(data.taxRate || '0');
          setTaxLabel(data.taxLabel || 'VAT');
          setTaxIncluded(Boolean(data.taxIncluded));
          setNotifyNewOrder(data.notifyNewOrder !== false);
          setNotifyLowStock(data.notifyLowStock !== false);
          setNotifyNewReview(Boolean(data.notifyNewReview));
          setNotifyNewBooking(data.notifyNewBooking !== false);
          setNotifyNewInquiry(data.notifyNewInquiry !== false);
          setNotifyEmail(data.notifyEmail || data.email || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName, email, phone, currency, maintenance,
          primaryColor, tagline, footerText,
          freeShippingThreshold, standardRate, expressRate, shippingOrigin,
          taxEnabled, taxRate, taxLabel, taxIncluded,
          notifyNewOrder, notifyLowStock, notifyNewReview, notifyNewBooking, notifyNewInquiry, notifyEmail,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const TABS: Tab[] = ['General', 'Branding', 'Shipping', 'Taxes', 'Notifications'];

  return (
    <div className="settings-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Store Settings</h1>
        <div className="header-actions">
          {saved && <span className="saved-msg">✓ Saved</span>}
          <button className="admin-btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading settings…</div>
      ) : (
        <div className="settings-grid">
          {/* Sidebar nav */}
          <div className="settings-nav">
            {TABS.map(t => (
              <button
                key={t}
                className={`settings-nav-btn ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="settings-content">

            {/* ── GENERAL ── */}
            {tab === 'General' && (
              <>
                <section className="settings-card">
                  <h2>Store Details</h2>
                  <p className="section-desc">Basic information about your boutique.</p>
                  <div className="form-group">
                    <label htmlFor="set-name">Store Name</label>
                    <input id="set-name" type="text" value={storeName} onChange={e => setStoreName(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="set-email">Contact Email</label>
                      <input id="set-email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="set-phone">Contact Phone</label>
                      <input id="set-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Currency</h2>
                  <p className="section-desc">The currency products are sold in.</p>
                  <div className="form-group">
                    <label htmlFor="set-currency">Primary Currency</label>
                    <select id="set-currency" value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option value="USD">USD ($) – United States Dollar</option>
                      <option value="EUR">EUR (€) – Euro</option>
                      <option value="GBP">GBP (£) – British Pound</option>
                      <option value="JPY">JPY (¥) – Japanese Yen</option>
                      <option value="AED">AED (د.إ) – UAE Dirham</option>
                    </select>
                  </div>
                </section>

                <section className="settings-card danger-zone">
                  <h2>Danger Zone</h2>
                  <div className="danger-content">
                    <div>
                      <strong>Maintenance Mode</strong>
                      <p>Take your store offline temporarily.</p>
                    </div>
                    <button className={`btn-toggle ${maintenance ? 'on' : 'off'}`} onClick={() => setMaintenance(!maintenance)}>
                      {maintenance ? 'Offline' : 'Online'}
                    </button>
                  </div>
                </section>
              </>
            )}

            {/* ── BRANDING ── */}
            {tab === 'Branding' && (
              <>
                <section className="settings-card">
                  <h2>Visual Identity</h2>
                  <p className="section-desc">Customise your brand&apos;s visual presence.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="set-color">Accent Color</label>
                      <div className="color-input-wrap">
                        <input id="set-color" type="color" className="color-picker" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                        <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="color-hex" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Copy &amp; Messaging</h2>
                  <p className="section-desc">Text that appears across the storefront.</p>
                  <div className="form-group">
                    <label htmlFor="set-tagline">Brand Tagline</label>
                    <input id="set-tagline" type="text" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="The Art of Invisible Luxury" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="set-footer">Footer Text</label>
                    <input id="set-footer" type="text" value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="© 2025 Eternyx. All rights reserved." />
                  </div>
                </section>
              </>
            )}

            {/* ── SHIPPING ── */}
            {tab === 'Shipping' && (
              <>
                <section className="settings-card">
                  <h2>Shipping Origin</h2>
                  <p className="section-desc">Where your orders ship from.</p>
                  <div className="form-group">
                    <label htmlFor="set-origin">Origin Location</label>
                    <input id="set-origin" type="text" value={shippingOrigin} onChange={e => setShippingOrigin(e.target.value)} placeholder="Grasse, France" />
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Rates &amp; Thresholds</h2>
                  <p className="section-desc">Shipping cost configuration.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="set-standard">Standard Rate ($)</label>
                      <input id="set-standard" type="number" min="0" value={standardRate} onChange={e => setStandardRate(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="set-express">Express Rate ($)</label>
                      <input id="set-express" type="number" min="0" value={expressRate} onChange={e => setExpressRate(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="set-free">Free Shipping Threshold ($)</label>
                    <input id="set-free" type="number" min="0" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(e.target.value)} />
                    <p className="field-hint">Orders above this amount qualify for complimentary shipping.</p>
                  </div>
                </section>
              </>
            )}

            {/* ── TAXES ── */}
            {tab === 'Taxes' && (
              <>
                <section className="settings-card">
                  <h2>Tax Configuration</h2>
                  <p className="section-desc">Set up tax collection for your storefront.</p>
                  <div className="form-group toggle-group">
                    <label>Enable Tax Collection</label>
                    <button className={`btn-toggle ${taxEnabled ? 'on' : 'off'}`} onClick={() => setTaxEnabled(!taxEnabled)}>
                      {taxEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {taxEnabled && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="set-tax-label">Tax Label</label>
                          <input id="set-tax-label" type="text" value={taxLabel} onChange={e => setTaxLabel(e.target.value)} placeholder="VAT" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="set-tax-rate">Tax Rate (%)</label>
                          <input id="set-tax-rate" type="number" min="0" max="100" step="0.01" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group toggle-group">
                        <label>Prices Include Tax</label>
                        <button className={`btn-toggle ${taxIncluded ? 'on' : 'off'}`} onClick={() => setTaxIncluded(!taxIncluded)}>
                          {taxIncluded ? 'Inclusive' : 'Exclusive'}
                        </button>
                      </div>
                    </>
                  )}
                </section>
              </>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === 'Notifications' && (
              <>
                <section className="settings-card">
                  <h2>Notification Email</h2>
                  <p className="section-desc">Where admin alerts are sent.</p>
                  <div className="form-group">
                    <label htmlFor="set-notify-email">Admin Email Address</label>
                    <input id="set-notify-email" type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} />
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Alert Preferences</h2>
                  <p className="section-desc">Choose which events trigger admin notifications.</p>

                  {([
                    { label: 'New Order', desc: 'Notify when a customer places an order.', value: notifyNewOrder, set: setNotifyNewOrder },
                    { label: 'Low Stock', desc: 'Notify when a product drops below 5 units.', value: notifyLowStock, set: setNotifyLowStock },
                    { label: 'New Review', desc: 'Notify when a customer submits a product review.', value: notifyNewReview, set: setNotifyNewReview },
                    { label: 'New Booking', desc: 'Notify when a VIP appointment request arrives.', value: notifyNewBooking, set: setNotifyNewBooking },
                    { label: 'New Inquiry', desc: 'Notify when a contact inquiry is submitted.', value: notifyNewInquiry, set: setNotifyNewInquiry },
                  ] as const).map(({ label, desc, value, set }) => (
                    <div key={label} className="notify-row">
                      <div className="notify-info">
                        <strong>{label}</strong>
                        <span>{desc}</span>
                      </div>
                      <button className={`btn-toggle ${value ? 'on' : 'off'}`} onClick={() => (set as any)(!value)}>
                        {value ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </section>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-btn-primary {
          background: #d4af37;
          color: #000;
          padding: 10px 20px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .admin-btn-primary:hover { opacity: 0.88; }
        .admin-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .header-actions { display: flex; align-items: center; gap: 16px; }
        .saved-msg { color: #22c55e; font-size: 0.85rem; }

        .admin-loading {
          padding: 80px 0;
          text-align: center;
          color: rgba(255,255,255,0.4);
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 40px;
          align-items: start;
        }

        .settings-nav { display: flex; flex-direction: column; gap: 4px; }
        .settings-nav-btn {
          background: none; border: none; text-align: left;
          padding: 10px 16px; color: rgba(255,255,255,0.5);
          font-size: 0.9rem; cursor: pointer; border-radius: 4px;
          transition: all 0.2s;
        }
        .settings-nav-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .settings-nav-btn.active { color: #d4af37; background: rgba(212,175,55,0.08); font-weight: 500; }

        .settings-content { display: flex; flex-direction: column; gap: 24px; max-width: 800px; }

        .settings-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 32px;
          border-radius: 4px;
        }

        h2 { font-size: 1.1rem; color: #fff; margin-bottom: 6px; font-weight: 400; }
        .section-desc { color: rgba(255,255,255,0.45); font-size: 0.85rem; margin-bottom: 24px; }

        .form-group { margin-bottom: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        label {
          display: block; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 8px;
        }
        input, select {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px; color: #fff; font-family: inherit;
          border-radius: 4px; box-sizing: border-box;
        }
        input:focus, select:focus { outline: none; border-color: #d4af37; }

        .field-hint { margin-top: 8px; font-size: 0.78rem; color: rgba(255,255,255,0.35); }

        /* Color picker */
        .color-input-wrap { display: flex; align-items: center; gap: 12px; }
        .color-picker { width: 44px; height: 44px; padding: 2px; border-radius: 4px; cursor: pointer; flex-shrink: 0; }
        .color-hex { flex: 1; font-family: monospace; }

        /* Toggle button */
        .btn-toggle {
          padding: 8px 18px; border-radius: 4px; border: 1px solid;
          font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .btn-toggle.on { background: rgba(34,197,94,0.1); border-color: #22c55e; color: #22c55e; }
        .btn-toggle.off { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); }

        .toggle-group { display: flex; justify-content: space-between; align-items: center; }
        .toggle-group label { margin: 0; }

        /* Danger zone */
        .danger-zone { border-color: rgba(239,68,68,0.25); }
        .danger-zone h2 { color: #f87171; }
        .danger-content { display: flex; justify-content: space-between; align-items: center; }
        .danger-content strong { display: block; margin-bottom: 4px; color: #fff; }
        .danger-content p { color: rgba(255,255,255,0.4); font-size: 0.82rem; margin: 0; }
        .danger-zone .btn-toggle.off { border-color: rgba(239,68,68,0.3); color: #f87171; background: rgba(239,68,68,0.06); }
        .danger-zone .btn-toggle.on { border-color: rgba(239,68,68,0.5); color: #ef4444; background: rgba(239,68,68,0.12); }

        /* Notifications */
        .notify-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .notify-row:last-child { border-bottom: none; }
        .notify-info { display: flex; flex-direction: column; gap: 3px; }
        .notify-info strong { color: rgba(255,255,255,0.85); font-size: 0.9rem; font-weight: 500; }
        .notify-info span { color: rgba(255,255,255,0.4); font-size: 0.8rem; }

        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
          .settings-nav { flex-direction: row; flex-wrap: wrap; gap: 4px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
