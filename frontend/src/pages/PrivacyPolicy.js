import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="info-page">
      <div className="container">
        <header className="info-header">
          <h1>Privacy Policy</h1>
          <p className="subtitle">Effective Date: January 1, 2025</p>
        </header>

        <section className="info-section">
          <h2>Introduction</h2>
          <p>
            Navodaya Trendz (&ldquo;NTz&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you visit <a href="https://www.navodayatrendz.com" target="_blank" rel="noopener noreferrer">www.navodayatrendz.com</a>.
          </p>
        </section>

        <section className="info-section">
          <h2>Information We Collect</h2>
          
          <h3>A. Personal Information</h3>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping/Billing address</li>
            <li>Payment details (processed securely by payment gateways)</li>
          </ul>

          <h3>B. Non-Personal Information</h3>
          <ul>
            <li>IP address</li>
            <li>Device type</li>
            <li>Browser details</li>
            <li>Pages visited</li>
            <li>Cookies &amp; analytics data</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>How We Use Your Information</h2>
          <p>We use your information for:</p>
          <ul>
            <li>Processing orders and payments</li>
            <li>Shipping &amp; delivery tracking</li>
            <li>Customer support and communication</li>
            <li>Marketing emails/SMS (only if you opt in)</li>
            <li>Improving website user experience</li>
            <li>Preventing fraud or misuse</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>Data Sharing</h2>
          <p>We do not sell or trade your data. We share data only with:</p>
          <ul>
            <li>Delivery partners (for shipping)</li>
            <li>Payment gateways (for secure checkout)</li>
            <li>Technical service providers (website hosting, analytics)</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>Data Protection</h2>
          <p>
            We use SSL encryption, secure servers, and restricted access measures to protect your data.
          </p>
        </section>

        <section className="info-section">
          <h2>Cookies</h2>
          <p>
            We use cookies to improve user experience, personalize recommendations, and monitor site performance. You can disable cookies anytime in your browser settings.
          </p>
        </section>

        <section className="info-section">
          <h2>Your Rights</h2>
          <p>You may request:</p>
          <ul>
            <li>Data correction</li>
            <li>Data deletion</li>
            <li>Opt-out from marketing</li>
            <li>Copy of stored information</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>Policy Updates</h2>
          <p>
            Changes to this policy will be updated on this page periodically.
          </p>
        </section>

        <section className="info-section contact-box">
          <h2>Contact Us</h2>
          <p>If you have any questions about our Privacy Policy, please reach out:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:navodayatrendz@gmail.com">navodayatrendz@gmail.com</a>
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:+918947900884">+91-8947900884</a>
          </p>
        </section>
      </div>

      <style>{`
        .info-page {
          background: var(--bg-secondary, #f8fafc);
          color: var(--text-primary, #1e293b);
          min-height: 100vh;
          padding: 3rem 0;
          font-family: 'Poppins', sans-serif;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .info-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid var(--border-color, #e2e8f0);
        }
        .info-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: var(--text-secondary, #64748b);
          font-size: 1rem;
        }
        .info-section {
          background: var(--bg-primary, #ffffff);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.1));
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-color, #e2e8f0);
        }
        .info-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
          margin-top: 0;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-color, #f1f5f9);
          padding-bottom: 0.5rem;
        }
        .info-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary, #334155);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .info-section p {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-secondary, #475569);
          margin-bottom: 1rem;
        }
        .info-section ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .info-section li {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-secondary, #475569);
          margin-bottom: 0.5rem;
        }
        .info-section a {
          color: var(--footer-accent, #ff6b35);
          text-decoration: none;
          font-weight: 500;
        }
        .info-section a:hover {
          text-decoration: underline;
        }
        .contact-box {
          background: rgba(255, 107, 53, 0.05);
          border-color: rgba(255, 107, 53, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
