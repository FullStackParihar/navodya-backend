import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Breadcrumb */}
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Legal</span>
          <span className="sep">/</span>
          <span className="current">Refund &amp; Return Policy</span>
        </nav>

        {/* Hero Header */}
        <header className="legal-header">
          <div className="legal-badge">
            <span className="legal-badge-dot"></span>
            Brand Era Customer Guarantee
          </div>
          <h1>Refund &amp; Return Policy</h1>
          <div className="legal-meta">
            <span><strong>Effective Date:</strong> January 1, 2025</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> March 2025</span>
            <span>•</span>
            <span><strong>Applies to:</strong> Brand Era Storefront &amp; Bulk Orders</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            At Brand Era, we take utmost pride in superior fabric quality, precision print craftsmanship, and stringent quality control. Because our products range from custom-printed merchandise to standard essentials, this policy outlines our transparent guidelines for returns, replacements, cancellations, and refunds.
          </p>

          {/* Quick Highlights */}
          <div className="legal-highlights">
            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-redo-alt"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>100% Free Remake</h4>
                <p>Complimentary replacement for any manufacturing or print defects.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>48h Claim Window</h4>
                <p>Report damaged or misprinted parcels within 48 to 72 hours of delivery.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>7-Day Return</h4>
                <p>For non-customized, unwashed items in original tags and packaging.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Fast Processing</h4>
                <p>Approved refunds processed within 2–5 business days to original method.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">1</div>
            <h2>Customized &amp; Print-on-Demand Products</h2>
          </div>
          <p>
            Customized merchandise includes goods manufactured, printed, embroidered, or engraved specifically according to customer specifications, including:
          </p>
          <ul>
            <li>Custom T-Shirts (Round Neck, Polo, Oversized, Corporate Uniforms)</li>
            <li>Custom Hoodies, Sweatshirts &amp; Jackets</li>
            <li>Customized Drinkware, Mugs, Sippers &amp; Water Bottles</li>
            <li>Corporate Swag Kits, Lanyards, Badges &amp; Stationery</li>
            <li>Alumni Reunion &amp; Event Kits with batch/college/company branding</li>
          </ul>

          <div className="legal-box legal-box-warning">
            <p>
              <strong>Important Notice on Bespoke Production:</strong> Because custom merchandise is personalized with unique artwork, names, logos, or sizing, <strong>these items cannot be restocked or resold</strong> and are generally <strong>non-returnable and non-refundable</strong> once manufactured as ordered.
            </p>
          </div>

          <h3>Our 100% Quality &amp; Defect Guarantee</h3>
          <p>
            Notwithstanding the bespoke nature of customized items, Brand Era guarantees complete peace of mind. We will provide a <strong>100% free remake, replacement, or full refund</strong> if you experience:
          </p>
          <ul>
            <li><strong>Printing or Embroidery Defects:</strong> Significant color divergence, peeling print, misspelled text caused by Brand Era, or misaligned graphics differing from approved digital proofs.</li>
            <li><strong>Garment Flaws:</strong> Fabric holes, broken seams, torn hems, defective zippers, or material blemishes.</li>
            <li><strong>Wrong Product Delivered:</strong> Mismatched style, incorrect size delivered versus what was ordered, or wrong garment color.</li>
            <li><strong>Transit Damage:</strong> Package arrived severely damaged, broken, or crushed during courier transit.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">2</div>
            <h2>Standard (Non-Customized / Blank) Products</h2>
          </div>
          <p>
            Items purchased from our standard catalog without personalized printing, custom artwork, or embroidery are eligible for return or exchange:
          </p>
          <ul>
            <li><strong>Return Window:</strong> Must be reported and postmarked within <strong>7 calendar days</strong> of receiving delivery.</li>
            <li><strong>Condition Requirements:</strong> Goods must be unused, unwashed, odor-free, with all original brand tags, labels, and packaging intact.</li>
            <li><strong>Refund Method:</strong> Once our fulfillment center receives and inspects the returned item, your refund will be credited to the original payment source within 3–5 business days.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">3</div>
            <h2>Order Cancellation Policy</h2>
          </div>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Order Category</th>
                  <th>Cancellation Window</th>
                  <th>Refund / Fee Structure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Standard (Blank) Retail Orders</strong></td>
                  <td>Within 2 to 4 hours of order placement (before dispatch)</td>
                  <td>100% full refund to original payment method.</td>
                </tr>
                <tr>
                  <td><strong>Custom Print Studio Orders</strong></td>
                  <td>Before digital proof approval / prior to production run</td>
                  <td>100% refund. Once garment printing/cutting begins, cancellations cannot be accepted.</td>
                </tr>
                <tr>
                  <td><strong>Bulk &amp; Corporate Orders</strong></td>
                  <td>Prior to material procurement and screen setup</td>
                  <td>Advance booking deposits cover incurred tooling/fabric costs; balance is refunded.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">4</div>
            <h2>How to Submit a Claim or Replacement Request</h2>
          </div>
          <p>
            To ensure swift resolution within 24 hours, please follow these steps if your shipment arrives with an issue:
          </p>
          <ol>
            <li>
              <strong>Notify Us Promptly:</strong> Contact our support team within <strong>48 to 72 hours</strong> of parcel delivery.
            </li>
            <li>
              <strong>Provide Order Evidence:</strong> Share your Order ID, along with a continuous unboxing video or high-resolution photos clearly showing:
              <ul>
                <li>The shipping label with barcode and recipient details.</li>
                <li>The specific defect, print issue, or damaged portion of the product.</li>
              </ul>
            </li>
            <li>
              <strong>Verification &amp; Solution:</strong> Our Quality Assurance team reviews evidence within 1 business day. Once verified, we will immediately initiate an expedited complimentary replacement or refund.
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">5</div>
            <h2>Refund Processing Timelines</h2>
          </div>
          <p>Once a refund is approved by our claims desk:</p>
          <ul>
            <li><strong>UPI &amp; Wallets (PhonePe, GPay, Paytm):</strong> 24 to 48 hours (1–2 business days).</li>
            <li><strong>Net Banking (NEFT / IMPS):</strong> 2 to 4 business days.</li>
            <li><strong>Credit &amp; Debit Cards:</strong> 5 to 7 business days, depending on your card issuer bank.</li>
            <li><strong>Store Credit / Gift Voucher:</strong> Instant credit (valid for 12 months on all Brand Era merchandise).</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">6</div>
            <h2>Size Selection &amp; Exchange Policy</h2>
          </div>
          <p>
            Garments are custom-printed according to the exact size chosen during checkout. Because size charts with chest, length, and sleeve measurements are detailed on every single product page:
          </p>
          <ul>
            <li>Please double-check size measurements before ordering custom-printed apparel.</li>
            <li>Size exchanges for customized apparel are not permitted if the garment matches the published sizing specifications within standard apparel industry tolerance (&plusmn;0.75 inches).</li>
            <li>For large corporate and alumni orders (50+ units), Brand Era offers physical size-sample trial sets prior to commencing full production.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">7</div>
            <h2>Non-Eligible Returns</h2>
          </div>
          <p>The following categories are strictly excluded from refunds or returns:</p>
          <ul>
            <li>Products damaged due to customer misuse, improper washing (e.g. bleaching, high-temperature iron directly over prints).</li>
            <li>Items purchased under clearance sales or designated final clearance promotions.</li>
            <li>Orders where customer provided an incorrect shipping address or failed to collect from the courier after multiple delivery attempts.</li>
          </ul>
        </section>

        {/* Contact Box */}
        <div className="legal-contact-card">
          <div className="legal-contact-inner">
            <div className="legal-contact-info">
              <h3>Need Help with an Order or Return?</h3>
              <p>
                Our customer claims desk is dedicated to making sure you love your Brand Era merchandise. Reach out with your order number for immediate assistance.
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
                  <span>Support Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="legal-contact-actions">
              <a href="mailto:support@brandera.com?subject=Return%20or%20Refund%20Claim" className="legal-btn legal-btn-primary">
                <i className="fas fa-undo"></i> Submit Claim via Email
              </a>
              <a href="https://wa.me/918947900884?text=Hi%20Brand%20Era,%20I%20need%20help%20with%20a%20refund%20or%20return" className="legal-btn legal-btn-outline" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
