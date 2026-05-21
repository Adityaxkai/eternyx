'use client';

import { useState } from 'react';

export default function JournalPage() {
  const [posts] = useState([
    { id: 1, title: 'The Art of Oud Extraction', author: 'Eternyx Editorial', date: 'Oct 12, 2026', status: 'Published' },
    { id: 2, title: 'Winter Fragrance Wardrobe', author: 'Emma Watson', date: 'Oct 15, 2026', status: 'Draft' },
    { id: 3, title: 'Behind the Scenes: Golden Mirage', author: 'Eternyx Editorial', date: 'Sep 28, 2026', status: 'Published' },
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">The Journal</h1>
        <button className="admin-btn-primary">+ New Article</button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="col-title">Title</div>
          <div className="col-author">Author</div>
          <div className="col-date">Date</div>
          <div className="col-status">Status</div>
          <div className="col-actions"></div>
        </div>

        <div className="table-body">
          {posts.map((post) => (
            <div key={post.id} className="table-row">
              <div className="col-title">
                <strong>{post.title}</strong>
              </div>
              <div className="col-author">{post.author}</div>
              <div className="col-date">{post.date}</div>
              <div className="col-status">
                <span className={`status-badge ${post.status.toLowerCase()}`}>
                  {post.status}
                </span>
              </div>
              <div className="col-actions">
                <button className="action-link edit">Edit</button>
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

        .col-title { flex: 2; font-family: var(--font-serif); font-size: 1.1rem; }
        .col-author { flex: 1; color: rgba(255, 255, 255, 0.6); }
        .col-date { width: 150px; color: rgba(255, 255, 255, 0.5); }
        .col-status { width: 120px; }
        .col-actions { width: 100px; text-align: right; }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.published { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.draft { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); }

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
