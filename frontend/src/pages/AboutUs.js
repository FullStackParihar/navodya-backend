import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Learn more about Navodaya Trendz</p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="about-heading">Our Story</h2>
              <p className="about-paragraph">
                Navodaya Trendz is an exclusive merchandise store designed for Navodayans, 
                celebrating the journey and connecting alumni across India. Founded with 
                a passion for preserving the memories of Jawahar Navodaya Vidyalayas, 
                we offer a wide range of premium quality products.
              </p>
              <p className="about-paragraph">
                From T-shirts and hoodies to mementos and accessories, each product 
                is crafted with care to reflect the spirit of Navodaya. We believe in 
                bringing the community together through shared memories and high-quality 
                merchandise.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="/story.jpeg" 
                alt="Our Story - Navodaya Trendz" 
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section-about">
        <div className="container">
          <div className="stats-grid-about">
            <div className="stat-card-about">
              <div className="stat-number-about">660+</div>
              <div className="stat-label-about">JNV Schools</div>
            </div>
            <div className="stat-card-about">
              <div className="stat-number-about">50K+</div>
              <div className="stat-label-about">Alumni Connected</div>
            </div>
            <div className="stat-card-about">
              <div className="stat-number-about">1000+</div>
              <div className="stat-label-about">Products</div>
            </div>
            <div className="stat-card-about">
              <div className="stat-number-about">28</div>
              <div className="stat-label-about">States</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2 className="mission-heading">Our Mission</h2>
            <p className="mission-text">
              To provide high-quality, affordable merchandise that celebrates the Navodaya 
              experience and connects alumni across India, preserving memories for generations to come.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
