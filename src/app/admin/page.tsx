'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });

  // Mock fetching dashboard stats for now.
  // In Phase 3, this will fetch from the real APIs.
  useEffect(() => {
    // Simulated load
    setTimeout(() => {
      setStats({
        revenue: 12450,
        orders: 48,
        products: 2,
        customers: 34
      });
    }, 500);
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${stats.revenue.toLocaleString()}</div>
          <div className="stat-trend positive">↑ 12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-trend positive">↑ 8% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Products</div>
          <div className="stat-value">{stats.products}</div>
          <div className="stat-trend neutral">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{stats.customers}</div>
          <div className="stat-trend positive">↑ 4 this week</div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <div className="widget-header">
            <h3>Recent Orders</h3>
            <button className="widget-action">View All</button>
          </div>
          <div className="widget-content placeholder">
            <p>Order table will appear here in Phase 3.</p>
          </div>
        </div>
        
        <div className="widget">
          <div className="widget-header">
            <h3>Low Stock Alerts</h3>
          </div>
          <div className="widget-content placeholder">
            <p>No products are currently low on stock.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 2rem;
          font-family: var(--font-serif);
          color: #fff;
          margin-bottom: 12px;
        }

        .stat-trend {
          font-size: 0.8rem;
        }

        .stat-trend.positive {
          color: #22c55e;
        }
        
        .stat-trend.neutral {
          color: rgba(255, 255, 255, 0.3);
        }

        .dashboard-widgets {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-widgets {
            grid-template-columns: 1fr;
          }
        }

        .widget {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .widget-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .widget-header h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .widget-action {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .widget-content {
          padding: 24px;
          flex: 1;
        }

        .widget-content.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.9rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
