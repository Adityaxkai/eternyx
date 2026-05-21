'use client';

import { useState } from 'react';

export default function DiscountsPage() {
  const [discounts] = useState([
    { id: 1, code: 'WELCOME10', type: 'Percentage', value: '10%', uses: 145, status: 'Active' },
    { id: 2, code: 'HOLIDAY2026', type: 'Fixed Amount', value: '$50.00', uses: 0, status: 'Scheduled' },
    { id: 3, code: 'VIPFREESHIP', type: 'Free Shipping', value: 'Shipping', uses: 89, status: 'Active' },
    { id: 4, code: 'SUMMER25', type: 'Percentage', value: '25%', uses: 412, status: 'Expired' },
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discounts</h1>
        <button className="admin-btn-primary">+ Create Discount</button>
      </div>

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
              <div className="col-value"><strong>{discount.value}</strong></div>
              <div className="col-uses">{discount.uses}</div>
              <div className="col-status">
                <span className={`status-badge ${discount.status.toLowerCase()}`}>
                  {discount.status}
                </span>
              </div>
              <div className="col-actions">
                <button className="action-link">Edit</button>
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
        .col-value { width: 120px; }
        .col-uses { width: 100px; color: rgba(255, 255, 255, 0.5); }
        .col-status { width: 120px; }
        .col-actions { width: 100px; text-align: right; }

        .code-tag {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 1px;
          color: #fff;
        }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.active { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.scheduled { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-badge.expired { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); }

        .action-link {
          background: none;
          border: none;
          color: #d4af37;
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
