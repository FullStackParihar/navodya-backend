import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FooterEnhanced = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [footerTheme, setFooterTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setFooterTheme(localStorage.getItem('theme') || 'light');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
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
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3><span className="newsletter-icon" aria-hidden="true">&#127891;</span> Stay Connected with Navodayans</h3>
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

        {/* Footer Top Section */}
        <div className="footer-top">
          <div className="footer-top-content">
            {/* Brand Section */}
            <div className="footer-brand footer-animate">
              <div className="footer-brand-mark">
                <img src="/logo2.png" alt="Navodaya Trendz" />
                <h3>Navodaya<span>Trendz</span></h3>
              </div>
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

                <li><Link to="/about-us"><i className="fas fa-chevron-right"></i> About Us</Link></li>
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

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; 2025 Navodaya Trendz. All Rights Reserved. | Made with <span aria-hidden="true">&#10084;</span> by Navodayans</p>
            <div className="bottom-links">
              <a href="#">Sitemap</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Partner with Us</a>
              <span 
                className="theme-toggle-link"
                onClick={() => {
                  const currentTheme = localStorage.getItem('theme') || 'light';
                  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                  localStorage.setItem('theme', newTheme);
                  document.documentElement.setAttribute('data-theme', newTheme);
                  document.body.classList.remove('theme-light', 'theme-dark');
                  document.body.classList.add(`theme-${newTheme}`);
                  window.dispatchEvent(new Event('theme-change'));
                }}
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <i className={`fas ${footerTheme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                Theme: {footerTheme === 'light' ? 'Dark' : 'Light'}
              </span>
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
      <style>{`
        /* Black & White Footer Variables */
        :root {
          --footer-primary: #000000;
          --footer-secondary: #111111;
          --footer-accent: #ffffff;
          --footer-text: #ffffff;
          --footer-text-light: #999999;
          --footer-border: #333333;
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

        .social-link:nth-child(1) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .social-link:nth-child(2) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .social-link:nth-child(3) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .social-link:nth-child(4) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .social-link:nth-child(5) { color: #fff; background: rgba(255, 255, 255, 0.1); }

        .social-link:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          background: #ffffff;
          color: #000000;
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

        .payment-icon:nth-child(1) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(2) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(3) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(4) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(5) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(6) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(7) { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .payment-icon:nth-child(8) { color: #fff; background: rgba(255, 255, 255, 0.1); }

        .payment-icon:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          background: #ffffff;
          color: #000000;
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
          color: #000000;
          transform: translateY(-2px);
        }

        .app-button i {
          font-size: 16px;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: #ffffff;
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
          color: #000000;
          margin: 0 0 10px 0;
        }

        .newsletter-content p {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.8);
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
          border: 2px solid #000000;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          color: #000000;
        }

        .newsletter-button {
          padding: 12px 25px;
          background: #000000;
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
          background: #333333;
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
          background: #000000;
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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }

        .back-to-top:hover {
          background: #333333;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
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
            bottom: 85px;
            right: 15px;
            width: 42px;
            height: 42px;
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
            width: 40px;
            height: 40px;
            bottom: 85px;
            right: 15px;
          }
          
          .back-to-top i {
            font-size: 16px;
          }
        }

        /* Production footer layout overrides */
        .universal-footer {
          margin-top: 72px;
          background: #0f172a;
          color: #f8fafc;
          border-top: 0;
          overflow: hidden;
        }

        .footer-top,
        .footer-middle,
        .footer-bottom {
          background: transparent;
        }

        .footer-top {
          padding: 52px 0 36px;
          border-bottom: 0;
        }

        .footer-top-content {
          max-width: 1280px;
          padding: 0 24px;
          grid-template-columns: minmax(260px, 1.5fr) repeat(3, minmax(160px, 1fr));
          gap: clamp(28px, 4vw, 56px);
          align-items: start;
        }

        .footer-brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand-mark img {
          width: 58px;
          height: auto;
          object-fit: contain;
          filter: brightness(1.08);
        }

        .footer-brand-mark h3 {
          margin: 0;
          font-size: 22px;
          line-height: 1.05;
          letter-spacing: 0;
          color: #ffffff;
        }

        .footer-brand-mark h3 span {
          display: block;
          color: #cbd5e1;
        }

        .footer-brand p {
          max-width: 360px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.7;
        }

        .footer-section {
          gap: 14px;
          min-width: 0;
        }

        .footer-section h4 {
          padding-bottom: 12px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .footer-section h4::after {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: #94a3b8;
        }

        .footer-links {
          gap: 8px;
        }

        .footer-links a {
          width: max-content;
          max-width: 100%;
          padding: 4px 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.35;
        }

        .footer-links a i {
          width: 14px;
          font-size: 10px;
          color: #94a3b8;
          transition: transform 0.2s, color 0.2s;
        }

        .footer-links a:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .footer-links a:hover i {
          color: #ffffff;
          transform: translateX(2px);
        }

        .footer-social {
          gap: 10px;
          flex-wrap: wrap;
        }

        .social-link {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: none;
        }

        .social-link i {
          font-size: 15px;
        }

        .social-link:hover {
          background: #ffffff !important;
          color: #0f172a !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
        }

        .footer-middle {
          padding: 28px 0;
          border-bottom: 0;
        }

        .footer-middle-content {
          max-width: 1280px;
          padding: 0 24px;
          grid-template-columns: 1.2fr 1.2fr 0.9fr;
          gap: 28px;
          align-items: start;
        }

        .payment-section h5,
        .trust-section h5,
        .app-section h5 {
          color: #ffffff;
          font-size: 13px;
          letter-spacing: 0.06em;
        }

        .payment-icons,
        .app-buttons {
          gap: 8px;
        }

        .payment-icon {
          width: 42px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .payment-icon:hover {
          background: #ffffff !important;
          color: #0f172a !important;
          transform: translateY(-2px);
          box-shadow: none;
        }

        .trust-badges {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .trust-badge {
          min-height: 40px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .trust-badge i {
          color: #ffffff;
        }

        .trust-badge span {
          color: #cbd5e1;
          font-size: 12px;
        }

        .app-button {
          min-height: 40px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .app-button:hover {
          background: #ffffff;
          color: #0f172a;
          transform: translateY(-2px);
        }

        .newsletter-section {
          padding: 42px 0 38px;
          background: #f8fafc;
          border-bottom: 0;
        }

        .newsletter-content {
          max-width: 700px;
        }

        .newsletter-content h3 {
          margin-bottom: 8px;
          color: #111827;
          font-size: clamp(24px, 3vw, 36px);
          line-height: 1.22;
          letter-spacing: 0;
        }

        .newsletter-content p {
          color: #64748b;
          font-size: clamp(14px, 1.6vw, 18px);
          line-height: 1.5;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .newsletter-form {
          max-width: 650px;
          gap: 8px;
          padding: 6px;
          border: 1px solid #dbe2ea;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.10);
        }

        .newsletter-input {
          min-height: 58px;
          border: 0;
          border-radius: 12px;
          padding: 0 20px;
          font-size: 16px;
        }

        .newsletter-input:focus {
          box-shadow: 0 0 0 3px rgba(47, 74, 103, 0.12);
        }

        .newsletter-button {
          min-height: 52px;
          border-radius: 12px;
          padding: 0 24px;
          background: #2f4a67;
          font-size: 16px;
        }

        .newsletter-button:hover {
          background: #23394f;
          transform: none;
        }

        .footer-bottom {
          padding: 20px 0;
        }

        .footer-bottom-content {
          max-width: 1280px;
          padding: 0 24px;
          gap: 16px;
        }

        .copyright {
          color: #cbd5e1;
          font-size: 13px;
        }

        .bottom-links {
          align-items: center;
          flex-wrap: wrap;
          gap: 12px 18px;
        }

        .bottom-links a,
        .theme-toggle-link {
          color: #cbd5e1;
          font-size: 13px;
        }

        .bottom-links a:hover,
        .theme-toggle-link:hover {
          color: #ffffff;
        }

        .back-to-top {
          width: 44px;
          height: 44px;
          right: 22px;
          bottom: 22px;
          background: #2f4a67;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.22);
        }

        .back-to-top:hover {
          background: #23394f;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .footer-top-content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 34px;
          }

          .footer-middle-content {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .trust-badges {
            max-width: none;
            margin: 0;
          }

          .app-buttons,
          .payment-icons {
            justify-content: flex-start;
          }
        }

        @media (max-width: 700px) {
          .universal-footer {
            margin-top: 48px;
          }

          .footer-top {
            padding: 38px 0 28px;
          }

          .footer-top-content {
            grid-template-columns: 1fr;
            gap: 28px;
            text-align: left;
          }

          .footer-brand,
          .footer-section {
            align-items: flex-start;
          }

          .footer-brand p,
          .footer-links,
          .footer-section h4 {
            text-align: left;
          }

          .footer-section h4::after {
            left: 0;
            transform: none;
          }

          .footer-links {
            align-items: flex-start;
          }

          .footer-social,
          .payment-icons,
          .app-buttons {
            justify-content: flex-start;
          }

          .trust-badges {
            grid-template-columns: 1fr;
          }

          .newsletter-form {
            flex-direction: column;
            max-width: 420px;
          }

          .newsletter-input,
          .newsletter-button {
            min-height: 50px;
            font-size: 15px;
          }

          .newsletter-button {
            width: 100%;
          }

          .footer-bottom-content {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .bottom-links {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .footer-top-content,
          .footer-middle-content,
          .newsletter-content,
          .footer-bottom-content {
            padding-left: 18px;
            padding-right: 18px;
          }

          .footer-brand-mark img {
            width: 50px;
          }

          .footer-brand-mark h3 {
            font-size: 20px;
          }

          .social-link {
            width: 36px;
            height: 36px;
          }

          .payment-icon {
            width: 38px;
            height: 28px;
          }

          .back-to-top {
            width: 40px;
            height: 40px;
            right: 16px;
            bottom: 16px;
          }
        }

        /* Final production footer alignment */
        .newsletter-section {
          padding: 40px 0 36px;
          background: #f8fafc;
        }

        .newsletter-icon {
          display: inline-flex;
          margin-right: 8px;
          vertical-align: -0.04em;
        }

        .newsletter-content h3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          font-weight: 800;
        }

        .newsletter-form {
          align-items: stretch;
        }

        .newsletter-button,
        .app-button,
        .payment-icon,
        .trust-badge,
        .social-link,
        .bottom-links a,
        .theme-toggle-link {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .footer-top {
          padding: 50px 0 30px;
        }

        .footer-top-content {
          width: 100%;
          max-width: 1280px;
          display: grid;
          grid-template-columns: minmax(280px, 1.35fr) repeat(3, minmax(150px, 1fr));
          gap: clamp(26px, 3.5vw, 52px);
        }

        .footer-brand,
        .footer-section,
        .payment-section,
        .trust-section,
        .app-section {
          min-width: 0;
        }

        .footer-brand-mark {
          margin-bottom: 16px;
        }

        .footer-brand p {
          margin-bottom: 20px;
        }

        .footer-section h4,
        .payment-section h5,
        .trust-section h5,
        .app-section h5 {
          margin: 0 0 14px;
        }

        .footer-section h4::after {
          left: 0;
          transform: none;
        }

        .footer-links a:focus-visible,
        .social-link:focus-visible,
        .payment-icon:focus-visible,
        .app-button:focus-visible,
        .bottom-links a:focus-visible,
        .theme-toggle-link:focus-visible,
        .newsletter-input:focus-visible,
        .newsletter-button:focus-visible,
        .back-to-top:focus-visible {
          outline: 3px solid rgba(148, 163, 184, 0.35);
          outline-offset: 3px;
        }

        .footer-middle {
          padding: 24px 0 30px;
        }

        .footer-middle-content {
          width: 100%;
          max-width: 1280px;
          display: grid;
          grid-template-columns: minmax(260px, 1.1fr) minmax(300px, 1.15fr) minmax(220px, 0.8fr);
          gap: clamp(22px, 3vw, 40px);
        }

        .payment-icons {
          display: flex;
          flex-wrap: wrap;
        }

        .payment-icon {
          cursor: default;
        }

        .trust-badges {
          display: grid;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
        }

        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.10);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-1px);
        }

        .app-buttons {
          display: grid;
          grid-template-columns: 1fr;
          max-width: 180px;
        }

        .app-button {
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .footer-bottom {
          background: rgba(2, 6, 23, 0.34);
          padding: 4px 0 !important;
        }

        .footer-bottom-content {
          min-height: 30px;
          gap: 8px 16px;
        }

        .bottom-links a,
        .theme-toggle-link {
          min-height: 22px;
          align-items: center;
        }

        .copyright {
          margin: 0;
          line-height: 1.2;
        }

        @media (max-width: 1100px) {
          .footer-top-content {
            grid-template-columns: minmax(260px, 1.2fr) repeat(3, minmax(130px, 1fr));
            gap: 26px;
          }

          .footer-middle-content {
            grid-template-columns: 1fr 1fr;
          }

          .app-section {
            grid-column: 1 / -1;
          }

          .app-buttons {
            grid-template-columns: repeat(2, minmax(140px, 180px));
            max-width: none;
          }
        }

        @media (max-width: 820px) {
          .newsletter-section {
            padding: 34px 0 32px;
          }

          .footer-top-content,
          .footer-middle-content {
            grid-template-columns: 1fr 1fr;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 620px) {
          .newsletter-content h3 {
            flex-wrap: wrap;
            font-size: 24px;
          }

          .footer-top-content,
          .footer-middle-content {
            grid-template-columns: 1fr;
          }

          .footer-middle {
            padding-top: 10px;
          }

          .app-section {
            grid-column: auto;
          }

          .app-buttons {
            grid-template-columns: 1fr;
            max-width: 220px;
          }

          .footer-bottom-content {
            gap: 12px;
          }
        }

        /* Crop the empty area in the square logo asset so the footer mark is
           clearly visible at laptop sizes without increasing footer height. */
        @media (min-width: 821px) {
          .footer-brand-mark {
            overflow: hidden;
            width: 100%;
            height: 45px;
            align-items: center;
            gap: 8px;
          }

          .footer-brand-mark img {
            width: 145px;
            height: 145px;
            max-width: none;
            flex: 0 0 145px;
            align-self: flex-start;
            transform: translateY(-52px);
          }

          .footer-brand-mark h3 {
            min-width: 0;
            font-size: 16px !important;
            line-height: 1.1;
            white-space: normal;
          }
        }

        /* Mobile footer logo: use the same cropped treatment instead of
           shrinking the entire square source image. */
        @media (max-width: 820px) {
          .footer-brand-mark {
            width: 100%;
            height: 45px;
            overflow: hidden;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
          }

          .footer-brand-mark img {
            width: 145px;
            height: 145px;
            max-width: none;
            flex: 0 0 145px;
            align-self: flex-start;
            transform: translateY(-52px);
          }

          .footer-brand-mark h3 {
            min-width: 0;
            font-size: 16px !important;
            line-height: 1.1;
            white-space: normal;
          }
        }

        @media (max-width: 420px) {
          .footer-brand-mark {
            height: 42px;
          }

          .footer-brand-mark img {
            width: 130px;
            height: 130px;
            flex-basis: 130px;
            transform: translateY(-46px);
          }
        }
      `}</style>
    </>
  );
};

export default FooterEnhanced;
