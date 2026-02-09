import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Today's Deals products with time-sensitive offers
const TodayDealsEnhanced = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    discountRange: [],
    dealTypes: []
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const result = await response.json();
        
        if (result.success) {
          // Filter products that have a sale_price (deals)
          const dealProducts = result.data.products.filter(p => p.sale_price && p.sale_price < p.price);
          
          const mapped = dealProducts.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price,
            originalPrice: p.price,
            image: p.images[0],
            badge: (p.tags && p.tags.includes('flash')) ? 'Flash Sale' : (p.tags && p.tags.includes('lightning')) ? 'Lightning' : 'Deal of Day',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category,
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : [],
            timeLeft: '12h 00m', // Mocked as backend doesn't have this yet
            discount: Math.round(((p.price - p.sale_price) / p.price) * 100),
            stockLeft: p.stock || 20,
            soldCount: (p.review_count || 0) * 5 // Mocked sold count
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const filteredProducts = products.filter(product => {
    // Tab filtering
    if (activeTab === 'flash' && product.badge !== 'Flash Sale') return false;
    if (activeTab === 'lightning' && product.badge !== 'Lightning') return false;
    if (activeTab === 'prime' && product.badge !== 'Prime') return false;
    if (activeTab === 'ending' && parseInt(product.timeLeft) > 5) return false;
    if (activeTab === 'low-stock' && product.stockLeft > 20) return false;
    
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
    
    // Deal type filtering
    if (selectedFilters.dealTypes.length > 0 && 
        !selectedFilters.dealTypes.includes(product.badge)) return false;
    
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
      case 'sold':
        return b.soldCount - a.soldCount;
      case 'stock':
        return a.stockLeft - b.stockLeft;
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      discountRange: [],
      dealTypes: []
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

  const getStockColor = (stockLeft) => {
    if (stockLeft <= 10) return '#ff0000'; // Red for low stock
    if (stockLeft <= 25) return '#ff6600'; // Orange for medium stock
    return '#00aa00'; // Green for good stock
  };

  const getDealIcon = (badge) => {
    switch(badge) {
      case 'Flash Sale': return 'fas fa-bolt';
      case 'Lightning': return 'fas fa-bolt';
      case 'Deal of Day': return 'fas fa-calendar-day';
      case 'Prime': return 'fas fa-crown';
      case 'Early Bird': return 'fas fa-dove';
      case 'Midnight': return 'fas fa-moon';
      case 'Happy Hour': return 'fas fa-cocktail';
      case 'Weekend': return 'fas fa-umbrella-beach';
      case 'Rush Hour': return 'fas fa-car';
      case 'Bonanza': return 'fas fa-gift';
      case 'Fiesta': return 'fas fa-party-horn';
      case 'Mega Sale': return 'fas fa-percentage';
      default: return 'fas fa-tag';
    }
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
                <span className="stat-number">{products.length}</span>
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
                        checked={selectedFilters.dealTypes.includes(dealType)}
                        onChange={() => handleFilterChange('dealTypes', dealType)}
                      />
                      <span className="filter-text">
                        <i className={getDealIcon(dealType)} style={{ marginRight: '8px', fontSize: '12px' }}></i>
                        {dealType}
                      </span>
                      <span className="filter-count">
                        {products.filter(p => p.badge === dealType).length}
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
                        {products.filter(p => p.category === category).length}
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
                      <option value="sold">Most Sold</option>
                      <option value="stock">Low Stock First</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-tabs-enhanced">
                {['all', 'flash', 'lightning', 'prime', 'ending', 'low-stock'].map((tab, index) => (
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
                    {tab === 'low-stock' && '📦 Low Stock'}
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
                      <div className="deal-badges">
                        <div className="deal-timer" style={{ color: getTimeColor(product.timeLeft) }}>
                          <i className="fas fa-clock"></i> {product.timeLeft} left
                        </div>
                        <div className="stock-indicator" style={{ color: getStockColor(product.stockLeft) }}>
                          <i className="fas fa-box"></i> {product.stockLeft} left
                        </div>
                        <div className="sold-count">
                          <i className="fas fa-shopping-cart"></i> {product.soldCount} sold
                        </div>
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

export default TodayDealsEnhanced;
