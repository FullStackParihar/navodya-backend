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

  return <>
    <header className="be-chrome">
      <Link to="/" className="be-wordmark" aria-label="Brand Era home"><img src="/brlogo.png" alt="Brand Era" /></Link>
      <nav aria-label="Brand Era navigation">
        <Link className={active('/tshirts')} to="/tshirts">Products</Link>
        <Link className={active('/alumni-kits')} to="/alumni-kits">Solutions</Link>
        <Link className={active('/print-studio')} to="/print-studio">Design Studio</Link>
        <Link className={active('/bulk-order')} to="/bulk-order">Bulk Orders</Link>
      </nav>
      <div className="be-chrome-actions">
        <Link to="/search" aria-label="Search">Search</Link>
        <Link to="/wishlist" aria-label="Saved products">Saved{wishlistItems ? ` (${wishlistItems})` : ''}</Link>
        <Link to="/account">Account</Link>
        <Link className="be-cart-link" to="/cart">Cart{totalItems ? ` (${totalItems})` : ''} <b>→</b></Link>
      </div>
    </header>
  </>;
};

export const BrandEraFooter = () => <footer className="be-footer">
  <div><div className="be-wordmark"><img src="/brlogo.png" alt="Brand Era" /></div><p>Design. Print. Brand. Deliver.</p></div>
  <p>Custom merchandise, print, and branded essentials made for your next big idea.</p>
  <nav><Link to="/tshirts">Products</Link><Link to="/print-studio">Design Studio</Link><Link to="/bulk-order">Request a quote</Link><Link to="/faq">Support</Link></nav>
</footer>;

export default BrandEraChrome;
