import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">Get in touch with Navodaya Trendz</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="contact-heading">Get in Touch</h2>
              <div className="contact-item">
                <i className="fab fa-whatsapp contact-icon" style={{ background: '#25D366', color: 'white' }}></i>
                <div>
                  <h3>WhatsApp</h3>
                  <a href="https://wa.me/919284490206" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>+91 92844 90206</a>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope contact-icon"></i>
                <div>
                  <h3>Email</h3>
                  <p>info@navodyatrendz.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone contact-icon"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <div>
                  <h3>Address</h3>
                  <p>New Delhi, India</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                {submitMessage && (
                  <div className="success-message-contact">
                    <i className="fas fa-check-circle"></i> {submitMessage}
                  </div>
                )}
                <div className="form-group-contact">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input-contact"
                  />
                </div>
                <div className="form-group-contact">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input-contact"
                  />
                </div>
                <div className="form-group-contact">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-input-contact"
                  />
                </div>
                <div className="form-group-contact">
                  <label>Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="form-textarea-contact"
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn-contact">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
