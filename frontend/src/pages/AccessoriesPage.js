import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AccessoriesPage.css';

const AccessoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', name: 'All Accessories' },
    { id: 'bags', name: 'Bags & Backpacks' },
    { id: 'caps', name: 'Caps & Hats' },
    { id: 'watches', name: 'Watches' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'other', name: 'Other' }
  ];

  const products = [
    {
      id: 1,
      name: 'JNV Backpack',
      category: 'bags',
      price: 999,
      originalPrice: 1299,
      image: 'https://via.placeholder.com/300x400?text=Backpack1',
      description: 'Durable backpack with JNV logo and multiple compartments',
      colors: ['black', 'navy'],
      featured: true
    },
    {
      id: 2,
      name: 'Sports Cap',
      category: 'caps',
      price: 499,
      originalPrice: 699,
      image: 'https://via.placeholder.com/300x400?text=Cap1',
      description: 'Breathable sports cap with embroidered JNV emblem',
      colors: ['black', 'navy', 'white', 'red'],
      featured: true
    },
    {
      id: 3,
      name: 'Classic Watch',
      category: 'watches',
      price: 1999,
      originalPrice: 2499,
      image: 'https://via.placeholder.com/300x400?text=Watch1',
      description: 'Elegant watch with JNV branding on the dial',
      colors: ['black', 'navy', 'brown'],
      featured: false
    },
    {
      id: 4,
      name: 'JNV Keychain',
      category: 'other',
      price: 299,
      originalPrice: 399,
      image: 'https://via.placeholder.com/300x400?text=Keychain1',
      description: 'Stylish keychain with JNV logo charm',
      colors: ['black', 'navy', 'silver'],
      featured: false
    },
    {
      id: 5,
      name: 'Alumni Badge Holder',
      category: 'other',
      price: 199,
      originalPrice: 299,
      image: 'https://via.placeholder.com/300x400?text=Badge1',
      description: 'Professional badge holder for JNV alumni identification',
      colors: ['black', 'navy', 'blue'],
      featured: false
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    return categoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="accessories-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Accessories Collection</h1>
          <p>Complete your JNV look with our premium accessories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
                    <div className="product-category">
                      <span className="category-tag">{product.category}</span>
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

export default AccessoriesPage;
