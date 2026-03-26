import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
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
              <span>ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="detail-row">
              <span>Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="detail-row">
              <span>Estimated Delivery:</span>
              <span>5-7 Business Days</span>
            </div>
          </div>

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
