'use client';

import { useState } from 'react';

export default function CustomersPage() {
  const [customers] = useState([
    { id: 'C-001', name: 'Emma Watson', email: 'emma@example.com', spent: 450.00, orders: 3, lastActive: '2 days ago' },
    { id: 'C-002', name: 'James Bond', email: '007@mi6.gov.uk', spent: 1290.50, orders: 8, lastActive: 'Today' },
    { id: 'C-003', name: 'Sarah Connor', email: 'sarah@sky.net', spent: 245.50, orders: 1, lastActive: '1 week ago' },
    { id: 'C-004', name: 'Tony Stark', email: 'tony@stark.com', spent: 3450.00, orders: 12, lastActive: '5 hours ago' },
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customers</h1>
        <button className="admin-btn-primary">Export CSV</button>
      </div>

      <div className="admin-filters">
        <input type="text" placeholder="Search customers by name or email..." className="admin-search-input" />
      </div>

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
          {customers.map((customer) => (
            <div key={customer.id} className="table-row">
              <div className="col-name">
                <div className="avatar">{customer.name.charAt(0)}</div>
                <strong>{customer.name}</strong>
              </div>
              <div className="col-email">{customer.email}</div>
              <div className="col-orders">{customer.orders}</div>
              <div className="col-spent">${customer.spent.toFixed(2)}</div>
              <div className="col-active">{customer.lastActive}</div>
              <div className="col-actions">
                <button className="action-link">View Profile</button>
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
        .col-orders { width: 100px; }
        .col-spent { width: 150px; font-family: var(--font-serif); font-size: 1.1rem; }
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
      `}</style>
    </div>
  );
}
