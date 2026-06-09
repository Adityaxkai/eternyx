'use client';

import { useState, useEffect } from 'react';

interface Discount {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: number;
  usage_count: number;
  active: boolean;
  created_at: string;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  // Form States
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = () => {
    setLoading(true);
    fetch('/api/admin/discounts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDiscounts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch discounts:', err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingDiscount(null);
    setCode('');
    setType('Percentage');
    setValue(10);
    setActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setCode(discount.code);
    setType(discount.type);
    setValue(discount.value);
    setActive(discount.active);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formatting validation
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      alert('Code cannot be empty');
      return;
    }

    const payload = {
      code: cleanCode,
      type,
      value: type === 'Free Shipping' ? 0 : Number(value),
      active,
    };

    try {
      if (editingDiscount) {
        // Edit / PATCH
        const res = await fetch(`/api/admin/discounts/${editingDiscount.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchDiscounts();
          setIsDrawerOpen(false);
        } else {
          alert('Failed to update discount');
        }
      } else {
        // Create / POST
        const res = await fetch('/api/admin/discounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchDiscounts();
          setIsDrawerOpen(false);
        } else {
          alert('Failed to create discount');
        }
      }
    } catch (err) {
      console.error('Save discount error:', err);
    }
  };

  const handleDelete = async () => {
    if (!editingDiscount) return;
    if (!confirm(`Are you sure you want to delete code "${editingDiscount.code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/discounts/${editingDiscount.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchDiscounts();
        setIsDrawerOpen(false);
      } else {
        alert('Failed to delete discount');
      }
    } catch (err) {
      console.error('Delete discount error:', err);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discounts</h1>
        <button className="admin-btn-primary" onClick={handleOpenCreate}>+ Create Discount</button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading promotional codes...</div>
      ) : discounts.length === 0 ? (
        <div className="admin-empty">
          <p>No discount codes created yet.</p>
          <button className="admin-btn-secondary" onClick={handleOpenCreate}>Create First Promo Code</button>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="col-code">Code</div>
            <div className="col-type">Type</div>
            <div className="col-value">Value</div>
            <div className="col-uses">Uses</div>
            <div className="col-status">Status</div>
            <div className="col-actions"></div>
          </div>

          <div className="table-body">
            {discounts.map((discount) => (
              <div key={discount.id} className="table-row">
                <div className="col-code">
                  <span className="code-tag">{discount.code}</span>
                </div>
                <div className="col-type">{discount.type}</div>
                <div className="col-value">
                  <strong>
                    {discount.type === 'Percentage' 
                      ? `${discount.value}%` 
                      : discount.type === 'Fixed Amount' 
                      ? `$${discount.value.toFixed(2)}` 
                      : 'Free Shipping'}
                  </strong>
                </div>
                <div className="col-uses">{discount.usage_count} uses</div>
                <div className="col-status">
                  <span className={`status-badge ${discount.active ? 'active' : 'expired'}`}>
                    {discount.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-link" onClick={() => handleOpenEdit(discount)}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-over Drawer for Create / Edit */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>{editingDiscount ? 'Edit Promo Code' : 'Create Promo Code'}</h2>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>&times;</button>
        </div>

        <form onSubmit={handleSave} className="drawer-form">
          <div className="form-group">
            <label htmlFor="disc-code">Promo Code</label>
            <input
              id="disc-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="E.g. SUMMER25"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="disc-type">Discount Type</label>
            <select
              id="disc-type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
          </div>

          {type !== 'Free Shipping' && (
            <div className="form-group">
              <label htmlFor="disc-value">Discount Value</label>
              <input
                id="disc-value"
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
              />
            </div>
          )}

          <div className="form-group-toggle">
            <label htmlFor="disc-active" className="toggle-label">Active & Redeemable</label>
            <input
              id="disc-active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="toggle-checkbox"
            />
          </div>

          <div className="drawer-actions">
            <button type="submit" className="admin-btn-save">
              {editingDiscount ? 'Update Code' : 'Save Code'}
            </button>
            {editingDiscount && (
              <button type="button" className="admin-btn-delete" onClick={handleDelete}>
                Delete Promo
              </button>
            )}
            <button type="button" className="admin-btn-cancel" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>

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
        }

        .admin-btn-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 10px 20px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          margin-top: 15px;
        }

        .admin-loading, .admin-empty {
          padding: 80px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .table-container {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .table-header {
          display: flex;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .table-row {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: #151515;
        }

        .col-code { width: 200px; }
        .col-type { flex: 1; color: rgba(255, 255, 255, 0.7); }
        .col-value { width: 150px; }
        .col-uses { width: 120px; color: rgba(255, 255, 255, 0.5); }
        .col-status { width: 120px; }
        .col-actions { width: 100px; text-align: right; }

        .code-tag {
          font-family: monospace;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          padding: 4px 12px;
          border-radius: 4px;
          letter-spacing: 1px;
          color: #d4af37;
        }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.active { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.expired { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .action-link {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 0.8rem;
        }
        
        .action-link:hover {
          color: #fff;
          text-decoration: underline;
        }

        /* Slide-over Drawer Styles */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 10000;
        }

        .drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: -460px;
          width: 100%;
          max-width: 460px;
          height: 100%;
          background: #080808;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          z-index: 10001;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 30px;
        }

        .drawer-panel.open {
          transform: translateX(-460px);
        }

        @media (max-width: 460px) {
          .drawer-panel {
            right: -100%;
            max-width: 100%;
          }
          .drawer-panel.open {
            transform: translateX(-100%);
          }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .drawer-header h2 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #fff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .drawer-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .drawer-close:hover {
          color: #fff;
        }

        .drawer-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .form-group input, .form-group select {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 12px;
          border-radius: 4px;
          font-family: inherit;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .form-group-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          margin-top: 10px;
        }

        .toggle-label {
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.8);
        }

        .toggle-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #d4af37;
        }

        .drawer-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .admin-btn-save {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
        }

        .admin-btn-delete {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
        }

        .admin-btn-delete:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        .admin-btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          border-radius: 2px;
        }

        .admin-btn-cancel:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
