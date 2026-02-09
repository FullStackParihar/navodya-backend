import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HoodiesPage.css';

const HoodiesPage = () => {
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const styles = [
    { id: 'all', name: 'All Hoodies' },
    { id: 'pullover', name: 'Pullover' },
    { id: 'zipup', name: 'Zip-Up' },
    { id: 'graphic', name: 'Graphic' }
  ];

  const products = [
    {
      id: 1,
      name: 'JNV Classic Hoodie',
      style: 'pullover',
      price: 1299,
      originalPrice: 1599,
      image: 'https://via.placeholder.com/300x400?text=Hoodie1',
      description: 'Premium cotton blend hoodie with embroidered JNV logo',
      colors: ['black', 'navy', 'gray'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      featured: true
    },
    {
      id: 2,
      name: 'Sports Performance Hoodie',
      style: 'zipup',
      price: 1499,
      originalPrice: 1899,
      image: 'https://via.placeholder.com/300x400?text=Hoodie2',
      description: 'Lightweight performance hoodie with moisture-wicking technology',
      colors: ['black', 'navy', 'gray', 'red'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      featured: true
    },
    {
      id: 3,
      name: 'Vintage Wash Hoodie',
      style: 'pullover',
      price: 1199,
      originalPrice: 1499,
      image: 'https://via.placeholder.com/300x400?text=Hoodie3',
      description: 'Comfortable vintage-style hoodie with relaxed fit',
      colors: ['black', 'gray', 'navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      featured: false
    },
    {
      id: 4,
      name: 'JNV Graphic Hoodie',
      style: 'graphic',
      price: 1599,
      originalPrice: 1999,
      image: 'https://via.placeholder.com/300x400?text=Hoodie4',
      description: 'Bold graphic designs featuring JNV themes and artwork',
      colors: ['black', 'navy', 'gray', 'red', 'blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      featured: false
    }
  ];

  const filteredProducts = products.filter(product => {
    const styleMatch = selectedStyle === 'all' || product.style === selectedStyle;
    return styleMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="hoodies-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Premium Hoodies Collection</h1>
          <p>Stay warm and stylish with our premium quality hoodies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            {/* Style Filter */}
            <div className="filter-group">
              <label className="filter-label">Style</label>
              <select 
                value={selectedStyle} 
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="filter-select"
              >
                {styles.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
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

      {/* Products Grid */}
      <div className="products-section">
        <div className="container">
          <div className="products-grid">
            {sortedProducts.map(product => (
              <div key={product.id} className="product-card">
                {product.featured && (
                  <div className="featured-badge">
                    <i className="fas fa-star"></i>
                    Featured
                  </div>
                )}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <div className="price-info">
                      {product.originalPrice > product.price ? (
                        <>
                          <span className="original-price">₹{product.originalPrice}</span>
                          <span className="current-price">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="current-price">₹{product.price}</span>
                      )}
                    </div>
                    <div className="product-features">
                      <span className="feature-tag">{product.style}</span>
                      <span className="sizes-info">Sizes: {product.sizes.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="add-to-cart-btn">
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                  <button className="quick-view-btn">
                    <i className="fas fa-eye"></i>
                    Quick View
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

export default HoodiesPage;
