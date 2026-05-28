import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePro.css';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Quality',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    link: '/tshirts',
    icon: 'fas fa-tshirt',
    count: 24
  },
  {
    name: 'Hoodies',
    description: 'Cozy & Warm',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=500&h=500&fit=crop',
    link: '/hoodies',
    icon: 'fas fa-hoodie-cloak',
    count: 18
  },
  {
    name: 'Accessories',
    description: 'Complete Look',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=500&h=500&fit=crop',
    link: '/accessories',
    icon: 'fas fa-hat-cowboy',
    count: 32
  },
  {
    name: 'Alumni Kits',
    description: 'Special Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop',
    link: '/alumni-kits',
    icon: 'fas fa-graduation-cap',
    count: 12
  }
];

const alumniFeatures = [
  {
    icon: 'fas fa-users',
    title: 'Alumni Community',
    description: 'Connect with fellow JNV graduates',
    color: '#fbbf24'
  },
  {
    icon: 'fas fa-calendar-alt',
    title: 'Events & Reunions',
    description: 'Stay updated on upcoming events',
    color: '#f59e0b'
  },
  {
    icon: 'fas fa-trophy',
    title: 'Merchandise',
    description: 'Exclusive alumni designs',
    color: '#d97706'
  },
  {
    icon: 'fas fa-bullhorn',
    title: 'Organize Events',
    description: 'Plan your next reunion',
    color: '#b45309'
  }
];

const events = [
  {
    title: 'Annual Alumni Meet 2024',
    date: 'December 15, 2024',
    time: '10:00 AM - 6:00 PM',
    location: 'JNV Main Campus',
    description: 'Join us for the grand annual alumni meet with cultural programs and networking.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
  },
  {
    title: 'JNV Silver Jubilee Reunion',
    date: 'January 25, 2025',
    time: '9:00 AM - 8:00 PM',
    location: 'Hotel Grand Palace',
    description: 'Celebrating 25 years of Navodaya with batchmates from 2000-2010.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop'
  },
  {
    title: 'Navodaya Sports Day',
    date: 'February 10, 2025',
    time: '8:00 AM - 5:00 PM',
    location: 'JNV Sports Complex',
    description: 'Relive your school days with friendly matches and competitions.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba821?w=600&h=400&fit=crop'
  }
];

const HomePro = () => {
  return (
    <div className="home-pro">
      {/* Hero Banner */}
      <section className="hero-banner-pro">
        <div className="hero-bg-pattern"></div>
        <div className="hero-gradient-overlay"></div>
        <div className="container">
          <div className="hero-content-pro">
            <div className="hero-text-pro">
              <span className="hero-badge-pro animate-float">
                <i className="fas fa-star"></i>
                Welcome to Navodaya Family
              </span>
              <h1 className="hero-title-pro animate-slide-up">
                Navodaya <span className="highlight">Trendz</span>
              </h1>
              <p className="hero-subtitle-pro animate-slide-up">
                Premium Merchandise & Community for JNV Students & Alumni
              </p>
              <p className="hero-desc-pro animate-slide-up">
                Discover exclusive JNV-themed apparel, connect with alumni, and organize amazing reunions. Show your Navodaya pride!
              </p>
              <div className="hero-buttons-pro animate-slide-up">
                <Link to="/tshirts" className="btn btn-primary-pro">
                  <i className="fas fa-shopping-bag"></i>
                  Shop Now
                </Link>
                <Link to="/events" className="btn btn-secondary-pro">
                  <i className="fas fa-calendar-check"></i>
                  Register Events
                </Link>
              </div>
              <div className="hero-stats-pro animate-fade-in">
                <div className="stat-box-pro">
                  <div className="stat-icon-pro">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content-pro">
                    <span className="stat-number-pro">15K+</span>
                    <span className="stat-label-pro">Community Members</span>
                  </div>
                </div>
                <div className="stat-box-pro">
                  <div className="stat-icon-pro">
                    <i className="fas fa-tshirt"></i>
                  </div>
                  <div className="stat-content-pro">
                    <span className="stat-number-pro">86</span>
                    <span className="stat-label-pro">Products</span>
                  </div>
                </div>
                <div className="stat-box-pro">
                  <div className="stat-icon-pro">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-content-pro">
                    <span className="stat-number-pro">50+</span>
                    <span className="stat-label-pro">Events</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual-pro animate-scale-in">
              <div className="hero-product-card card-one">
                <div className="product-badge-pro">
                  <span>HOT</span>
                </div>
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop" alt="T-Shirt" />
              </div>
              <div className="hero-product-card card-two">
                <img src="https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=400&h=500&fit=crop" alt="Hoodie" />
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator-pro animate-bounce">
          <span>Discover More</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section-pro">
        <div className="container">
          <div className="section-header-pro text-center">
            <span className="section-tag-pro">Explore</span>
            <h2 className="section-title-pro">
              Shop by <span className="highlight">Category</span>
            </h2>
            <p className="section-subtitle-pro">Find the perfect merchandise for every occasion</p>
          </div>
          <div className="categories-grid-pro">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card-pro animate-fade-up"
              >
                <div className="category-image-wrapper-pro">
                  <img src={category.image} alt={category.name} className="category-img-pro" />
                  <div className="category-overlay-pro"></div>
                  <div className="category-badge-pro">
                    <span>{category.count} Items</span>
                  </div>
                </div>
                <div className="category-info-pro">
                  <div className="category-icon-pro">
                    <i className={category.icon}></i>
                  </div>
                  <h3 className="category-name-pro">{category.name}</h3>
                  <p className="category-desc-pro">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni & Events Section */}
      <section className="alumni-section-pro">
        <div className="container">
          <div className="alumni-content-pro">
            <div className="alumni-text-pro">
              <span className="section-tag-pro">Alumni Community</span>
              <h2 className="section-title-pro white">
                For JNV <span className="highlight-gold">Alumni</span> & Event Organizers
              </h2>
              <p className="alumni-desc-pro">
                Connect with your batchmates, organize reunions, and get exclusive alumni merchandise.
              </p>
              <div className="alumni-features-pro">
                {alumniFeatures.map((feature, index) => (
                  <div key={index} className="alumni-feature-pro animate-fade-up">
                    <div className="feature-icon-wrapper-pro" style={{ background: feature.color }}>
                      <i className={feature.icon}></i>
                    </div>
                    <div className="feature-text-pro">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="alumni-actions-pro">
                <Link to="/profile" className="btn btn-primary-pro btn-gold">
                  <i className="fas fa-user-circle"></i>
                  My Profile
                </Link>
                <Link to="/events" className="btn btn-outline-light">
                  <i className="fas fa-calendar-plus"></i>
                  Register for Events
                </Link>
              </div>
            </div>
            <div className="alumni-visual-pro animate-scale-in">
              <div className="alumni-card-pro">
                <div className="alumni-avatar-pro">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Join the Community</h3>
                <p>Connect with thousands of JNV alumni worldwide</p>
                <div className="alumni-stats-pro">
                  <div>
                    <strong>500+</strong>
                    <span>Batches</span>
                  </div>
                  <div>
                    <strong>15K+</strong>
                    <span>Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="events-section-pro">
        <div className="container">
          <div className="section-header-pro text-center">
            <span className="section-tag-pro">Events</span>
            <h2 className="section-title-pro">
              Upcoming <span className="highlight">Events</span>
            </h2>
            <p className="section-subtitle-pro">Don't miss out on amazing reunions and gatherings!</p>
          </div>
          <div className="events-grid-pro">
            {events.map((event, index) => (
              <div key={index} className="event-card-pro animate-fade-up">
                <div className="event-image-wrapper">
                  <img src={event.image} alt={event.title} className="event-image" />
                </div>
                <div className="event-content">
                  <div className="event-date-box">
                    <span className="event-month">DEC</span>
                    <span className="event-day">15</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span><i className="fas fa-clock"></i> {event.time}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <Link to="/events" className="btn btn-outline-pro btn-small">
                    <i className="fas fa-ticket-alt"></i>
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-wrapper-pro">
            <Link to="/events" className="btn btn-primary-pro">
              <i className="fas fa-calendar-alt"></i>
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="offers-banner-pro">
        <div className="container">
          <div className="offers-content-pro">
            <div className="offers-text-pro">
              <span className="offers-badge-pro">
                <i className="fas fa-gift"></i>
                Limited Time Offer
              </span>
              <h2>Get <span className="highlight-gold">20% OFF</span> on Alumni Kits!</h2>
              <p>Use code: <strong>ALUMNI20</strong> at checkout. Valid till stocks last!</p>
            </div>
            <div className="offers-actions-pro">
              <Link to="/alumni-kits" className="btn btn-primary-pro btn-gold">
                <i className="fas fa-shopping-cart"></i>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePro;
