import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Today's Deals products with time-sensitive offers
const todayDealsProducts = [
  {
    id: 55,
    name: 'JNV Flash Sale T-Shirt',
    description: 'Limited Time | 60% Off | Premium Cotton',
    price: 199,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: 'Flash Sale',
    reviews: 445,
    rating: 4.6,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    timeLeft: '2h 45m',
    discount: 60
  },
  {
    id: 56,
    name: 'JNV Lightning Deal Hoodie',
    description: 'Lightning Deal | 50% Off | Fleece Lined',
    price: 399,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'Lightning',
    reviews: 312,
    rating: 4.7,
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy'],
    timeLeft: '1h 30m',
    discount: 50
  },
  {
    id: 57,
    name: 'JNV Deal of the Day Backpack',
    description: 'Deal of the Day | 40% Off | Waterproof',
    price: 539,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    badge: 'Deal of Day',
    reviews: 278,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray'],
    timeLeft: '8h 15m',
    discount: 40
  },
  {
    id: 58,
    name: 'JNV Prime Special Watch',
    description: 'Prime Special | 35% Off | Premium Quality',
    price: 649,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    badge: 'Prime',
    reviews: 189,
    rating: 4.8,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Silver'],
    timeLeft: '12h 00m',
    discount: 35
  },
  {
    id: 59,
    name: 'JNV Early Bird Cap',
    description: 'Early Bird | 55% Off | Adjustable',
    price: 89,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Early Bird',
    reviews: 234,
    rating: 4.3,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Red'],
    timeLeft: '4h 20m',
    discount: 55
  },
  {
    id: 60,
    name: 'JNV Midnight Sale Water Bottle',
    description: 'Midnight Sale | 45% Off | Insulated',
    price: 109,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Midnight',
    reviews: 167,
    rating: 4.4,
    category: 'Accessories',
    sizes: ['1L'],
    colors: ['Silver', 'Black', 'Blue'],
    timeLeft: '6h 45m',
    discount: 45
  },
  {
    id: 61,
    name: 'JNV Happy Hour Phone Case',
    description: 'Happy Hour | 50% Off | Shockproof',
    price: 74,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    badge: 'Happy Hour',
    reviews: 145,
    rating: 4.2,
    category: 'Accessories',
    sizes: ['iPhone', 'Android'],
    colors: ['Black', 'White', 'Clear'],
    timeLeft: '3h 10m',
    discount: 50
  },
  {
    id: 62,
    name: 'JNV Weekend Special Alumni Kit',
    description: 'Weekend Special | 30% Off | Complete Set',
    price: 1399,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Weekend',
    reviews: 298,
    rating: 4.7,
    category: 'Alumni Kits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Maroon'],
    timeLeft: '10h 30m',
    discount: 30
  },
  {
    id: 63,
    name: 'JNV Rush Hour Sunglasses',
    description: 'Rush Hour | 40% Off | UV Protected',
    price: 239,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300&h=400&fit=crop',
    badge: 'Rush Hour',
    reviews: 123,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tortoise'],
    timeLeft: '5h 55m',
    discount: 40
  },
  {
    id: 64,
    name: 'JNV Bonanza Wallet',
    description: 'Bonanza | 35% Off | Genuine Leather',
    price: 324,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Bonanza',
    reviews: 189,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan'],
    timeLeft: '7h 20m',
    discount: 35
  },
  {
    id: 65,
    name: 'JNV Fiesta Socks Set',
    description: 'Fiesta | 60% Off | Pack of 3',
    price: 59,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Fiesta',
    reviews: 267,
    rating: 4.1,
    category: 'Accessories',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White', 'Navy', 'Gray'],
    timeLeft: '9h 45m',
    discount: 60
  },
  {
    id: 66,
    name: 'JNV Mega Sale Belt',
    description: 'Mega Sale | 42% Off | Genuine Leather',
    price: 289,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1544966503-7e3c4c5c5c5c?w=300&h=400&fit=crop',
    badge: 'Mega Sale',
    reviews: 156,
    rating: 4.4,
    category: 'Accessories',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Tan'],
    timeLeft: '11h 15m',
    discount: 42
  }
];

const TodayDeals = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    discountRange: []
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

  const filteredProducts = todayDealsProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'flash' && product.badge !== 'Flash Sale') return false;
    if (activeTab === 'lightning' && product.badge !== 'Lightning') return false;
    if (activeTab === 'prime' && product.badge !== 'Prime') return false;
    if (activeTab === 'ending' && parseInt(product.timeLeft) > 5) return false;
    
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
    
    // Discount filtering
    if (selectedFilters.discountRange.length > 0) {
      const inRange = selectedFilters.discountRange.some(range => {
        if (range === '30-40') return product.discount >= 30 && product.discount < 40;
        if (range === '40-50') return product.discount >= 40 && product.discount < 50;
        if (range === '50-60') return product.discount >= 50 && product.discount < 60;
        if (range === 'above-60') return product.discount >= 60;
        return false;
      });
      if (!inRange) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      case 'discount-high':
        return b.discount - a.discount;
      case 'discount-low':
        return a.discount - b.discount;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      discountRange: []
    });
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
  };

  const getTimeColor = (timeLeft) => {
    const hours = parseInt(timeLeft);
    if (hours <= 2) return '#ff0000'; // Red for urgent
    if (hours <= 5) return '#ff6600'; // Orange for moderate
    return '#00aa00'; // Green for plenty of time
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
            <h1 className="animate-slideDown">Today's Deals</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Limited time offers - Save up to 60% on exclusive JNV merchandise
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{todayDealsProducts.length}</span>
                <span className="stat-label">Active Deals</span>
              </div>
              <div className="stat">
                <span className="stat-number">60%</span>
                <span className="stat-label">Max Discount</span>
              </div>
              <div className="stat">
                <span className="stat-number">24h</span>
                <span className="stat-label">Deals Refresh</span>
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
                <h3>Deal Filters</h3>
                {getFilterCount() > 0 && (
                  <button className="clear-filters" onClick={clearAllFilters}>
                    Clear All ({getFilterCount()})
                  </button>
                )}
              </div>

              <div className="filter-section">
                <h4>Deal Types</h4>
                <div className="filter-options">
                  {['Flash Sale', 'Lightning', 'Deal of Day', 'Prime', 'Early Bird', 'Midnight', 'Happy Hour', 'Weekend', 'Rush Hour', 'Bonanza', 'Fiesta', 'Mega Sale'].map(dealType => (
                    <label key={dealType} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(dealType)}
                        onChange={() => handleFilterChange('categories', dealType)}
                      />
                      <span className="filter-text">{dealType}</span>
                      <span className="filter-count">
                        {todayDealsProducts.filter(p => p.badge === dealType).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Categories</h4>
                <div className="filter-options">
                  {['T-Shirts', 'Hoodies', 'Accessories', 'Alumni Kits'].map(category => (
                    <label key={category} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <span className="filter-text">{category}</span>
                      <span className="filter-count">
                        {todayDealsProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['One Size', 'iPhone', 'Android', '1L', 'S', 'M', 'L', 'XL'].map(size => (
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
                <h4>Discount Range</h4>
                <div className="filter-options">
                  {[
                    { value: '30-40', label: '30% - 40% Off' },
                    { value: '40-50', label: '40% - 50% Off' },
                    { value: '50-60', label: '50% - 60% Off' },
                    { value: 'above-60', label: '60%+ Off' }
                  ].map(range => (
                    <label key={range.value} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.discountRange.includes(range.value)}
                        onChange={() => handleFilterChange('discountRange', range.value)}
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
                    { name: 'Silver', hex: '#C0C0C0' },
                    { name: 'Brown', hex: '#964B00' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Blue', hex: '#0000ff' },
                    { name: 'Maroon', hex: '#800000' },
                    { name: 'Tan', hex: '#D2B48C' },
                    { name: 'Clear', hex: '#f0f0f0' },
                    { name: 'Tortoise', hex: '#8B4513' }
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
                  <h2>Showing {filteredProducts.length} Deals</h2>
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
                      <option value="time">Sort by: Time Left</option>
                      <option value="discount-high">Discount: High to Low</option>
                      <option value="discount-low">Discount: Low to High</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-tabs-enhanced">
                {['all', 'flash', 'lightning', 'prime', 'ending'].map((tab, index) => (
                  <button 
                    key={tab}
                    className={`tab-btn-enhanced ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' && 'All Deals'}
                    {tab === 'flash' && '⚡ Flash Sale'}
                    {tab === 'lightning' && '🔥 Lightning'}
                    {tab === 'prime' && '👑 Prime'}
                    {tab === 'ending' && '⏰ Ending Soon'}
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
                      <div className="deal-timer" style={{ color: getTimeColor(product.timeLeft) }}>
                        <i className="fas fa-clock"></i> {product.timeLeft} left
                      </div>
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="no-products-found">
                    <i className="fas fa-tag"></i>
                    <h3>No deals found</h3>
                    <p>Try adjusting your filters or browse all deals</p>
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

export default TodayDeals;
