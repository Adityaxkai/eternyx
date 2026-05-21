'use client';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Analytics</h1>
        <select className="admin-select-header">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Sales</div>
          <div className="metric-value">$42,500.00</div>
          <div className="metric-trend up">+15% from last period</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Orders</div>
          <div className="metric-value">124</div>
          <div className="metric-trend up">+8% from last period</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Conversion Rate</div>
          <div className="metric-value">3.2%</div>
          <div className="metric-trend down">-0.4% from last period</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card wide">
          <h3>Revenue Over Time</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '45%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '75%'}}></div>
            <div className="bar" style={{height: '90%'}}></div>
            <div className="bar" style={{height: '100%'}}></div>
          </div>
        </div>
        
        <div className="chart-card narrow">
          <h3>Top Selling Products</h3>
          <ul className="top-products">
            <li>
              <span>Oud Symphony</span>
              <strong>$18,400</strong>
            </li>
            <li>
              <span>Midnight Iris</span>
              <strong>$12,100</strong>
            </li>
            <li>
              <span>Golden Mirage</span>
              <strong>$8,500</strong>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .admin-select-header {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
          margin-bottom: 12px;
        }

        .metric-trend {
          font-size: 0.8rem;
        }
        
        .metric-trend.up { color: #4ade80; }
        .metric-trend.down { color: #f87171; }

        .charts-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
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
          gap: 20px;
          padding-top: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bar {
          flex: 1;
          background: linear-gradient(to top, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.8));
          border-radius: 4px 4px 0 0;
          transition: height 1s ease;
        }

        .top-products {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .top-products li {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .top-products li:last-child {
          border-bottom: none;
        }

        .top-products span {
          color: rgba(255, 255, 255, 0.8);
        }

        .top-products strong {
          color: #d4af37;
        }
      `}</style>
    </div>
  );
}
