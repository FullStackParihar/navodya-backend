import React, { useMemo, useState } from 'react';

const FAQ = () => {
  const faqs = useMemo(() => ([
    {
      q: 'How do I place an order?',
      a: 'Browse products, add items to cart, then go to Payment to complete your order.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support UPI, Debit/Credit Cards, Net Banking, Wallets, and Cash on Delivery (where available).'
    },
    {
      q: 'How can I track my order?',
      a: 'Go to Account → My Orders and click Track, or open the Order Tracking page with your order ID.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Delivery time depends on your location. Typical delivery is 3–7 business days after shipping.'
    },
    {
      q: 'Can I change my delivery address after placing an order?',
      a: 'If the order is not shipped yet, you can request an address change by contacting support.'
    },
    {
      q: 'How do I return or exchange a product?',
      a: 'For returns/exchanges, contact support with your order ID. We will guide you through the process.'
    },
    {
      q: 'Do you offer bulk orders for alumni meets?',
      a: 'Yes. Use the Bulk Order page to submit quantity and customization requirements.'
    },
    {
      q: 'How do I contact support?',
      a: 'You can call, email, or WhatsApp from the Support section in Account or Order Tracking pages.'
    }
  ]), []);

  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (idx) => setOpenIndex((cur) => (cur === idx ? -1 : idx));

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="container">
          <div className="hero-card">
            <div>
              <h1>FAQ</h1>
              <p>Quick answers to common questions about orders, payments, tracking and support.</p>
            </div>
            <div className="hero-badges">
              <span className="pill"><i className="fas fa-truck"></i> Delivery</span>
              <span className="pill"><i className="fas fa-credit-card"></i> Payments</span>
              <span className="pill"><i className="fas fa-headset"></i> Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-body">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-list">
              {faqs.map((item, idx) => {
                const isOpen = idx === openIndex;
                return (
                  <button
                    key={item.q}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                    onClick={() => toggle(idx)}
                    type="button"
                  >
                    <div className="faq-q">
                      <span>{item.q}</span>
                      <span className="chev"><i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i></span>
                    </div>
                    {isOpen && (
                      <div className="faq-a">
                        {item.a}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <aside className="faq-side">
              <div className="side-card">
                <h3>Still need help?</h3>
                <p>Reach out and we’ll help you quickly.</p>
                <div className="side-actions">
                  <a className="btn-secondary" href="tel:+9118001234567">
                    <i className="fas fa-phone"></i> Call
                  </a>
                  <a className="btn-secondary" href="mailto:support@navodayatrendz.com?subject=FAQ%20Help">
                    <i className="fas fa-envelope"></i> Email
                  </a>
                  <a className="btn-primary" href="https://wa.me/919284490206?text=Hi%2C%20I%20need%20help%20with%20my%20order">
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              </div>

              <div className="side-card">
                <h3>Bulk Orders</h3>
                <p>Ordering for alumni meets? Submit your requirements here.</p>
                <a className="btn-primary" href="/bulk-order">
                  <i className="fas fa-users"></i> Bulk Order
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style jsx>{`
        .faq-page {
          background: var(--bg-secondary, #f8fafc);
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .faq-hero {
          padding: 2rem 0;
          background:
            radial-gradient(1200px 400px at 20% 0%, rgba(255, 107, 53, 0.18), transparent 60%),
            radial-gradient(900px 350px at 80% 10%, rgba(58, 134, 255, 0.14), transparent 60%);
        }

        .hero-card {
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        h1 {
          margin: 0;
          color: var(--text-primary, #1e293b);
        }

        .hero-card p {
          margin: 0.5rem 0 0;
          color: var(--text-secondary, #64748b);
          font-weight: 600;
        }

        .hero-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          font-weight: 800;
          color: var(--text-primary, #1e293b);
          font-size: 0.85rem;
        }

        .faq-body {
          padding: 1.25rem 0;
        }

        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.25rem;
          align-items: start;
        }

        .faq-list {
          display: grid;
          gap: 0.75rem;
        }

        .faq-item {
          width: 100%;
          text-align: left;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .faq-item:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          border-color: rgba(255, 107, 53, 0.35);
        }

        .faq-item.open {
          background: rgba(255, 107, 53, 0.05);
          border-color: rgba(255, 107, 53, 0.35);
        }

        .faq-q {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          color: var(--text-primary, #1e293b);
          font-weight: 900;
        }

        .chev {
          color: var(--text-secondary, #64748b);
          flex-shrink: 0;
        }

        .faq-a {
          margin-top: 0.75rem;
          color: var(--text-secondary, #64748b);
          font-weight: 600;
          line-height: 1.6;
        }

        .faq-side {
          position: sticky;
          top: 110px;
          display: grid;
          gap: 1rem;
        }

        .side-card {
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.5rem;
          border: 1px solid var(--border-color, #e2e8f0);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .side-card h3 {
          margin: 0;
          color: var(--text-primary, #1e293b);
        }

        .side-card p {
          margin: 0.5rem 0 1rem;
          color: var(--text-secondary, #64748b);
          font-weight: 600;
        }

        .side-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 800;
          cursor: pointer;
          padding: 0.75rem 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .btn-primary {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: #fff;
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        @media (max-width: 1024px) {
          .faq-layout {
            grid-template-columns: 1fr;
          }

          .faq-side {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;
