import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Feedback = () => {
  const { success, error } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderId: '',
    topic: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim()) return 'Please enter your email';
    if (!form.message.trim()) return 'Please write your feedback';
    if (rating === 0) return 'Please select a rating';
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      error(msg);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      success('Thanks! Your feedback has been submitted.');
      setRating(0);
      setHoverRating(0);
      setForm({ name: '', email: '', orderId: '', topic: 'general', message: '' });
    }, 900);
  };

  const shownRating = hoverRating || rating;

  return (
    <div className="feedback-page">
      <section className="feedback-hero">
        <div className="container">
          <div className="hero-card">
            <div>
              <h1>Feedback</h1>
              <p>Help us improve Navodaya Trendz. Share your experience.</p>
            </div>
            <div className="hero-mini">
              <div className="mini">
                <div className="mini-title">Support</div>
                <a className="mini-link" href="mailto:support@navodayatrendz.com?subject=Feedback">support@navodayatrendz.com</a>
              </div>
              <div className="mini">
                <div className="mini-title">Call</div>
                <a className="mini-link" href="tel:+9118001234567">+91 1800-123-4567</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feedback-body">
        <div className="container">
          <div className="layout">
            <div className="card">
              <h2>Rate your experience</h2>
              <p className="muted">Select a rating and tell us what went well (or what didn’t).</p>

              <div className="stars" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`star ${shownRating >= n ? 'on' : ''}`}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(n)}
                    aria-label={`${n} star`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
                <span className="rating-text">{shownRating ? `${shownRating}/5` : 'Select'}</span>
              </div>

              <form className="form" onSubmit={onSubmit}>
                <div className="grid">
                  <div className="field">
                    <label>Name</label>
                    <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div className="field">
                    <label>Order ID (optional)</label>
                    <input value={form.orderId} onChange={(e) => handleChange('orderId', e.target.value)} placeholder="ORD2024..." />
                  </div>
                  <div className="field">
                    <label>Topic</label>
                    <select value={form.topic} onChange={(e) => handleChange('topic', e.target.value)}>
                      <option value="general">General</option>
                      <option value="product">Product Quality</option>
                      <option value="delivery">Delivery</option>
                      <option value="payment">Payment</option>
                      <option value="support">Support</option>
                      <option value="ui">Website UI</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Feedback</label>
                  <textarea
                    rows="5"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Write your feedback here..."
                  />
                </div>

                <div className="actions">
                  <button className="btn-secondary" type="button" onClick={() => {
                    setRating(0);
                    setHoverRating(0);
                    setForm({ name: '', email: '', orderId: '', topic: 'general', message: '' });
                  }}>
                    Reset
                  </button>
                  <button className="btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>

            <aside className="side">
              <div className="side-card">
                <h3>Quick help</h3>
                <p>Check FAQ for common questions.</p>
                <a className="btn-primary" href="/faq"><i className="fas fa-question-circle"></i> Open FAQ</a>
              </div>

              <div className="side-card">
                <h3>Track an order</h3>
                <p>If your feedback is about delivery, tracking helps.</p>
                <a className="btn-secondary" href="/account"><i className="fas fa-user-circle"></i> Account</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style jsx>{`
        .feedback-page {
          background: var(--bg-secondary, #f8fafc);
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .feedback-hero {
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

        .hero-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .mini {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 0.9rem;
        }

        .mini-title {
          color: var(--text-secondary, #64748b);
          font-weight: 800;
          font-size: 0.8rem;
        }

        .mini-link {
          color: var(--text-primary, #1e293b);
          font-weight: 900;
          text-decoration: none;
        }

        .feedback-body {
          padding: 1.25rem 0;
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.25rem;
          align-items: start;
        }

        .card {
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.5rem;
          border: 1px solid var(--border-color, #e2e8f0);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .muted {
          color: var(--text-secondary, #64748b);
          font-weight: 600;
          margin: 0.25rem 0 1rem;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin: 0.75rem 0 1.25rem;
        }

        .star {
          width: 42px;
          height: 42px;
          border-radius: 0.9rem;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted, #94a3b8);
        }

        .star:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 107, 53, 0.35);
        }

        .star.on {
          background: rgba(255, 107, 53, 0.12);
          color: var(--primary-color, #ff6b35);
          border-color: rgba(255, 107, 53, 0.35);
        }

        .rating-text {
          margin-left: 0.5rem;
          font-weight: 900;
          color: var(--text-primary, #1e293b);
        }

        .form {
          display: grid;
          gap: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .field {
          display: grid;
          gap: 0.35rem;
        }

        label {
          font-weight: 900;
          color: var(--text-primary, #1e293b);
          font-size: 0.9rem;
        }

        input, select, textarea {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 0.85rem 0.95rem;
          outline: none;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        input:focus, select:focus, textarea:focus {
          border-color: rgba(255, 107, 53, 0.45);
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.12);
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 900;
          cursor: pointer;
          padding: 0.85rem 1.15rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .btn-primary {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .btn-primary:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .side {
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

        @media (max-width: 1024px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .side {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .hero-mini {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Feedback;
