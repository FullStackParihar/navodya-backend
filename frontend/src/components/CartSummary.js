import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ 
  cartItems = [], 
  showCheckoutButton = true,
  className = '',
  onCheckout = null 
}) => {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 999 ? 0 : 99;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed to checkout.');
      return;
    }

    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/payment');
    }
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className={`cart-summary ${className}`}>
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
          <span>₹{subtotal}</span>
        </div>
        <div className="price-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
        <div className="price-row">
          <span>Tax (18%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {subtotal < 1000 && (
        <div className="free-shipping-notice">
          <i className="fas fa-truck"></i>
          <span>Add ₹{1000 - subtotal} more for FREE shipping!</span>
        </div>
      )}

      {showCheckoutButton && (
        <button 
          className="checkout-btn large"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <i className="fas fa-lock"></i>
          <span>Proceed to Checkout</span>
          <span className="checkout-amount">₹{total}</span>
        </button>
      )}

      <div className="secure-payment">
        <i className="fas fa-shield-alt"></i>
        <span>Secure Payment</span>
      </div>

      <style jsx>{`
        .cart-summary {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .cart-summary h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: var(--radius-lg, 0.75rem);
          transition: background-color var(--transition-fast);
        }

        .summary-item:hover {
          background: var(--gray-50, #f8fafc);
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
          font-weight: 500;
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
          font-size: 0.875rem;
        }

        .price-row.total {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--text-primary, #1e293b);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color, #e2e8f0);
        }

        .free-shipping-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(47, 74, 103, 0.12);
          color: var(--text-primary, #1e293b);
          border-radius: var(--radius-lg, 0.75rem);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .checkout-btn {
          width: 100%;
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
          border: none;
          padding: 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .checkout-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .checkout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkout-btn.large {
          padding: 1.25rem;
          font-size: 1.125rem;
        }

        .checkout-amount {
          font-weight: 700;
        }

        .secure-payment {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--success-color, #06ffa5);
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .cart-summary {
            padding: 1.5rem;
          }

          .summary-item img {
            width: 50px;
            height: 50px;
          }

          .checkout-btn {
            padding: 0.875rem;
            font-size: 0.875rem;
          }

          .checkout-btn.large {
            padding: 1rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CartSummary;
