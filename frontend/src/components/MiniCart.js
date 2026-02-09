import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MiniCart = ({ 
  cartItems = [], 
  isOpen = false, 
  onClose = () => {},
  trigger 
}) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(null);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    return subtotal + shipping + tax;
  };

  const handleRemoveItem = (itemId) => {
    setIsRemoving(itemId);
    setTimeout(() => {
      // In real app, this would call a remove function passed as prop
      setIsRemoving(null);
    }, 300);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/payment');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Mini Cart Dropdown */}
      <div className={`mini-cart ${isOpen ? 'open' : ''}`}>
        <div className="mini-cart-header">
          <h3>Shopping Cart ({itemCount} items)</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <button className="btn-shop" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="mini-cart-items">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className={`mini-cart-item ${isRemoving === item.id ? 'removing' : ''}`}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} | Color: {item.color}</p>
                    <div className="item-price-qty">
                      <span className="price">₹{item.price}</span>
                      <span className="quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="mini-cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">₹{calculateTotal()}</span>
              </div>
              
              <div className="cart-actions">
                <button className="btn-view-cart" onClick={handleViewCart}>
                  View Cart
                </button>
                <button className="btn-checkout" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay */}
      {isOpen && <div className="mini-cart-overlay" onClick={onClose}></div>}

      <style jsx>{`
        .mini-cart {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: var(--bg-primary, white);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: right var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .mini-cart.open {
          right: 0;
        }

        .mini-cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .mini-cart-header h3 {
          color: var(--text-primary, #1e293b);
          margin: 0;
          font-size: 1.125rem;
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
          transition: all var(--transition-fast);
          color: var(--text-secondary, #64748b);
        }

        .close-btn:hover {
          background: var(--gray-100, #f1f5f9);
          color: var(--text-primary, #1e293b);
        }

        .empty-cart {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .empty-cart i {
          font-size: 3rem;
          color: var(--text-muted, #94a3b8);
          margin-bottom: 1rem;
        }

        .empty-cart p {
          color: var(--text-secondary, #64748b);
          margin-bottom: 1.5rem;
        }

        .btn-shop {
          background: var(--primary-color, #ff6b35);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-shop:hover {
          background: var(--primary-dark, #e55a2b);
          transform: translateY(-2px);
        }

        .mini-cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .mini-cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          margin-bottom: 0.75rem;
          transition: all var(--transition-fast);
          position: relative;
        }

        .mini-cart-item:hover {
          background: var(--gray-50, #f8fafc);
        }

        .mini-cart-item.removing {
          opacity: 0;
          transform: translateX(20px);
        }

        .mini-cart-item img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md, 0.5rem);
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-details h4 {
          font-size: 0.875rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .item-details p {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          margin-bottom: 0.5rem;
        }

        .item-price-qty {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        .quantity {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
        }

        .remove-item {
          background: transparent;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          color: var(--text-muted, #94a3b8);
        }

        .remove-item:hover {
          background: var(--danger-color, #fb5607);
          color: white;
        }

        .mini-cart-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .total-amount {
          color: var(--primary-color, #ff6b35);
        }

        .cart-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-view-cart, .btn-checkout {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-view-cart {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-view-cart:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .btn-checkout {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
        }

        .btn-checkout:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .mini-cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .mini-cart {
            width: 100%;
            right: -100%;
          }

          .mini-cart-item img {
            width: 50px;
            height: 50px;
          }

          .cart-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default MiniCart;
