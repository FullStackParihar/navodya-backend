import React from 'react';
import { Link } from 'react-router-dom';

const FooterEnhanced = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
      color: 'white', 
      padding: '60px 20px 20px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr', 
          gap: '40px', 
          marginBottom: '40px' 
        }}>
          <div>
            <img src="/logo.png" alt="Navodaya Trendz" style={{ height: '120px', marginBottom: '16px' }} />
            <p style={{ color: '#dbeafe', marginBottom: '20px', lineHeight: '1.6' }}>
              Made by Navodayans, for Navodayans. Premium quality merchandise celebrating the Navodaya spirit.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://wa.me/919284490206" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                fontSize: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                 onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                fontSize: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                 onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                fontSize: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                 onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'white' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/tshirts" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                T-Shirts
              </Link>
              <Link to="/hoodies" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Hoodies
              </Link>
              <Link to="/accessories" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Accessories
              </Link>
              <Link to="/alumni-kits" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Alumni Kits
              </Link>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'white' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                About Us
              </Link>
              <Link to="/contact" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Contact
              </Link>
              <Link to="/gallery" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Gallery
              </Link>
              <Link to="/events" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Events
              </Link>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'white' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Home
              </Link>
              <Link to="/regional-alumni" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Regional Alumni
              </Link>
              <Link to="/bulk-order" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Bulk Orders
              </Link>
              <Link to="/cart" style={{ color: '#dbeafe', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#dbeafe'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                Cart
              </Link>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: '#dbeafe', margin: 0, fontSize: '14px' }}>
            &copy; 2025 Navodaya Trendz. All Rights Reserved.
          </p>
          <p style={{ color: '#dbeafe', margin: 0, fontSize: '14px' }}>
            Powered by <a href="https://brandera.co.in" target="_blank" rel="noopener noreferrer" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '700',
              transition: 'all 0.2s'
            }} 
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
              Brandera
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterEnhanced;
