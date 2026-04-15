import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FooterEnhanced.css';

const FooterEnhanced = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleComingSoon = (label) => {
    alert(`${label} is coming soon!`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Navodaya Trendz newsletter!');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Universal Enhanced Footer */}
      <footer className="universal-footer">
        {/* Footer Top Section */}
        <div className="footer-top">
          <div className="footer-top-content">
            {/* Brand Section */}
            <div className="footer-brand footer-animate">
              <h3>Navodaya<span>Trendz</span></h3>
              <p>Made by Navodayans, for Navodayans. Your trusted partner for JNV alumni merchandise.</p>
              <div className="footer-social">
                <a href="https://facebook.com" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://whatsapp.com" className="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Shop Section */}
            <div className="footer-section footer-animate footer-animate-delay-1">
              <h4>Shop</h4>
              <ul className="footer-links">
                <li><Link to="/tshirts"><i className="fas fa-chevron-right"></i> T-Shirts</Link></li>
                <li><Link to="/hoodies"><i className="fas fa-chevron-right"></i> Hoodies</Link></li>
                <li><Link to="/accessories"><i className="fas fa-chevron-right"></i> Accessories</Link></li>
                <li><Link to="/alumni-kits"><i className="fas fa-chevron-right"></i> Alumni Kits</Link></li>
                <li><Link to="/customize"><i className="fas fa-chevron-right"></i> Customize</Link></li>
                <li><Link to="/today-deals"><i className="fas fa-chevron-right"></i> Today's Deals</Link></li>
                <li><Link to="/new-arrivals"><i className="fas fa-chevron-right"></i> New Arrivals</Link></li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="footer-section footer-animate footer-animate-delay-2">
              <h4>Help</h4>
              <ul className="footer-links">
                <li><Link to="/contact"><i className="fas fa-chevron-right"></i> Contact Us</Link></li>
                <li><Link to="/shipping"><i className="fas fa-chevron-right"></i> Shipping Info</Link></li>
                <li><Link to="/returns"><i className="fas fa-chevron-right"></i> Returns & Exchanges</Link></li>
                <li><Link to="/size-guide"><i className="fas fa-chevron-right"></i> Size Guide</Link></li>
                <li><Link to="/track-order"><i className="fas fa-chevron-right"></i> Track Order</Link></li>
                <li><Link to="/faq"><i className="fas fa-chevron-right"></i> FAQ</Link></li>
              </ul>
            </div>

            {/* Policies Section */}
            <div className="footer-section footer-animate footer-animate-delay-3">
              <h4>Policies</h4>
              <ul className="footer-links">
                <li><Link to="/privacy-policy"><i className="fas fa-chevron-right"></i> Privacy Policy</Link></li>
                <li><Link to="/terms-conditions"><i className="fas fa-chevron-right"></i> Terms & Conditions</Link></li>
                <li><Link to="/refund-policy"><i className="fas fa-chevron-right"></i> Refund Policy</Link></li>
                <li><Link to="/disclaimer"><i className="fas fa-chevron-right"></i> Disclaimer</Link></li>
                <li><Link to="/cookie-policy"><i className="fas fa-chevron-right"></i> Cookie Policy</Link></li>
                <li><Link to="/shipping-policy"><i className="fas fa-chevron-right"></i> Shipping Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Middle Section */}
        <div className="footer-middle">
          <div className="footer-middle-content">
            {/* Payment Methods */}
            <div className="payment-section">
              <h5>Payment Methods</h5>
              <div className="payment-icons">
                <div className="payment-icon" title="Visa">
                  <i className="fab fa-cc-visa"></i>
                </div>
                <div className="payment-icon" title="Mastercard">
                  <i className="fab fa-cc-mastercard"></i>
                </div>
                <div className="payment-icon" title="American Express">
                  <i className="fab fa-cc-amex"></i>
                </div>
                <div className="payment-icon" title="PayPal">
                  <i className="fab fa-cc-paypal"></i>
                </div>
                <div className="payment-icon" title="Google Pay">
                  <i className="fab fa-google-pay"></i>
                </div>
                <div className="payment-icon" title="Apple Pay">
                  <i className="fab fa-apple-pay"></i>
                </div>
                <div className="payment-icon" title="Net Banking">
                  <i className="fas fa-university"></i>
                </div>
                <div className="payment-icon" title="Cash on Delivery">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-section">
              <h5>Why Shop With Us</h5>
              <div className="trust-badges">
                <div className="trust-badge">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="trust-badge">
                  <i className="fas fa-truck"></i>
                  <span>Fast Delivery</span>
                </div>
                <div className="trust-badge">
                  <i className="fas fa-undo"></i>
                  <span>Easy Returns</span>
                </div>
                <div className="trust-badge">
                  <i className="fas fa-headset"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* App Download */}
            <div className="app-section">
              <h5>Download App</h5>
              <div className="app-buttons">
                <button type="button" className="app-button" onClick={() => handleComingSoon('Google Play app')}>
                  <i className="fab fa-google-play"></i>
                  <span>Google Play</span>
                </button>
                <button type="button" className="app-button" onClick={() => handleComingSoon('App Store app')}>
                  <i className="fab fa-app-store"></i>
                  <span>App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>🎓 Stay Connected with Navodayans</h3>
            <p>Get exclusive offers, new arrivals, and alumni meet updates delivered to your inbox</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                className="newsletter-input" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 Navodaya Trendz. All Rights Reserved. | Made with <span>❤️</span> by Navodayans</p>
            <div className="bottom-links">
              <button type="button" onClick={() => handleComingSoon('Sitemap')}>Sitemap</button>
              <button type="button" onClick={() => handleComingSoon('Careers')}>Careers</button>
              <button type="button" onClick={() => handleComingSoon('Press')}>Press</button>
              <button type="button" onClick={() => handleComingSoon('Partner with Us')}>Partner with Us</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
};

export default FooterEnhanced;
