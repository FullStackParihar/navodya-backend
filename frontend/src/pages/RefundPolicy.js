import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="info-page">
      <div className="container">
        <header className="info-header">
          <h1>Refund &amp; Return Policy</h1>
          <p className="subtitle">Last Updated: January 1, 2025</p>
        </header>

        <section className="info-section">
          <h2>1. Customized Products</h2>
          <p>Customized products include:</p>
          <ul>
            <li>T-shirts with school/batch printing</li>
            <li>Hoodies &amp; sweatshirts</li>
            <li>Mugs, badges, banners</li>
            <li>Alumni meet kits</li>
          </ul>
          <p className="warning-text">
            <strong>Important Notice:</strong> These items are <strong>NON-RETURNABLE and NON-REFUNDABLE</strong> as they are custom-made for your specific requirements.
          </p>
          <p>Replacement is offered ONLY if:</p>
          <ul>
            <li>Wrong product received</li>
            <li>Damaged product</li>
            <li>Printing mistake by NTz</li>
            <li>Defective item</li>
          </ul>
          <p>
            <strong>Evidence required:</strong> Unboxing video + clear photos of the issue.
          </p>
        </section>

        <section className="info-section">
          <h2>2. Non-Customized Products</h2>
          <p>Eligible for return within <strong>7 days of delivery</strong> if:</p>
          <ul>
            <li>Unused</li>
            <li>Unwashed</li>
            <li>In original packaging</li>
          </ul>
          <p>The refund will be processed to your original payment method after a quality check is completed.</p>
        </section>

        <section className="info-section">
          <h2>3. Cancellation Policy</h2>
          <ul>
            <li><strong>Non-customized orders:</strong> Can be cancelled within 2 hours of placement.</li>
            <li><strong>Bulk/Alumni meet orders:</strong> Cannot be cancelled once artwork is approved and production begins.</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>4. Refund Processing Time</h2>
          <ul>
            <li><strong>To original payment method:</strong> 5–7 working days</li>
            <li><strong>If UPI or Wallet:</strong> 2–3 working days</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>5. Exchange Policy</h2>
          <p>Exchange is allowed for:</p>
          <ul>
            <li>Wrong size delivered</li>
            <li>Defective item</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>6. Non-Returnable Items</h2>
          <ul>
            <li>Customized clothing</li>
            <li>Accessories with name/logo customization</li>
            <li>Bulk orders</li>
            <li>Items bought under clearance sale</li>
          </ul>
        </section>

        <section className="info-section contact-box">
          <h2>Contact for Claims</h2>
          <p>For any return or refund claims, please contact our support team:</p>
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
        .warning-text {
          color: #dc2626 !important;
          background: rgba(220, 38, 38, 0.05);
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #dc2626;
        }
        .contact-box {
          background: rgba(255, 107, 53, 0.05);
          border-color: rgba(255, 107, 53, 0.2);
        }
      `}</style>
    </div>
  );
};

export default RefundPolicy;
