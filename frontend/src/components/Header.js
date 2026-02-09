import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchBarAmazon from './SearchBarAmazon';

import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated and is admin
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = isAuthenticated && userEmail === 'admin@navodaya.com';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-content">
            <Link to="/" className="logo animate-fadeIn">
              <i className="fas fa-graduation-cap"></i>
              Navodaya<span>Trendz</span>
            </Link>
            
            <div className="delivery-info animate-slideDown">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <div>Deliver to</div>
                <strong>JNV Campus</strong>
              </div>
            </div>
            
            <SearchBarAmazon />
            
            <div className="nav-icons">
              <Link 
                to={isAuthenticated ? "/account" : "/login"} 
                className={`nav-item ${location.pathname === '/account' ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: '0.05s' }}
              >
                <i className="fas fa-user-circle"></i>
                <span>{isAuthenticated ? 'Account' : 'Login'}</span>
              </Link>

              {isAuthenticated && (
                <Link 
                  to="/user-profile" 
                  className={`nav-item ${location.pathname === '/user-profile' ? 'active' : ''} animate-fadeIn`}
                  style={{ animationDelay: '0.15s' }}
                >
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </Link>
              )}
              
              {isAdmin && (
                <Link 
                  to="/admin-profile" 
                  className={`nav-item ${location.pathname === '/admin-profile' ? 'active' : ''} animate-fadeIn`}
                  style={{ animationDelay: '0.25s' }}
                >
                  <i className="fas fa-crown"></i>
                  <span>Admin</span>
                </Link>
              )}

              <Link 
                to="/wishlist" 
                className={`nav-item ${location.pathname === '/wishlist' ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: '0.28s' }}
              >
                <div className="cart-icon-wrapper">
                  <i className="fas fa-heart"></i>
                  {wishlistCount > 0 && (
                    <span className="cart-count animate-bounce" style={{backgroundColor: '#ef4444'}}>{wishlistCount}</span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>
              
              <Link 
                to="/cart" 
                className={`nav-item cart-item ${location.pathname === '/cart' ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: '0.3s' }}
              >
                <div className="cart-icon-wrapper">
                  <i className="fas fa-shopping-cart"></i>
                  {totalItems > 0 && (
                    <span className="cart-count animate-bounce">{totalItems}</span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <div className="container">
          <div className="secondary-nav-content">
            <button 
              className="menu-toggle"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars"></i>
              <span>All</span>
            </button>
            
            <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/tshirts" 
                  className={location.pathname === '/tshirts' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/hoodies" onClick={() => setIsMobileMenuOpen(false)}>Hoodies</Link>
              </li>
              <li>
                <Link to="/accessories" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
              </li>
              <li>
                <Link to="/alumni-kits" onClick={() => setIsMobileMenuOpen(false)}>Alumni Kits</Link>
              </li>
              <li>
                <Link to="/customize" onClick={() => setIsMobileMenuOpen(false)}>Customize</Link>
              </li>
              <li>
                <Link 
                  to="/today-deals" 
                  className={location.pathname === '/today-deals' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-arrivals" 
                  className={location.pathname === '/new-arrivals' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className={location.pathname === '/faq' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className={location.pathname === '/feedback' ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
