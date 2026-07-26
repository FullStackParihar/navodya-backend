import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="info-page">
      <div className="container">
        <header className="info-header">
          <h1>Shipping Policy</h1>
          <p className="subtitle">Effective Date: January 1, 2025</p>
        </header>

        <section className="info-section">
          <h2>1. Shipping Coverage</h2>
          <p>
            We ship all over India and to selected international locations.
          </p>
        </section>

        <section className="info-section">
          <h2>2. Shipping Time</h2>
          
          <h3>Customized Orders</h3>
          <ul>
            <li><strong>Production Time:</strong> 3–7 days</li>
            <li><strong>Delivery Time:</strong> 5–9 days (depending on location)</li>
          </ul>

          <h3>Non-Customized Orders</h3>
          <ul>
            <li><strong>Delivery Time:</strong> 3–6 days</li>
          </ul>

          <h3>Bulk / Alumni Meet Orders</h3>
          <ul>
            <li><strong>Dispatch Time:</strong> Within 7–12 days</li>
            <li><strong>Important Recommendation:</strong> Customers must place orders 10–15 days before the event date to ensure timely delivery.</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>3. Shipping Partners</h2>
          <p>We work with trusted courier partners to ensure secure and fast shipping:</p>
          <ul>
            <li>Delhivery</li>
            <li>Blue Dart</li>
            <li>Speed Post</li>
            <li>DTDC</li>
            <li>Shiprocket partners</li>
          </ul>
          <p>Tracking details will be shared via email and SMS after your order is dispatched.</p>
        </section>

        <section className="info-section">
          <h2>4. Shipping Charges</h2>
          <ul>
            <li>Standard shipping charges are calculated based on order weight and delivery location.</li>
            <li>We offer free shipping on selected promotional offers and coupon codes.</li>
            <li>Bulk order shipping charges may vary depending on the total cargo volume.</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>5. Delays</h2>
          <p>
            Navodaya Trendz (NTz) is not responsible for delays caused by:
          </p>
          <ul>
            <li>Courier company issues</li>
            <li>Strikes, weather conditions, or natural calamities</li>
            <li>Incorrect shipping address provided by the customer</li>
            <li>High festive/holiday load</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>6. Damaged Packages</h2>
          <p>If your package arrives in a damaged condition, please follow these steps:</p>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            <li style={{ marginBottom: '0.5rem' }}>Record a continuous unboxing video showing the shipping label clearly.</li>
            <li style={{ marginBottom: '0.5rem' }}>Send photos of the packaging and product to the NTz team.</li>
            <li style={{ marginBottom: '0.5rem' }}>We will provide a replacement as per our policy.</li>
          </ol>
        </section>

        <section className="info-section contact-box">
          <h2>Support Contact</h2>
          <p>For any shipping queries, reach out to us:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:+918947900884">+91-8947900884</a>
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:navodayatrendz@gmail.com">navodayatrendz@gmail.com</a>
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

export default ShippingPolicy;
