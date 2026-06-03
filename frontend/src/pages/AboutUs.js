import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">About Navodaya Trendz</h1>
            <p className="about-hero-subtitle">Made by Navodayans, for Navodayans</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">Our <span className="highlight">Story</span></h2>
          </div>
          <div className="story-content">
            <p>
              Navodaya Trendz was born out of a simple idea: to create a space where Navodayans can 
              connect, celebrate their shared memories, and proudly wear their JNV identity. Founded 
              by a group of JNV alumni, we understand the unique bond that ties all Navodayans together.
            </p>
            <p>
              What started as a small initiative to create custom batch t-shirts has grown into a 
              full-fledged platform offering a wide range of merchandise, from hoodies to accessories, 
              all designed to celebrate the Navodaya spirit.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="our-mission">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Stand For</span>
            <h2 className="section-title">Our <span className="highlight">Mission</span></h2>
          </div>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Community First</h3>
              <p>Everything we do is centered around the Navodaya community, ensuring our products and services truly represent our shared values.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <i className="fas fa-tshirt"></i>
              </div>
              <h3>Quality Products</h3>
              <p>We are committed to delivering high-quality merchandise that you'll be proud to wear, using only the best materials.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Connect Alumni</h3>
              <p>We believe in the power of connection. Our platform and events bring Navodayans together across batches and regions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="our-team">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Meet the Makers</span>
            <h2 className="section-title">Our <span className="highlight">Team</span></h2>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Founder 1</h3>
              <p>JNV Batch 2005</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Founder 2</h3>
              <p>JNV Batch 2008</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3>Founder 3</h3>
              <p>JNV Batch 2010</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join the Navodaya Family</h2>
            <p>Become part of our growing community of proud Navodayans</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
