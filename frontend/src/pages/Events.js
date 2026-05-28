import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
    event: '',
    guests: '0',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const eventsList = [
    {
      id: 'annual-meet-2024',
      title: 'Annual Alumni Meet 2024',
      date: 'December 15, 2024',
      time: '10:00 AM - 6:00 PM',
      location: 'JNV Main Campus',
      description: 'Join us for the grand annual alumni meet with cultural programs, networking, and delicious food.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      price: 'Free',
      category: 'Reunion'
    },
    {
      id: 'silver-jubilee',
      title: 'JNV Silver Jubilee Reunion',
      date: 'January 25, 2025',
      time: '9:00 AM - 8:00 PM',
      location: 'Hotel Grand Palace',
      description: 'Celebrating 25 years of Navodaya with batchmates from 2000-2010. Special performances and memories.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      price: '₹1,500',
      category: 'Special'
    },
    {
      id: 'sports-day',
      title: 'Navodaya Sports Day',
      date: 'February 10, 2025',
      time: '8:00 AM - 5:00 PM',
      location: 'JNV Sports Complex',
      description: 'Relive your school days with friendly matches, competitions, and lots of fun.',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8217?w=600&h=400&fit=crop',
      price: 'Free',
      category: 'Sports'
    },
    {
      id: 'cultural-night',
      title: 'Cultural Night 2025',
      date: 'March 8, 2025',
      time: '6:00 PM - 11:00 PM',
      location: 'JNV Auditorium',
      description: 'An evening of music, dance, and performances by talented alumni.',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
      price: '₹500',
      category: 'Cultural'
    },
    {
      id: 'batch-reunion-2010',
      title: '2010 Batch Reunion',
      date: 'April 20, 2025',
      time: '5:00 PM - 10:00 PM',
      location: 'The Lawns Resort',
      description: 'Exclusive reunion for the 2010 batch. Catch up with old friends!',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
      price: '₹2,000',
      category: 'Batch'
    },
    {
      id: 'alumni-conclave',
      title: 'Alumni Career Conclave',
      date: 'May 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'JNV Seminar Hall',
      description: 'Career guidance, mentorship, and networking opportunities for students and alumni.',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop',
      price: 'Free',
      category: 'Career'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        batch: '',
        event: '',
        guests: '0',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <div className="events-hero-content">
            <span className="events-badge">Events & Reunions</span>
            <h1 className="events-title">Register for <span className="highlight">Upcoming Events</span></h1>
            <p className="events-subtitle">Join amazing reunions, connect with batchmates, and create lasting memories!</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="events-layout">
          {/* Events List */}
          <div className="events-list-section">
            <h2 className="section-heading">
              <i className="fas fa-calendar-alt"></i>
              Upcoming Events
            </h2>
            <div className="events-list">
              {eventsList.map((event, index) => (
                <div key={event.id} className="event-card animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="event-card-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-price-tag">{event.price}</div>
                  </div>
                  <div className="event-card-content">
          <span className="event-category">{event.category}</span>
          <h3 className="event-card-title">{event.title}</h3>
          <div className="event-card-meta">
                      <span><i className="fas fa-calendar"></i> {event.date}</span>
                      <span><i className="fas fa-clock"></i> {event.time}</span>
                      <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                    </div>
                    <p className="event-card-desc">{event.description}</p>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => setFormData(prev => ({ ...prev, event: event.id }))}
                    >
                      <i className="fas fa-ticket-alt"></i>
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="registration-section">
            <div className="registration-card">
              <div className="registration-header">
                <div className="registration-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h2>Event Registration</h2>
                <p>Fill out the form to register for an event</p>
              </div>

              {submitSuccess ? (
                <div className="success-message">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>Registration Successful!</h3>
                  <p>Thank you for registering. We'll send you a confirmation email shortly.</p>
                  <Link to="/" className="btn btn-primary">
                    <i className="fas fa-home"></i>
                    Back to Home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="registration-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      <i className="fas fa-user"></i>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <i className="fas fa-phone"></i>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="batch">
                      <i className="fas fa-graduation-cap"></i>
                      Batch Year
                    </label>
                    <input
                      type="text"
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      placeholder="e.g., 2010"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="event">
                      <i className="fas fa-calendar-check"></i>
                      Select Event *
                    </label>
                    <select
                      id="event"
                      name="event"
                      value={formData.event}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Choose an event --</option>
                      {eventsList.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.title} ({event.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="guests">
                      <i className="fas fa-users"></i>
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                    >
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <i className="fas fa-comment"></i>
                      Special Requests
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Any special requests or notes..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Complete Registration
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
