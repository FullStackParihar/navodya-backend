import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Alumni Kits products with more variety
const alumniKitsProducts = [
  {
    id: 43,
    name: 'JNV Premium Alumni Kit',
    description: 'Complete Set | T-Shirt + Hoodie + Cap + Badge | Premium Packaging',
    price: 1999,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Premium',
    reviews: 342,
    rating: 4.8,
    category: 'Complete Kits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Maroon']
  },
  {
    id: 44,
    name: 'JNV Silver Alumni Kit',
    description: 'Silver Edition | T-Shirt + Cap + ID Holder + Certificate',
    price: 1499,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    badge: 'Silver',
    reviews: 278,
    rating: 4.6,
    category: 'Silver Edition',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Silver', 'Gray', 'White']
  },
  {
    id: 45,
    name: 'JNV Gold Alumni Kit',
    description: 'Gold Edition | Hoodie + Watch + Wallet + Premium Badge',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'Gold',
    reviews: 189,
    rating: 4.9,
    category: 'Gold Edition',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Gold', 'Black', 'Navy']
  },
  {
    id: 46,
    name: 'JNV Basic Alumni Kit',
    description: 'Essential Set | T-Shirt + Cap + Badge | Value Pack',
    price: 999,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    badge: 'Value',
    reviews: 412,
    rating: 4.4,
    category: 'Basic Kits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: 47,
    name: 'JNV Executive Alumni Kit',
    description: 'Executive Set | Blazer + Shirt + Tie + Badge + Certificate',
    price: 3999,
    originalPrice: 5499,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    badge: 'Executive',
    reviews: 156,
    rating: 4.7,
    category: 'Executive',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'Gray', 'Charcoal']
  },
  {
    id: 48,
    name: 'JNV Sports Alumni Kit',
    description: 'Sports Set | Jersey + Shorts + Cap + Water Bottle + Bag',
    price: 1799,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    badge: 'Sports',
    reviews: 223,
    rating: 4.5,
    category: 'Sports',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Red', 'Green']
  },
  {
    id: 49,
    name: 'JNV Digital Alumni Kit',
    description: 'Digital Set | E-Certificate + Digital Badge + Online Access',
    price: 499,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1563013544-b8e825b3e4c8?w=300&h=400&fit=crop',
    badge: 'Digital',
    reviews: 198,
    rating: 4.2,
    category: 'Digital',
    sizes: ['Digital'],
    colors: ['Digital']
  },
  {
    id: 50,
    name: 'JNV Custom Alumni Kit',
    description: 'Customizable | Choose Your Items | Personalized Badge',
    price: 1299,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Custom',
    reviews: 167,
    rating: 4.6,
    category: 'Custom',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Custom']
  },
  {
    id: 51,
    name: 'JNV Batch Alumni Kit',
    description: 'Batch Special | Batch Year Items | Group Discount Available',
    price: 1599,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
    badge: 'Batch',
    reviews: 289,
    rating: 4.5,
    category: 'Batch',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Maroon']
  },
  {
    id: 52,
    name: 'JNV International Alumni Kit',
    description: 'International Set | Premium Items | Global Shipping',
    price: 2999,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop',
    badge: 'International',
    reviews: 134,
    rating: 4.8,
    category: 'International',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White']
  },
  {
    id: 53,
    name: 'JNV Mini Alumni Kit',
    description: 'Mini Set | Cap + Badge + Keychain + Certificate',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Mini',
    reviews: 245,
    rating: 4.3,
    category: 'Mini',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy']
  },
  {
    id: 54,
    name: 'JNV Legacy Alumni Kit',
    description: 'Legacy Set | Premium Items | Engraved Badge | Wooden Box',
    price: 4999,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    badge: 'Legacy',
    reviews: 89,
    rating: 4.9,
    category: 'Legacy',
    sizes: ['M', 'L', 'XL'],
    colors: ['Brown', 'Black', 'Gold']
  }
];

const AlumniKits = () => {
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

  const filteredProducts = alumniKitsProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'premium' && !['Premium', 'Executive', 'Legacy'].includes(product.badge)) return false;
    if (activeTab === 'new' && product.reviews < 200) return false;
    if (activeTab === 'bestseller' && product.reviews < 300) return false;
    if (activeTab === 'value' && !['Value', 'Mini', 'Digital'].includes(product.badge)) return false;
    
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
        if (range === 'under-999') return product.price < 999;
        if (range === '999-1999') return product.price >= 999 && product.price <= 1999;
        if (range === '2000-3999') return product.price >= 2000 && product.price <= 3999;
        if (range === 'above-4000') return product.price > 4000;
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
            <h1 className="animate-slideDown">JNV Alumni Kits</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Exclusive alumni kits designed to celebrate your JNV journey
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{alumniKitsProducts.length}+</span>
                <span className="stat-label">Kits Available</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.6★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">5.2k+</span>
                <span className="stat-label">Alumni Served</span>
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
                <h4>Kit Categories</h4>
                <div className="filter-options">
                  {['Complete Kits', 'Silver Edition', 'Gold Edition', 'Basic Kits', 'Executive', 'Sports', 'Digital', 'Custom', 'Batch', 'International', 'Mini', 'Legacy'].map(category => (
                    <label key={category} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <span className="filter-text">{category}</span>
                      <span className="filter-count">
                        {alumniKitsProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['One Size', 'Digital', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
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
                    { value: 'under-999', label: 'Under ₹999' },
                    { value: '999-1999', label: '₹999 - ₹1,999' },
                    { value: '2000-3999', label: '₹2,000 - ₹3,999' },
                    { value: 'above-4000', label: 'Above ₹4,000' }
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
                <h4>Color Theme</h4>
                <div className="color-options-enhanced">
                  {[
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Navy', hex: '#000080' },
                    { name: 'Gray', hex: '#808080' },
                    { name: 'Silver', hex: '#C0C0C0' },
                    { name: 'Gold', hex: '#64748b' },
                    { name: 'Maroon', hex: '#800000' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Blue', hex: '#0000ff' },
                    { name: 'Green', hex: '#008000' },
                    { name: 'Charcoal', hex: '#36454f' },
                    { name: 'Brown', hex: '#964B00' },
                    { name: 'Custom', hex: '#ff00ff' },
                    { name: 'Digital', hex: '#00ffff' }
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
                  <h2>Showing {filteredProducts.length} Alumni Kits</h2>
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
                {['all', 'premium', 'value', 'new', 'bestseller'].map((tab, index) => (
                  <button 
                    key={tab}
                    className={`tab-btn-enhanced ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' && 'All Kits'}
                    {tab === 'premium' && '💎 Premium'}
                    {tab === 'value' && '💰 Value'}
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
                    <h3>No kits found</h3>
                    <p>Try adjusting your filters or browse all kits</p>
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

export default AlumniKits;
