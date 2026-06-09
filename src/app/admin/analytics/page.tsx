'use client';

import { useState, useEffect } from 'react';

interface RevenueChartItem {
  date: string;
  value: number;
}

interface TopProductItem {
  name: string;
  count: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  revenueChart: RevenueChartItem[];
  topProducts: TopProductItem[];
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMetrics(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch analytics:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const maxVal = metrics?.revenueChart && metrics.revenueChart.length > 0
    ? Math.max(...metrics.revenueChart.map((d) => d.value), 1)
    : 1;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Analytics</h1>
        <div className="admin-actions">
          <button 
            className="admin-btn-secondary" 
            onClick={fetchMetrics} 
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading analytics data...</div>
      ) : !metrics ? (
        <div className="admin-empty">Failed to load dashboard metrics. Please try again.</div>
      ) : (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-title">Total Revenue</div>
              <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
              <div className="metric-meta">Delivered & active orders</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Orders</div>
              <div className="metric-value">{metrics.totalOrders}</div>
              <div className="metric-meta">Total orders placed</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Average Order Value</div>
              <div className="metric-value">{formatCurrency(metrics.avgOrderValue)}</div>
              <div className="metric-meta">Per delivered order</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Customers</div>
              <div className="metric-value">{metrics.totalCustomers}</div>
              <div className="metric-meta">Registered user profiles</div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card wide">
              <h3>Revenue Over Time (Last 30 Days)</h3>
              <div className="chart-placeholder">
                {metrics.revenueChart?.map((item, idx) => {
                  const heightPercent = (item.value / maxVal) * 100;
                  return (
                    <div 
                      key={idx} 
                      className="bar-container" 
                      title={`${item.date}: ${formatCurrency(item.value)}`}
                    >
                      <div className="bar-tooltip">
                        <span className="tooltip-date">{item.date}</span>
                        <span className="tooltip-value">{formatCurrency(item.value)}</span>
                      </div>
                      <div 
                        className="bar" 
                        style={{ height: `${Math.max(heightPercent, 2)}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              {metrics.revenueChart && metrics.revenueChart.length > 0 && (
                <div className="chart-labels">
                  <span>{metrics.revenueChart[0].date}</span>
                  <span>{metrics.revenueChart[Math.floor(metrics.revenueChart.length / 2)].date}</span>
                  <span>{metrics.revenueChart[metrics.revenueChart.length - 1].date}</span>
                </div>
              )}
            </div>
            
            <div className="chart-card narrow">
              <h3>Top Selling Products</h3>
              <ul className="top-products">
                {metrics.topProducts && metrics.topProducts.length > 0 ? (
                  metrics.topProducts.map((p, idx) => (
                    <li key={idx}>
                      <span>{p.name}</span>
                      <strong>{p.count} units sold</strong>
                    </li>
                  ))
                ) : (
                  <li className="no-products">No products sold yet.</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .admin-actions {
          display: flex;
          gap: 12px;
        }

        .admin-btn-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .admin-btn-secondary:hover:not(:disabled) {
          border-color: #d4af37;
          color: #d4af37;
        }

        .admin-btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 4px;
        }

        .metric-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 12px;
        }

        .metric-value {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: #fff;
          margin-bottom: 6px;
        }

        .metric-meta {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .admin-loading, .admin-empty {
          padding: 80px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .charts-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .charts-container {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 4px;
        }

        .chart-card h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 30px;
          font-weight: 500;
        }

        .chart-placeholder {
          height: 250px;
          display: flex;
          align-items: flex-end;
          gap: 6px;
          padding-top: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .bar-container {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: flex-end;
          position: relative;
          cursor: pointer;
        }

        .bar {
          width: 100%;
          background: linear-gradient(to top, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.8));
          border-radius: 2px 2px 0 0;
          transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bar-container:hover .bar {
          background: linear-gradient(to top, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 1));
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        .bar-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, -8px);
          background: #000;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.7rem;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          z-index: 10;
        }

        .bar-container:hover .bar-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -4px);
        }

        .tooltip-date {
          color: rgba(255, 255, 255, 0.6);
        }

        .tooltip-value {
          color: #d4af37;
          font-weight: 600;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          padding-top: 10px;
        }

        .top-products {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .top-products li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .top-products li:last-child {
          border-bottom: none;
        }

        .top-products span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .top-products strong {
          color: #d4af37;
          font-size: 0.9rem;
        }

        .no-products {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          text-align: center;
          padding: 24px 0;
        }
      `}</style>
    </div>
  );
}
