import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AlumniKits.css';

const AlumniKits = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const result = await api.get('/products');
        if (result.success) {
          const fetchedKits = result.data.products
            .filter(p => p.category_id && (p.category_id.name === 'Alumni Kit' || p.category_id.slug === 'alumni-kit'))
            .map(p => ({
              id: p._id,
              slug: p.slug,
              title: p.name,
              price: `₹${p.sale_price || p.price}`,
              description: p.description || 'Premium Alumni Kit',
              image: (p.images && p.images[0]) ? p.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'
            }));
          setKits(fetchedKits);
        }
      } catch (err) {
        console.error('Error loading kits', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKits();
  }, []);

  return (
    <div className="alumni-kits-page">
      <div className="alumni-kits-hero">
        <h1>Alumni Kits</h1>
        <p>Premium quality kits for Navodaya alumni to show your pride.</p>
      </div>

      <div className="alumni-kits-container">
        <div className="alumni-kits-header">
          <div>
            <span className="alumni-kits-eyebrow">Collection</span>
            <h2>Available Kits</h2>
          </div>
        </div>

        {loading ? (
          <div className="kits-loader">
            <div className="spinner"></div>
            <p>Loading kits...</p>
          </div>
        ) : kits.length === 0 ? (
          <div className="no-kits-state">
            <i className="fas fa-box-open"></i>
            <h2>No Alumni Kits Yet</h2>
            <p>Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="alumni-kits-grid">
            {kits.map((kit, index) => (
              <div key={kit.id} className="kit-card animate-fadeInUp" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="kit-banner">
                  <img src={kit.image} alt={kit.title} />
                  <div className="kit-badge"><i className="fas fa-box"></i> Kit</div>
                </div>

                <div className="kit-content">
                  <div className="kit-profile">
                    <div className="kit-avatar">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="kit-info">
                      <h3 className="kit-name">{kit.title}</h3>
                      <span className="kit-type">Navodaya Alumni Kit</span>
                    </div>
                  </div>

                  <div className="kit-details">
                    <div className="kit-detail-row price-row">
                      <span className="kit-detail-label"><i className="fas fa-tag"></i> Price:</span>
                      <span className="kit-detail-value highlight">{kit.price}</span>
                    </div>
                    <div className="kit-description">{kit.description}</div>
                  </div>

                  <Link to={`/product/${kit.id}`} className="kit-action">
                    <i className="fas fa-eye"></i>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniKits;
