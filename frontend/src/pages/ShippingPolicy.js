import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPages.css';

const ShippingPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Breadcrumb */}
        <nav className="legal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Legal</span>
          <span className="sep">/</span>
          <span className="current">Shipping Policy</span>
        </nav>

        {/* Hero Header */}
        <header className="legal-header">
          <div className="legal-badge">
            <span className="legal-badge-dot"></span>
            Brand Era Logistics &amp; Fulfillment
          </div>
          <h1>Shipping &amp; Delivery Policy</h1>
          <div className="legal-meta">
            <span><strong>Effective Date:</strong> January 1, 2025</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> March 2025</span>
            <span>•</span>
            <span><strong>Coverage:</strong> Pan-India &amp; International</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
            Brand Era collaborates with India&rsquo;s leading express couriers and surface cargo networks to ensure your custom apparel, branded corporate merchandise, and bulk orders arrive safely, on schedule, and in pristine condition.
          </p>

          {/* Quick Highlights */}
          <div className="legal-highlights">
            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Pan-India Delivery</h4>
                <p>Delivering across 19,000+ pin codes in all Indian states &amp; UTs.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-truck-moving"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Tier-1 Couriers</h4>
                <p>Dispatched via Blue Dart, Delhivery, DTDC &amp; Express networks.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-satellite-dish"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Live Tracking</h4>
                <p>Automated SMS, email, and WhatsApp tracking link on dispatch.</p>
              </div>
            </div>

            <div className="legal-highlight-card">
              <div className="legal-highlight-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="legal-highlight-text">
                <h4>Secure Packaging</h4>
                <p>Tamper-evident, weather-resistant heavy-duty packaging.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">1</div>
            <h2>Delivery Coverage &amp; Reach</h2>
          </div>
          <p>
            <strong>Brand Era</strong> delivers across all regions of India, covering over 19,000 pin codes across urban metros, Tier-2/Tier-3 cities, and rural postal zones via India Post Speed Post.
          </p>
          <p>
            <strong>International Shipping:</strong> We provide worldwide export shipping for corporate clients, overseas alumni chapters, and international events. International shipping rates, custom duties, and documentation are quoted individually based on parcel volume and destination country.
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">2</div>
            <h2>Order Processing &amp; Delivery Timelines</h2>
          </div>
          <p>
            Because we engineer custom printed and personalized goods alongside ready stock, each order follows a designated timeline:
          </p>

          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Order Category</th>
                  <th>Production / Packing</th>
                  <th>Courier Transit Time</th>
                  <th>Total Estimated Window</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Custom Print-on-Demand (1–10 pcs)</strong></td>
                  <td>2 to 4 business days</td>
                  <td>3 to 6 business days</td>
                  <td><strong>5 to 9 business days</strong></td>
                </tr>
                <tr>
                  <td><strong>Ready-to-Ship Blank Essentials</strong></td>
                  <td>Within 24 to 48 hours</td>
                  <td>2 to 5 business days</td>
                  <td><strong>3 to 6 business days</strong></td>
                </tr>
                <tr>
                  <td><strong>Bulk Orders &amp; Alumni Kits (50–500 pcs)</strong></td>
                  <td>5 to 8 business days</td>
                  <td>3 to 6 business days (Surface/Air)</td>
                  <td><strong>8 to 14 business days</strong></td>
                </tr>
                <tr>
                  <td><strong>Mega Corporate Orders (500+ pcs)</strong></td>
                  <td>8 to 12 business days</td>
                  <td>4 to 7 business days (Cargo)</td>
                  <td><strong>12 to 18 business days</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-box legal-box-info">
            <p>
              <strong>Event &amp; Reunion Advisory:</strong> If you are ordering alumni kits, conference t-shirts, or event merchandise for a specific event date, we strongly recommend placing your order at least <strong>12 to 15 days in advance</strong> to allow buffer time for carrier transit.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">3</div>
            <h2>Courier &amp; Logistics Partners</h2>
          </div>
          <p>
            We partner with certified, technology-driven logistics aggregators and express carriers to guarantee reliable parcel handling:
          </p>
          <ul>
            <li><strong>Express Air Courier:</strong> Blue Dart, Delhivery Air, DTDC Express (primarily utilized for retail orders and urgent custom shipments).</li>
            <li><strong>Surface &amp; Cargo Freight:</strong> Delhivery Surface, Safechem, VRL, and GATI for heavy bulk carton shipments.</li>
            <li><strong>National Postal Coverage:</strong> Speed Post (Department of Posts, Govt. of India) for remote or regional postal zones.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">4</div>
            <h2>Real-Time Order Tracking</h2>
          </div>
          <p>
            As soon as your package is inspected, packed, and scanned by the courier partner:
          </p>
          <ul>
            <li>An automated notification containing the Courier Name and Air Waybill (AWB) Tracking Number will be sent to your registered Email, SMS, and WhatsApp.</li>
            <li>You can track the live movement of your consignment directly through our website via the <Link to="/track/order">Track Order</Link> page.</li>
            <li>You will receive periodic milestone updates: Dispatched &rarr; In Transit &rarr; Out for Delivery &rarr; Delivered.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">5</div>
            <h2>Shipping Charges &amp; Free Delivery</h2>
          </div>
          <ul>
            <li><strong>Standard Retail Orders:</strong> Shipping charges are calculated transparently during checkout based on delivery pincode and total item weight.</li>
            <li><strong>Free Shipping Offers:</strong> Brand Era regularly provides Free Shipping on orders exceeding qualified thresholds (e.g. orders above &#8377;999) or via promotional coupon codes.</li>
            <li><strong>Bulk &amp; B2B Shipments:</strong> Freight charges for heavy multi-carton consignments are calculated by volumetric weight or shipped through the client&rsquo;s preferred corporate logistics account (To-Pay/Freight Collect options available).</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">6</div>
            <h2>Damaged, Tampered, or Incomplete Shipments</h2>
          </div>
          <p>
            Brand Era utilizes reinforced, tamper-evident security packaging. If you suspect any tampering during transit:
          </p>
          <div className="legal-box legal-box-warning">
            <p>
              <strong>Important Packaging Protocol:</strong> If a parcel arrives visibly crushed, torn open, or resealed with unbranded tape:
            </p>
            <ul>
              <li>Refuse delivery OR note &ldquo;Damaged/Tampered Packaging Received&rdquo; on the courier&rsquo;s digital or physical Proof of Delivery (POD) slip.</li>
              <li>Record a continuous unboxing video showing the shipping label and parcel state before opening.</li>
              <li>Notify Brand Era Support within <strong>48 hours</strong> at <a href="mailto:support@brandera.com">support@brandera.com</a> or WhatsApp <a href="tel:+918947900884">+91-8947900884</a> so we can arrange an immediate complimentary replacement.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <div className="legal-section-header">
            <div className="legal-section-number">7</div>
            <h2>Delays &amp; Unforeseen Circumstances</h2>
          </div>
          <p>
            While Brand Era consistently dispatches orders on or before the committed schedule, external transit times may occasionally experience delays due to:
          </p>
          <ul>
            <li>Severe weather conditions, cyclones, floods, or natural calamities.</li>
            <li>National holidays, state elections, or peak festive season logistics congestion (e.g. Diwali, New Year).</li>
            <li>Incorrect, incomplete, or unverified shipping addresses provided by the customer.</li>
            <li>Consignee unavailability or phone unanswered after multiple delivery attempts by the courier executive.</li>
          </ul>
          <p>
            In any such event, our dedicated logistics helpdesk actively escalates with regional courier hubs to expedite priority delivery.
          </p>
        </section>

        {/* Contact Box */}
        <div className="legal-contact-card">
          <div className="legal-contact-inner">
            <div className="legal-contact-info">
              <h3>Have Shipping or Delivery Questions?</h3>
              <p>
                Our logistics dispatch team is available to assist with consignment tracking, express dispatch requests, or bulk freight logistics.
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
                  <span>Dispatch Desk: Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="legal-contact-actions">
              <Link to="/track/order" className="legal-btn legal-btn-primary">
                <i className="fas fa-search-location"></i> Track Your Order
              </Link>
              <a href="https://wa.me/918947900884?text=Hi%20Brand%20Era,%20I%20have%20an%20inquiry%20regarding%20shipping" className="legal-btn legal-btn-outline" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> WhatsApp Logistics
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
