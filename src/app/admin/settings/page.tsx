'use client';

export default function SettingsPage() {
  return (
    <div className="settings-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Store Settings</h1>
        <button className="admin-btn-primary">Save Changes</button>
      </div>

      <div className="settings-grid">
        {/* Navigation / Sections sidebar */}
        <div className="settings-nav">
          <button className="settings-nav-btn active">General</button>
          <button className="settings-nav-btn">Branding</button>
          <button className="settings-nav-btn">Shipping</button>
          <button className="settings-nav-btn">Taxes</button>
          <button className="settings-nav-btn">Notifications</button>
        </div>

        {/* Content area */}
        <div className="settings-content">
          <section className="settings-card">
            <h2>Store Details</h2>
            <p className="section-desc">Basic information about your store that appears on your site.</p>
            
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" defaultValue="Eternyx Luxury Fragrances" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" defaultValue="support@eternyx.com" />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
          </section>

          <section className="settings-card">
            <h2>Store Currency</h2>
            <p className="section-desc">The currency your products are sold in.</p>
            
            <div className="form-group">
              <label>Primary Currency</label>
              <select>
                <option>USD ($) - United States Dollar</option>
                <option>EUR (€) - Euro</option>
                <option>GBP (£) - British Pound</option>
              </select>
            </div>
          </section>

          <section className="settings-card danger-zone">
            <h2>Danger Zone</h2>
            <div className="danger-content">
              <div>
                <strong>Maintenance Mode</strong>
                <p>Put your store offline temporarily for updates.</p>
              </div>
              <button className="btn-outline">Enable</button>
            </div>
          </section>
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

        .settings-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 40px;
          align-items: start;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-nav-btn {
          background: none;
          border: none;
          text-align: left;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .settings-nav-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .settings-nav-btn.active {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          font-weight: 500;
        }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 800px;
        }

        .settings-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 32px;
          border-radius: 4px;
        }

        h2 {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 400;
        }

        .section-desc {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        input, select {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          color: #fff;
          font-family: inherit;
          border-radius: 4px;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .danger-zone {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .danger-zone h2 {
          color: #ef4444;
        }

        .danger-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .danger-content strong {
          display: block;
          margin-bottom: 4px;
        }

        .danger-content p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin: 0;
        }

        .btn-outline {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
