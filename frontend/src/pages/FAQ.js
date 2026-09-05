import React, { useMemo, useState } from 'react';

const FAQ = () => {
  const faqs = useMemo(() => ([
    {
      q: '1. What is Navodaya Trendz?',
      a: 'Navodaya Trendz (NTz) is an exclusive merchandise brand for Jawahar Navodaya Vidyalaya (JNV) alumni, students, schools, and Navodayans worldwide. We specialize in customized T-shirts, hoodies, alumni meet kits, banners, trophies, and corporate gifts.'
    },
    {
      q: '2. Do you have merchandise for all JNV schools?',
      a: 'Yes! We provide designs for all 650+ JNVs across India. You can also request custom school/batch designs anytime.'
    },
    {
      q: '3. Can I order customized products with school name or batch year?',
      a: 'Yes. You can customize: T-shirts, hoodies, sweatshirts, mugs, badges, banners, and alumni meet kits. Customization options will be shown on the product page or handled through WhatsApp after checkout.'
    },
    {
      q: '4. Do you provide special packages for alumni meets?',
      a: 'Yes. We offer: Alumni Meet Starter Kit, Premium Reunion Kit, and Custom Meet Package. We also offer a free banner on bulk orders (limited period). Bulk discounts are available for 30–500+ pieces.'
    },
    {
      q: '5. What is the minimum order quantity for customization?',
      a: 'Single piece customization is available for selected products. For alumni meets or group orders, a minimum of 30–50 pieces is recommended for best pricing.'
    },
    {
      q: '6. What is the delivery time?',
      a: 'Customized Orders: 3–7 days for production + 5–9 days for delivery. Non-Customized Orders: 3–6 days delivery. Bulk/Alumni Meet Orders: 7–12 days depending on quantity (We recommend ordering 10–15 days before the event).'
    },
    {
      q: '7. Do you ship internationally?',
      a: 'Yes, we ship internationally for selected products. Shipping charges vary based on weight and location.'
    },
    {
      q: '8. What are the shipping charges?',
      a: 'Shipping charges depend on your location, order size, and ongoing offers. Occasionally we offer free shipping promotions.'
    },
    {
      q: '9. How do I track my order?',
      a: 'After dispatch, you will receive a tracking link and courier partner details. You can also track your order from the “Track Order” page on our website.'
    },
    {
      q: '10. What payment methods do you accept?',
      a: 'We accept UPI, Debit/Credit Cards, Net Banking, and Wallets.'
    },
    {
      q: '11. What is your return or refund policy?',
      a: 'Customized products: No return or refund (unless defective/wrong item delivered). Replacement is available with proof (photos + unboxing video). Non-customized products: 7-day return window. Refund after quality check.'
    },
    {
      q: '12. Can I cancel my order?',
      a: 'Non-customized orders: within 2 hours of placing the order. Customized/bulk orders: Cannot be cancelled after design approval.'
    },
    {
      q: '13. How do I get support or ask questions?',
      a: 'You can contact us via Phone (+91-8947900884), Email (navodayatrendz@gmail.com), WhatsApp (available on website), or our social media (Instagram, Facebook, LinkedIn).'
    },
    {
      q: '14. Do you work with JNV schools for official events?',
      a: 'Yes. We supply trophies, certificates, event banners, and uniform T-shirts. We also support GeM Orders for principals and purchase officers.'
    },
    {
      q: '15. Do you take corporate or office orders?',
      a: 'Yes! We provide customized merchandise for Navodayan professionals working in corporates, startups, alumni associations, and NGOs. Bulk corporate pricing is available.'
    },
    {
      q: '16. Can I get help in designing my merchandise?',
      a: 'Absolutely! Our design team will create school logo designs, batch crests, alumni meet artwork, and custom branding. Design previews are shared before printing.'
    },
    {
      q: '17. How do I place a bulk order for an alumni meet?',
      a: 'You can place a bulk order by: Filling the Alumni Meet Form on the website, contacting us on WhatsApp, or calling directly for quick assistance. Our team will guide you through design, pricing, and delivery.'
    },
    {
      q: '18. Is there a discount for large orders?',
      a: 'Yes. We offer attractive discounts for alumni meets, corporate orders, school orders, and 100+ quantity bookings. The discount depends on the item type and quantity.'
    },
    {
      q: '19. Is this an official JNV/NVS store?',
      a: 'Navodaya Trendz is founded by Navodayans for the Navodaya community. We are not officially affiliated with NVS, but we serve all Navodayans and alumni groups worldwide.'
    },
    {
      q: '20. Do you keep customer data secure?',
      a: 'Yes. We follow strict security protocols to protect your personal information (details in our Privacy Policy page).'
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
                  <a className="btn-secondary" href="tel:+918947900884">
                    <i className="fas fa-phone"></i> Call
                  </a>
                  <a className="btn-secondary" href="mailto:navodayatrendz@gmail.com?subject=FAQ%20Help">
                    <i className="fas fa-envelope"></i> Email
                  </a>
                  <a className="btn-primary" href="https://wa.me/918947900884?text=Hi%2C%20I%20need%20help%20with%20my%20order">
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

      <style>{`
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
