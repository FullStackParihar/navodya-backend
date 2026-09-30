import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css';

const Disclaimer = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Breadcrumb */}
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Legal</span>
          <span className="sep">/</span>
          <span className="current">Disclaimer</span>
        </nav>

        {/* Hero Header */}
        <header className="legal-header">
          <div className="legal-badge">
            <span className="legal-badge-dot"></span>
            Brand Era Legal Notice
          </div>
          <h1>Legal Disclaimer</h1>
          <div className="legal-meta">
            <span><strong>Effective Date:</strong> January 1, 2025</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> March 2025</span>
            <span>•</span>
            <span><strong>Applies to:</strong> www.brandera.com</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Please read this disclaimer carefully before using the Brand Era website, 3D/2D Design Studio, or ordering custom merchandise and apparel. This page outlines representations, intellectual property warranties, and limitations of liability.
          </p>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">1</div>
            <h2>Product Rendering &amp; Visual Representation</h2>
          </div>
          <p>
            All product visuals, 3D interactive renders, print mockups, and swatch images displayed across <strong>Brand Era</strong> are digital representations provided to illustrate design placement and garment aesthetic.
          </p>
          <ul>
            <li>Actual fabric texture, finish, and dye lot tones may display slight variance due to monitor color calibration settings (RGB screen displays vs CMYK / Pantone textile print standards).</li>
            <li>We adhere to strict quality tolerances, but minor shifts in print scale (&plusmn;5%) or garment sizing (&plusmn;0.75 inches) fall within standard textile manufacturing tolerances.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">2</div>
            <h2>Customer-Submitted Artwork &amp; Trademark Warranty</h2>
          </div>
          <div className="legal-box legal-box-warning">
            <p>
              <strong>Intellectual Property Authorization:</strong> Brand Era operates as an on-demand contract manufacturer and custom printing service provider.
            </p>
          </div>
          <p>
            When you upload or transmit any graphic, trademark, brand name, corporate emblem, school crest, or copyright-protected artwork to Brand Era:
          </p>
          <ul>
            <li>You warrant and represent that you are the lawful owner of the submitted intellectual property, or that you hold explicit written license, authorization, or authority to commission printing of such materials.</li>
            <li>Brand Era disclaims all liability for trademark, copyright, or design infringements resulting from customer-submitted artwork. The customer agrees to indemnify Brand Era against any claims or legal expenses arising from unauthorized submissions.</li>
            <li>Brand Era reserves the right to decline or cancel any print production order that it deems in violation of intellectual property laws, hateful, defamatory, or unlawful.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">3</div>
            <h2>Community &amp; Alumni Merchandise Notice</h2>
          </div>
          <p>
            Any school, collegiate, alumni, or community celebration merchandise created through Brand Era is manufactured to celebrate community camaraderie and reunion heritage. Unless explicitly affirmed in writing, such products do not imply official administrative endorsement, statutory affiliation, or governmental licensing by any specific educational or municipal authority.
          </p>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">4</div>
            <h2>Limitation of Liability</h2>
          </div>
          <p>
            To the maximum extent permitted by applicable Indian laws, Brand Era, its proprietors, directors, employees, and logistics partners shall not be held liable for:
          </p>
          <ul>
            <li>Indirect, incidental, punitive, or consequential damages resulting from the use or inability to use our services.</li>
            <li>Carrier transit delays caused by force majeure events, bad weather, strikes, or regional courier service interruptions.</li>
            <li>Inaccuracies resulting from incorrect contact or address details provided by the customer during checkout.</li>
          </ul>
        </section>

        {/* Contact Box */}
        <div className="legal-contact-card">
          <div className="legal-contact-inner">
            <div className="legal-contact-info">
              <h3>Legal Queries or Notices</h3>
              <p>
                For official correspondence, legal notices, or trademark inquiries, please reach out to our legal compliance desk.
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
              <a href="mailto:support@brandera.com?subject=Legal%20Inquiry" className="legal-btn legal-btn-primary">
                <i className="fas fa-envelope"></i> Contact Legal Desk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
