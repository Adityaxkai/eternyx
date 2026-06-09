'use client';

import { useState, useEffect, useCallback } from 'react';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  status: 'New' | 'Read' | 'Resolved';
  date: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  New: '#d4af37',
  Read: '#60a5fa',
  Resolved: '#22c55e',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'New' | 'Read' | 'Resolved'>('All');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: status as any } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    setInquiries(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSelect = (inq: Inquiry) => {
    setSelected(inq);
    // Auto-mark as Read
    if (inq.status === 'New') updateStatus(inq.id, 'Read');
  };

  const filtered = filter === 'All' ? inquiries : inquiries.filter(i => i.status === filter);

  const counts = {
    All: inquiries.length,
    New: inquiries.filter(i => i.status === 'New').length,
    Read: inquiries.filter(i => i.status === 'Read').length,
    Resolved: inquiries.filter(i => i.status === 'Resolved').length,
  };

  return (
    <div className="inquiries-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customer Inquiries</h1>
        {counts.New > 0 && (
          <span className="new-badge">{counts.New} New</span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {(['All', 'New', 'Read', 'Resolved'] as const).map(tab => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
            <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading inquiries…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>No {filter === 'All' ? '' : filter.toLowerCase()} inquiries yet.</p>
        </div>
      ) : (
        <div className={`inquiries-layout ${selected ? 'detail-open' : ''}`}>
          {/* Inbox list */}
          <div className="inbox-list">
            {filtered.map(inq => (
              <div
                key={inq.id}
                className={`inbox-item ${selected?.id === inq.id ? 'selected' : ''} ${inq.status === 'New' ? 'unread' : ''}`}
                onClick={() => handleSelect(inq)}
              >
                <div className="inbox-top">
                  <span className="inbox-name">{inq.name}</span>
                  <span className="inbox-date">{inq.date}</span>
                </div>
                <div className="inbox-type">{inq.inquiryType}</div>
                <div className="inbox-preview">{inq.message.slice(0, 80)}{inq.message.length > 80 ? '…' : ''}</div>
                <span className="inbox-status" style={{ color: STATUS_COLORS[inq.status] }}>● {inq.status}</span>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="detail-panel">
              <div className="detail-header">
                <div>
                  <div className="detail-name">{selected.name}</div>
                  <div className="detail-email">{selected.email}</div>
                </div>
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="detail-meta">
                <span className="meta-chip">{selected.inquiryType}</span>
                <span className="meta-chip">{selected.id}</span>
                <span className="meta-chip">{new Date(selected.created_at).toLocaleDateString()}</span>
              </div>

              <div className="detail-message">{selected.message}</div>

              <div className="detail-section">
                <div className="detail-label">Update Status</div>
                <div className="status-actions">
                  {(['New', 'Read', 'Resolved'] as const).map(s => (
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

              <div className="reply-block">
                <div className="detail-label">Reply via Email</div>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.inquiryType)} Inquiry – Eternyx&body=Dear ${encodeURIComponent(selected.name)},%0A%0A`}
                  className="reply-link"
                >
                  ✉ Compose Reply
                </a>
              </div>

              <button className="delete-btn" onClick={() => deleteInquiry(selected.id)}>Delete Inquiry</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .inquiries-page { max-width: 1200px; }

        .new-badge {
          font-size: 0.72rem;
          background: rgba(212,175,55,0.15);
          color: #d4af37;
          border: 1px solid rgba(212,175,55,0.3);
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

        .inquiries-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .inquiries-layout.detail-open {
          grid-template-columns: 380px 1fr;
        }

        .inbox-list {
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .inbox-item {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .inbox-item:hover { background: rgba(255,255,255,0.02); }
        .inbox-item.selected { background: rgba(212,175,55,0.05); border-left: 2px solid #d4af37; }
        .inbox-item.unread .inbox-name { color: #fff; font-weight: 600; }

        .inbox-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .inbox-name { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
        .inbox-date { font-size: 0.75rem; color: rgba(255,255,255,0.3); }
        .inbox-type { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: #d4af37; margin-bottom: 6px; }
        .inbox-preview { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.5; margin-bottom: 8px; }
        .inbox-status { font-size: 0.7rem; }

        .detail-panel {
          background: #111;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 28px;
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .detail-name { color: #fff; font-size: 1.05rem; margin-bottom: 4px; }
        .detail-email { color: rgba(255,255,255,0.4); font-size: 0.82rem; }

        .detail-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
        }

        .detail-close:hover { color: #fff; }

        .detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .meta-chip {
          font-size: 0.7rem;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.5);
          padding: 3px 8px;
          border-radius: 3px;
        }

        .detail-message {
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          line-height: 1.7;
          background: rgba(255,255,255,0.03);
          padding: 16px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 20px;
          white-space: pre-wrap;
        }

        .detail-section { margin-bottom: 20px; }

        .detail-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
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

        .reply-block { margin-bottom: 20px; }

        .reply-link {
          display: inline-block;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.25);
          color: #d4af37;
          padding: 9px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.82rem;
          transition: all 0.2s;
        }

        .reply-link:hover { background: rgba(212,175,55,0.15); }

        .delete-btn {
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
