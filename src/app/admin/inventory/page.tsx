'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InventoryVariant {
  productId: string;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  size: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  totalUnits: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export default function InventoryPage() {
  const [variants, setVariants] = useState<InventoryVariant[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    totalVariants: 0,
    totalUnits: 0,
    inStockCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setVariants(data.variants || []);
        setStats(data.stats || {
          totalProducts: 0,
          totalVariants: 0,
          totalUnits: 0,
          inStockCount: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (productId: string, size: string, newStock: number) => {
    const validStock = Math.max(0, Math.floor(newStock));
    const itemKey = `${productId}_${size}`;
    setSavingKey(itemKey);

    // Optimistically update local state
    setVariants((prev) =>
      prev.map((v) => {
        if (v.productId === productId && v.size === size) {
          let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
          if (validStock === 0) status = 'Out of Stock';
          else if (validStock <= 5) status = 'Low Stock';
          return { ...v, stock: validStock, status };
        }
        return v;
      })
    );

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size, newStock: validStock }),
      });

      if (res.ok) {
        setSaveFeedback(itemKey);
        setTimeout(() => setSaveFeedback(null), 1800);
      } else {
        alert('Failed to update stock on database.');
        fetchInventory(); // Revert
      }
    } catch (err) {
      console.error('Update stock error:', err);
      fetchInventory();
    } finally {
      setSavingKey(null);
    }
  };

  const filteredVariants = variants.filter((v) => {
    // Tab filter
    if (filterTab === 'IN_STOCK' && v.status !== 'In Stock') return false;
    if (filterTab === 'LOW_STOCK' && v.status !== 'Low Stock') return false;
    if (filterTab === 'OUT_OF_STOCK' && v.status !== 'Out of Stock') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = v.productName.toLowerCase().includes(q);
      const matchCat = v.category.toLowerCase().includes(q);
      const matchSize = v.size.toLowerCase().includes(q);
      return matchName || matchCat || matchSize;
    }

    return true;
  });

  return (
    <div className="inventory-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Warehouse & Inventory</h1>
          <p className="admin-page-sub">Monitor live stock, adjust variant quantities, and manage stock alerts.</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchInventory} className="refresh-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
          <Link href="/admin/products" className="manage-catalog-link">
            Manage Catalog →
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Stock Units</span>
          <span className="stat-value">{stats.totalUnits.toLocaleString()}</span>
          <span className="stat-sub">Across {stats.totalVariants} variants</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Fragrances</span>
          <span className="stat-value">{stats.totalProducts}</span>
          <span className="stat-sub">In luxury catalog</span>
        </div>
        <div className="stat-card alert-card">
          <span className="stat-label">Low Stock Alerts</span>
          <span className="stat-value warning">{stats.lowStockCount}</span>
          <span className="stat-sub">5 units or less</span>
        </div>
        <div className="stat-card alert-card">
          <span className="stat-label">Out of Stock</span>
          <span className="stat-value danger">{stats.outOfStockCount}</span>
          <span className="stat-sub">Requires replenishment</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="inventory-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterTab('ALL')}
          >
            All Variants ({variants.length})
          </button>
          <button
            className={`filter-tab ${filterTab === 'IN_STOCK' ? 'active' : ''}`}
            onClick={() => setFilterTab('IN_STOCK')}
          >
            In Stock ({stats.inStockCount})
          </button>
          <button
            className={`filter-tab warning-tab ${filterTab === 'LOW_STOCK' ? 'active' : ''}`}
            onClick={() => setFilterTab('LOW_STOCK')}
          >
            Low Stock ({stats.lowStockCount})
          </button>
          <button
            className={`filter-tab danger-tab ${filterTab === 'OUT_OF_STOCK' ? 'active' : ''}`}
            onClick={() => setFilterTab('OUT_OF_STOCK')}
          >
            Out of Stock ({stats.outOfStockCount})
          </button>
        </div>

        <div className="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search fragrance, category, or size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="admin-loading">Auditing fragrance warehouse stock...</div>
      ) : filteredVariants.length === 0 ? (
        <div className="empty-state">
          <p>No inventory records found matching your filters.</p>
        </div>
      ) : (
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Item</th>
                <th>Fragrance Name</th>
                <th>Category</th>
                <th>Variant Size</th>
                <th>Retail Price</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right', paddingRight: '28px' }}>Adjust Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((item) => {
                const itemKey = `${item.productId}_${item.size}`;
                const isSaving = savingKey === itemKey;
                const isSaved = saveFeedback === itemKey;

                return (
                  <tr key={itemKey}>
                    <td className="col-img">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="thumb" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="thumb-placeholder" />
                      )}
                    </td>
                    <td className="col-name">
                      <strong>{item.productName}</strong>
                    </td>
                    <td className="col-cat">
                      <span className="cat-pill">{item.category}</span>
                    </td>
                    <td className="col-size">
                      <span className="size-badge">{item.size}</span>
                    </td>
                    <td className="col-price">₹{item.price}</td>
                    <td className="col-status">
                      <span
                        className={`status-pill ${
                          item.status === 'In Stock'
                            ? 'status-in'
                            : item.status === 'Low Stock'
                            ? 'status-low'
                            : 'status-out'
                        }`}
                      >
                        <span className="dot" />
                        {item.status}
                      </span>
                    </td>
                    <td className="col-adjust">
                      <div className="adjuster-box">
                        <button
                          type="button"
                          className="adjust-btn minus"
                          onClick={() => handleStockChange(item.productId, item.size, item.stock - 1)}
                          disabled={item.stock <= 0 || isSaving}
                          title="Decrease 1 unit"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) =>
                            handleStockChange(item.productId, item.size, Number(e.target.value) || 0)
                          }
                          className="stock-input"
                          disabled={isSaving}
                        />
                        <button
                          type="button"
                          className="adjust-btn plus"
                          onClick={() => handleStockChange(item.productId, item.size, item.stock + 1)}
                          disabled={isSaving}
                          title="Increase 1 unit"
                        >
                          +
                        </button>
                        {isSaved && <span className="saved-indicator">✓ Saved</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .inventory-page {
          max-width: 1200px;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }
        .admin-page-title {
          font-family: var(--font-serif);
          font-weight: 300;
          font-size: 1.8rem;
          color: #fff;
          margin: 0 0 6px 0;
        }
        .admin-page-sub {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.85rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .refresh-btn {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 14px;
          border-radius: 4px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .manage-catalog-link {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.85rem;
          transition: opacity 0.2s;
        }
        .manage-catalog-link:hover {
          opacity: 0.8;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 300;
          color: #fff;
          font-family: var(--font-serif);
          margin-bottom: 4px;
        }
        .stat-value.warning {
          color: #f59e0b;
        }
        .stat-value.danger {
          color: #ef4444;
        }
        .stat-sub {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
        }

        /* Controls */
        .inventory-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        .filter-tab {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 14px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tab:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .filter-tab.active {
          background: rgba(212, 175, 55, 0.12);
          border-color: #d4af37;
          color: #d4af37;
        }
        .filter-tab.warning-tab.active {
          background: rgba(245, 158, 11, 0.12);
          border-color: #f59e0b;
          color: #f59e0b;
        }
        .filter-tab.danger-tab.active {
          background: rgba(239, 68, 68, 0.12);
          border-color: #ef4444;
          color: #ef4444;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 8px 14px;
          min-width: 280px;
        }
        .search-box svg {
          color: rgba(255, 255, 255, 0.4);
        }
        .search-box input {
          background: none;
          border: none;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }

        /* Table */
        .inventory-table-wrap {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow-x: auto;
        }
        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .inventory-table th {
          padding: 14px 20px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.2);
        }
        .inventory-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .inventory-table tr:last-child td {
          border-bottom: none;
        }
        .inventory-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 4px;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .thumb-placeholder {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .col-name strong {
          color: #fff;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .cat-pill {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .size-badge {
          background: rgba(255, 255, 255, 0.06);
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 0.78rem;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.85);
        }

        .col-price {
          color: #d4af37;
          font-weight: 500;
        }

        /* Status pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status-pill .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-in {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
        }
        .status-in .dot {
          background: #22c55e;
        }
        .status-low {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
        }
        .status-low .dot {
          background: #f59e0b;
        }
        .status-out {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
        }
        .status-out .dot {
          background: #ef4444;
        }

        /* Adjuster */
        .adjuster-box {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: flex-end;
        }
        .adjust-btn {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .adjust-btn:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }
        .adjust-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .stock-input {
          width: 58px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          text-align: center;
          padding: 5px;
          border-radius: 3px;
          font-size: 0.85rem;
          font-family: inherit;
        }
        .stock-input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .saved-indicator {
          color: #4ade80;
          font-size: 0.72rem;
          font-weight: 500;
          margin-left: 6px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .empty-state {
          padding: 60px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
