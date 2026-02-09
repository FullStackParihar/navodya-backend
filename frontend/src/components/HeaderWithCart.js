import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';
import ThemeSwitch from './ThemeSwitch';

const HeaderWithCart = () => {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setIsMiniCartOpen(false);
    navigate('/payment');
  };

  return (
    <>
      <header className="header">
        <nav className="nav container">
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i> Navodaya Trendz
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/tshirts" className="nav-link">T-Shirts</Link></li>
            <li><Link to="/bulk-order" className="nav-link">Bulk Order</Link></li>
            <li><Link to="/payment" className="nav-link">Payment</Link></li>
          </ul>
          
          <div className="header-actions">
            <div className="search-container">
              <input type="text" className="search-bar" placeholder="Search products..." />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <div className="cart-container">
              <button 
                className="cart-button"
                onClick={() => setIsMiniCartOpen(true)}
              >
                <i className="fas fa-shopping-cart"></i>
                {itemCount > 0 && (
                  <span className="cart-count">{itemCount}</span>
                )}
              </button>
              
              {itemCount > 0 && (
                <button 
                  className="quick-checkout-btn"
                  onClick={handleCheckout}
                >
                  <i className="fas fa-bolt"></i> Quick Checkout
                </button>
              )}
            </div>
            
            <ThemeSwitch />
          </div>
        </nav>
      </header>

      <MiniCart 
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
        cartItems={items}
      />

      <style jsx>{`
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cart-button {
          background: transparent;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          position: relative;
          color: var(--text-primary, #1e293b);
        }

        .cart-button:hover {
          background: var(--gray-100, #f1f5f9);
          transform: scale(1.05);
        }

        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--primary-color, #ff6b35);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .quick-checkout-btn {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quick-checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        @media (max-width: 768px) {
          .header-actions {
            gap: 0.5rem;
          }

          .quick-checkout-btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }

          .quick-checkout-btn span {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderWithCart;
