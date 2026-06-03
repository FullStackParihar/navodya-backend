import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css'; // reuse the same CSS for consistency

const AlumniKits = () => {
  const kits = [
    {
      id: 'basic',
      title: 'Basic Alumni Kit',
      price: '₹499',
      description: 'T-shirt + Cap + Keychain',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
    },
    {
      id: 'premium',
      title: 'Premium Alumni Kit',
      price: '₹999',
      description: 'T-shirt + Hoodie + Cap + Keychain + Sticker Pack',
      image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=600&h=400&fit=crop'
    },
    {
      id: 'deluxe',
      title: 'Deluxe Alumni Kit',
      price: '₹1499',
      description: 'Premium T-shirt + Premium Hoodie + Cap + Keychain + Sticker Pack + Mug',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=400&fit=crop'
    }
  ];

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <div className="events-hero-content">
            <span className="events-badge">Alumni Kits</span>
            <h1 className="events-title">Complete Your <span className="highlight">Navodaya Collection</span></h1>
            <p className="events-subtitle">Premium quality kits for Navodaya alumni to show your pride!</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="events-layout">
          <div className="events-list-section">
            <h2 className="section-heading">
              <i className="fas fa-box"></i>
              Available Kits
            </h2>
            <div className="events-list">
              {kits.map((kit, index) => (
                <div key={kit.id} className="event-card animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="event-card-image">
                    <img src={kit.image} alt={kit.title} />
                    <div className="event-price-tag">{kit.price}</div>
                  </div>
                  <div className="event-card-content">
                    <span className="event-category">Kit</span>
                    <h3 className="event-card-title">{kit.title}</h3>
                    <p className="event-card-desc">{kit.description}</p>
                    <Link to="/" className="btn btn-primary btn-small">
                      <i className="fas fa-shopping-cart"></i>
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="registration-section">
            <div className="registration-card">
              <div className="registration-header">
                <div className="registration-icon">
                  <i className="fas fa-gift"></i>
                </div>
                <h2>Custom Kit</h2>
                <p>Can't find what you want? Create your own custom kit!</p>
              </div>
              <Link to="/customize" className="btn btn-primary btn-full">
                <i className="fas fa-palette"></i>
                Customize Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniKits;
