import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutButton = ({ 
  cartItems = [], 
  className = '', 
  size = 'large', 
  disabled = false,
  onCheckout = null 
}) => {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed to checkout.');
      return;
    }

    // Call custom checkout handler if provided
    if (onCheckout) {
      onCheckout();
    }

    // Navigate to payment page
    navigate('/payment');
  };

  const isDisabled = disabled || cartItems.length === 0;

  return (
    <button
      className={`checkout-btn ${className} ${size}`}
      onClick={handleCheckout}
      disabled={isDisabled}
    >
      <i className="fas fa-lock"></i>
      <span>Proceed to Checkout</span>
      {cartItems.length > 0 && (
        <span className="checkout-amount">₹{calculateSubtotal()}</span>
      )}
    </button>
  );
};

export default CheckoutButton;
