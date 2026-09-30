import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './BrandEraChrome.css';

const BrandEraChrome = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const location = useLocation();
  const active = (path) => location.pathname === path ? 'active' : '';

  const userRole = localStorage.getItem('userRole') || 'user';
  const isAdmin = userRole === 'admin' || localStorage.getItem('userEmail') === 'admin@navodaya.com';

  return <>
    <header className="be-chrome">
      <Link to="/" className="be-wordmark" aria-label="Brand Era home"><img src="/brlogo.png" alt="Brand Era" /></Link>
      <nav aria-label="Brand Era navigation">
        <Link className={active('/products')} to="/products">Products</Link>
        <Link className={active('/alumni-kits')} to="/alumni-kits">Solutions</Link>
        <Link className={active('/print-studio')} to="/print-studio">Design Studio</Link>
        <Link className={active('/bulk-order')} to="/bulk-order">Bulk Orders</Link>
      </nav>
      <div className="be-chrome-actions">
        <Link to="/search" aria-label="Search">Search</Link>
        <Link to="/wishlist" aria-label="Saved products">Saved{wishlistItems ? ` (${wishlistItems})` : ''}</Link>
        {isAdmin && <Link to="/admin-profile" style={{ color: '#e63322', fontWeight: 'bold' }}>👑 Admin</Link>}
        <Link to="/account">Account</Link>
        <Link className="be-cart-link" to="/cart">Cart{totalItems ? ` (${totalItems})` : ''} <b>→</b></Link>
      </div>
    </header>
  </>;
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
