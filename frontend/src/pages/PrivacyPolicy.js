import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Breadcrumb */}
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Legal</span>
          <span className="sep">/</span>
          <span className="current">Privacy Policy</span>
        </nav>

        {/* Hero Header */}
        <header className="legal-header">
          <div className="legal-badge">
            <span className="legal-badge-dot"></span>
            Brand Era Trust &amp; Security
          </div>
          <h1>Privacy Policy</h1>
          <div className="legal-meta">
            <span><strong>Effective Date:</strong> January 1, 2025</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> March 2025</span>
            <span>•</span>
            <span><strong>Applies to:</strong> www.brandera.com</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Brand Era (&ldquo;BrandEra&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to safeguarding your personal data, custom artwork, and brand privacy. This Privacy Policy details how we collect, handle, safeguard, and disclose your data across our custom apparel, print studio, corporate merchandising, and bulk production platforms.
          </p>

          {/* Quick Highlights */}
          <div className="legal-highlights">
            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>No Data Selling</h4>
                <p>We never sell or rent your personal information to third parties.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-palette"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Artwork Protection</h4>
                <p>Your custom designs and client logos remain 100% your property.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-lock"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>256-bit SSL</h4>
                <p>End-to-end encrypted transactions and secured cloud infrastructure.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>PCI-DSS Payments</h4>
                <p>Card and UPI payments processed by RBI-regulated gateways.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">1</div>
            <h2>Introduction &amp; Scope</h2>
          </div>
          <p>
            Welcome to <strong>Brand Era</strong> (&ldquo;BrandEra&rdquo;), accessible online via <a href="https://www.brandera.com" target="_blank" rel="noopener noreferrer">www.brandera.com</a>. Brand Era provides premier on-demand garment manufacturing, custom printed t-shirts and hoodies, corporate gifts, alumni reunion kits, and bespoke merchandise solutions.
          </p>
          <p>
            This Privacy Policy governs your use of our storefront, custom Design Studio, bulk order estimation tools, customer dashboard, and related services. By visiting our website or ordering custom merchandise from Brand Era, you acknowledge and agree to the practices outlined in this policy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">2</div>
            <h2>Information We Collect</h2>
          </div>
          <p>
            To deliver tailored printing, timely order fulfillment, and seamless customer service, we collect information across the following categories:
          </p>

          <h3>A. Personal &amp; Account Details</h3>
          <ul>
            <li><strong>Contact Information:</strong> Full name, email address, mobile/telephone number.</li>
            <li><strong>Shipping &amp; Billing Details:</strong> Delivery address, state, pin code, GSTIN (for B2B/corporate tax invoicing), and company/organization name.</li>
            <li><strong>Account Credentials:</strong> Username, encrypted password hash, and profile preferences when you register an account.</li>
          </ul>

          <h3>B. Custom Artwork &amp; Design Assets</h3>
          <ul>
            <li>Vector logos, graphic files (PNG, JPG, SVG, AI, PDF, EPS), batch crests, school/college emblems, and typography inscriptions uploaded via our Design Studio or bulk inquiry forms.</li>
            <li>Color codes, print placement instructions, garment dimensions, and special finishing specifications.</li>
          </ul>

          <h3>C. Transaction &amp; Payment Data</h3>
          <ul>
            <li>Transaction reference IDs, payment status, mode of payment (UPI, Credit/Debit Card, Net Banking), and invoice records.</li>
            <li><strong>Note on Payment Security:</strong> Brand Era does <em>not</em> store full credit/debit card numbers, CVV codes, or net banking passwords. All financial transactions are securely tokenized and processed through certified, PCI-DSS compliant payment gateways (such as Cashfree, Razorpay, and direct banking partners).</li>
          </ul>

          <h3>D. Technical &amp; Device Information</h3>
          <ul>
            <li>Internet Protocol (IP) address, browser type and version, operating system, device identifiers, referral URLs, pages visited, and interaction logs collected via essential cookies and analytics tools.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">3</div>
            <h2>Customer Artwork &amp; Intellectual Property Protection</h2>
          </div>
          <div className="legal-box legal-box-success">
            <p>
              <strong>Brand Era Guarantee:</strong> Your proprietary logos, corporate branding, slogans, and bespoke graphics remain your sole property.
            </p>
          </div>
          <p>
            We strictly treat all client design files, brand marks, and batch artwork as confidential material:
          </p>
          <ul>
            <li>Files uploaded to our platform are utilized exclusively to prepare digital proofs, calibrate printing equipment (screen printing, DTF, embroidery, sublimation), and manufacture physical products.</li>
            <li>Brand Era will never publish, license, duplicate, or sell your proprietary graphics or client trademarks to any third party.</li>
            <li>We may only photograph finished customized merchandise for marketing or portfolio display with your prior written consent.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">4</div>
            <h2>How We Use Your Information</h2>
          </div>
          <p>We process collected information for legitimate business operations including:</p>
          <ul>
            <li><strong>Order Execution:</strong> Rendering digital mockups, manufacturing apparel, printing custom artwork, and packing parcels.</li>
            <li><strong>Logistics &amp; Tracking:</strong> Dispatching packages and sending automated real-time dispatch alerts, courier tracking numbers, and delivery status via SMS, WhatsApp, and email.</li>
            <li><strong>Customer Support:</strong> Assisting with sizing queries, design proof revisions, bulk quotes, and addressing inquiries submitted to our helpdesk.</li>
            <li><strong>Platform Security:</strong> Detecting fraudulent transactions, preventing unauthorized access, and verifying checkout legitimacy.</li>
            <li><strong>Statutory Compliance:</strong> Generating tax invoices compliant with Indian Goods &amp; Services Tax (GST) regulations and maintaining audit-ready accounting records.</li>
            <li><strong>Marketing &amp; Updates (Opt-in only):</strong> Sharing seasonal promotions, new arrival catalogs, or volume discount opportunities. You can unsubscribe anytime via the link in our emails.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">5</div>
            <h2>Data Sharing &amp; Third-Party Disclosure</h2>
          </div>
          <p>
            <strong>Brand Era does NOT sell, rent, or trade your personal information or artwork files.</strong> We disclose data solely to trusted partners necessary for business fulfillment:
          </p>
          <ul>
            <li><strong>Logistics Carriers:</strong> Vetted courier and freight services (such as Delhivery, Blue Dart, DTDC, ExpressBees, Speed Post, and Shiprocket Enterprise) receive your name, delivery address, and contact number strictly to complete parcel delivery.</li>
            <li><strong>Payment Processors:</strong> RBI-authorized payment aggregators to securely process your checkout transactions.</li>
            <li><strong>Cloud &amp; Infrastructure Providers:</strong> Secured cloud data centers and hosting providers managing our application infrastructure, protected by strict data processing agreements.</li>
            <li><strong>Legal &amp; Law Enforcement:</strong> Only when legally required under applicable Indian statutory laws, court orders, or governmental directives.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">6</div>
            <h2>Cookies &amp; Tracking Technologies</h2>
          </div>
          <p>
            Our website uses cookies and similar technologies to enhance your browsing experience:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for shopping cart persistence, session state, user authentication, and secure checkout navigation.</li>
            <li><strong>Functional Cookies:</strong> Memorize your viewing preferences, recent searches, and saved wishlist items.</li>
            <li><strong>Analytics Cookies:</strong> Help us identify technical bugs, track page loading performance, and optimize storefront usability.</li>
          </ul>
          <p>
            You can configure your browser settings to refuse or delete cookies. However, disabling essential cookies may impact certain storefront capabilities, including persistent shopping carts and interactive Design Studio features.
          </p>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">7</div>
            <h2>Data Security &amp; Retention</h2>
          </div>
          <p>
            We implement stringent technical and organizational security protocols to defend your personal information and artwork files against unauthorized access, loss, or alteration:
          </p>
          <ul>
            <li>256-bit Secure Socket Layer (SSL/TLS) encryption across all web traffic.</li>
            <li>Restricted server access controls, role-based database permissions, and encrypted backups.</li>
            <li>Customer account data is retained as long as your account remains active or as required by law for accounting and tax records. Design files may be retained to facilitate seamless re-orders unless you request their deletion.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">8</div>
            <h2>Your Legal Rights &amp; Choices</h2>
          </div>
          <p>Under applicable data privacy regulations, you are entitled to:</p>
          <ul>
            <li><strong>Access &amp; Review:</strong> Request a copy of the personal information Brand Era holds about you.</li>
            <li><strong>Correction &amp; Updates:</strong> Modify your profile data, delivery address, or billing records via your account dashboard or by writing to our team.</li>
            <li><strong>Data Deletion:</strong> Request the deletion of your account and uploaded graphic files, subject to statutory invoice retention requirements.</li>
            <li><strong>Marketing Opt-out:</strong> Withdraw consent for promotional newsletters or SMS marketing at any time.</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">9</div>
            <h2>Policy Revisions</h2>
          </div>
          <p>
            Brand Era reserves the right to amend this Privacy Policy periodically to reflect technological advances, service changes, or statutory regulations. Any revisions will be published on this page with an updated &ldquo;Last Updated&rdquo; date. Significant changes will be announced through storefront banners or direct email notification to registered users.
          </p>
        </section>

        {/* Contact Box */}
        <div className="legal-contact-card">
          <div className="legal-contact-inner">
            <div className="legal-contact-info">
              <h3>Have Privacy Questions?</h3>
              <p>
                Our Data Grievance and Support Officer is here to assist with any questions regarding personal data handling, artwork protection, or account privacy.
              </p>
              <div className="legal-contact-details">
                <div className="legal-contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email: <a href="mailto:support@brandera.com">support@brandera.com</a></span>
                </div>
                <div className="legal-contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>Helpline / WhatsApp: <a href="tel:+918947900884">+91-8947900884</a></span>
                </div>
                <div className="legal-contact-item">
                  <i className="fas fa-clock"></i>
                  <span>Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
                </div>
                <div className="legal-contact-item">
                  <i className="fas fa-building"></i>
                  <span>Platform: Brand Era Merchandise Solutions</span>
                </div>
              </div>
            </div>

            <div className="legal-contact-actions">
              <a href="mailto:support@brandera.com?subject=Privacy%20Inquiry" className="legal-btn legal-btn-primary">
                <i className="fas fa-paper-plane"></i> Email Privacy Desk
              </a>
              <a href="https://wa.me/918947900884?text=Hi%20Brand%20Era,%20I%20have%20a%20question%20regarding%20privacy" className="legal-btn legal-btn-outline" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
