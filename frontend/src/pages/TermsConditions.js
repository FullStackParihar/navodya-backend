import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css';

const TermsConditions = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Breadcrumb */}
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Legal</span>
          <span className="sep">/</span>
          <span className="current">Terms &amp; Conditions</span>
        </nav>

        {/* Hero Header */}
        <header className="legal-header">
          <div className="legal-badge">
            <span className="legal-badge-dot"></span>
            Brand Era Terms of Service
          </div>
          <h1>Terms &amp; Conditions</h1>
          <div className="legal-meta">
            <span><strong>Effective Date:</strong> January 1, 2025</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> March 2025</span>
            <span>•</span>
            <span><strong>Governing Law:</strong> India</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Welcome to Brand Era (&ldquo;BrandEra&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). These Terms and Conditions govern your access to and use of www.brandera.com, our custom Print Studio, e-commerce storefront, bulk merchandise services, and customer accounts.
          </p>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">1</div>
            <h2>Acceptance of Terms</h2>
          </div>
          <p>
            By accessing our website, creating an account, uploading custom graphics, or purchasing goods from Brand Era, you agree to be bound by these Terms &amp; Conditions and our linked policies (including our <Link to="/privacy-policy">Privacy Policy</Link>, <Link to="/refund-policy">Refund Policy</Link>, and <Link to="/shipping-policy">Shipping Policy</Link>). If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">2</div>
            <h2>Account Registration &amp; Security</h2>
          </div>
          <p>
            When registering an account with Brand Era:
          </p>
          <ul>
            <li>You agree to provide accurate, current, and complete registration details.</li>
            <li>You are solely responsible for maintaining the confidentiality of your login credentials and password.</li>
            <li>You agree to immediately notify Brand Era of any unauthorized use or security breach of your account.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">3</div>
            <h2>Custom Printing &amp; Print Studio Usage</h2>
          </div>
          <p>
            Our Design Studio allows customers to create and order custom apparel, hoodies, accessories, and promotional gear:
          </p>
          <ul>
            <li><strong>Design Responsibility:</strong> Customers are solely responsible for verifying graphic alignment, spelling, resolution, and dimensions before placing an order.</li>
            <li><strong>Content Standards:</strong> You agree not to upload any material that is defamatory, obscene, infringing upon any third party&rsquo;s intellectual property, promoting violence, or violating applicable Indian laws.</li>
            <li><strong>Right to Reject:</strong> Brand Era reserves the unilateral right to decline any order featuring content that violates our standards or applicable law.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">4</div>
            <h2>Pricing, Taxes &amp; Payments</h2>
          </div>
          <ul>
            <li>All prices displayed on the storefront are in Indian Rupees (INR) and inclusive of statutory GST unless stated otherwise in formal B2B bulk quotations.</li>
            <li>Payments must be tendered in full via approved payment gateways (UPI, credit/debit card, net banking) before custom manufacturing commences.</li>
            <li>Brand Era reserves the right to revise catalog prices or delivery fees at any time without prior notice; however, active confirmed orders will not be subjected to retroactive price adjustments.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">5</div>
            <h2>Governing Law &amp; Jurisdiction</h2>
          </div>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

        {/* Contact Box */}
        <div className="legal-contact-card">
          <div className="legal-contact-inner">
            <div className="legal-contact-info">
              <h3>Questions Regarding Our Terms?</h3>
              <p>
                Our legal compliance desk is available to assist with any questions regarding our terms of service or corporate supplier agreements.
              </p>
              <div className="legal-contact-details">
                <div className="legal-contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email: <a href="mailto:support@brandera.com">support@brandera.com</a></span>
                </div>
                <div className="legal-contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>Helpline: <a href="tel:+918947900884">+91-8947900884</a></span>
                </div>
              </div>
            </div>

            <div className="legal-contact-actions">
              <a href="mailto:support@brandera.com?subject=Terms%20Inquiry" className="legal-btn legal-btn-primary">
                <i className="fas fa-envelope"></i> Contact Legal Desk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
