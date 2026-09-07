'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/compressImage';
import { PhilosophyConfig, DEFAULT_PHILOSOPHY, DEFAULT_CATEGORIES } from '@/lib/types';

type Tab = 'General' | 'Branding' | 'Categories' | 'About Us' | 'Shipping' | 'Taxes' | 'Notifications' | 'Footer';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('General');

  // ── Categories ──
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim().toUpperCase();
    if (!trimmed) return;
    if (categoriesList.includes(trimmed)) {
      alert(`Category "${trimmed}" already exists.`);
      return;
    }
    setCategoriesList([...categoriesList, trimmed]);
    setNewCategoryInput('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (!confirm(`Delete category "${catToDelete}"?`)) return;
    setCategoriesList(categoriesList.filter(c => c !== catToDelete));
  };

  const handleStartEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setEditCategoryValue(categoriesList[index]);
  };

  const handleSaveEditCategory = (index: number) => {
    const trimmed = editCategoryValue.trim().toUpperCase();
    if (!trimmed) return;
    const updated = [...categoriesList];
    updated[index] = trimmed;
    setCategoriesList(updated);
    setEditingCategoryIndex(null);
    setEditCategoryValue('');
  };

  // ── Philosophy ──
  const [philosophyEyebrow, setPhilosophyEyebrow] = useState(DEFAULT_PHILOSOPHY.eyebrow);
  const [philosophyHeadline1, setPhilosophyHeadline1] = useState(DEFAULT_PHILOSOPHY.headlinePart1);
  const [philosophyHeadline2, setPhilosophyHeadline2] = useState(DEFAULT_PHILOSOPHY.headlinePart2);
  const [philosophyDescription, setPhilosophyDescription] = useState(DEFAULT_PHILOSOPHY.description);
  const [philosophyButtonText, setPhilosophyButtonText] = useState(DEFAULT_PHILOSOPHY.buttonText);
  const [philosophyButtonUrl, setPhilosophyButtonUrl] = useState(DEFAULT_PHILOSOPHY.buttonUrl);
  const [philosophyImageUrl, setPhilosophyImageUrl] = useState(DEFAULT_PHILOSOPHY.imageUrl);
  const [uploadingPhilosophyImage, setUploadingPhilosophyImage] = useState(false);

  const handlePhilosophyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    const inputElement = e.target;
    setUploadingPhilosophyImage(true);
    try {
      const file = await compressImage(rawFile, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
        mimeType: 'image/webp',
      });
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'image/webp',
          'x-filename': file.name,
        },
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        setPhilosophyImageUrl(data.url);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Upload error.');
    } finally {
      if (inputElement) inputElement.value = '';
      setUploadingPhilosophyImage(false);
    }
  };

  // ── Footer ──
  const [footerDisclaimer, setFooterDisclaimer] = useState('');
  const [footerCopyright, setFooterCopyright] = useState('');
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);
  const [footerBottomLinks, setFooterBottomLinks] = useState<FooterLink[]>([]);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const handleAddColumn = () => {
    setFooterColumns([...footerColumns, { title: 'New Category', links: [] }]);
  };

  const handleRemoveColumn = (colIdx: number) => {
    setFooterColumns(footerColumns.filter((_, idx) => idx !== colIdx));
  };

  const handleUpdateColumnTitle = (colIdx: number, newTitle: string) => {
    const updated = footerColumns.map((col, idx) => {
      if (idx === colIdx) return { ...col, title: newTitle };
      return col;
    });
    setFooterColumns(updated);
  };

  const handleAddLink = (colIdx: number) => {
    const updated = footerColumns.map((col, idx) => {
      if (idx === colIdx) {
        return {
          ...col,
          links: [...col.links, { label: 'New Link', url: '#' }]
        };
      }
      return col;
    });
    setFooterColumns(updated);
  };

  const handleUpdateLink = (colIdx: number, linkIdx: number, field: 'label' | 'url', value: string) => {
    const updated = footerColumns.map((col, cIdx) => {
      if (cIdx === colIdx) {
        const updatedLinks = col.links.map((link, lIdx) => {
          if (lIdx === linkIdx) {
            return { ...link, [field]: value };
          }
          return link;
        });
        return { ...col, links: updatedLinks };
      }
      return col;
    });
    setFooterColumns(updated);
  };

  const handleRemoveLink = (colIdx: number, linkIdx: number) => {
    const updated = footerColumns.map((col, cIdx) => {
      if (cIdx === colIdx) {
        return {
          ...col,
          links: col.links.filter((_, lIdx) => lIdx !== linkIdx)
        };
      }
      return col;
    });
    setFooterColumns(updated);
  };

  const handleAddBottomLink = () => {
    setFooterBottomLinks([...footerBottomLinks, { label: 'New Policy', url: '#' }]);
  };

  const handleUpdateBottomLink = (idx: number, field: 'label' | 'url', value: string) => {
    const updated = footerBottomLinks.map((link, lIdx) => {
      if (lIdx === idx) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setFooterBottomLinks(updated);
  };

  const handleRemoveBottomLink = (idx: number) => {
    setFooterBottomLinks(footerBottomLinks.filter((_, lIdx) => lIdx !== idx));
  };

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

          setInstagramUrl(data.instagramUrl || '');
          setFacebookUrl(data.facebookUrl || '');
          setTwitterUrl(data.twitterUrl || '');

          // Load Categories
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategoriesList(data.categories);
          } else {
            fetch('/api/categories')
              .then(r => r.json())
              .then(cats => { if (Array.isArray(cats) && cats.length > 0) setCategoriesList(cats); })
              .catch(() => {});
          }

          // Load Philosophy settings
          const phil = data.philosophyConfig || {};
          setPhilosophyEyebrow(phil.eyebrow || DEFAULT_PHILOSOPHY.eyebrow);
          setPhilosophyHeadline1(phil.headlinePart1 || DEFAULT_PHILOSOPHY.headlinePart1);
          setPhilosophyHeadline2(phil.headlinePart2 || DEFAULT_PHILOSOPHY.headlinePart2);
          setPhilosophyDescription(phil.description || DEFAULT_PHILOSOPHY.description);
          setPhilosophyButtonText(phil.buttonText || DEFAULT_PHILOSOPHY.buttonText);
          setPhilosophyButtonUrl(phil.buttonUrl || DEFAULT_PHILOSOPHY.buttonUrl);
          setPhilosophyImageUrl(phil.imageUrl || DEFAULT_PHILOSOPHY.imageUrl);

          // Load Footer settings with fallback defaults
          const fc = data.footerConfig || {};
          
          const defaultCols = [
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
              title: 'Brand Story',
              links: [
                { label: 'The Heritage', url: '/story' }
              ]
            },
            {
              title: 'Support & Store',
              links: [
                { label: 'Contact Us', url: '/contact' }
              ]
            }
          ];
          const defaultBottom = [
            { label: 'Privacy Policy', url: '/privacy' },
            { label: 'Terms and Conditions', url: '/terms' },
            { label: 'Returns & Refunds', url: '/terms#returns' },
            { label: 'Shipping Info', url: '/terms#shipping' }
          ];

          setFooterDisclaimer(fc.disclaimer || 'ETERNYX fragrances are handcrafted in Grasse, France, using organically-sourced natural materials and pure botanical essences. Spontaneous scent dispersion and natural sediment are hallmarks of artisan quality. Free standard shipping applies to all orders above $250. Individual results and scent endurance may vary depending on ambient humidity and skin temperature.');
          setFooterCopyright(fc.copyright || data.footerText || '© 2026 ETERNYX Luxury. All rights reserved.');
          
          if (fc.columns && fc.columns.length > 0) {
            setFooterColumns(fc.columns);
          } else {
            setFooterColumns(defaultCols);
          }
          
          if (fc.bottomLinks && fc.bottomLinks.length > 0) {
            setFooterBottomLinks(fc.bottomLinks);
          } else {
            setFooterBottomLinks(defaultBottom);
          }
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
          primaryColor, tagline, footerText: footerCopyright,
          categories: categoriesList,
          philosophyConfig: {
            eyebrow: philosophyEyebrow,
            headlinePart1: philosophyHeadline1,
            headlinePart2: philosophyHeadline2,
            description: philosophyDescription,
            buttonText: philosophyButtonText,
            buttonUrl: philosophyButtonUrl,
            imageUrl: philosophyImageUrl,
          },
          footerConfig: {
            disclaimer: footerDisclaimer,
            copyright: footerCopyright,
            columns: footerColumns,
            bottomLinks: footerBottomLinks
          },
          instagramUrl,
          facebookUrl,
          twitterUrl,
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

  const TABS: Tab[] = ['General', 'Branding', 'Categories', 'About Us', 'Shipping', 'Taxes', 'Notifications', 'Footer'];

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
                  <p className="section-desc">Basic information about your store.</p>
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
                      <option value="INR">INR (₹) – Indian Rupee</option>
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

            {/* ── CATEGORIES ── */}
            {tab === 'Categories' && (
              <>
                <section className="settings-card">
                  <h2>Product Categories</h2>
                  <p className="section-desc">
                    Manage the categories used to organize your perfumes and collections across the storefront and admin panel.
                  </p>
                  
                  {/* Add New Category Bar */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px', marginTop: '16px' }}>
                    <input 
                      type="text" 
                      placeholder="NEW CATEGORY NAME (e.g. OUD COLLECTION)" 
                      value={newCategoryInput} 
                      onChange={e => setNewCategoryInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                      style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                    <button 
                      type="button"
                      className="admin-btn-primary" 
                      onClick={handleAddCategory}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      + Add Category
                    </button>
                  </div>

                  {/* Categories Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                    {categoriesList.map((cat, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        {editingCategoryIndex === idx ? (
                          <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                            <input 
                              type="text"
                              value={editCategoryValue}
                              onChange={e => setEditCategoryValue(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleSaveEditCategory(idx); }}
                              autoFocus
                              style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem', textTransform: 'uppercase' }}
                            />
                            <button 
                              type="button"
                              onClick={() => handleSaveEditCategory(idx)}
                              style={{ background: '#d4af37', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              Save
                            </button>
                            <button 
                              type="button"
                              onClick={() => setEditingCategoryIndex(null)}
                              style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d4af37' }} />
                              <span style={{ fontWeight: 500, fontSize: '0.85rem', letterSpacing: '0.06em', color: '#ffffff' }}>
                                {cat}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                type="button"
                                onClick={() => handleStartEditCategory(idx)}
                                title="Rename Category"
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                              >
                                ✎
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                title="Delete Category"
                                style={{ background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.2)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                              >
                                ✕
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="field-hint" style={{ marginTop: '20px' }}>
                    Click <strong>&quot;Save Changes&quot;</strong> in the top header to save your updated category list.
                  </p>
                </section>
              </>
            )}

            {/* ── ABOUT US ── */}
            {tab === 'About Us' && (
              <>
                <section className="settings-card">
                  <h2>Homepage About Us / Brand Statement</h2>
                  <p className="section-desc">Customise the &quot;Silence is Luxury&quot; brand statement and about us section on the homepage.</p>
                  
                  <div className="form-group">
                    <label htmlFor="set-phil-eyebrow">Section Eyebrow / Tag</label>
                    <input 
                      id="set-phil-eyebrow" 
                      type="text" 
                      value={philosophyEyebrow} 
                      onChange={e => setPhilosophyEyebrow(e.target.value)} 
                      placeholder="About Us" 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="set-phil-head1">Headline (Line 1)</label>
                      <input 
                        id="set-phil-head1" 
                        type="text" 
                        value={philosophyHeadline1} 
                        onChange={e => setPhilosophyHeadline1(e.target.value)} 
                        placeholder="Silence" 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="set-phil-head2">Headline (Line 2)</label>
                      <input 
                        id="set-phil-head2" 
                        type="text" 
                        value={philosophyHeadline2} 
                        onChange={e => setPhilosophyHeadline2(e.target.value)} 
                        placeholder="Is Luxury." 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="set-phil-desc">Body Description</label>
                    <textarea 
                      id="set-phil-desc" 
                      rows={4} 
                      value={philosophyDescription} 
                      onChange={e => setPhilosophyDescription(e.target.value)} 
                      placeholder="We reject the noise of conventional fragrance..." 
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="set-phil-btn-text">Button Text</label>
                      <input 
                        id="set-phil-btn-text" 
                        type="text" 
                        value={philosophyButtonText} 
                        onChange={e => setPhilosophyButtonText(e.target.value)} 
                        placeholder="About Us" 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="set-phil-btn-url">Button Link</label>
                      <input 
                        id="set-phil-btn-url" 
                        type="text" 
                        value={philosophyButtonUrl} 
                        onChange={e => setPhilosophyButtonUrl(e.target.value)} 
                        placeholder="/story" 
                      />
                    </div>
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Section Imagery</h2>
                  <p className="section-desc">The featured perfume photography shown on the right side.</p>
                  
                  {philosophyImageUrl && (
                    <div style={{ marginBottom: '16px', maxWidth: '360px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img 
                        src={philosophyImageUrl} 
                        alt="Brand Philosophy Preview" 
                        referrerPolicy="no-referrer"
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Upload New Image</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhilosophyImageUpload} 
                      disabled={uploadingPhilosophyImage}
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    />
                    {uploadingPhilosophyImage && <p className="field-hint" style={{ color: '#d4af37' }}>Uploading image to Google Drive…</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="set-phil-img-url">Or Direct Image URL</label>
                    <input 
                      id="set-phil-img-url" 
                      type="text" 
                      value={philosophyImageUrl} 
                      onChange={e => setPhilosophyImageUrl(e.target.value)} 
                      placeholder="/images/brand-statement.png" 
                    />
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
                      <label htmlFor="set-standard">Standard Rate (₹)</label>
                      <input id="set-standard" type="number" min="0" value={standardRate} onChange={e => setStandardRate(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="set-express">Express Rate (₹)</label>
                      <input id="set-express" type="number" min="0" value={expressRate} onChange={e => setExpressRate(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="set-free">Free Shipping Threshold (₹)</label>
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

            {/* ── FOOTER CONFIGURATOR ── */}
            {tab === 'Footer' && (
              <>
                <section className="settings-card">
                  <h2>Footer Fine Print</h2>
                  <p className="section-desc">Manage site-wide footer notes and copyright disclaimers.</p>

                  <div className="form-group">
                    <label htmlFor="footer-disclaimer-input">Sourcing Disclaimer & Notes</label>
                    <textarea 
                      id="footer-disclaimer-input"
                      value={footerDisclaimer} 
                      onChange={e => setFooterDisclaimer(e.target.value)} 
                      rows={5}
                      placeholder="ETERNYX fragrances are handcrafted in Grasse..."
                      className="textarea-input"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="footer-copyright-input">Copyright Line</label>
                    <input 
                      id="footer-copyright-input"
                      type="text" 
                      value={footerCopyright} 
                      onChange={e => setFooterCopyright(e.target.value)} 
                      placeholder="© 2026 ETERNYX Luxury. All rights reserved." 
                    />
                  </div>
                </section>

                <section className="settings-card">
                  <h2>Social Media Links</h2>
                  <p className="section-desc">Manage site-wide social media profile links. Leaving a field blank will hide the icon in the footer.</p>
                  
                  <div className="form-group">
                    <label htmlFor="ig-url-input">Instagram URL</label>
                    <input 
                      id="ig-url-input"
                      type="text" 
                      value={instagramUrl} 
                      onChange={e => setInstagramUrl(e.target.value)} 
                      placeholder="https://instagram.com/yourbrand" 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fb-url-input">Facebook URL</label>
                    <input 
                      id="fb-url-input"
                      type="text" 
                      value={facebookUrl} 
                      onChange={e => setFacebookUrl(e.target.value)} 
                      placeholder="https://facebook.com/yourbrand" 
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="tw-url-input">Twitter / X URL</label>
                    <input 
                      id="tw-url-input"
                      type="text" 
                      value={twitterUrl} 
                      onChange={e => setTwitterUrl(e.target.value)} 
                      placeholder="https://twitter.com/yourbrand" 
                    />
                  </div>
                </section>

                <section className="settings-card">
                  <div className="card-header-flex">
                    <h2>Directory Navigation Columns</h2>
                    <button className="add-btn-accent" onClick={handleAddColumn}>
                      + Add Column
                    </button>
                  </div>
                  <p className="section-desc">Set up your footer columns (recommend 4 columns maximum on desktop).</p>

                  <div className="columns-editor-list">
                    {footerColumns.length === 0 ? (
                      <p className="empty-hint">No columns configured. Click &ldquo;Add Column&rdquo; to start.</p>
                    ) : (
                      footerColumns.map((col, colIdx) => (
                        <div key={colIdx} className="column-editor-card">
                          <div className="column-editor-header">
                            <input 
                              type="text" 
                              value={col.title} 
                              onChange={e => handleUpdateColumnTitle(colIdx, e.target.value)}
                              placeholder="Column Title (e.g. Shop)"
                              className="title-input-field"
                            />
                            <button className="btn-delete-column" onClick={() => handleRemoveColumn(colIdx)}>
                              Delete Column
                            </button>
                          </div>

                          <div className="column-links-list">
                            {col.links.map((link, linkIdx) => (
                              <div key={linkIdx} className="link-editor-row">
                                <input 
                                  type="text" 
                                  value={link.label} 
                                  onChange={e => handleUpdateLink(colIdx, linkIdx, 'label', e.target.value)}
                                  placeholder="Link Label (e.g. Silken Oud)"
                                  style={{ flex: 1 }}
                                />
                                <input 
                                  type="text" 
                                  value={link.url} 
                                  onChange={e => handleUpdateLink(colIdx, linkIdx, 'url', e.target.value)}
                                  placeholder="URL (e.g. /shop)"
                                  style={{ flex: 1 }}
                                />
                                <button className="btn-delete-link" onClick={() => handleRemoveLink(colIdx, linkIdx)}>
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button className="btn-add-link" onClick={() => handleAddLink(colIdx)}>
                              + Add Link Item
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="settings-card">
                  <div className="card-header-flex">
                    <h2>Bottom Policies List</h2>
                    <button className="add-btn-accent" onClick={handleAddBottomLink}>
                      + Add Policy Link
                    </button>
                  </div>
                  <p className="section-desc">Manage links in the horizontal list at the very bottom bar of the footer.</p>

                  <div className="bottom-links-editor-list">
                    {footerBottomLinks.length === 0 ? (
                      <p className="empty-hint">No bottom links configured.</p>
                    ) : (
                      footerBottomLinks.map((link, idx) => (
                        <div key={idx} className="link-editor-row">
                          <input 
                            type="text" 
                            value={link.label} 
                            onChange={e => handleUpdateBottomLink(idx, 'label', e.target.value)}
                            placeholder="Label (e.g. Privacy Policy)"
                            style={{ flex: 1 }}
                          />
                          <input 
                            type="text" 
                            value={link.url} 
                            onChange={e => handleUpdateBottomLink(idx, 'url', e.target.value)}
                            placeholder="URL (e.g. /privacy)"
                            style={{ flex: 1 }}
                          />
                          <button className="btn-delete-link" onClick={() => handleRemoveBottomLink(idx)}>
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
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

        .textarea-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          color: #fff;
          font-family: inherit;
          border-radius: 4px;
          box-sizing: border-box;
          resize: vertical;
        }
        .textarea-input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .card-header-flex h2 {
          margin: 0;
        }

        .add-btn-accent {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.35);
          padding: 6px 14px;
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-btn-accent:hover {
          background: rgba(212, 175, 55, 0.25);
          border-color: #d4af37;
        }

        .columns-editor-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 18px;
        }

        .column-editor-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 20px;
        }

        .column-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 12px;
          margin-bottom: 14px;
        }

        .title-input-field {
          background: transparent !important;
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 0 !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          padding: 4px 0 !important;
          color: #d4af37 !important;
        }
        .title-input-field:focus {
          border-bottom-color: #d4af37 !important;
        }

        .btn-delete-column {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);
          padding: 6px 12px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-delete-column:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        .column-links-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .link-editor-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-delete-link {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .btn-delete-link:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }

        .btn-add-link {
          align-self: flex-start;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          margin-top: 4px;
          transition: color 0.2s;
        }
        .btn-add-link:hover {
          color: #d4af37;
        }

        .bottom-links-editor-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .empty-hint {
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.85rem;
          font-style: italic;
          margin: 10px 0;
        }

        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
          .settings-nav { flex-direction: row; flex-wrap: wrap; gap: 4px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
