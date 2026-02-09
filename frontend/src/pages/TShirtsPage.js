import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TShirtsPage.css';

const TShirtsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', name: 'All T-Shirts' },
    { id: 'classic', name: 'Classic' },
    { id: 'sports', name: 'Sports' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'graphic', name: 'Graphic' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { id: 'all', name: 'All Colors', hex: '#000000' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'navy', name: 'Navy', hex: '#1e3a8a' },
    { id: 'gray', name: 'Gray', hex: '#6B7280' },
    { id: 'red', name: 'Red', hex: '#DC2626' },
    { id: 'blue', name: 'Blue', hex: '#2563EB' }
  ];

  const products = [
    {
      id: 1,
      name: 'JNV Classic Tee',
      category: 'classic',
      price: 599,
      originalPrice: 799,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt1',
      description: 'Premium cotton t-shirt with classic JNV logo',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['white', 'black', 'navy', 'gray'],
      featured: true
    },
    {
      id: 2,
      name: 'Sports Performance Tee',
      category: 'sports',
      price: 799,
      originalPrice: 999,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt2',
      description: 'Moisture-wicking fabric perfect for sports activities',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'navy', 'red', 'blue'],
      featured: true
    },
    {
      id: 3,
      name: 'Vintage JNV Design',
      category: 'vintage',
      price: 899,
      originalPrice: 1299,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt3',
      description: 'Retro-inspired design with distressed JNV branding',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['white', 'black', 'gray', 'navy'],
      featured: false
    },
    {
      id: 4,
      name: 'Graphic Art Tee',
      category: 'graphic',
      price: 999,
      originalPrice: 1499,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt4',
      description: 'Unique graphic designs created by JNV artists',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'red', 'blue', 'gray'],
      featured: false
    },
    {
      id: 5,
      name: 'Alumni Batch Tee',
      category: 'classic',
      price: 1299,
      originalPrice: 1899,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt5',
      description: 'Special edition for JNV alumni batches',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['white', 'black', 'navy', 'gray'],
      featured: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize);
    const colorMatch = selectedColor === 'all' || product.colors.includes(selectedColor);
    return categoryMatch && sizeMatch && colorMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="tshirts-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>T-Shirts Collection</h1>
          <p>Premium quality t-shirts designed for JNV students and alumni</p>
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

            {/* Size Filter */}
            <div className="filter-group">
              <label className="filter-label">Size</label>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div className="filter-group">
              <label className="filter-label">Color</label>
              <select 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
                className="filter-select"
              >
                {colors.map(color => (
                  <option key={color.id} value={color.id}>
                    {color.name}
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
                  {product.originalPrice > product.price && (
                    <div className="discount-badge">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
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
                    <div className="product-sizes">
                      <span className="sizes-label">Sizes:</span>
                      <div className="size-pills">
                        {product.sizes.map(size => (
                          <span key={size} className="size-pill">
                            {size}
                          </span>
                        ))}
                      </div>
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

export default TShirtsPage;
