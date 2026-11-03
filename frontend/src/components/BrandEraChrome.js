import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './BrandEraChrome.css';

const BrandEraChrome = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
      ? 'active'
      : '';

  const userRole = localStorage.getItem('userRole') || 'user';
  const isAdmin = userRole === 'admin' || localStorage.getItem('userEmail') === 'admin@navodaya.com';

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="be-chrome">
        <Link to="/" className="be-wordmark" aria-label="Brand Era home" onClick={closeMenu}>
          <img src="/brlogo.png" alt="Brand Era" />
        </Link>
        <nav className={menuOpen ? 'be-nav-open' : ''} aria-label="Brand Era navigation">
          <Link className={active('/products')} to="/products" onClick={closeMenu}>Products</Link>
          <Link className={active('/services')} to="/services" onClick={closeMenu}>Services</Link>
          <Link className={active('/alumni-kits')} to="/alumni-kits" onClick={closeMenu}>Solutions</Link>
          <Link className={active('/print-studio')} to="/print-studio" onClick={closeMenu}>Design Studio</Link>
          <Link className={active('/bulk-order')} to="/bulk-order" onClick={closeMenu}>Bulk Orders</Link>

          {/* Mobile-accessible links */}
          <div className="be-mobile-divider"></div>
          <div className="be-mobile-extras">
            <Link className={`be-mobile-extra-link ${active('/wishlist')}`} to="/wishlist" onClick={closeMenu}>
              <i className="fas fa-heart"></i>
              <span>Saved Products</span>
              {wishlistItems > 0 && <span className="be-mobile-count">{wishlistItems}</span>}
            </Link>
            <Link className={`be-mobile-extra-link ${active('/account')}`} to="/account" onClick={closeMenu}>
              <i className="fas fa-user"></i>
              <span>My Account</span>
            </Link>
            {isAdmin && (
              <Link className={`be-mobile-extra-link be-admin-link ${active('/admin-profile')}`} to="/admin-profile" onClick={closeMenu}>
                <span className="be-admin-badge">👑 Admin Panel</span>
              </Link>
            )}
          </div>
        </nav>

        <div className="be-chrome-actions">
          <Link to="/search" className="be-search-link" aria-label="Search" onClick={closeMenu}>
            <i className="fas fa-search"></i>
            <span className="be-search-text">Search</span>
          </Link>
          <Link to="/wishlist" className="be-desktop-action" aria-label="Saved products">
            Saved{wishlistItems ? ` (${wishlistItems})` : ''}
          </Link>
          {isAdmin && (
            <Link to="/admin-profile" className="be-desktop-action" style={{ color: '#ed241e', fontWeight: 'bold' }}>
              👑 Admin
            </Link>
          )}
          <Link to="/account" className="be-desktop-action">Account</Link>
          <Link className="be-cart-link" to="/cart" aria-label="Cart" onClick={closeMenu}>
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="be-cart-badge">{totalItems}</span>}
          </Link>
          <button
            className={`be-hamburger ${menuOpen ? 'be-hamburger-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      {menuOpen && (
        <div
          className="be-nav-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export const BrandEraFooter = () => (
  <footer className="be-footer">
    <div className="be-footer-inner">
      <div className="be-footer-brand">
        <div className="be-wordmark"><img src="/brlogo.png" alt="Brand Era" /></div>
        <p className="be-footer-tagline">Design. Print. Brand. Deliver.</p>
        <p className="be-footer-sub">Custom merchandise, print, and branded essentials made for your next big idea.</p>
      </div>
      <div className="be-footer-links">
        <div className="be-footer-col">
          <h4>Products</h4>
          <Link to="/tshirts">T-Shirts</Link>
          <Link to="/hoodies">Hoodies</Link>
          <Link to="/accessories">Accessories</Link>
          <Link to="/alumni-kits">Alumni Kits</Link>
        </div>
        <div className="be-footer-col">
          <h4>Services</h4>
          <Link to="/services">All Services</Link>
          <Link to="/print-studio">Design Studio</Link>
          <Link to="/bulk-order">Bulk Orders</Link>
          <Link to="/account">My Account</Link>
        </div>
        <div className="be-footer-col">
          <h4>Company</h4>
          <Link to="/about-us">About Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/feedback">Feedback</Link>
        </div>
        <div className="be-footer-col">
          <h4>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
    <div className="be-footer-bottom">
      <span>&copy; {new Date().getFullYear()} Brand Era. All rights reserved.</span>
      <div className="be-footer-bottom-links">
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/disclaimer">Disclaimer</Link>
        <Link to="/faq">Support</Link>
      </div>
    </div>
  </footer>
);

export default BrandEraChrome;