import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QuickCheckoutModal = ({ 
  isOpen = false, 
  onClose = () => {},
  cartItems = [],
  product = null 
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get('/auth/profile');
        if (result.success) {
          const u = result.data.user || result.data || {};
          setFormData(prev => ({
            ...prev,
            fullName: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            address: u.address || '',
            city: u.city || '',
            state: u.state || '',
            pincode: u.pincode || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching profile for quick checkout:', err);
      }
    };
    fetchProfile();
  }, []);

  const items = product ? [product] : cartItems;

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    return subtotal + shipping + tax;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePincode = (pincode) => {
    return /^\d{6}$/.test(pincode);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        alert('Please fill in all required fields');
        return;
      }
      if (!validatePincode(formData.pincode)) {
        alert('Please enter a valid 6-digit pincode');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleQuickCheckout = () => {
    // Simulate quick checkout processing
    alert('Order placed successfully! You will be redirected to payment page.');
    onClose();
    navigate('/payment');
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  if (!isOpen) return null;

  return (
    <>
      <div className="quick-checkout-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Quick Checkout</h2>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            {/* Progress Steps */}
            <div className="quick-progress">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Shipping</span>
              </div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Payment</span>
              </div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Review</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="quick-order-summary">
              <h3>Order Summary</h3>
              <div className="quick-items">
                {items.map(item => (
                  <div key={item.id} className="quick-item">
                    <img src={item.image} alt={item.name} />
                    <div className="quick-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} | Size: {item.size}{item.fabricName ? ` | Fabric: ${item.fabricName}` : ''}</p>
                    </div>
                    <div className="quick-item-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              <div className="quick-total">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="quick-step animate-fadeIn">
                <h3>Shipping Information</h3>
                <div className="quick-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, apartment, etc."
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="quick-step animate-fadeIn">
                <h3>Payment Method</h3>
                <div className="quick-payment-methods">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', icon: 'fas fa-money-bill-wave', color: '#4CAF50' },
                    { id: 'upi', name: 'UPI', icon: 'fas fa-mobile-alt', color: '#00D4AA' },
                    { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card', color: '#4A90E2' }
                  ].map(method => (
                    <div
                      key={method.id}
                      className={`quick-payment-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, paymentMethod: method.id})}
                    >
                      <div className="payment-icon" style={{ backgroundColor: method.color }}>
                        <i className={method.icon}></i>
                      </div>
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="quick-step animate-fadeIn">
                <h3>Review Order</h3>
                <div className="quick-review">
                  <div className="review-section">
                    <h4>Shipping Address</h4>
                    <p><strong>{formData.fullName}</strong></p>
                    <p>{formData.phone}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>
                  <div className="review-section">
                    <h4>Payment Method</h4>
                    <p>{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       formData.paymentMethod === 'upi' ? 'UPI' : 'Credit/Debit Card'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {step > 1 && (
              <button className="btn-secondary" onClick={handlePrevStep}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            )}
            
            {step < 3 ? (
              <button className="btn-primary" onClick={handleNextStep}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button className="btn-primary btn-large" onClick={handleQuickCheckout}>
                <i className="fas fa-lock"></i> Complete Order - ₹{total}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="modal-overlay" onClick={onClose}></div>

      <style>{`
        .quick-checkout-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: #ffffff;
          border: 2px solid #000000;
          border-radius: 1.5rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #000000;
        }

        .modal-header h2 {
          color: #000000;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #666666;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #000000;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .quick-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          position: relative;
        }

        .quick-progress::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: #e5e5e5;
          z-index: 0;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e5e5;
          color: #666666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .progress-step.active .step-number {
          background: #000000;
          color: white;
        }

        .progress-step span {
          font-size: 0.75rem;
          color: #666666;
          font-weight: 500;
        }

        .progress-step.active span {
          color: #000000;
        }

        .quick-order-summary {
          background: #f5f5f5;
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .quick-order-summary h3 {
          color: #000000;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .quick-items {
          margin-bottom: 1rem;
        }

        .quick-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .quick-item img {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          object-fit: cover;
        }

        .quick-item-details {
          flex: 1;
        }

        .quick-item-details h4 {
          font-size: 0.875rem;
          color: #000000;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .quick-item-details p {
          font-size: 0.75rem;
          color: #666666;
          margin: 0;
        }

        .quick-item-price {
          font-weight: 600;
          color: #000000;
        }

        .quick-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: #000000;
          padding-top: 0.75rem;
          border-top: 1px solid #000000;
        }

        .quick-step {
          margin-bottom: 2rem;
        }

        .quick-step h3 {
          color: #000000;
          margin-bottom: 1rem;
        }

        .quick-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #000000;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #000000;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        .quick-payment-methods {
          display: grid;
          gap: 0.75rem;
        }

        .quick-payment-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #000000;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-payment-option:hover {
          border-color: #000000;
          background: #f5f5f5;
        }

        .quick-payment-option.selected {
          border-color: #000000;
          background: #000000;
          color: white;
        }

        .payment-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .quick-review {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-section h4 {
          color: #000000;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .review-section p {
          color: #666666;
          margin: 0;
          font-size: 0.875rem;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #000000;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: #000000;
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background: #333333;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #000000;
          border: 1px solid #000000;
        }

        .btn-secondary:hover {
          background: #e5e5e5;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column;
          }

          .modal-footer button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default QuickCheckoutModal;
