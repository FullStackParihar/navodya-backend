import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import QuickCheckoutModal from './QuickCheckoutModal';

const CheckoutDashboard = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

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
    fetchOrders();
  }, []);

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleQuickCheckout = () => {
    if (items.length > 0) {
      setShowQuickCheckout(true);
    } else {
      alert('Your cart is empty. Please add items to proceed.');
    }
  };

  const handleViewPayment = () => {
    navigate('/payment');
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleViewOrders = () => {
    navigate('/profile');
  };

  const handleBulkOrder = () => {
    navigate('/bulk-order');
  };

  const handleQuickCheckoutWithProduct = (product) => {
    setSelectedProduct(product);
    setShowQuickCheckout(true);
  };

  return (
    <>
      <div className="checkout-dashboard">
        <div className="dashboard-header">
          <h1>Checkout Center</h1>
          <p>Manage your orders, track deliveries, and complete purchases</p>
        </div>

        <div className="dashboard-grid">
          {/* Cart Section */}
          <div className="dashboard-section cart-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="section-info">
                <h2>Shopping Cart</h2>
                <p>{items.length} items • ₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
              </div>
            </div>
            <div className="section-actions">
              <button className="btn-primary" onClick={handleViewCart}>
                <i className="fas fa-eye"></i> View Cart
              </button>
              <button className="btn-secondary" onClick={handleQuickCheckout}>
                <i className="fas fa-bolt"></i> Quick Checkout
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section quick-actions">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="section-info">
                <h2>Quick Actions</h2>
                <p>Fast checkout and order management</p>
              </div>
            </div>
            <div className="action-grid">
              <button className="action-btn" onClick={handleViewPayment}>
                <i className="fas fa-credit-card"></i>
                <span>Go to Payment</span>
              </button>
              <button className="action-btn" onClick={handleViewOrders}>
                <i className="fas fa-list"></i>
                <span>My Orders</span>
              </button>
              <button className="action-btn" onClick={handleBulkOrder}>
                <i className="fas fa-users"></i>
                <span>Bulk Order</span>
              </button>
              <button className="action-btn" onClick={() => setShowQuickCheckout(true)}>
                <i className="fas fa-bolt"></i>
                <span>Quick Checkout</span>
              </button>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="dashboard-section tracking-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="section-info">
                <h2>Track Orders</h2>
                <p>Monitor your order status and delivery</p>
              </div>
            </div>
            <div className="orders-list">
              {isLoadingOrders ? (
                <div className="loading-orders">Loading orders...</div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                      <div className="order-meta">
                        <span className={`status-badge ${order.status}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <span className="order-date">{order.date}</span>
                        <span className="order-total">₹{order.total}</span>
                      </div>
                    </div>
                    <button 
                      className="track-btn"
                      onClick={() => handleTrackOrder(order.id)}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                      Track
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-orders">No orders found</div>
              )}
            </div>
            <button className="btn-secondary full-width" onClick={handleViewOrders}>
              <i className="fas fa-list"></i> View All Orders
            </button>
          </div>

          {/* Support */}
          <div className="dashboard-section support-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="section-info">
                <h2>Customer Support</h2>
                <p>Get help with your orders and payments</p>
              </div>
            </div>
            <div className="support-options">
              <button className="support-btn" onClick={() => window.open('tel:+9118001234567')}>
                <i className="fas fa-phone"></i>
                <span>Call Support</span>
              </button>
              <button className="support-btn" onClick={() => window.open('mailto:support@navodayatrendz.com')}>
                <i className="fas fa-envelope"></i>
                <span>Email Support</span>
              </button>
              <button className="support-btn whatsapp" onClick={() => window.open('https://wa.me/919284490206')}>
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </button>
              <button className="support-btn" onClick={() => alert('Live chat would open here')}>
                <i className="fas fa-comments"></i>
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div className="stat-info">
              <h3>{items.length}</h3>
              <p>Items in Cart</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-info">
              <h3>₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</h3>
              <p>Cart Total</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-box"></i>
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Active Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div className="stat-info">
              <h3>2</h3>
              <p>Out for Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Checkout Modal */}
      <QuickCheckoutModal
        isOpen={showQuickCheckout}
        onClose={() => {
          setShowQuickCheckout(false);
          setSelectedProduct(null);
        }}
        cartItems={items}
        product={selectedProduct}
      />

      <style jsx>{`
        .checkout-dashboard {
          padding: 2rem 0;
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: var(--text-secondary, #64748b);
          font-size: 1.125rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .dashboard-section {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          transition: transform var(--transition-fast);
        }

        .dashboard-section:hover {
          transform: translateY(-4px);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .section-icon {
          width: 50px;
          height: 50px;
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
          border-radius: var(--radius-xl, 1rem);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .section-info h2 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
        }

        .section-info p {
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        .section-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .action-btn {
          background: var(--gray-50, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          padding: 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn:hover {
          background: var(--primary-color, #2f4a67);
          color: white;
          border-color: var(--primary-color, #2f4a67);
          transform: translateY(-2px);
        }

        .action-btn i {
          font-size: 1.25rem;
        }

        .action-btn span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-lg, 0.75rem);
          transition: all var(--transition-fast);
        }

        .order-item:hover {
          background: var(--gray-100, #f1f5f9);
        }

        .order-info h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .order-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full, 9999px);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.shipped {
          background: var(--info-color, #2563eb);
          color: white;
        }

        .status-badge.delivered {
          background: var(--success-color, #16a34a);
          color: white;
        }

        .status-badge.processing {
          background: var(--warning-color, #d97706);
          color: var(--gray-900, #0f172a);
        }

        .order-date, .order-total {
          color: var(--text-secondary, #64748b);
          font-size: 0.75rem;
        }

        .track-btn {
          background: var(--primary-color, #2f4a67);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .track-btn:hover {
          background: var(--primary-dark, #23394f);
          transform: translateY(-2px);
        }

        .full-width {
          width: 100%;
        }

        .support-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .support-btn {
          background: var(--gray-50, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          padding: 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .support-btn:hover {
          background: var(--primary-color, #2f4a67);
          color: white;
          border-color: var(--primary-color, #2f4a67);
          transform: translateY(-2px);
        }

        .support-btn.whatsapp:hover {
          background: #25D366;
          border-color: #25D366;
        }

        .support-btn i {
          font-size: 1.25rem;
        }

        .support-btn span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--bg-primary, white);
          border-radius: var(--radius-xl, 1rem);
          padding: 1.5rem;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
          border-radius: var(--radius-lg, 0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .stat-info h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
          font-size: 1.25rem;
        }

        .stat-info p {
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .action-grid {
            grid-template-columns: 1fr;
          }

          .support-options {
            grid-template-columns: 1fr;
          }

          .section-actions {
            flex-direction: column;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .order-item {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .order-meta {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutDashboard;
