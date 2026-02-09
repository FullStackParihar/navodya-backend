import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockOrderData = {
    id: orderId || 'ORD20240127001',
    orderDate: '2024-01-27',
    estimatedDelivery: '2024-02-05',
    status: 'shipped',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    total: 2592,
    customer: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210'
    },
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      address: '123, Navodaya Colony',
      landmark: 'Near JNV School',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    items: [
      {
        id: 1,
        name: 'JNV Classic T-Shirt',
        price: 599,
        quantity: 2,
        size: 'L',
        color: 'Navy',
        image: 'https://picsum.photos/seed/tshirt1/100/100'
      }
    ],
    tracking: [
      {
        id: 1,
        status: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been successfully placed.',
        date: '2024-01-27',
        time: '10:30 AM',
        completed: true,
        icon: 'fas fa-shopping-cart'
      },
      {
        id: 2,
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed.',
        date: '2024-01-27',
        time: '11:15 AM',
        completed: true,
        icon: 'fas fa-check-circle'
      },
      {
        id: 3,
        status: 'shipped',
        title: 'Shipped',
        description: 'Your order has been shipped via Express Delivery.',
        date: '2024-01-29',
        time: '02:30 PM',
        completed: true,
        icon: 'fas fa-truck',
        trackingNumber: 'EXP123456789',
        carrier: 'Express Delivery'
      },
      {
        id: 4,
        status: 'out-for-delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery and will arrive soon.',
        date: '2024-01-30',
        time: '09:10 AM',
        completed: false,
        icon: 'fas fa-box'
      },
      {
        id: 5,
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully.',
        date: null,
        time: null,
        completed: false,
        icon: 'fas fa-check-double'
      }
    ],
    support: {
      phone: '+91 1800-123-4567',
      email: 'support@navodayatrendz.com',
      whatsapp: '+91 92844 90206',
      chatAvailable: true
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setOrderData(mockOrderData);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  const calculateDaysRemaining = () => {
    if (!orderData) return 0;
    const today = new Date();
    const deliveryDate = new Date(orderData.estimatedDelivery);
    const diffTime = deliveryDate - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Order Not Found</h2>
            <button className="btn-primary" onClick={() => navigate('/profile')}>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="order-tracking-page">
      <div className="container">
        <div className="tracking-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <i className="fas fa-arrow-left"></i> Back to Orders
          </button>
          <div className="order-info">
            <h1>Order #{orderData.id}</h1>
            <p>Placed on {new Date(orderData.orderDate).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="delivery-info">
            <div className="delivery-badge">
              <i className="fas fa-truck"></i>
              <span>{orderData.status.toUpperCase()}</span>
            </div>
            <div className="delivery-time">
              <i className="fas fa-calendar"></i>
              <span>{daysRemaining} days remaining</span>
            </div>
          </div>
        </div>

        <div className="tracking-content">
          <div className="timeline-section">
            <h2>Order Status</h2>
            <div className="timeline">
              {orderData.tracking.map((step) => (
                <div key={step.id} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
                  <div className="timeline-marker">
                    <i className={step.icon}></i>
                  </div>
                  <div className="timeline-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    {step.date && (
                      <div className="timeline-date">
                        <i className="far fa-calendar"></i>
                        <span>{step.date} at {step.time}</span>
                      </div>
                    )}
                    {step.trackingNumber && (
                      <div className="tracking-number">
                        <i className="fas fa-barcode"></i>
                        <span>Tracking: {step.trackingNumber}</span>
                        <button 
                          className="track-btn"
                          onClick={() => window.open(`https://www.google.com/search?q=${step.trackingNumber}`, '_blank')}
                        >
                          Track
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-estimate">
            <h2>Estimated Delivery</h2>
            <div className="estimate-card">
              <div className="estimate-date">
                <i className="fas fa-calendar-check"></i>
                <div>
                  <h3>{new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</h3>
                  <p>{daysRemaining} days remaining</p>
                </div>
              </div>
              <div className="estimate-address">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Delivery Address</h3>
                  <p>{orderData.shippingAddress.fullName}</p>
                  <p>{orderData.shippingAddress.address}, {orderData.shippingAddress.city}</p>
                  <p>{orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="support-section">
            <h2>Customer Support</h2>
            <div className="support-options">
              <div className="support-card">
                <div className="support-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="support-info">
                  <h3>Call Us</h3>
                  <p>{orderData.support.phone}</p>
                  <small>Available 9 AM - 9 PM, 7 days a week</small>
                  <button 
                    className="support-btn"
                    onClick={() => window.open(`tel:${orderData.support.phone}`)}
                  >
                    Call Now
                  </button>
                </div>
              </div>

              <div className="support-card">
                <div className="support-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="support-info">
                  <h3>Email Support</h3>
                  <p>{orderData.support.email}</p>
                  <small>We respond within 24 hours</small>
                  <button 
                    className="support-btn"
                    onClick={() => window.open(`mailto:${orderData.support.email}?subject=Order ${orderData.id}`)}
                  >
                    Send Email
                  </button>
                </div>
              </div>

              <div className="support-card">
                <div className="support-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="support-info">
                  <h3>WhatsApp Support</h3>
                  <p>{orderData.support.whatsapp}</p>
                  <small>Instant chat support</small>
                  <button 
                    className="support-btn whatsapp"
                    onClick={() => window.open(`https://wa.me/${orderData.support.whatsapp.replace(/[^\d]/g, '')}?text=Hi, I need help with my order ${orderData.id}`)}
                  >
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-tracking-page {
          padding: 2rem 0;
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .tracking-header {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-btn {
          background: var(--gray-200, #e2e8f0);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-info h1 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .delivery-info {
          display: flex;
          gap: 1rem;
        }

        .delivery-badge, .delivery-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
        }

        .delivery-badge {
          background: var(--success-color, #06ffa5);
          color: var(--gray-900, #0f172a);
        }

        .delivery-time {
          background: var(--primary-color, #ff6b35);
          color: white;
        }

        .tracking-content {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--gray-200, #e2e8f0);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
          padding-left: 2rem;
        }

        .timeline-marker {
          position: absolute;
          left: -25px;
          top: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--gray-200, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary, #64748b);
          border: 3px solid var(--bg-primary, white);
        }

        .timeline-item.completed .timeline-marker {
          background: var(--success-color, #06ffa5);
          color: var(--gray-900, #0f172a);
        }

        .timeline-content h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .timeline-content p {
          color: var(--text-secondary, #64748b);
          margin-bottom: 0.5rem;
        }

        .timeline-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted, #94a3b8);
          font-size: 0.875rem;
        }

        .tracking-number {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .track-btn {
          background: var(--primary-color, #ff6b35);
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md, 0.375rem);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .delivery-estimate {
          margin-top: 3rem;
        }

        .estimate-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: var(--gray-50, #f8fafc);
          padding: 2rem;
          border-radius: var(--radius-xl, 1rem);
        }

        .estimate-date, .estimate-address {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .estimate-date i, .estimate-address i {
          width: 40px;
          height: 40px;
          background: var(--primary-color, #ff6b35);
          color: white;
          border-radius: var(--radius-lg, 0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .estimate-address i {
          background: var(--success-color, #06ffa5);
          color: var(--gray-900, #0f172a);
        }

        .support-section {
          margin-top: 3rem;
        }

        .support-section h2 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 2rem;
        }

        .support-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .support-card {
          background: var(--gray-50, #f8fafc);
          padding: 2rem;
          border-radius: var(--radius-xl, 1rem);
          text-align: center;
        }

        .support-icon {
          width: 60px;
          height: 60px;
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
        }

        .support-info h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .support-info p {
          color: var(--text-secondary, #64748b);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .support-info small {
          color: var(--text-muted, #94a3b8);
          display: block;
          margin-bottom: 1rem;
        }

        .support-btn {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
        }

        .support-btn.whatsapp {
          background: #25D366;
        }

        .loading-state, .error-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--gray-200, #e2e8f0);
          border-top: 4px solid var(--primary-color, #ff6b35);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .tracking-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .estimate-card {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .support-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
