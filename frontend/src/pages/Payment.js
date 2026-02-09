import React, { useState, useEffect } from 'react';

const Payment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      address: '123, Navodaya Colony',
      landmark: 'Near JNV School',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      type: 'home',
      isDefault: true
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false
  });

  const [showAddAddress, setShowAddAddress] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
      icon: 'fas fa-mobile-alt',
      color: '#00D4AA'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Rupay, American Express',
      icon: 'fas fa-credit-card',
      color: '#4A90E2'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: 'fas fa-university',
      color: '#7B68EE'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      description: 'Paytm Wallet, Amazon Pay, Mobikwik',
      icon: 'fas fa-wallet',
      color: '#FF6B6B'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: 'fas fa-money-bill-wave',
      color: '#4CAF50'
    },
    {
      id: 'emi',
      name: 'EMI',
      description: 'Pay in easy monthly installments',
      icon: 'fas fa-calendar-alt',
      color: '#FF9800'
    }
  ];

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
    saveUpi: false
  });

  const [selectedBank, setSelectedBank] = useState('');

  const cartItems = [
    {
      id: 1,
      name: 'JNV Classic T-Shirt',
      price: 599,
      quantity: 2,
      size: 'L',
      color: 'Navy',
      image: 'https://picsum.photos/seed/tshirt1/100/100'
    },
    {
      id: 2,
      name: 'JNV Alumni Hoodie',
      price: 999,
      quantity: 1,
      size: 'XL',
      color: 'Black',
      image: 'https://picsum.photos/seed/hoodie1/100/100'
    }
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 999 ? 0 : 99;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const validatePincode = (pincode) => {
    return /^\d{6}$/.test(pincode);
  };

  const handleAddAddress = () => {
    if (!validatePincode(newAddress.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    const address = {
      ...newAddress,
      id: Date.now()
    };

    setAddresses([...addresses, address]);
    setNewAddress({
      name: '',
      fullName: '',
      phone: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      type: 'home',
      isDefault: false
    });
    setShowAddAddress(false);
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
    }, 3000);
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Checkout</h1>
          <div className="progress-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Address</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Confirm</div>
            </div>
          </div>
        </div>

        {!orderPlaced ? (
          <div className="payment-content">
            <div className="payment-main">
              {/* Step 1: Address Selection */}
              {currentStep === 1 && (
                <div className="payment-section">
                  <h2>Select Delivery Address</h2>
                  
                  <div className="addresses-list">
                    {addresses.map(address => (
                      <div 
                        key={address.id}
                        className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="address-header">
                          <div className="address-type">
                            <i className={`fas fa-${address.type === 'home' ? 'home' : 'briefcase'}`}></i>
                            <span>{address.name}</span>
                            {address.isDefault && <span className="default-badge">Default</span>}
                          </div>
                        </div>
                        
                        <div className="address-details">
                          <p className="address-name">{address.fullName}</p>
                          <p className="address-phone">{address.phone}</p>
                          <p className="address-text">
                            {address.address}, {address.landmark && `${address.landmark}, `}
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn-add-address"
                    onClick={() => setShowAddAddress(true)}
                  >
                    <i className="fas fa-plus"></i> Add New Address
                  </button>

                  {showAddAddress && (
                    <div className="add-address-form">
                      <h3>Add New Address</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Address *</label>
                          <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                            placeholder="Street address, apartment, etc."
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Landmark</label>
                          <input
                            type="text"
                            value={newAddress.landmark}
                            onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                            placeholder="Nearby landmark"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>City *</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            placeholder="City name"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>State *</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            placeholder="State name"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Pincode *</label>
                          <input
                            type="text"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="btn-secondary"
                          onClick={() => setShowAddAddress(false)}
                        >
                          Cancel
                        </button>
                        <button className="btn-primary" onClick={handleAddAddress}>
                          Add Address
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="step-navigation">
                    <button 
                      className="btn-primary"
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedAddress}
                    >
                      Continue to Payment <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="payment-section">
                  <h2>Select Payment Method</h2>
                  
                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="payment-method-icon" style={{ backgroundColor: method.color }}>
                          <i className={method.icon}></i>
                        </div>
                        <div className="payment-method-info">
                          <h3>{method.name}</h3>
                          <p>{method.description}</p>
                        </div>
                        <div className="payment-method-radio">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                          />
                          <span className="radio-custom"></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="step-navigation">
                    <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
                      <i className="fas fa-arrow-left"></i> Back to Address
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => setCurrentStep(3)}
                      disabled={!paymentMethod}
                    >
                      Review Order <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {currentStep === 3 && (
                <div className="payment-section">
                  <h2>Order Confirmation</h2>
                  
                  <div className="order-summary">
                    <div className="summary-section">
                      <h3>Delivery Address</h3>
                      <div className="selected-address">
                        <p><strong>{selectedAddress.fullName}</strong></p>
                        <p>{selectedAddress.phone}</p>
                        <p>{selectedAddress.address}, {selectedAddress.landmark && `${selectedAddress.landmark}, `}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                      </div>
                    </div>

                    <div className="summary-section">
                      <h3>Payment Method</h3>
                      <div className="selected-payment">
                        <div className="payment-method-icon" style={{ 
                          backgroundColor: paymentMethods.find(m => m.id === paymentMethod)?.color 
                        }}>
                          <i className={paymentMethods.find(m => m.id === paymentMethod)?.icon}></i>
                        </div>
                        <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                      </div>
                    </div>

                    <div className="summary-section">
                      <h3>Order Items</h3>
                      <div className="order-items">
                        {cartItems.map(item => (
                          <div key={item.id} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Size: {item.size} | Color: {item.color}</p>
                              <p>Qty: {item.quantity}</p>
                            </div>
                            <div className="item-price">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="step-navigation">
                    <button className="btn-secondary" onClick={() => setCurrentStep(2)}>
                      <i className="fas fa-arrow-left"></i> Back to Payment
                    </button>
                    <button 
                      className="btn-primary btn-large"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Processing Payment...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock"></i> Pay ₹{calculateTotal()}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="order-summary-sidebar">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="summary-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} | Size: {item.size}</p>
                    </div>
                    <div className="summary-item-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>{calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping()}`}</span>
                </div>
                <div className="price-row">
                  <span>Tax (18%)</span>
                  <span>₹{calculateTax()}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="secure-payment">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="order-success">
            <div className="success-content">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for your order. We'll send you order confirmation and tracking details shortly.</p>
              
              <button className="btn-primary" onClick={() => window.location.href = '/'}>
                <i className="fas fa-shopping-cart"></i> Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .payment-page {
          padding: 2rem 0;
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
        }

        .payment-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .payment-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 1rem;
        }

        .progress-indicator {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gray-200, #e2e8f0);
          color: var(--text-secondary, #64748b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .step.active .step-number {
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          font-weight: 500;
        }

        .step.active .step-label {
          color: var(--primary-color, #2f4a67);
        }

        .payment-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .payment-main {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .payment-section h2 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 2rem;
        }

        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .address-card {
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          padding: 1.5rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .address-card:hover {
          border-color: var(--primary-color, #2f4a67);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .address-card.selected {
          border-color: var(--primary-color, #2f4a67);
          background: var(--gray-50, #f8fafc);
        }

        .address-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .address-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        .default-badge {
          background: var(--success-color, #16a34a);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full, 9999px);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .address-details p {
          margin-bottom: 0.5rem;
          color: var(--text-secondary, #64748b);
        }

        .address-name {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        .btn-add-address {
          width: 100%;
          background: transparent;
          border: 2px dashed var(--primary-color, #2f4a67);
          color: var(--primary-color, #2f4a67);
          padding: 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-add-address:hover {
          background: var(--primary-color, #2f4a67);
          color: white;
        }

        .add-address-form {
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 2rem;
          margin-top: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color, #2f4a67);
          box-shadow: 0 0 0 3px rgba(47, 74, 103, 0.18);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .payment-methods {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .payment-method-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .payment-method-card:hover {
          border-color: var(--primary-color, #2f4a67);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .payment-method-card.selected {
          border-color: var(--primary-color, #2f4a67);
          background: var(--gray-50, #f8fafc);
        }

        .payment-method-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-lg, 0.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .payment-method-info h3 {
          font-size: 1.125rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
        }

        .payment-method-info p {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        .payment-method-radio {
          margin-left: auto;
        }

        .payment-method-radio input[type="radio"] {
          display: none;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .payment-method-radio input[type="radio"]:checked + .radio-custom {
          border-color: var(--primary-color, #2f4a67);
          background: var(--primary-color, #2f4a67);
        }

        .payment-method-radio input[type="radio"]:checked + .radio-custom::after {
          content: '';
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 2rem;
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

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .order-summary-sidebar {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .order-summary-sidebar h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 1.5rem;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .summary-item img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md, 0.5rem);
          object-fit: cover;
        }

        .summary-item-details {
          flex: 1;
        }

        .summary-item-details h4 {
          font-size: 0.875rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
        }

        .summary-item-details p {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        .summary-item-price {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        .price-breakdown {
          border-top: 1px solid var(--border-color, #e2e8f0);
          padding-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .price-row.total {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--text-primary, #1e293b);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color, #e2e8f0);
        }

        .secure-check {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--success-color, #16a34a);
          font-weight: 600;
        }

        .order-success {
          text-align: center;
          padding: 4rem 2rem;
        }

        .success-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .success-icon {
          font-size: 4rem;
          color: var(--success-color, #16a34a);
          margin-bottom: 2rem;
        }

        .order-success h2 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 1rem;
        }

        .order-success p {
          color: var(--text-secondary, #64748b);
          margin-bottom: 2rem;
        }

        .summary-section {
          margin-bottom: 2rem;
        }

        .summary-section h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 1rem;
        }

        .selected-address {
          background: var(--gray-50, #f8fafc);
          padding: 1rem;
          border-radius: var(--radius-lg, 0.75rem);
        }

        .selected-address p {
          margin-bottom: 0.5rem;
          color: var(--text-secondary, #64748b);
        }

        .selected-payment {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--gray-50, #f8fafc);
          padding: 1rem;
          border-radius: var(--radius-lg, 0.75rem);
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-lg, 0.75rem);
        }

        .order-item img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md, 0.5rem);
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-details h4 {
          font-size: 1rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
        }

        .item-details p {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        .item-price {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        @media (max-width: 1024px) {
          .payment-content {
            grid-template-columns: 1fr;
          }

          .order-summary-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .progress-indicator {
            gap: 1rem;
          }

          .step-label {
            font-size: 0.75rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .step-navigation {
            flex-direction: column;
          }

          .step-navigation button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
