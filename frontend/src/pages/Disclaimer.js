import React from 'react';

const Disclaimer = () => {
  return (
    <div className="info-page">
      <div className="container">
        <header className="info-header">
          <h1>Disclaimer</h1>
          <p className="subtitle">Effective Date: January 1, 2025</p>
        </header>

        <section className="info-section">
          <h2>Representation Policy</h2>
          <p>
            The website content, product images, and graphics are for representation only. Actual product colors and prints may vary slightly due to digital rendering or display settings.
          </p>
        </section>

        <section className="info-section">
          <h2>Limitation of Liability</h2>
          <p>
            Navodaya Trendz (NTz) is not responsible for:
          </p>
          <ul>
            <li>Delays caused by courier partners</li>
            <li>Customer providing incorrect shipping or contact information</li>
            <li>Third-party technical issues</li>
          </ul>
          <p>
            By using this website, you agree that NTz is not liable for indirect, incidental, or consequential damages.
          </p>
        </section>

        <section className="info-section">
          <h2>Community Branding Disclaimer</h2>
          <p>
            All logos and school names used for alumni merchandise are for community use and do not imply official endorsements by the Jawahar Navodaya Vidyalaya (JNV) administration or Navodaya Vidyalaya Samiti (NVS) unless explicitly stated.
          </p>
        </section>

        <section className="info-section contact-box">
          <h2>Contact Us</h2>
          <p>For any queries or concerns regarding this disclaimer, please contact us:</p>
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
        .contact-box {
          background: rgba(255, 107, 53, 0.05);
          border-color: rgba(255, 107, 53, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Disclaimer;
