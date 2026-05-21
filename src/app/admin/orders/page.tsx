'use client';

import { useState } from 'react';

export default function OrdersPage() {
  const [orders] = useState([
    { id: 'ORD-8910', customer: 'Emma Watson', date: 'Oct 14, 2026', total: 185.00, status: 'Processing', items: 2 },
    { id: 'ORD-8909', customer: 'James Bond', date: 'Oct 14, 2026', total: 95.00, status: 'Shipped', items: 1 },
    { id: 'ORD-8908', customer: 'Sarah Connor', date: 'Oct 13, 2026', total: 245.50, status: 'Delivered', items: 3 },
    { id: 'ORD-8907', customer: 'Tony Stark', date: 'Oct 12, 2026', total: 850.00, status: 'Pending', items: 5 },
    { id: 'ORD-8906', customer: 'Bruce Wayne', date: 'Oct 10, 2026', total: 120.00, status: 'Cancelled', items: 1 },
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <button className="admin-btn-primary">Export CSV</button>
      </div>

      <div className="admin-filters">
        <input type="text" placeholder="Search orders by ID or customer..." className="admin-search-input" />
        <select className="admin-select">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="col-id">Order ID</div>
          <div className="col-customer">Customer</div>
          <div className="col-date">Date</div>
          <div className="col-items">Items</div>
          <div className="col-total">Total</div>
          <div className="col-status">Status</div>
          <div className="col-actions"></div>
        </div>

        <div className="table-body">
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="col-id"><strong>{order.id}</strong></div>
              <div className="col-customer">{order.customer}</div>
              <div className="col-date">{order.date}</div>
              <div className="col-items">{order.items} items</div>
              <div className="col-total">${order.total.toFixed(2)}</div>
              <div className="col-status">
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="col-actions">
                <button className="action-link">View Details</button>
              </div>
            </div>
          ))}
        </div>
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
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-search-input, .admin-select {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 10px 16px;
          border-radius: 4px;
          font-family: inherit;
        }

        .admin-search-input {
          flex: 1;
        }
        
        .admin-search-input:focus, .admin-select:focus {
          outline: none;
          border-color: #d4af37;
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

        .col-id { width: 120px; color: #d4af37; }
        .col-customer { flex: 1; font-weight: 500; }
        .col-date { width: 150px; color: rgba(255, 255, 255, 0.6); }
        .col-items { width: 100px; color: rgba(255, 255, 255, 0.5); }
        .col-total { width: 120px; font-family: var(--font-serif); font-size: 1.1rem; }
        .col-status { width: 120px; }
        .col-actions { width: 100px; text-align: right; }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.processing { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-badge.shipped { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
        .status-badge.delivered { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.pending { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; }

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
      `}</style>
    </div>
  );
}
