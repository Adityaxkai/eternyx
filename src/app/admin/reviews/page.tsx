'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  product: string;
  customer: string;
  rating: number;
  date: string;
  comment: string;
  status: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reviews:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      fetchReviews();
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const filteredReviews = reviews.filter((r) => {
    const matchProduct = selectedProduct === 'All Products' || r.product === selectedProduct;
    const matchStatus = selectedStatus === 'All Statuses' || r.status === selectedStatus;
    return matchProduct && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
        <button className="admin-btn-primary" onClick={fetchReviews} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="admin-filters">
        <select 
          className="admin-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option>All Products</option>
          <option>Oud Symphony</option>
          <option>Midnight Iris</option>
          <option>Golden Mirage</option>
          <option>Vetiver Ghost</option>
          <option>Eternyx Noir</option>
        </select>
        <select 
          className="admin-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Published</option>
          <option>Pending</option>
          <option>Hidden</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-empty">No reviews found matching the filters.</div>
      ) : (
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
            {filteredReviews.map((review) => (
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
                  {review.status !== 'Published' && (
                    <button 
                      className="action-btn approve" 
                      onClick={() => handleUpdateStatus(review.id, 'Published')}
                    >
                      Approve
                    </button>
                  )}
                  {review.status !== 'Hidden' && (
                    <button 
                      className="action-btn hide" 
                      onClick={() => handleUpdateStatus(review.id, 'Hidden')}
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

        .admin-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-loading, .admin-empty {
          padding: 80px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

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
        .col-actions { width: 180px; display: flex; gap: 8px; justify-content: flex-end; }

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
          transition: all 0.2s;
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
