'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customer_id: string;
  date: string;
  total: number;
  status: string;
  items_count: number;
  items: OrderItem[];
  created_at: string;
  customer: {
    name: string;
    email: string;
  } | null;
}

interface StockAlert {
  name: string;
  size: string;
  stock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch store statistics from analytics API
        const statsRes = await fetch('/api/admin/analytics');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            revenue: statsData.totalRevenue || 0,
            orders: statsData.totalOrders || 0,
            products: statsData.totalProducts || 0,
            customers: statsData.totalCustomers || 0
          });
        }

        // 2. Fetch orders and slice recent 5
        const ordersRes = await fetch('/api/admin/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (Array.isArray(ordersData)) {
            const sorted = ordersData
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 5);
            setRecentOrders(sorted);
          }
        }

        // 3. Fetch products and filter stock levels <= 5
        const productsRes = await fetch('/api/admin/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (Array.isArray(productsData)) {
            const alerts: StockAlert[] = [];
            productsData.forEach((p: any) => {
              if (Array.isArray(p.sizes)) {
                p.sizes.forEach((s: any) => {
                  if (s.stock <= 5) {
                    alerts.push({
                      name: p.name,
                      size: s.size,
                      stock: s.stock
                    });
                  }
                });
              }
            });
            setLowStockAlerts(alerts);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
      </div>

      {loading ? (
        <div className="admin-loading">Assembling dashboard metrics...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">${stats.revenue.toLocaleString()}</div>
              <div className="stat-trend positive">Live updates active</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{stats.orders}</div>
              <div className="stat-trend positive">Delivered & pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Products</div>
              <div className="stat-value">{stats.products}</div>
              <div className="stat-trend neutral">Catalog range</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Customers</div>
              <div className="stat-value">{stats.customers}</div>
              <div className="stat-trend positive">User profiles</div>
            </div>
          </div>

          <div className="dashboard-widgets">
            {/* Recent Orders Table */}
            <div className="widget">
              <div className="widget-header">
                <h3>Recent Orders</h3>
                <Link href="/admin/orders" className="widget-action">View All</Link>
              </div>
              <div className="widget-content">
                {recentOrders.length === 0 ? (
                  <div className="no-data-msg">No transactions registered yet.</div>
                ) : (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <Link href="/admin/orders" className="order-id-link">
                              {order.id}
                            </Link>
                          </td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.customer?.name || 'Guest'}</span>
                              <span className="customer-email">{order.customer?.email || ''}</span>
                            </div>
                          </td>
                          <td>{order.date}</td>
                          <td className="order-total">${order.total.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            {/* Inventory Alerts */}
            <div className="widget">
              <div className="widget-header">
                <h3>Low Stock Alerts</h3>
              </div>
              <div className="widget-content">
                <div className="stock-alerts-list">
                  {lowStockAlerts.length === 0 ? (
                    <div className="no-alerts">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p>All catalog stocks healthy.</p>
                    </div>
                  ) : (
                    <div className="alerts-container">
                      {lowStockAlerts.map((alert, idx) => (
                        <div key={idx} className="alert-item">
                          <div className="alert-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          </div>
                          <div className="alert-details">
                            <span className="alert-product">{alert.name}</span>
                            <span className="alert-size">Size: {alert.size}</span>
                          </div>
                          <div className="alert-stock">
                            <span className="stock-count">{alert.stock} left</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .admin-loading {
          text-align: center;
          padding: 50px;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          font-size: 0.9rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .stat-trend.positive {
          color: rgba(212, 175, 55, 0.7);
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
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .widget-action {
          color: #d4af37;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }

        .widget-action:hover {
          color: #fff;
        }

        .widget-content {
          padding: 20px 24px;
          flex: 1;
        }

        .no-data-msg {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
          font-size: 0.85rem;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .orders-table th {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-weight: 500;
        }

        .orders-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.85);
          vertical-align: middle;
        }

        .order-id-link {
          color: #d4af37;
          text-decoration: none;
          font-family: monospace;
          letter-spacing: 0.5px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .order-id-link:hover {
          color: #fff;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          color: #fff;
          font-weight: 500;
        }

        .customer-email {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .order-total {
          font-family: var(--font-serif);
          color: #fff;
        }

        .status-badge {
          display: inline-block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 6px;
          border-radius: 2px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .status-badge.processing {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .status-badge.delivered {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .stock-alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }

        .no-alerts {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 180px;
          gap: 12px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-style: italic;
        }

        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
        }

        .alert-item {
          display: flex;
          align-items: center;
          background: rgba(239, 68, 68, 0.02);
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: 4px;
          padding: 10px 14px;
          gap: 10px;
        }

        .alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .alert-product {
          color: #fff;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .alert-size {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .alert-stock {
          font-size: 0.7rem;
          color: #ef4444;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

