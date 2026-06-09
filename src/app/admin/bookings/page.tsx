'use client';

import { useState, useEffect, useCallback } from 'react';

type Booking = {
  id: string;
  name: string;
  email: string;
  location: string;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Declined';
  date: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  Pending: '#d4af37',
  Confirmed: '#22c55e',
  Declined: '#ef4444',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Declined'>('All');
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error('Failed to load bookings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    All: bookings.length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Declined: bookings.filter(b => b.status === 'Declined').length,
  };

  return (
    <div className="bookings-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">VIP Bookings</h1>
        <span className="total-badge">{bookings.length} Total</span>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {(['All', 'Pending', 'Confirmed', 'Declined'] as const).map(tab => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab} <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No {filter === 'All' ? '' : filter.toLowerCase()} bookings yet.</p>
        </div>
      ) : (
        <div className={`bookings-layout ${selected ? 'detail-open' : ''}`}>
          {/* Table */}
          <div className="table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr
                    key={b.id}
                    className={selected?.id === b.id ? 'selected' : ''}
                    onClick={() => setSelected(b)}
                  >
                    <td className="mono">{b.id}</td>
                    <td>
                      <div className="guest-name">{b.name}</div>
                      <div className="guest-email">{b.email}</div>
                    </td>
                    <td>{b.location}</td>
                    <td>{b.date}</td>
                    <td>
                      <span className="status-badge" style={{ color: STATUS_COLORS[b.status], borderColor: STATUS_COLORS[b.status] + '40' }}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button className="row-delete" onClick={(e) => { e.stopPropagation(); deleteBooking(b.id); }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="detail-panel">
              <div className="detail-header">
                <span className="detail-id">{selected.id}</span>
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="detail-section">
                <div className="detail-label">Guest</div>
                <div className="detail-value">{selected.name}</div>
                <div className="detail-sub">{selected.email}</div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Location</div>
                <div className="detail-value">{selected.location}</div>
              </div>

              {selected.message && (
                <div className="detail-section">
                  <div className="detail-label">Message</div>
                  <div className="detail-message">{selected.message}</div>
                </div>
              )}

              <div className="detail-section">
                <div className="detail-label">Submitted</div>
                <div className="detail-value">{new Date(selected.created_at).toLocaleString()}</div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Status</div>
                <div className="status-actions">
                  {(['Pending', 'Confirmed', 'Declined'] as const).map(s => (
                    <button
                      key={s}
                      className={`status-btn ${selected.status === s ? 'active' : ''}`}
                      style={selected.status === s ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
                      onClick={() => updateStatus(selected.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="delete-btn" onClick={() => deleteBooking(selected.id)}>Delete Booking</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .bookings-page { max-width: 1200px; }

        .total-badge {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
          padding: 4px 10px;
          border-radius: 20px;
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
        }

        .filter-tab {
          background: none;
          border: 1px solid transparent;
          color: rgba(255,255,255,0.5);
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-tab:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .filter-tab.active { color: #d4af37; border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.06); }

        .tab-count {
          font-size: 0.7rem;
          background: rgba(255,255,255,0.1);
          padding: 1px 6px;
          border-radius: 10px;
        }

        .admin-loading, .empty-state {
          padding: 80px 0;
          text-align: center;
          color: rgba(255,255,255,0.4);
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
        }

        .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }

        .bookings-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .bookings-layout.detail-open {
          grid-template-columns: 1fr 360px;
        }

        .table-wrap {
          overflow-x: auto;
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .bookings-table thead th {
          padding: 14px 16px;
          text-align: left;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .bookings-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: background 0.15s;
        }

        .bookings-table tbody tr:hover { background: rgba(255,255,255,0.02); }
        .bookings-table tbody tr.selected { background: rgba(212,175,55,0.05); }

        .bookings-table td {
          padding: 14px 16px;
          color: rgba(255,255,255,0.8);
          vertical-align: middle;
        }

        .mono { font-family: monospace; font-size: 0.75rem; color: rgba(255,255,255,0.4); }

        .guest-name { font-weight: 500; margin-bottom: 2px; }
        .guest-email { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

        .status-badge {
          display: inline-block;
          font-size: 0.7rem;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .row-delete {
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          cursor: pointer;
          font-size: 0.85rem;
          transition: color 0.2s;
          padding: 4px 8px;
        }

        .row-delete:hover { color: #ef4444; }

        .detail-panel {
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 24px;
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .detail-id {
          font-family: monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        .detail-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
        }

        .detail-close:hover { color: #fff; }

        .detail-section { margin-bottom: 20px; }

        .detail-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 6px;
        }

        .detail-value { color: #fff; font-size: 0.95rem; }
        .detail-sub { color: rgba(255,255,255,0.4); font-size: 0.82rem; margin-top: 2px; }

        .detail-message {
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          line-height: 1.6;
          background: rgba(255,255,255,0.03);
          padding: 12px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .status-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .status-btn:hover { background: rgba(255,255,255,0.05); }
        .status-btn.active { font-weight: 600; background: rgba(255,255,255,0.04); }

        .delete-btn {
          margin-top: 12px;
          background: none;
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.82rem;
          width: 100%;
          transition: all 0.2s;
        }

        .delete-btn:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; }
      `}</style>
    </div>
  );
}
