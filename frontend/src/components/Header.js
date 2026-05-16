import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const location = useLocation();
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const isAdmin = isAuthenticated && (userRole === 'admin' || localStorage.getItem('userEmail') === 'admin@navodaya.com');

  const shopCategories = [
    { name: 'All Products', link: '/tshirts', icon: 'fas fa-store' },
    { name: 'T-Shirts', link: '/tshirts', icon: 'fas fa-tshirt' },
    { name: 'Hoodies', link: '/hoodies', icon: 'fas fa-mitten' },
    { name: 'Momentum', link: '/momentum', icon: 'fas fa-trophy' },
    { name: 'Accessories', link: '/accessories', icon: 'fas fa-watch' },
    { name: 'Alumni Kits', link: '/alumni-kits', icon: 'fas fa-briefcase' },
    { name: 'Event Merchandise', link: '/event-merchandise', icon: 'fas fa-gift' },
    { name: 'Custom Orders', link: '/customize', icon: 'fas fa-palette' },
    { name: 'Comprehensive Form', link: '/comprehensive-form', icon: 'fas fa-file-alt' }
  ];

  return (
    <header className="header-new">
      <div className="container header-container">
        <Link to="/" className="logo-new">
          <img src="/logo.png" alt="Navodaya Trendz" style={{ height: '100px' }} />
        </Link>
        
        <nav className="nav-links-new">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button className="nav-link-btn">
              Shop <i className="fas fa-chevron-down" style={{ fontSize: '12px', marginLeft: '6px' }}></i>
            </button>
            
            {shopDropdownOpen && (
              <div className="dropdown-menu">
                {shopCategories.map((cat, idx) => (
                  <Link 
                    key={idx} 
                    to={cat.link} 
                    className="dropdown-item"
                    onClick={() => setShopDropdownOpen(false)}
                  >
                    <i className={cat.icon} style={{ marginRight: '10px' }}></i>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link to="/regional-alumni" className={location.pathname === '/regional-alumni' ? 'active' : ''}>Regional Alumni</Link>
          <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>Events</Link>
          <Link to="/bulk-order" className={location.pathname === '/bulk-order' ? 'active' : ''}>Bulk Orders</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
        </nav>
        
        <div className="header-right">
          <div className="header-icons-new">
            {isAdmin && (
              <Link to="/admin" className="header-icon-btn" title="Admin Panel">
                <i className="fas fa-cog"></i>
              </Link>
            )}
            <Link to="/wishlist" className="header-icon-btn">
              <i className="far fa-heart"></i>
            </Link>
            <Link to="/cart" className="header-icon-btn cart-icon-new">
              <i className="fas fa-shopping-cart"></i>
              {totalItems > 0 && <span className="cart-badge-new">{totalItems}</span>}
            </Link>
            <Link to={isAuthenticated ? "/user-profile" : "/login"} className="header-icon-btn login-btn-new">
              <i className="far fa-user"></i>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
