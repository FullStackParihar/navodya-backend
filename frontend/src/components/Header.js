import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const location = useLocation();
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
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

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#0f172a',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>
        
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '1999',
            display: 'block'
          }}
        ></div>
      )}
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed',
          top: '0',
          right: '0',
          width: '280px',
          height: '100vh',
          background: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: '2000',
          padding: '80px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto'
        }}>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#0f172a',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
          
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            Home
          </Link>
          
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Shop</div>
            {shopCategories.map((cat, idx) => (
              <Link 
                key={idx} 
                to={cat.link} 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                <i className={cat.icon} style={{ marginRight: '10px', width: '20px' }}></i>
                {cat.name}
              </Link>
            ))}
          </div>
          
          <Link 
            to="/regional-alumni" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            Regional Alumni
          </Link>
          
          <Link 
            to="/events" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            Events
          </Link>
          
          <Link 
            to="/bulk-order" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            Bulk Orders
          </Link>
          
          <Link 
            to="/about" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px'
            }}
          >
            About Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
