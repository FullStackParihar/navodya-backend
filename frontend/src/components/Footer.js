import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Navodaya Trendz</h3>
            <p>Made by Navodayans, for Navodayans. Your trusted partner for JNV alumni merchandise.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/tshirts">T-Shirts</Link></li>
              <li><Link to="/hoodies">Hoodies</Link></li>
              <li><Link to="/accessories">Accessories</Link></li>
              <li><Link to="/alumni-kits">Alumni Kits</Link></li>
              <li><Link to="/customize">Customize</Link></li>
              <li><Link to="/offers">Offers</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Help</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Policies</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Navodaya Trendz. All Rights Reserved. | Made with ❤️ by Navodayans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
