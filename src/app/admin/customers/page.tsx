'use client';

import { useState, useEffect } from 'react';

interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items_count: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  spent: number;
  orders: number;
  lastActive: string;
  order_count?: number;
  total_spend?: number;
}

interface DetailedCustomer extends Omit<Customer, 'orders'> {
  orders: CustomerOrder[];
  total_spend: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Drawer states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [detailedCustomer, setDetailedCustomer] = useState<DetailedCustomer | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch customers:', err);
        setLoading(false);
      });
  };

  const handleOpenProfile = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setDrawerLoading(true);
    setIsDrawerOpen(true);
    
    fetch(`/api/admin/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetailedCustomer(data);
        setDrawerLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch customer profile details:', err);
        setDrawerLoading(false);
      });
  };

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customers</h1>
        <button className="admin-btn-primary" onClick={fetchCustomers}>Refresh List</button>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search customers by name or email..."
          className="admin-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Loading customer profiles...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="admin-empty">
          <p>No customer profiles found.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="col-name">Customer</div>
            <div className="col-email">Email</div>
            <div className="col-orders">Orders</div>
            <div className="col-spent">Total Spent</div>
            <div className="col-active">Last Active</div>
            <div className="col-actions"></div>
          </div>

          <div className="table-body">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="table-row">
                <div className="col-name">
                  <div className="avatar">{customer.name.charAt(0).toUpperCase()}</div>
                  <strong>{customer.name}</strong>
                </div>
                <div className="col-email">{customer.email}</div>
                <div className="col-orders">
                  {customer.order_count !== undefined ? customer.order_count : customer.orders} orders
                </div>
                <div className="col-spent">
                  ${(customer.total_spend !== undefined ? customer.total_spend : customer.spent).toFixed(2)}
                </div>
                <div className="col-active">{customer.lastActive}</div>
                <div className="col-actions">
                  <button className="action-link" onClick={() => handleOpenProfile(customer.id)}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-over Profile Details Drawer */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Customer Profile</h2>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>&times;</button>
        </div>

        {drawerLoading ? (
          <div className="drawer-loading">Loading customer analytics...</div>
        ) : detailedCustomer ? (
          <div className="drawer-content">
            {/* Customer Summary Card */}
            <div className="info-card profile-card">
              <div className="profile-summary-header">
                <div className="large-avatar">{detailedCustomer.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3>{detailedCustomer.name}</h3>
                  <p className="profile-email">{detailedCustomer.email}</p>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="stat-box">
                  <p className="stat-label">Total Spent</p>
                  <p className="stat-value">${detailedCustomer.total_spend.toFixed(2)}</p>
                </div>
                <div className="stat-box">
                  <p className="stat-label">Orders Placed</p>
                  <p className="stat-value">{detailedCustomer.orders.length}</p>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="info-card">
              <h3>Purchase History</h3>
              {detailedCustomer.orders.length === 0 ? (
                <p className="no-history">No orders recorded for this customer.</p>
              ) : (
                <div className="history-list">
                  {detailedCustomer.orders.map((order) => (
                    <div key={order.id} className="history-row">
                      <div>
                        <p className="history-ref">Order Reference: <strong>{order.id}</strong></p>
                        <p className="history-meta">{order.date} | {order.items_count} items</p>
                      </div>
                      <div className="history-pricing">
                        <p className="history-amount">${order.total.toFixed(2)}</p>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="drawer-error">Profile failed to load.</div>
        )}
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

        .admin-filters {
          display: flex;
          margin-bottom: 24px;
        }

        .admin-search-input {
          flex: 1;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px 16px;
          border-radius: 4px;
          font-family: inherit;
        }

        .admin-search-input:focus {
          outline: none;
          border-color: #d4af37;
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

        .col-name { 
          flex: 1.5; 
          display: flex; 
          align-items: center; 
          gap: 12px;
        }
        
        .avatar {
          width: 32px;
          height: 32px;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .col-email { flex: 1.5; color: rgba(255, 255, 255, 0.6); }
        .col-orders { width: 120px; }
        .col-spent { width: 150px; font-family: var(--font-serif); font-size: 1.1rem; color: #fff; }
        .col-active { width: 150px; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
        .col-actions { width: 120px; text-align: right; }

        .action-link {
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 0.8rem;
        }
        
        .action-link:hover {
          color: #fff;
        }

        /* Slide-over Drawer panel Overlay */
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
          margin-bottom: 25px;
          flex-shrink: 0;
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

        .drawer-loading, .drawer-error {
          padding: 50px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          padding: 20px;
        }

        .info-card h3 {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #d4af37;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          padding-bottom: 8px;
        }

        .profile-card {
          border-color: rgba(212, 175, 55, 0.15);
          background: rgba(212, 175, 55, 0.01);
        }

        .profile-summary-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .large-avatar {
          width: 48px;
          height: 48px;
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.25rem;
          border: 1.5px solid rgba(212, 175, 55, 0.3);
        }

        .profile-email {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 15px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.01);
          padding: 10px 15px;
          border-radius: 4px;
        }

        .stat-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.15rem;
          font-weight: 500;
          color: #fff;
          font-family: var(--font-serif);
        }

        .no-history {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          text-align: center;
          padding: 20px 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .history-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .history-row:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .history-ref {
          font-size: 0.8rem;
          color: #fff;
        }

        .history-meta {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 4px;
        }

        .history-pricing {
          text-align: right;
        }

        .history-amount {
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
          font-family: var(--font-serif);
          margin-bottom: 4px;
        }

        .status-badge {
          font-size: 0.6rem;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.pending { background: rgba(234, 179, 8, 0.12); color: #eab308; }
        .status-badge.processing { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .status-badge.shipped { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
        .status-badge.delivered { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
      `}</style>
    </div>
  );
}
