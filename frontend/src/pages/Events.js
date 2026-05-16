import React, { useState } from 'react';

const Events = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, title: 'Navodaya Brand Launch Webinar', date: '2024-06-10', time: '7:00 PM', location: 'Online (Zoom)', attendees: 450, maxAttendees: 1000, price: 0, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fas fa-rocket' },
    { id: 2, title: 'Alumni Career Consulting Session', date: '2024-06-15', time: '4:00 PM', location: 'Online (Google Meet)', attendees: 280, maxAttendees: 500, price: 199, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fas fa-briefcase' },
    { id: 3, title: 'Brand Merchandise Design Workshop', date: '2024-06-20', time: '3:00 PM', location: 'Online (Zoom)', attendees: 150, maxAttendees: 300, price: 0, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'fas fa-palette' },
    { id: 4, title: 'Digital Marketing for Alumni Entrepreneurs', date: '2024-06-25', time: '6:00 PM', location: 'Online (Teams)', attendees: 320, maxAttendees: 600, price: 299, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: 'fas fa-chart-line' },
    { id: 5, title: 'Navodaya Community Q&A', date: '2024-07-01', time: '8:00 PM', location: 'Online (YouTube Live)', attendees: 600, maxAttendees: 2000, price: 0, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: 'fas fa-comments' }
  ];

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    alert(`Successfully registered for ${selectedEvent.title}!`);
    setShowRegistrationForm(false);
    setSelectedEvent(null);
  };

  return (
    <div className="product-page-container">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Join online events, consulting & brand sessions</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2 className="about-heading" style={{ marginBottom: '40px' }}>Featured Events</h2>
          <div className="regions-grid">
            {events.map((event) => (
              <div key={event.id} className="region-card">
                <div className="region-image" style={{ background: event.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <i className={event.icon} style={{ fontSize: '64px', marginBottom: '8px' }}></i>
                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{event.title}</h3>
                  </div>
                </div>
                <div className="region-content">
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>{event.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>
                    <i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>
                    <i className="fas fa-clock"></i> {event.time}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                    <i className="fas fa-map-marker-alt"></i> {event.location}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                    <button 
                      className="add-to-cart-new"
                      onClick={() => handleRegister(event)}
                      disabled={event.attendees >= event.maxAttendees}
                    >
                      {event.attendees >= event.maxAttendees ? 'Sold Out' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container">
          <h2 className="about-heading" style={{ marginBottom: '40px' }}>Upcoming Events</h2>
          <div className="regions-grid">
            <div className="region-card">
              <div className="region-image" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <i className="fas fa-calendar-alt" style={{ fontSize: '64px', marginBottom: '8px' }}></i>
                  <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Alumni Reunion 2025</h3>
                </div>
              </div>
              <div className="region-content">
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>Alumni Reunion 2025</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>
                  <i className="fas fa-calendar"></i> December 15, 2025
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                  <i className="fas fa-map-marker-alt"></i> Goa, India
                </p>
                <a 
                  href="https://wa.me/919284490206" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                    padding: '12px 24px', background: '#25D366', color: 'white', 
                    borderRadius: '12px', textDecoration: 'none', fontWeight: '600', 
                    fontSize: '16px'
                  }}
                >
                  <i className="fab fa-whatsapp"></i> Connect on WhatsApp
                </a>
              </div>
            </div>

            <div className="region-card">
              <div className="region-image" style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <i className="fas fa-laptop-code" style={{ fontSize: '64px', marginBottom: '8px' }}></i>
                  <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Tech Summit 2025</h3>
                </div>
              </div>
              <div className="region-content">
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>Tech Summit 2025</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>
                  <i className="fas fa-calendar"></i> November 20, 2025
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                  <i className="fas fa-map-marker-alt"></i> Online (Zoom)
                </p>
                <a 
                  href="https://wa.me/919284490206" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                    padding: '12px 24px', background: '#25D366', color: 'white', 
                    borderRadius: '12px', textDecoration: 'none', fontWeight: '600', 
                    fontSize: '16px'
                  }}
                >
                  <i className="fab fa-whatsapp"></i> Connect on WhatsApp
                </a>
              </div>
            </div>

            <div className="region-card">
              <div className="region-image" style={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <i className="fas fa-star" style={{ fontSize: '64px', marginBottom: '8px' }}></i>
                  <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Annual Dinner 2025</h3>
                </div>
              </div>
              <div className="region-content">
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>Annual Dinner 2025</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>
                  <i className="fas fa-calendar"></i> January 10, 2025
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '12px' }}>
                  <i className="fas fa-map-marker-alt"></i> Delhi, India
                </p>
                <a 
                  href="https://wa.me/919284490206" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                    padding: '12px 24px', background: '#25D366', color: 'white', 
                    borderRadius: '12px', textDecoration: 'none', fontWeight: '600', 
                    fontSize: '16px'
                  }}
                >
                  <i className="fab fa-whatsapp"></i> Connect on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showRegistrationForm && selectedEvent && (
        <div style={{ 
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: '1000', padding: '20px'
        }}>
          <div style={{ 
            background: 'white', borderRadius: '20px', padding: '40px', 
            maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-dark)' }}>
                Register for {selectedEvent.title}
              </h2>
              <button 
                onClick={() => setShowRegistrationForm(false)}
                style={{ 
                  background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-gray)'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  style={{ 
                    width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                    borderRadius: '12px', fontSize: '16px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Email *</label>
                <input
                  type="email"
                  required
                  style={{ 
                    width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                    borderRadius: '12px', fontSize: '16px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  style={{ 
                    width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                    borderRadius: '12px', fontSize: '16px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>JNV Batch</label>
                <input
                  type="text"
                  style={{ 
                    width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                    borderRadius: '12px', fontSize: '16px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="add-to-cart-new">
                  <i className="fas fa-check"></i> Complete Registration
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  style={{ 
                    padding: '14px 28px', borderRadius: '12px', fontSize: '16px', 
                    fontWeight: '600', cursor: 'pointer', border: '1px solid #e2e8f0', 
                    background: 'white', color: 'var(--text-dark)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
