import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SizeFilter from '../components/SizeFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced T-shirt products with more variety
const tshirtProducts = [
  {
    id: 1,
    name: 'JNV Classic T-Shirt',
    description: 'Premium Cotton | Custom Design',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: 'Bestseller',
    reviews: 245,
    rating: 4.5,
    category: 'Classic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Gray']
  },
  {
    id: 5,
    name: 'JNV Polo T-Shirt',
    description: 'Polo Collar | Embroidered Logo',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 189,
    rating: 4.3,
    category: 'Polo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'White', 'Black', 'Green']
  },
  {
    id: 6,
    name: 'JNV Sports T-Shirt',
    description: 'Dri-Fit Fabric | Athletic Fit',
    price: 449,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
    reviews: 156,
    rating: 4.6,
    category: 'Sports',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Blue', 'Red', 'Gray']
  },
  {
    id: 7,
    name: 'JNV Batch T-Shirt',
    description: 'Custom Batch Year | Premium Print',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    badge: 'Hot',
    reviews: 298,
    rating: 4.7,
    category: 'Classic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy']
  },
  {
    id: 8,
    name: 'JNV Alumni T-Shirt',
    description: 'Vintage Design | Soft Cotton',
    price: 429,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    reviews: 167,
    rating: 4.4,
    category: 'Vintage',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'White']
  },
  {
    id: 9,
    name: 'JNV Girls T-Shirt',
    description: 'Girls Fit | Stylish Design',
    price: 379,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=400&fit=crop',
    reviews: 134,
    rating: 4.2,
    category: 'Girls',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pink', 'White', 'Black', 'Purple']
  },
  {
    id: 10,
    name: 'JNV V-Neck T-Shirt',
    description: 'V-Neck Design | Premium Fabric',
    price: 419,
    originalPrice: 549,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 98,
    rating: 4.1,
    category: 'V-Neck',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Blue']
  },
  {
    id: 11,
    name: 'JNV Round Neck T-Shirt',
    description: 'Classic Round Neck | Comfort Fit',
    price: 359,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    reviews: 203,
    rating: 4.3,
    category: 'Classic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Red']
  },
  {
    id: 12,
    name: 'JNV Graphic T-Shirt',
    description: 'Graphic Print | Modern Design',
    price: 489,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    reviews: 176,
    rating: 4.5,
    category: 'Graphic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray']
  }
];

const TShirts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: []
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const filteredProducts = tshirtProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'trending' && product.badge !== 'Hot') return false;
    if (activeTab === 'new' && product.badge !== 'New') return false;
    if (activeTab === 'bestseller' && product.reviews < 200) return false;
    
    // Category filtering
    if (selectedFilters.categories.length > 0 && 
        !selectedFilters.categories.includes(product.category)) return false;
    
    // Size filtering
    if (selectedFilters.sizes.length > 0) {
      const hasSelectedSize = product.sizes.some(size => 
        selectedFilters.sizes.includes(size)
      );
      if (!hasSelectedSize) return false;
    }
    
    // Color filtering
    if (selectedFilters.colors.length > 0) {
      const hasSelectedColor = product.colors.some(color => 
        selectedFilters.colors.includes(color)
      );
      if (!hasSelectedColor) return false;
    }
    
    // Price filtering
    if (selectedFilters.priceRange.length > 0) {
      const inRange = selectedFilters.priceRange.some(range => {
        if (range === 'under-299') return product.price < 299;
        if (range === '299-499') return product.price >= 299 && product.price <= 499;
        if (range === '500-799') return product.price >= 500 && product.price <= 799;
        if (range === 'above-800') return product.price > 800;
        return false;
      });
      if (!inRange) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: []
    });
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="tshirt-hero animate-fadeIn">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slideDown">JNV T-Shirts Collection</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Premium quality T-shirts designed exclusively for Navodayans
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{tshirtProducts.length}+</span>
                <span className="stat-label">Designs</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.5★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">1.2k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Page */}
      <section className="shop-page-enhanced">
        <div className="container">
          <div className="shop-layout-enhanced">
            {/* Enhanced Filters Sidebar */}
            <aside className="filters-sidebar-enhanced animate-slideInLeft">
              <div className="filters-header">
                <h3>Filters</h3>
                {getFilterCount() > 0 && (
                  <button className="clear-filters" onClick={clearAllFilters}>
                    Clear All ({getFilterCount()})
                  </button>
                )}
              </div>

              <div className="filter-section">
                <h4>Categories</h4>
                <div className="filter-options">
                  {['Classic', 'Polo', 'Sports', 'Vintage', 'Girls', 'V-Neck', 'Graphic'].map(category => (
                    <label key={category} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <span className="filter-text">{category}</span>
                      <span className="filter-count">
                        {tshirtProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <SizeFilter 
                  onSizeChange={(sizes) => {
                    setSelectedFilters(prev => ({
                      ...prev,
                      sizes: sizes
                    }));
                  }}
                  selectedSizes={selectedFilters.sizes}
                />
              </div>

              <div className="filter-section">
                <h4>Price</h4>
                <div className="filter-options">
                  {[
                    { value: 'under-299', label: 'Under ₹299' },
                    { value: '299-499', label: '₹299 - ₹499' },
                    { value: '500-799', label: '₹500 - ₹799' },
                    { value: 'above-800', label: 'Above ₹800' }
                  ].map(range => (
                    <label key={range.value} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.priceRange.includes(range.value)}
                        onChange={() => handleFilterChange('priceRange', range.value)}
                      />
                      <span className="filter-text">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Color</h4>
                <div className="color-options-enhanced">
                  {[
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Navy', hex: '#000080' },
                    { name: 'Gray', hex: '#808080' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Blue', hex: '#0000ff' },
                    { name: 'Green', hex: '#008000' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Purple', hex: '#800080' }
                  ].map(color => (
                    <label key={color.name} className="color-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.colors.includes(color.name)}
                        onChange={() => handleFilterChange('colors', color.name)}
                      />
                      <span 
                        className="color-circle" 
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      ></span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Enhanced Products Main */}
            <main className="products-main-enhanced">
              <div className="products-header-enhanced">
                <div className="results-info">
                  <h2>Showing {filteredProducts.length} Products</h2>
                  {getFilterCount() > 0 && (
                    <p>Active filters: {getFilterCount()} applied</p>
                  )}
                </div>
                <div className="view-sort-options">
                  <div className="view-options">
                    <button className="view-btn active">
                      <i className="fas fa-th"></i>
                    </button>
                    <button className="view-btn">
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                  <div className="sort-dropdown">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Best Rating</option>
                      <option value="reviews">Most Reviews</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-tabs-enhanced">
                {['all', 'trending', 'new', 'bestseller'].map((tab, index) => (
                  <button 
                    key={tab}
                    className={`tab-btn-enhanced ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' && 'All Products'}
                    {tab === 'trending' && '🔥 Trending'}
                    {tab === 'new' && '✨ New Arrivals'}
                    {tab === 'bestseller' && '⭐ Bestsellers'}
                  </button>
                ))}
              </div>

              <div className="products-grid-enhanced">
                {isLoading ? (
                  <SkeletonLoader type="product" count={8} />
                ) : filteredProducts.length > 0 ? (
                  sortedProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="product-wrapper animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="no-products-found">
                    <i className="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or browse all products</p>
                    <button className="btn-primary" onClick={clearAllFilters}>
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {filteredProducts.length > 0 && (
                <div className="pagination-enhanced">
                  <button className="page-btn disabled">
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  <div className="page-numbers">
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <span className="page-dots">...</span>
                    <button className="page-btn">8</button>
                  </div>
                  <button className="page-btn">
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TShirts;
