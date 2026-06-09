'use client';

import { useState, useEffect } from 'react';

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
  shipping_address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  discount_code: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    spent: number;
    orders: number;
    lastActive: string;
  } | null;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Drawer States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = () => {
    setLoading(true);
    const url = statusFilter === 'all' 
      ? '/api/admin/orders' 
      : `/api/admin/orders?status=${statusFilter}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort orders by created_at desc or date desc
          const sorted = data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          setOrders(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  };

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        // Keep the local drawer details in sync
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  // Filter orders by search query
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const orderIdMatch = o.id.toLowerCase().includes(query);
    const customerNameMatch = o.customer?.name.toLowerCase().includes(query) || false;
    const customerEmailMatch = o.customer?.email.toLowerCase().includes(query) || false;
    return orderIdMatch || customerNameMatch || customerEmailMatch;
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <button className="admin-btn-primary" onClick={fetchOrders}>Refresh Lists</button>
      </div>

      <div className="admin-filters">
        <input 
          type="text" 
          placeholder="Search orders by ID, customer name or email..." 
          className="admin-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading scent orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <p>No orders matching filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="col-id">Order ID</div>
            <div className="col-customer">Customer</div>
            <div className="col-date">Date</div>
            <div className="col-items">Items</div>
            <div className="col-total">Total</div>
            <div className="col-status">Status</div>
            <div className="col-actions"></div>
          </div>

          <div className="table-body">
            {filteredOrders.map((order) => (
              <div key={order.id} className="table-row">
                <div className="col-id"><strong>{order.id}</strong></div>
                <div className="col-customer">
                  {order.customer ? (
                    <div>
                      <p className="cust-name">{order.customer.name}</p>
                      <p className="cust-email">{order.customer.email}</p>
                    </div>
                  ) : (
                    'Guest User'
                  )}
                </div>
                <div className="col-date">{order.date}</div>
                <div className="col-items">{order.items_count} items</div>
                <div className="col-total">${order.total.toFixed(2)}</div>
                <div className="col-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-link" onClick={() => handleOpenDetails(order)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-over Drawer for Order Details */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        {selectedOrder && (
          <>
            <div className="drawer-header">
              <div>
                <h2>Order Details</h2>
                <p className="drawer-subhead">{selectedOrder.id}</p>
              </div>
              <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>

            <div className="drawer-content">
              {/* Status Update Card */}
              <div className="info-card status-card">
                <label htmlFor="ord-status-sel">Redemption Status</label>
                <div className="status-selector-row">
                  <span className={`status-badge big ${selectedOrder.status.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                  <select 
                    id="ord-status-sel"
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Profile Card */}
              <div className="info-card">
                <h3>Customer Information</h3>
                {selectedOrder.customer ? (
                  <div className="info-grid">
                    <div>
                      <p className="info-label">Name</p>
                      <p className="info-val">{selectedOrder.customer.name}</p>
                    </div>
                    <div>
                      <p className="info-label">Email</p>
                      <p className="info-val">{selectedOrder.customer.email}</p>
                    </div>
                  </div>
                ) : (
                  <p>Guest Profile</p>
                )}
              </div>

              {/* Shipping Address Card */}
              <div className="info-card">
                <h3>Shipping Details</h3>
                <div className="info-address">
                  <p className="address-line">{selectedOrder.shipping_address.street}</p>
                  <p className="address-line">
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.zip}
                  </p>
                  <p className="address-line">{selectedOrder.shipping_address.country}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="info-card">
                <h3>Scent Manifest</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="manifest-item">
                      <div className="manifest-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="manifest-details">
                        <h4>{item.name}</h4>
                        <p className="manifest-meta">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="manifest-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Breakdown */}
              <div className="breakdown-box">
                {selectedOrder.discount_code && (
                  <div className="breakdown-row promo">
                    <span>Applied Coupon:</span>
                    <strong>{selectedOrder.discount_code}</strong>
                  </div>
                )}
                <div className="breakdown-row grand-total">
                  <span>Grand Total Paid:</span>
                  <strong>${selectedOrder.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </>
        )}
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

        .admin-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-search-input, .admin-select {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px 16px;
          border-radius: 4px;
          font-family: inherit;
        }

        .admin-search-input {
          flex: 1;
        }
        
        .admin-search-input:focus, .admin-select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .admin-loading, .admin-empty {
          padding: 80px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
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

        .col-id { width: 130px; color: #d4af37; font-family: monospace; letter-spacing: 0.5px; }
        .col-customer { flex: 1.5; }
        .cust-name { font-weight: 500; color: #fff; }
        .cust-email { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); margin-top: 2px; }
        .col-date { width: 140px; color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; }
        .col-items { width: 100px; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
        .col-total { width: 120px; font-family: var(--font-serif); font-size: 1.05rem; color: #fff; }
        .col-status { width: 120px; }
        .col-actions { width: 110px; text-align: right; }

        .status-badge {
          font-size: 0.65rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.pending { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .status-badge.processing { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-badge.shipped { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
        .status-badge.delivered { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .status-badge.big {
          font-size: 0.8rem;
          padding: 8px 16px;
        }

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

        /* Detail Drawer panel Overlay */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 10000;
        }

        .drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: -460px;
          width: 100%;
          max-width: 460px;
          height: 100%;
          background: #080808;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          z-index: 10001;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 30px;
        }

        .drawer-panel.open {
          transform: translateX(-460px);
        }

        @media (max-width: 460px) {
          .drawer-panel {
            right: -100%;
            max-width: 100%;
          }
          .drawer-panel.open {
            transform: translateX(-100%);
          }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 20px;
          margin-bottom: 25px;
          flex-shrink: 0;
        }

        .drawer-header h2 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #fff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .drawer-subhead {
          font-size: 0.75rem;
          color: #d4af37;
          font-family: monospace;
          margin-top: 4px;
        }

        .drawer-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .drawer-close:hover {
          color: #fff;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-right: 5px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          padding: 20px;
        }

        .info-card h3 {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #d4af37;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          padding-bottom: 8px;
        }

        .status-card {
          border-color: rgba(212, 175, 55, 0.15);
          background: rgba(212, 175, 55, 0.02);
        }

        .status-card label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          display: block;
          margin-bottom: 10px;
        }

        .status-selector-row {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .status-dropdown {
          flex: 1;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.8rem;
        }

        .status-dropdown:focus {
          outline: none;
          border-color: #d4af37;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 2px;
        }

        .info-val {
          font-size: 0.85rem;
          color: #fff;
        }

        .address-line {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 4px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .manifest-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .manifest-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .manifest-img {
          width: 50px;
          height: 60px;
          background: #111;
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .manifest-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .manifest-details {
          flex: 1;
        }

        .manifest-details h4 {
          font-family: var(--font-serif);
          font-size: 0.9rem;
          font-weight: 300;
          color: #fff;
          margin-bottom: 4px;
        }

        .manifest-meta {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .manifest-price {
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
        }

        .breakdown-box {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 10px;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .breakdown-row.promo {
          color: #d4af37;
        }

        .breakdown-row.grand-total {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 10px;
          font-size: 0.95rem;
          color: #fff;
        }

        .breakdown-row.grand-total strong {
          color: #d4af37;
          font-family: var(--font-serif);
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
