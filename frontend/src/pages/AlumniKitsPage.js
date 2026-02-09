import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AlumniKitsPage.css';

const AlumniKitsPage = () => {
  const [selectedKit, setSelectedKit] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const kits = [
    {
      id: 1,
      name: 'Premium Alumni Kit',
      price: 2999,
      originalPrice: 3999,
      image: 'https://via.placeholder.com/300x400?text=Kit1',
      description: 'Complete alumni kit with t-shirt, hoodie, cap, and accessories',
      items: ['T-Shirt', 'Hoodie', 'Cap', 'Keychain', 'Badge'],
      featured: true,
      discount: 25
    },
    {
      id: 2,
      name: 'Sports Alumni Kit',
      price: 3499,
      originalPrice: 4499,
      image: 'https://via.placeholder.com/300x400?text=Kit2',
      description: 'Performance-focused kit with moisture-wicking hoodie and sports cap',
      items: ['T-Shirt', 'Hoodie', 'Cap', 'Water Bottle'],
      featured: true,
      discount: 20
    },
    {
      id: 3,
      name: 'Classic Alumni Kit',
      price: 2499,
      originalPrice: 3299,
      image: 'https://via.placeholder.com/300x400?text=Kit3',
      description: 'Traditional kit with classic t-shirt and pullover hoodie',
      items: ['T-Shirt', 'Hoodie'],
      featured: false,
      discount: 15
    },
    {
      id: 4,
      name: 'Graduation Special Kit',
      price: 4999,
      originalPrice: 5999,
      image: 'https://via.placeholder.com/300x400?text=Kit4',
      description: 'Premium graduation kit with formal accessories and gift items',
      items: ['T-Shirt', 'Hoodie', 'Cap', 'Tie', 'Certificate', 'Gift Box'],
      featured: false,
      discount: 30
    }
  ];

  const filteredKits = selectedKit === 'all' ? kits : kits.filter(kit => kit.id === selectedKit);

  const sortedKits = [...filteredKits].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="alumni-kits-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Alumni Kits Collection</h1>
          <p>Comprehensive kits designed for JNV alumni with exclusive items and special discounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            {/* Kit Filter */}
            <div className="filter-group">
              <label className="filter-label">Kit Type</label>
              <select 
                value={selectedKit} 
                onChange={(e) => setSelectedKit(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Kits</option>
                <option value="premium">Premium</option>
                <option value="sports">Sports</option>
                <option value="classic">Classic</option>
                <option value="graduation">Graduation</option>
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kits Grid */}
      <div className="kits-section">
        <div className="container">
          <div className="kits-grid">
            {sortedKits.map(kit => (
              <div key={kit.id} className="kit-card">
                {kit.featured && (
                  <div className="featured-badge">
                    <i className="fas fa-star"></i>
                    Featured
                  </div>
                )}
                {kit.discount && (
                  <div className="discount-badge">
                    -{kit.discount}% OFF
                  </div>
                )}
                <div className="kit-image">
                  <img src={kit.image} alt={kit.name} />
                </div>
                <div className="kit-info">
                  <h3 className="kit-name">{kit.name}</h3>
                  <p className="kit-description">{kit.description}</p>
                  <div className="kit-meta">
                    <div className="price-info">
                      {kit.originalPrice > kit.price ? (
                        <>
                          <span className="original-price">₹{kit.originalPrice}</span>
                          <span className="current-price">₹{kit.price}</span>
                        </>
                      ) : (
                        <span className="current-price">₹{kit.price}</span>
                      )}
                    </div>
                    <div className="kit-items">
                      <span className="items-label">Includes:</span>
                      <div className="items-list">
                        {kit.items.map((item, index) => (
                          <span key={index} className="item-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kit-actions">
                  <button className="add-to-cart-btn">
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                  <button className="quick-view-btn">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniKitsPage;
