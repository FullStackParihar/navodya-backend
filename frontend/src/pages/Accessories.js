import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Accessories products with more variety
const accessoriesProducts = [
  {
    id: 31,
    name: 'JNV Baseball Cap',
    description: 'Adjustable Strap | Embroidered Logo | Premium Cotton',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Bestseller',
    reviews: 245,
    rating: 4.5,
    category: 'Caps',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'White', 'Red']
  },
  {
    id: 32,
    name: 'JNV Backpack',
    description: 'Waterproof | Laptop Compartment | Multiple Pockets',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    badge: 'Hot',
    reviews: 189,
    rating: 4.6,
    category: 'Bags',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray', 'Forest Green']
  },
  {
    id: 33,
    name: 'JNV Water Bottle',
    description: 'Stainless Steel | Insulated | 1L Capacity',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 156,
    rating: 4.4,
    category: 'Bottles',
    sizes: ['1L'],
    colors: ['Silver', 'Black', 'Blue', 'Red']
  },
  {
    id: 34,
    name: 'JNV Phone Case',
    description: 'Premium Protection | Custom Design | Shockproof',
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    badge: 'Trending',
    reviews: 134,
    rating: 4.3,
    category: 'Phone Cases',
    sizes: ['iPhone', 'Android'],
    colors: ['Black', 'White', 'Clear', 'Blue']
  },
  {
    id: 35,
    name: 'JNV ID Card Holder',
    description: 'Premium Leather | Custom Engraving | Magnetic Closure',
    price: 99,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 98,
    rating: 4.2,
    category: 'ID Holders',
    sizes: ['Standard'],
    colors: ['Black', 'Brown', 'Navy']
  },
  {
    id: 36,
    name: 'JNV Notebook Set',
    description: 'Premium Paper | Custom Cover | Set of 3',
    price: 249,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1563013544-b8e825b3e4c8?w=300&h=400&fit=crop',
    badge: 'Premium',
    reviews: 167,
    rating: 4.5,
    category: 'Stationery',
    sizes: ['A5'],
    colors: ['Black', 'Blue', 'Red', 'Green']
  },
  {
    id: 37,
    name: 'JNV Keychain',
    description: 'Metallic | Custom Logo | Durable',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Popular',
    reviews: 89,
    rating: 4.1,
    category: 'Keychains',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Black']
  },
  {
    id: 38,
    name: 'JNV Sunglasses',
    description: 'UV Protection | Polarized | Stylish Design',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300&h=400&fit=crop',
    badge: 'Summer',
    reviews: 123,
    rating: 4.4,
    category: 'Sunglasses',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tortoise']
  },
  {
    id: 39,
    name: 'JNV Watch',
    description: 'Analog | Leather Strap | Water Resistant',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    badge: 'Exclusive',
    reviews: 78,
    rating: 4.6,
    category: 'Watches',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Silver']
  },
  {
    id: 40,
    name: 'JNV Belt',
    description: 'Genuine Leather | Adjustable | Classic Design',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1544966503-7e3c4c5c5c5c?w=300&h=400&fit=crop',
    badge: 'Classic',
    reviews: 145,
    rating: 4.3,
    category: 'Belts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Tan']
  },
  {
    id: 41,
    name: 'JNV Wallet',
    description: 'Premium Leather | Multiple Card Slots | RFID Protected',
    price: 449,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Premium',
    reviews: 167,
    rating: 4.7,
    category: 'Wallets',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan']
  },
  {
    id: 42,
    name: 'JNV Socks Set',
    description: 'Cotton Blend | Pack of 3 | Comfort Fit',
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Value',
    reviews: 234,
    rating: 4.2,
    category: 'Socks',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White', 'Navy', 'Gray']
  }
];

const Accessories = () => {
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

  const filteredProducts = accessoriesProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'trending' && product.badge !== 'Trending') return false;
    if (activeTab === 'new' && product.badge !== 'New') return false;
    if (activeTab === 'bestseller' && product.reviews < 200) return false;
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
        if (range === 'under-199') return product.price < 199;
        if (range === '199-399') return product.price >= 199 && product.price <= 399;
        if (range === '400-699') return product.price >= 400 && product.price <= 699;
        if (range === 'above-700') return product.price > 700;
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
            <h1 className="animate-slideDown">JNV Accessories Collection</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Premium accessories designed exclusively for Navodayans
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{accessoriesProducts.length}+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.4★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">3.5k+</span>
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
                  {['Caps', 'Bags', 'Bottles', 'Phone Cases', 'ID Holders', 'Stationery', 'Keychains', 'Sunglasses', 'Watches', 'Belts', 'Wallets', 'Socks'].map(category => (
                    <label key={category} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      <span className="filter-text">{category}</span>
                      <span className="filter-count">
                        {accessoriesProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['One Size', 'iPhone', 'Android', '1L', 'A5', 'Standard', 'S', 'M', 'L', 'XL'].map(size => (
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
                    { value: 'under-199', label: 'Under ₹199' },
                    { value: '199-399', label: '₹199 - ₹399' },
                    { value: '400-699', label: '₹400 - ₹699' },
                    { value: 'above-700', label: 'Above ₹700' }
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
                    { name: 'Brown', hex: '#964B00' },
                    { name: 'Silver', hex: '#C0C0C0' },
                    { name: 'Gold', hex: '#64748b' },
                    { name: 'Clear', hex: '#f0f0f0' },
                    { name: 'Tan', hex: '#D2B48C' },
                    { name: 'Forest Green', hex: '#228B22' },
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

export default Accessories;
