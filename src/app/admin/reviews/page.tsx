'use client';

import { useState } from 'react';

export default function ReviewsPage() {
  const [reviews] = useState([
    { id: 'REV-101', product: 'Oud Symphony', customer: 'Emma W.', rating: 5, date: 'Oct 14, 2026', comment: 'Absolutely mesmerizing. The scent lasts all day and feels incredibly luxurious.', status: 'Published' },
    { id: 'REV-102', product: 'Midnight Iris', customer: 'James B.', rating: 4, date: 'Oct 12, 2026', comment: 'Great fragrance, very subtle but distinct. Packaging was a bit dented on arrival though.', status: 'Pending' },
    { id: 'REV-103', product: 'Golden Mirage', customer: 'Sarah C.', rating: 5, date: 'Oct 10, 2026', comment: 'My new signature scent. Worth every penny.', status: 'Published' },
    { id: 'REV-104', product: 'Oud Symphony', customer: 'Tony S.', rating: 2, date: 'Oct 08, 2026', comment: 'Too strong for my liking. Gives me a headache.', status: 'Hidden' },
  ]);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
      </div>

      <div className="admin-filters">
        <select className="admin-select">
          <option>All Products</option>
          <option>Oud Symphony</option>
          <option>Midnight Iris</option>
          <option>Golden Mirage</option>
        </select>
        <select className="admin-select">
          <option>All Statuses</option>
          <option>Published</option>
          <option>Pending</option>
          <option>Hidden</option>
        </select>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="col-product">Product</div>
          <div className="col-rating">Rating</div>
          <div className="col-review">Review</div>
          <div className="col-date">Date</div>
          <div className="col-status">Status</div>
          <div className="col-actions"></div>
        </div>

        <div className="table-body">
          {reviews.map((review) => (
            <div key={review.id} className="table-row">
              <div className="col-product"><strong>{review.product}</strong></div>
              <div className="col-rating">
                <span className="stars">{renderStars(review.rating)}</span>
              </div>
              <div className="col-review">
                <div className="review-customer">{review.customer}</div>
                <div className="review-comment">"{review.comment}"</div>
              </div>
              <div className="col-date">{review.date}</div>
              <div className="col-status">
                <span className={`status-badge ${review.status.toLowerCase()}`}>
                  {review.status}
                </span>
              </div>
              <div className="col-actions">
                <button className="action-btn approve">Approve</button>
                <button className="action-btn hide">Hide</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-select {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 10px 16px;
          border-radius: 4px;
          font-family: inherit;
        }

        .admin-select:focus {
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
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: #151515;
        }

        .col-product { width: 150px; }
        .col-rating { width: 100px; }
        .col-review { flex: 1; padding-right: 20px; }
        .col-date { width: 120px; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
        .col-status { width: 100px; }
        .col-actions { width: 140px; display: flex; gap: 8px; justify-content: flex-end; }

        .stars {
          color: #d4af37;
          letter-spacing: 2px;
        }

        .review-customer {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }

        .review-comment {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          font-style: italic;
        }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.published { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.pending { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .status-badge.hidden { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); }

        .action-btn {
          background: none;
          border: 1px solid;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .action-btn.approve {
          border-color: rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }
        
        .action-btn.approve:hover {
          background: rgba(34, 197, 94, 0.1);
        }

        .action-btn.hide {
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
        }
        
        .action-btn.hide:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
