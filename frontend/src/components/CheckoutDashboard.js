import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const CheckoutDashboard = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'verifying' | 'success' | 'failed'
  const [verifiedOrder, setVerifiedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await api.get('/orders');
        if (result.success) {
          const mappedOrders = result.data.map(order => ({
            id: order._id,
            status: order.status.toLowerCase(),
            date: new Date(order.created_at).toLocaleDateString(),
            total: order.pricing.total,
            items: order.items.length
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const orderId = queryParams.get('order_id');

    if (orderId) {
      const verifyPayment = async () => {
        setVerificationStatus('verifying');
        try {
          const response = await api.post('/payments/verify', { orderId });
          if (response.success && response.data.payment_info.status === 'PAID') {
            setVerificationStatus('success');
            setVerifiedOrder(response.data);
            clearCart();
            // Fetch updated orders list
            fetchOrders();
          } else {
            setVerificationStatus('failed');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setVerificationStatus('failed');
        } finally {
          // Clean up query parameters from the browser URL address bar
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      verifyPayment();
    } else {
      fetchOrders();
    }
  }, []);

  const handleViewCart = () => navigate('/cart');
  const handleViewPayment = () => navigate('/payment');
  const handleTrackOrder = (orderId) => navigate(`/order/${orderId}`);
  const handleViewOrders = () => navigate('/account');
  const handleBulkOrder = () => navigate('/bulk-order');

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="checkout-dashboard">
      <div className="dashboard-header">
        <h1>Checkout Center</h1>
        <p>Complete your purchase and manage orders</p>
      </div>

      <div className="dashboard-content">
        {/* Payment Verification Status */}
        {verificationStatus && (
          <div className={`section payment-status-card ${verificationStatus}`} style={{ gridColumn: '1 / -1' }}>
            <div className="status-content" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {verificationStatus === 'verifying' && (
                <>
                  <i className="fas fa-spinner fa-spin status-icon loading-icon" style={{ fontSize: '2.5rem', color: '#ffc107' }}></i>
                  <div className="status-info">
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Verifying Payment</h3>
                    <p style={{ margin: 0, color: '#666' }}>We are checking the payment status with Cashfree. Please do not close or refresh this page.</p>
                  </div>
                </>
              )}
              {verificationStatus === 'success' && (
                <>
                  <i className="fas fa-check-circle status-icon success-icon" style={{ fontSize: '2.5rem', color: '#28a745' }}></i>
                  <div className="status-info" style={{ width: '100%' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#28a745' }}>Payment Successful!</h3>
                    <p style={{ margin: 0, color: '#666' }}>Your order has been placed successfully. Thank you for your purchase!</p>
                    {verifiedOrder && (
                      <div className="order-summary-mini" style={{ margin: '1rem 0', padding: '1rem', background: '#f9f9f9', borderRadius: '0.75rem', border: '1px solid #ddd', maxWidth: '400px' }}>
                        <div style={{ marginBottom: '0.25rem' }}><strong>Order ID:</strong> #{verifiedOrder._id.slice(-8).toUpperCase()}</div>
                        <div><strong>Total Amount:</strong> ₹{verifiedOrder.pricing?.total}</div>
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={() => handleTrackOrder(verifiedOrder?._id || '')}>
                      <i className="fas fa-shipping-fast" style={{ marginRight: '8px' }}></i> Track Order
                    </button>
                  </div>
                </>
              )}
              {verificationStatus === 'failed' && (
                <>
                  <i className="fas fa-exclamation-circle status-icon failed-icon" style={{ fontSize: '2.5rem', color: '#dc3545' }}></i>
                  <div className="status-info">
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#dc3545' }}>Payment Verification Failed</h3>
                    <p style={{ margin: 0, color: '#666' }}>We could not verify your payment. If money was debited from your account, it will be refunded. You can try to pay again from your Account Dashboard.</p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => setVerificationStatus(null)}>
                        Dismiss
                      </button>
                      <button className="btn btn-primary" onClick={handleViewOrders}>
                        Go to My Orders
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* Cart Summary */}
        <div className="section cart-summary">
          <h2 className="section-title">Your Cart</h2>
          <div className="cart-info">
            <div className="cart-items">
              <i className="fas fa-shopping-bag"></i>
              <span>{items.length} items</span>
            </div>
            <div className="cart-total">
              <span className="label">Total</span>
              <span className="amount">₹{cartTotal}</span>
            </div>
          </div>
          <div className="cart-actions">
            <button className="btn btn-secondary" onClick={handleViewCart}>
              View Cart
            </button>
            <button className="btn btn-primary" onClick={handleViewPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={handleViewOrders}>
              <i className="fas fa-list-ul"></i>
              <span>My Orders</span>
            </button>
            <button className="action-card" onClick={handleBulkOrder}>
              <i className="fas fa-users"></i>
              <span>Bulk Order</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="section recent-orders">
          <h2 className="section-title">Recent Orders</h2>
          <div className="orders-list">
            {isLoadingOrders ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <span className={`status ${order.status}`}>{order.status.toUpperCase()}</span>
                  </div>
                  <div className="order-details">
                    <span className="date">{order.date}</span>
                    <span className="total">₹{order.total}</span>
                  </div>
                  <button className="track-btn" onClick={() => handleTrackOrder(order.id)}>
                    Track Order
                  </button>
                </div>
              ))
            ) : (
              <div className="no-orders">No orders yet</div>
            )}
          </div>
          {orders.length > 3 && (
            <button className="view-all" onClick={handleViewOrders}>View All Orders</button>
          )}
        </div>

        {/* Support */}
        <div className="section support">
          <h2 className="section-title">Need Help?</h2>
          <div className="support-options">
            <a href="tel:+9118001234567" className="support-link">
              <i className="fas fa-phone"></i>
              <span>Call Support</span>
            </a>
            <a href="mailto:support@navodayatrendz.com" className="support-link">
              <i className="fas fa-envelope"></i>
              <span>Email Us</span>
            </a>
            <a href="https://wa.me/919284490206" target="_blank" rel="noopener noreferrer" className="support-link whatsapp">
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-dashboard {
          padding: 2rem 1rem;
          min-height: 100vh;
          background: #f8f8f8;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          color: #000;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #666;
          margin: 0;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .section {
          background: #fff;
          border: 2px solid #000;
          border-radius: 1.5rem;
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          color: #000;
          margin-bottom: 1rem;
          margin-top: 0;
        }

        /* Cart Summary */
        .cart-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 1rem;
          margin-bottom: 1rem;
        }

        .cart-items {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #000;
          font-weight: 600;
        }

        .cart-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .cart-total .label {
          font-size: 0.875rem;
          color: #666;
        }

        .cart-total .amount {
          font-size: 1.5rem;
          font-weight: bold;
          color: #000;
        }

        .cart-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .btn {
          padding: 0.875rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-primary {
          background: #000;
          color: #fff;
        }

        .btn-primary:hover {
          background: #333;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #000;
          border: 1px solid #000;
        }

        .btn-secondary:hover {
          background: #e5e5e5;
        }

        /* Quick Actions */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-card {
          background: #fff;
          border: 1px solid #000;
          border-radius: 1rem;
          padding: 1.5rem 1rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        .action-card:hover {
          background: #000;
          color: #fff;
        }

        .action-card i {
          font-size: 1.75rem;
        }

        /* Recent Orders */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-card {
          background: #f5f5f5;
          border-radius: 1rem;
          padding: 1rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .order-header h3 {
          font-size: 1rem;
          color: #000;
          margin: 0;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: bold;
          background: #666;
          color: #fff;
        }

        .status.delivered, .status.shipped {
          background: #000;
        }

        .order-details {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .track-btn {
          width: 100%;
          padding: 0.625rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .track-btn:hover {
          background: #333;
        }

        .view-all {
          width: 100%;
          margin-top: 1rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid #000;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .view-all:hover {
          background: #000;
          color: #fff;
        }

        /* Support */
        .support-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .support-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 1px solid #000;
          border-radius: 1rem;
          color: #000;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }

        .support-link:hover {
          background: #000;
          color: #fff;
        }

        .support-link.whatsapp:hover {
          background: #25D366;
          border-color: #25D366;
        }

        .payment-status-card {
          border-width: 2px;
          transition: all 0.3s ease;
        }
        .payment-status-card.verifying {
          border-color: #ffc107;
          background: #fffdf5;
        }
        .payment-status-card.success {
          border-color: #28a745;
          background: #f4faf6;
        }
        .payment-status-card.failed {
          border-color: #dc3545;
          background: #fdf5f6;
        }
        .status-icon {
          flex-shrink: 0;
        }
        .status-info {
          flex-grow: 1;
        }

        .loading, .no-orders {
          text-align: center;
          color: #666;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .checkout-dashboard {
            padding: 1rem;
          }

          .cart-actions {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutDashboard;
