import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Hoodie products with more variety
const hoodieProducts = [
  {
    id: 21,
    name: 'JNV Classic Hoodie',
    description: 'Premium Cotton | Fleece Lined | Custom Design',
    price: 799,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'Bestseller',
    reviews: 342,
    rating: 4.6,
    category: 'Classic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Gray', 'Maroon']
  },
  {
    id: 22,
    name: 'JNV Zipper Hoodie',
    description: 'Full Zipper | Pockets | Embroidered Logo',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    badge: 'Hot',
    reviews: 278,
    rating: 4.5,
    category: 'Zipper',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Forest Green']
  },
  {
    id: 23,
    name: 'JNV Sports Hoodie',
    description: 'Performance Fabric | Moisture Wicking | Athletic Fit',
    price: 849,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 189,
    rating: 4.7,
    category: 'Sports',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Blue', 'Red', 'Gray']
  },
  {
    id: 24,
    name: 'JNV Alumni Hoodie',
    description: 'Vintage Design | Premium Fleece | Alumni Badge',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 412,
    rating: 4.8,
    category: 'Alumni',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'Navy', 'Burgundy']
  },
  {
    id: 25,
    name: 'JNV Girls Hoodie',
    description: 'Slim Fit | Stylish Design | Soft Fabric',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=400&fit=crop',
    reviews: 156,
    rating: 4.4,
    category: 'Girls',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pink', 'White', 'Black', 'Purple']
  },
  {
    id: 26,
    name: 'JNV Pullover Hoodie',
    description: 'Pullover Style | Kangaroo Pocket | Hooded',
    price: 699,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop',
    badge: 'Trending',
    reviews: 223,
    rating: 4.3,
    category: 'Pullover',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Navy']
  },
  {
    id: 27,
    name: 'JNV Graphic Hoodie',
    description: 'Graphic Print | Modern Design | Premium Quality',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    badge: 'Premium',
    reviews: 198,
    rating: 4.6,
    category: 'Graphic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: 28,
    name: 'JNV Winter Hoodie',
    description: 'Thermal Lined | Heavy Duty | Winter Ready',
    price: 999,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Winter',
    reviews: 167,
    rating: 4.5,
    category: 'Winter',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Dark Gray', 'Forest Green']
  },
  {
    id: 29,
    name: 'JNV Batch Hoodie',
    description: 'Custom Batch Year | Premium Print | Alumni Special',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    badge: 'Exclusive',
    reviews: 289,
    rating: 4.7,
    category: 'Batch',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Maroon', 'White']
  },
  {
    id: 30,
    name: 'JNV Lightweight Hoodie',
    description: 'Lightweight | Breathable | All Season',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    badge: 'Summer',
    reviews: 134,
    rating: 4.2,
    category: 'Lightweight',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Gray', 'Navy', 'Black']
  }
];

const Hoodies = () => {
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

  const filteredProducts = hoodieProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'trending' && product.badge !== 'Trending') return false;
    if (activeTab === 'new' && product.badge !== 'New') return false;
    if (activeTab === 'bestseller' && product.reviews < 300) return false;
    if (activeTab === 'premium' && product.badge !== 'Premium') return false;
    
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
        if (range === 'under-599') return product.price < 599;
        if (range === '599-799') return product.price >= 599 && product.price <= 799;
        if (range === '800-999') return product.price >= 800 && product.price <= 999;
        if (range === 'above-1000') return product.price > 1000;
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
            <h1 className="animate-slideDown">JNV Hoodies Collection</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Premium quality hoodies designed exclusively for Navodayans
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{hoodieProducts.length}+</span>
                <span className="stat-label">Designs</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.6★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">2.1k+</span>
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
                  {['Classic', 'Zipper', 'Sports', 'Alumni', 'Girls', 'Pullover', 'Graphic', 'Winter', 'Batch', 'Lightweight'].map(category => (
                    <label key={category} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <span className="filter-text">{category}</span>
                      <span className="filter-count">
                        {hoodieProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <label key={size} className="size-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.sizes.includes(size)}
                        onChange={() => handleFilterChange('sizes', size)}
                      />
                      <span className="size-box">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Price</h4>
                <div className="filter-options">
                  {[
                    { value: 'under-599', label: 'Under ₹599' },
                    { value: '599-799', label: '₹599 - ₹799' },
                    { value: '800-999', label: '₹800 - ₹999' },
                    { value: 'above-1000', label: 'Above ₹1000' }
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
                    { name: 'Maroon', hex: '#800000' },
                    { name: 'Forest Green', hex: '#228B22' },
                    { name: 'Burgundy', hex: '#800020' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Purple', hex: '#800080' },
                    { name: 'Light Gray', hex: '#d3d3d3' },
                    { name: 'Dark Gray', hex: '#a9a9a9' },
                    { name: 'Red', hex: '#ff0000' }
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
                {['all', 'trending', 'new', 'bestseller', 'premium'].map((tab, index) => (
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
                    {tab === 'premium' && '💎 Premium'}
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

export default Hoodies;
