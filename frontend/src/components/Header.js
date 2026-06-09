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

  // Reactive auth state — re-reads localStorage on every route change
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    setIsAuthenticated(auth);
    setIsAdmin(auth && (role === 'admin' || email === 'admin@navodaya.com'));
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-content">
            {/* Desktop Logo */}
            <Link to="/" className="logo animate-fadeIn desktop-logo">
              <img src="/logo2.png" alt="Navodaya Trendz" style={{ height: '120px', width: 'auto' }} />
            </Link>

            {/* Row 1: Logo + Hamburger (Mobile only) */}
            <div className="top-nav-row-1">
              <Link to="/" className="logo animate-fadeIn">
                <img src="/logo2.png" alt="Navodaya Trendz" style={{ height: '70px', width: 'auto' }} />
              </Link>
              
              <button 
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>

            {/* Row 2: Delivery Info */}
            <div className="delivery-info animate-slideDown">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <div>Deliver to</div>
                <strong>JNV Campus</strong>
              </div>
            </div>

            {/* Row 3: Search Bar */}
            <SearchBarAmazon />

            {/* Row 4: Nav Icons */}
            <div className="nav-icons">
              <Link 
                to={isAuthenticated ? "/account" : "/login"} 
                className={`nav-item ${location.pathname === '/account' ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: '0.05s' }}
              >
                <i className="fas fa-user-circle"></i>
                <span>{isAuthenticated ? 'Account' : 'Login'}</span>
              </Link>


              
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
                    <span className="cart-count animate-bounce" style={{backgroundColor: '#000000'}}>{wishlistCount}</span>
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
            
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/tshirts" 
                  className={location.pathname === '/tshirts' ? 'active' : ''}
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/hoodies">Hoodies</Link>
              </li>
              <li>
                <Link to="/accessories">Accessories</Link>
              </li>

              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/bulk-order">Bulk Order</Link>
              </li>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/today-deals">Today's Deals</Link>
              </li>
              <li>
                <Link to="/new-arrivals">New Arrivals</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin-profile"
                    className={location.pathname === '/admin-profile' ? 'active' : ''}
                    style={{ color: '#f59e0b', fontWeight: '700' }}
                  >
                    <i className="fas fa-shield-alt" style={{ marginRight: '4px' }}></i>
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Category Pills (Mobile) */}
      <div className="quick-category-pills">
        <Link to="/tshirts" onClick={closeMobileMenu}>T-Shirts</Link>
        <Link to="/hoodies" onClick={closeMobileMenu}>Hoodies</Link>
        <Link to="/accessories" onClick={closeMobileMenu}>Accessories</Link>
        <Link to="/events" onClick={closeMobileMenu}>Events</Link>
        <Link to="/today-deals" onClick={closeMobileMenu}>Today's Deals</Link>
        <Link to="/new-arrivals" onClick={closeMobileMenu}>New Arrivals</Link>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={closeMobileMenu}></div>
        <div className="drawer-content">
          <button className="drawer-close" onClick={closeMobileMenu}>
            <i className="fas fa-times"></i>
          </button>
          <ul>
            <li>
              <Link to="/" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li>
              <Link to="/tshirts" onClick={closeMobileMenu}>T-Shirts</Link>
            </li>
            <li>
              <Link to="/hoodies" onClick={closeMobileMenu}>Hoodies</Link>
            </li>
            <li>
              <Link to="/accessories" onClick={closeMobileMenu}>Accessories</Link>
            </li>
            <li>
              <Link to="/events" onClick={closeMobileMenu}>Events</Link>
            </li>
            <li>
              <Link to="/bulk-order" onClick={closeMobileMenu}>Bulk Order</Link>
            </li>
            <li>
              <Link to="/about-us" onClick={closeMobileMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/today-deals" onClick={closeMobileMenu}>Today's Deals</Link>
            </li>
            <li>
              <Link to="/new-arrivals" onClick={closeMobileMenu}>New Arrivals</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin-profile" onClick={closeMobileMenu}>
                  <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
