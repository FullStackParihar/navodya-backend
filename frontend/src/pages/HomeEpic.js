import React from 'react';
import { Link } from 'react-router-dom';
import './HomeEpic.css';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop',
    link: '/tshirts',
    icon: 'fa-shirt-long-sleeve'
  },
  {
    name: 'Hoodies',
    description: 'Cozy & Warm',
    image: 'https://images.unsplash.com/photo-1626596738752-e34943c79b53?w=600&h=700&fit=crop',
    link: '/hoodies',
    icon: 'fa-shirt'
  },
  {
    name: 'Accessories',
    description: 'Complete Style',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop',
    link: '/accessories',
    icon: 'fa-hat-cowboy'
  },
  {
    name: 'Alumni Kits',
    description: 'Special Packages',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&h=700&fit=crop',
    link: '/alumni-kits',
    icon: 'fa-graduation-cap'
  },
  {
    name: 'Events',
    description: 'Meet & Celebrate',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=700&fit=crop',
    link: '/events',
    icon: 'fa-calendar-days'
  }
];

const events = [
  {
    title: 'Annual Alumni Meet',
    date: '2024-12-15',
    time: '10:00 AM',
    location: 'JNV Campus',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop'
  },
  {
    title: 'Silver Jubilee',
    date: '2025-01-25',
    time: '9:00 AM',
    location: 'Grand Palace',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'
  },
  {
    title: 'Sports Day',
    date: '2025-02-10',
    time: '8:00 AM',
    location: 'JNV Grounds',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba821?w=600&h=400&fit=crop'
  }
];

const HomeEpic = () => {
  return (
    <div className="home-epic">
      {/* Hero Section */}
      <section className="hero-epic">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <i className="fas fa-star"></i>
                #1 JNV Merchandise
              </div>
              <h1 className="hero-title">
                Wear Your
                <span className="title-line">
                  <span className="title-word" style={{ '--delay': '0s' }}>Navodaya</span>
                  <span className="title-word" style={{ '--delay': '0.2s' }}>Pride</span>
                </span>
              </h1>
              <p className="hero-description">
                Premium quality apparel and accessories for JNV students and alumni. Show your Navodaya spirit with style!
              </p>
              <div className="hero-actions">
                <Link to="/tshirts" className="btn btn-primary">
                  <i className="fas fa-bolt"></i>
                  Shop Collection
                </Link>
                <Link to="/events" className="btn btn-secondary">
                  <i className="fas fa-calendar-alt"></i>
                  Events
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-text">
                    <span className="stat-number">15K+</span>
                    <span className="stat-label">Happy Alumni</span>
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-icon">
                    <i className="fas fa-tshirt"></i>
                  </div>
                  <div className="stat-text">
                    <span className="stat-number">100+</span>
                    <span className="stat-label">Products</span>
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-text">
                    <span className="stat-number">4.9</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hero-right">
              <div className="hero-products">
                <div className="product-float product-1">
                  <div className="product-tag">HOT</div>
                  <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop" alt="T-Shirt" />
                </div>
                <div className="product-float product-2">
                  <img src="https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=400&h=500&fit=crop" alt="Hoodie" />
                </div>
                <div className="product-float product-3">
                  <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop" alt="Cap" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-hint">
          <span>Scroll to explore</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore</span>
            <h2 className="section-title">Shop by <span className="highlight">Category</span></h2>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay"></div>
                  <div className="category-icon">
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Events</span>
            <h2 className="section-title">Upcoming <span className="highlight">Events</span></h2>
          </div>
          
          <div className="events-grid">
            {events.map((event, index) => (
              <div key={index} className="event-card" style={{ '--delay': `${index * 0.15}s` }}>
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                </div>
                <div className="event-content">
                  {(() => {
                    const eventDate = new Date(event.date);
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    return (
                      <div className="event-date">
                        <span className="date-day">{day}</span>
                        <span className="date-month">{month}</span>
                      </div>
                    );
                  })()}
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span><i className="fas fa-clock"></i> {event.time}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                  </div>
                  <Link to="/events" className="btn-event">
                    <i className="fas fa-ticket-alt"></i>
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all-wrapper">
            <Link to="/events" className="btn btn-primary">
              View All Events
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <span className="cta-badge">Special Offer</span>
              <h2>Get <span className="highlight-gold">20% OFF</span> on Alumni Kits!</h2>
              <p>Use code <strong>ALUMNI20</strong> at checkout. Limited time offer!</p>
            </div>
            <div className="cta-actions">
              <Link to="/alumni-kits" className="btn btn-primary">
                <i className="fas fa-shopping-bag"></i>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeEpic;
