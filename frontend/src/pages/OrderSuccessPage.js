import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';
import { generateInvoice } from '../utils/invoiceGenerator';

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;
  
  // Use real data if available, otherwise fallback to random for demo/hardcoded
  const orderId = order?._id || order?.id || `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const orderDate = order?.created_at ? new Date(order.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  const paymentMethod = order?.payment_info?.method || 'Cash on Delivery';

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been confirmed and will be delivered soon.</p>
          
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order Number:</span>
              <span>{orderId}</span>
            </div>
            <div className="detail-row">
              <span>Order Date:</span>
              <span>{orderDate}</span>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span>Estimated Delivery:</span>
              <span>5-7 Business Days</span>
            </div>
          </div>

          {order && (
            <div className="invoice-section" style={{ marginBottom: '2rem' }}>
              <button 
                className="btn-invoice" 
                onClick={() => generateInvoice(order)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                <i className="fas fa-file-invoice"></i>
                Download Invoice
              </button>
            </div>
          )}

          <div className="action-buttons">
            <Link to="/" className="btn-primary">
              <i className="fas fa-home"></i>
              Continue Shopping
            </Link>
            <Link to="/account" className="btn-secondary">
              <i className="fas fa-user"></i>
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
