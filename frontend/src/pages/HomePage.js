import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand">Navodaya</span> Trendz
            </h1>
            <p className="hero-subtitle">
              Premium JNV Alumni Apparel & Accessories
            </p>
            <div className="hero-description">
              Discover our exclusive collection of high-quality t-shirts, hoodies, and accessories designed specifically for JNV students and alumni. Express your style with our premium products.
            </div>
            <div className="hero-actions">
              <Link to="/tshirts" className="btn btn-primary">
                <i className="fas fa-tshirt"></i>
                Shop T-Shirts
              </Link>
              <Link to="/hoodies" className="btn btn-secondary">
                <i className="fas fa-hoodie-cloak"></i>
                Shop Hoodies
              </Link>
              <Link to="/accessories" className="btn btn-accent">
                <i className="fas fa-glasses"></i>
                Accessories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Navodaya Trendz?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Premium Quality</h3>
              <p>High-quality materials and printing techniques ensure long-lasting comfort and style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>Exclusive Designs</h3>
              <p>Unique JNV-themed designs created by talented artists exclusively for our community.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your campus across India with real-time tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tags"></i>
              </div>
              <h3>Affordable Prices</h3>
              <p>Student-friendly pricing with special discounts for JNV students and bulk orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/tshirts" className="category-card">
              <div className="category-icon">
                <i className="fas fa-tshirt"></i>
              </div>
              <h3>T-Shirts</h3>
              <p>Premium cotton t-shirts with JNV branding</p>
            </Link>
            <Link to="/hoodies" className="category-card">
              <div className="category-icon">
                <i className="fas fa-hoodie-cloak"></i>
              </div>
              <h3>Hoodies</h3>
              <p>Comfortable hoodies for all weather conditions</p>
            </Link>
            <Link to="/accessories" className="category-card">
              <div className="category-icon">
                <i className="fas fa-glasses"></i>
              </div>
              <h3>Accessories</h3>
              <p>Complete your look with our accessories collection</p>
            </Link>
            <Link to="/alumni-kits" className="category-card">
              <div className="category-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Alumni Kits</h3>
              <p>Complete alumni packages with multiple items</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Students Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Amazing quality t-shirts! The JNV design is perfect and the fabric is so comfortable. Highly recommend!"
                </p>
                <div className="testimonial-author">
                  <strong>Rahul Kumar</strong>
                  <span>Class of 2022</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Great collection of hoodies and accessories. Fast delivery and excellent customer service!"
                </p>
                <div className="testimonial-author">
                  <strong>Priya Sharma</strong>
                  <span>Class of 2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-subtitle">Get the latest updates on new arrivals and exclusive offers</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                <i className="fas fa-envelope"></i>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
