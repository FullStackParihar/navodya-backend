import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FooterEnhanced = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

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
                <a href="#" className="app-button">
                  <i className="fab fa-google-play"></i>
                  <span>Google Play</span>
                </a>
                <a href="#" className="app-button">
                  <i className="fab fa-app-store"></i>
                  <span>App Store</span>
                </a>
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
              <a href="#">Sitemap</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Partner with Us</a>
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

      {/* Enhanced Footer Styles */}
      <style jsx>{`
        /* Amazon-Inspired Footer Variables */
        :root {
          --footer-primary: #131921;
          --footer-secondary: #232f3e;
          --footer-accent: #2f4a67;
          --footer-text: #ffffff;
          --footer-text-light: #999999;
          --footer-border: #37475a;
          --transition-footer: all 0.3s ease;
        }

        /* Main Footer Container */
        .universal-footer {
          background: var(--footer-primary);
          color: var(--footer-text);
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin-top: 80px;
          position: relative;
        }

        /* Footer Top Section */
        .footer-top {
          background: var(--footer-secondary);
          padding: 40px 0;
          border-bottom: 1px solid var(--footer-border);
        }

        .footer-top-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }

        /* Brand Section */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-brand h3 {
          font-size: 28px;
          font-weight: 700;
          color: var(--footer-text);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-brand h3 span {
          color: var(--footer-accent);
        }

        .footer-brand p {
          font-size: 16px;
          line-height: 1.6;
          color: var(--footer-text-light);
          margin: 0;
          max-width: 400px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--footer-text);
          text-decoration: none;
          transition: var(--transition-footer);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .social-link:hover {
          background: var(--footer-accent);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(255, 153, 0, 0.3);
        }

        .social-link i {
          font-size: 18px;
        }

        /* Footer Sections */
        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-section h4 {
          font-size: 18px;
          font-weight: 600;
          color: var(--footer-text);
          margin: 0;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-section h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--footer-accent);
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links a {
          color: var(--footer-text-light);
          text-decoration: none;
          font-size: 15px;
          transition: var(--transition-footer);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
        }

        .footer-links a:hover {
          color: var(--footer-accent);
          transform: translateX(5px);
        }

        .footer-links a i {
          font-size: 12px;
          width: 16px;
          text-align: center;
          opacity: 0.7;
        }

        .footer-links a:hover i {
          opacity: 1;
        }

        /* Footer Middle Section */
        .footer-middle {
          background: var(--footer-primary);
          padding: 30px 0;
          border-bottom: 1px solid var(--footer-border);
        }

        .footer-middle-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .payment-section h5,
        .trust-section h5,
        .app-section h5 {
          font-size: 14px;
          font-weight: 600;
          color: var(--footer-text);
          margin: 0 0 15px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .payment-icons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .payment-icon {
          width: 40px;
          height: 25px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--footer-text);
          font-size: 16px;
          transition: var(--transition-footer);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .payment-icon:hover {
          background: var(--footer-accent);
          transform: translateY(-2px);
        }

        .trust-badges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition-footer);
        }

        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .trust-badge i {
          color: var(--footer-accent);
          font-size: 14px;
        }

        .trust-badge span {
          font-size: 12px;
          color: var(--footer-text-light);
          font-weight: 500;
        }

        .app-buttons {
          display: flex;
          gap: 10px;
        }

        .app-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: var(--footer-text);
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          transition: var(--transition-footer);
        }

        .app-button:hover {
          background: var(--footer-accent);
          color: white;
          transform: translateY(-2px);
        }

        .app-button i {
          font-size: 16px;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, var(--footer-accent) 0%, #23394f 100%);
          padding: 40px 0;
          text-align: center;
        }

        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .newsletter-content h3 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 10px 0;
        }

        .newsletter-content p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 25px 0;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          max-width: 400px;
          margin: 0 auto;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background: rgba(255, 255, 255, 0.9);
        }

        .newsletter-button {
          padding: 12px 25px;
          background: var(--footer-primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-footer);
          white-space: nowrap;
        }

        .newsletter-button:hover {
          background: var(--footer-secondary);
          transform: translateY(-2px);
        }

        /* Footer Bottom */
        .footer-bottom {
          background: var(--footer-primary);
          padding: 25px 0;
          border-top: 1px solid var(--footer-border);
        }

        .footer-bottom-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright {
          font-size: 14px;
          color: var(--footer-text-light);
          margin: 0;
        }

        .copyright span {
          color: var(--footer-accent);
        }

        .bottom-links {
          display: flex;
          gap: 20px;
        }

        .bottom-links a {
          color: var(--footer-text-light);
          text-decoration: none;
          font-size: 13px;
          transition: var(--transition-footer);
        }

        .bottom-links a:hover {
          color: var(--footer-accent);
        }

        /* Back to Top Button */
        .back-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--footer-accent);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-footer);
          opacity: 0;
          visibility: hidden;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }

        .back-to-top:hover {
          background: #23394f;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(47, 74, 103, 0.4);
        }

        .back-to-top i {
          font-size: 20px;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-animate {
          animation: fadeInUp 0.6s ease-out;
        }

        .footer-animate-delay-1 {
          animation-delay: 0.1s;
        }

        .footer-animate-delay-2 {
          animation-delay: 0.2s;
        }

        .footer-animate-delay-3 {
          animation-delay: 0.3s;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-top-content {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          
          .footer-middle-content {
            grid-template-columns: 1fr;
            gap: 30px;
            text-align: center;
          }
          
          .trust-badges {
            grid-template-columns: 1fr;
            max-width: 200px;
            margin: 0 auto;
          }
          
          .app-buttons {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .footer-top {
            padding: 30px 0;
          }
          
          .footer-top-content {
            grid-template-columns: 1fr;
            gap: 25px;
            text-align: center;
          }
          
          .footer-brand {
            align-items: center;
          }
          
          .footer-brand p {
            max-width: 100%;
            text-align: center;
          }
          
          .footer-social {
            justify-content: center;
          }
          
          .footer-section {
            align-items: center;
          }
          
          .footer-section h4::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .footer-links {
            align-items: center;
          }
          
          .footer-middle {
            padding: 25px 0;
          }
          
          .payment-icons {
            justify-content: center;
          }
          
          .newsletter-form {
            flex-direction: column;
            max-width: 300px;
          }
          
          .footer-bottom-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .bottom-links {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .universal-footer {
            margin-top: 60px;
          }
          
          .footer-top {
            padding: 25px 0;
          }
          
          .footer-brand h3 {
            font-size: 24px;
          }
          
          .footer-brand p {
            font-size: 15px;
          }
          
          .footer-section h4 {
            font-size: 16px;
          }
          
          .footer-links a {
            font-size: 14px;
          }
          
          .newsletter-content h3 {
            font-size: 24px;
          }
          
          .newsletter-content p {
            font-size: 15px;
          }
          
          .trust-badges {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .trust-badge {
            padding: 6px 10px;
          }
          
          .trust-badge span {
            font-size: 11px;
          }
          
          .app-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .app-button {
            width: 200px;
            justify-content: center;
          }
          
          .payment-icons {
            gap: 8px;
          }
          
          .payment-icon {
            width: 35px;
            height: 22px;
            font-size: 14px;
          }
          
          .back-to-top {
            width: 45px;
            height: 45px;
            bottom: 20px;
            right: 20px;
          }
          
          .back-to-top i {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default FooterEnhanced;
