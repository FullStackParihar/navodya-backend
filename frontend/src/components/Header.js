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
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerTheme, setDrawerTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setDrawerTheme(localStorage.getItem('theme') || 'light');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('mobile-drawer-open', isMobileMenuOpen);
    return () => document.body.classList.remove('mobile-drawer-open');
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-content">
            {/* Desktop Logo */}
            <Link to="/" className="logo animate-fadeIn desktop-logo">
              <img src="/logo2.png" alt="Navodaya Trendz" style={{ height: '95px', width: 'auto' }} />
            </Link>

            {/* Row 1: Logo + Actions + Hamburger (Mobile only) */}
            <div className="top-nav-row-1">
              <Link to="/" className="logo animate-fadeIn">
                <img src="/logo2.png" alt="Navodaya Trendz" style={{ height: '65px', width: 'auto' }} />
              </Link>
              
              <div className="mobile-actions-wrapper">
                <Link 
                  to={isAuthenticated ? "/account" : "/login"} 
                  className="mobile-action-item"
                  aria-label="Account"
                >
                  <i className="fas fa-user-circle"></i>
                </Link>
                
                <Link 
                  to="/wishlist" 
                  className="mobile-action-item"
                  aria-label="Wishlist"
                >
                  <div className="cart-icon-wrapper">
                    <i className="fas fa-heart"></i>
                    {wishlistCount > 0 && (
                      <span className="cart-count" style={{ backgroundColor: '#000000', border: '1px solid #ffffff' }}>{wishlistCount}</span>
                    )}
                  </div>
                </Link>
                
                <Link 
                  to="/cart" 
                  className="mobile-action-item"
                  aria-label="Cart"
                >
                  <div className="cart-icon-wrapper">
                    <i className="fas fa-shopping-cart"></i>
                    {totalItems > 0 && (
                      <span className="cart-count">{totalItems}</span>
                    )}
                  </div>
                </Link>
                
                <button 
                  className="mobile-menu-toggle"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
              </div>
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

            {/* Row 4: Nav Icons (Desktop only) */}
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
                <Link
                  to="/hoodies"
                  className={location.pathname === '/hoodies' ? 'active' : ''}
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className={location.pathname === '/accessories' ? 'active' : ''}
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/alumni-kits"
                  className={location.pathname === '/alumni-kits' ? 'active' : ''}
                >
                  Alumni Kits
                </Link>
              </li>
              <li>
                <Link 
                  to="/contests"
                  className={location.pathname === '/contests' ? 'active' : ''}
                >
                  Giveaway
                </Link>
              </li>
              <li>
                <Link 
                  to="/winners"
                  className={location.pathname === '/winners' ? 'active' : ''}
                >
                  Winners
                </Link>
              </li>
              <li>
                <Link
                  to="/bulk-order"
                  className={location.pathname === '/bulk-order' ? 'active' : ''}
                >
                  Bulk Order
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className={location.pathname === '/about-us' ? 'active' : ''}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/today-deals"
                  className={location.pathname === '/today-deals' ? 'active' : ''}
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className={location.pathname === '/new-arrivals' ? 'active' : ''}
                >
                  New Arrivals
                </Link>
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
        <Link to="/alumni-kits" onClick={closeMobileMenu}>Alumni Kits</Link>
        <Link to="/contests" onClick={closeMobileMenu}>Giveaway</Link>
        <Link to="/winners" onClick={closeMobileMenu}>Winners</Link>
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
              <Link to="/alumni-kits" onClick={closeMobileMenu}>Alumni Kits</Link>
            </li>
            <li>
              <Link to="/contests" onClick={closeMobileMenu}>Giveaway</Link>
            </li>
            <li>
              <Link to="/winners" onClick={closeMobileMenu}>Winners</Link>
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
            <li style={{ marginTop: '16px', listStyle: 'none' }}>
              <div 
                className="drawer-theme-toggle" 
                onClick={() => {
                  const currentTheme = localStorage.getItem('theme') || 'light';
                  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                  localStorage.setItem('theme', newTheme);
                  document.documentElement.setAttribute('data-theme', newTheme);
                  document.body.classList.remove('theme-light', 'theme-dark');
                  document.body.classList.add(`theme-${newTheme}`);
                  window.dispatchEvent(new Event('theme-change'));
                  closeMobileMenu();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  background: 'rgba(128,128,128,0.06)'
                }}
              >
                <i className={`fas ${drawerTheme === 'light' ? 'fa-moon' : 'fa-sun'}`} style={{ width: '16px', textAlign: 'center' }}></i>
                <span>Switch to {drawerTheme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
