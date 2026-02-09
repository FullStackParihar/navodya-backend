import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced New Arrivals products with latest collections
const newArrivalsProducts = [
  {
    id: 103,
    name: 'JNV Summer Collection T-Shirt',
    description: 'Summer 2024 | Breathable Fabric | New Design | Limited Edition',
    price: 449,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: 'Just In',
    reviews: 45,
    rating: 4.7,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Sky Blue', 'Mint', 'Coral', 'Lavender'],
    arrivalDate: '2024-01-20',
    isNew: true,
    isTrending: true,
    collection: 'Summer 2024'
  },
  {
    id: 104,
    name: 'JNV Tech Hoodie',
    description: 'Tech Wear | Smart Fabric | Modern Fit | Innovation Series',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 38,
    rating: 4.8,
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Charcoal', 'Navy', 'Graphite'],
    arrivalDate: '2024-01-19',
    isNew: true,
    isTrending: false,
    collection: 'Tech Series'
  },
  {
    id: 105,
    name: 'JNV Smart Backpack',
    description: 'Smart Features | USB Charging | Anti-Theft | Premium Quality',
    price: 1299,
    originalPrice: 1699,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    badge: 'Latest',
    reviews: 52,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy', 'Olive'],
    arrivalDate: '2024-01-18',
    isNew: true,
    isTrending: true,
    collection: 'Smart Series'
  },
  {
    id: 106,
    name: 'JNV Eco Water Bottle',
    description: 'Eco Friendly | Bamboo Design | Sustainable | Earth Collection',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Eco',
    reviews: 67,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['750ml'],
    colors: ['Green', 'Bamboo', 'Natural', 'Earth'],
    arrivalDate: '2024-01-17',
    isNew: true,
    isTrending: false,
    collection: 'Earth Collection'
  },
  {
    id: 107,
    name: 'JNV Wireless Earbuds Case',
    description: 'Wireless Compatible | Premium Leather | Magnetic | Modern',
    price: 399,
    originalPrice: 549,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    badge: 'Tech',
    reviews: 41,
    rating: 4.4,
    category: 'Accessories',
    sizes: ['Universal'],
    colors: ['Black', 'Brown', 'Blue', 'Rose Gold'],
    arrivalDate: '2024-01-16',
    isNew: true,
    isTrending: true,
    collection: 'Tech Series'
  },
  {
    id: 108,
    name: 'JNV Minimalist Wallet',
    description: 'Minimalist Design | RFID Protected | Slim | Urban Collection',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Modern',
    reviews: 58,
    rating: 4.7,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Tan', 'Gray', 'Navy'],
    arrivalDate: '2024-01-15',
    isNew: true,
    isTrending: false,
    collection: 'Urban Collection'
  },
  {
    id: 109,
    name: 'JNV Sports Pro Jersey',
    description: 'Pro Series | Performance Fabric | Limited Edition | Athletic',
    price: 799,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 73,
    rating: 4.9,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'White', 'Red', 'Electric Blue'],
    arrivalDate: '2024-01-14',
    isNew: true,
    isTrending: true,
    collection: 'Sports Pro'
  },
  {
    id: 110,
    name: 'JNV Vintage Cap Collection',
    description: 'Vintage Series | Retro Design | Premium Quality | Classic',
    price: 349,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Vintage',
    reviews: 62,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Brown', 'Navy', 'Forest Green', 'Cream'],
    arrivalDate: '2024-01-13',
    isNew: true,
    isTrending: false,
    collection: 'Vintage Series'
  },
  {
    id: 111,
    name: 'JNV Premium Alumni Kit 2024',
    description: '2024 Edition | Premium Items | Exclusive | Luxury Series',
    price: 2499,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Exclusive',
    reviews: 89,
    rating: 4.8,
    category: 'Alumni Kits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gold', 'Navy', 'Burgundy'],
    arrivalDate: '2024-01-12',
    isNew: true,
    isTrending: true,
    collection: 'Luxury Series'
  },
  {
    id: 112,
    name: 'JNV Athleisure Hoodie',
    description: 'Athleisure Wear | Comfort Fit | Stylish | Lifestyle Collection',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop',
    badge: 'Trending',
    reviews: 94,
    rating: 4.5,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'Olive', 'Sage'],
    arrivalDate: '2024-01-11',
    isNew: true,
    isTrending: true,
    collection: 'Lifestyle'
  },
  {
    id: 113,
    name: 'JNV Smart Watch Band',
    description: 'Smart Watch Compatible | Silicone | Sport | Fitness Series',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    badge: 'Smart',
    reviews: 76,
    rating: 4.3,
    category: 'Accessories',
    sizes: ['Universal'],
    colors: ['Black', 'White', 'Blue', 'Pink', 'Neon Green'],
    arrivalDate: '2024-01-10',
    isNew: true,
    isTrending: false,
    collection: 'Fitness Series'
  },
  {
    id: 114,
    name: 'JNV Sustainable Notebook Set',
    description: 'Sustainable Materials | Recycled Paper | Eco-Friendly | Green Series',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1563013544-b8e825b3e4c8?w=300&h=400&fit=crop',
    badge: 'Sustainable',
    reviews: 83,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['A5'],
    colors: ['Kraft', 'Green', 'Blue', 'Recycled Brown'],
    arrivalDate: '2024-01-09',
    isNew: true,
    isTrending: false,
    collection: 'Green Series'
  }
];

const NewArrivalsEnhanced = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [],
    collections: [],
    newArrivalTypes: []
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every hour
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 3600000);
    return () => clearInterval(timer);
  }, []);

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

  const filteredProducts = newArrivalsProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'just-in' && product.badge !== 'Just In') return false;
    if (activeTab === 'limited' && product.badge !== 'Limited') return false;
    if (activeTab === 'exclusive' && product.badge !== 'Exclusive') return false;
    if (activeTab === 'trending' && !product.isTrending) return false;
    if (activeTab === 'eco' && !product.collection.toLowerCase().includes('eco') && !product.collection.toLowerCase().includes('green') && !product.collection.toLowerCase().includes('earth')) return false;
    
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
        if (range === '500-999') return product.price >= 500 && product.price <= 999;
        if (range === 'above-1000') return product.price > 1000;
        return false;
      });
      if (!inRange) return false;
    }
    
    // Collection filtering
    if (selectedFilters.collections.length > 0 && 
        !selectedFilters.collections.includes(product.collection)) return false;
    
    // New arrival type filtering
    if (selectedFilters.newArrivalTypes.length > 0 && 
        !selectedFilters.newArrivalTypes.includes(product.badge)) return false;
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.arrivalDate) - new Date(a.arrivalDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
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
      priceRange: [],
      collections: [],
      newArrivalTypes: []
    });
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
  };

  const getDaysAgo = (arrivalDate) => {
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const diffTime = Math.abs(today - arrival);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getNewBadgeColor = (daysAgo) => {
    if (daysAgo <= 3) return '#ff0000'; // Red for very new
    if (daysAgo <= 7) return '#ff6600'; // Orange for new
    if (daysAgo <= 14) return '#00aa00'; // Green for recent
    return '#666666'; // Gray for older
  };

  const getCollectionIcon = (collection) => {
    const lowerCollection = collection.toLowerCase();
    if (lowerCollection.includes('summer')) return 'fas fa-sun';
    if (lowerCollection.includes('tech')) return 'fas fa-microchip';
    if (lowerCollection.includes('smart')) return 'fas fa-brain';
    if (lowerCollection.includes('eco') || lowerCollection.includes('green') || lowerCollection.includes('earth')) return 'fas fa-leaf';
    if (lowerCollection.includes('urban')) return 'fas fa-city';
    if (lowerCollection.includes('sports')) return 'fas fa-running';
    if (lowerCollection.includes('vintage')) return 'fas fa-history';
    if (lowerCollection.includes('luxury')) return 'fas fa-gem';
    if (lowerCollection.includes('lifestyle')) return 'fas fa-heart';
    if (lowerCollection.includes('fitness')) return 'fas fa-dumbbell';
    return 'fas fa-star';
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
            <h1 className="animate-slideDown">New Arrivals</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Discover the latest JNV merchandise - Fresh collections just arrived
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{newArrivalsProducts.length}</span>
                <span className="stat-label">New Items</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.6★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">Daily</span>
                <span className="stat-label">Updates</span>
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
                <h3>New Arrivals Filters</h3>
                {getFilterCount() > 0 && (
                  <button className="clear-filters" onClick={clearAllFilters}>
                    Clear All ({getFilterCount()})
                  </button>
                )}
              </div>

              <div className="filter-section">
                <h4>Collection Types</h4>
                <div className="filter-options">
                  {['Summer 2024', 'Tech Series', 'Smart Series', 'Earth Collection', 'Urban Collection', 'Sports Pro', 'Vintage Series', 'Luxury Series', 'Lifestyle', 'Fitness Series', 'Green Series'].map(collection => (
                    <label key={collection} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.collections.includes(collection)}
                        onChange={() => handleFilterChange('collections', collection)}
                      />
                      <span className="filter-text">
                        <i className={getCollectionIcon(collection)} style={{ marginRight: '8px', fontSize: '12px' }}></i>
                        {collection}
                      </span>
                      <span className="filter-count">
                        {newArrivalsProducts.filter(p => p.collection === collection).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Arrival Types</h4>
                <div className="filter-options">
                  {['Just In', 'New', 'Latest', 'Eco', 'Tech', 'Modern', 'Limited', 'Vintage', 'Exclusive', 'Trending', 'Smart', 'Sustainable'].map(arrivalType => (
                    <label key={arrivalType} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.newArrivalTypes.includes(arrivalType)}
                        onChange={() => handleFilterChange('newArrivalTypes', arrivalType)}
                      />
                      <span className="filter-text">{arrivalType}</span>
                      <span className="filter-count">
                        {newArrivalsProducts.filter(p => p.badge === arrivalType).length}
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
                        {newArrivalsProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['One Size', 'Universal', '750ml', 'A5', 'S', 'M', 'L', 'XL'].map(size => (
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
                    { value: 'under-299', label: 'Under ₹299' },
                    { value: '299-499', label: '₹299 - ₹499' },
                    { value: '500-999', label: '₹500 - ₹999' },
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
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Black', hex: '#000000' },
                    { name: 'Navy', hex: '#000080' },
                    { name: 'Gray', hex: '#808080' },
                    { name: 'Sky Blue', hex: '#87CEEB' },
                    { name: 'Mint', hex: '#98FF98' },
                    { name: 'Coral', hex: '#FF7F50' },
                    { name: 'Lavender', hex: '#E6E6FA' },
                    { name: 'Charcoal', hex: '#36454f' },
                    { name: 'Graphite', hex: '#36454f' },
                    { name: 'Green', hex: '#008000' },
                    { name: 'Bamboo', hex: '#d2b48c' },
                    { name: 'Natural', hex: '#f5deb3' },
                    { name: 'Blue', hex: '#0000ff' },
                    { name: 'Brown', hex: '#964B00' },
                    { name: 'Tan', hex: '#D2B48C' },
                    { name: 'Olive', hex: '#808000' },
                    { name: 'Sage', hex: '#B2AC88' },
                    { name: 'Gold', hex: '#64748b' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Electric Blue', hex: '#0000FF' },
                    { name: 'Forest Green', hex: '#228B22' },
                    { name: 'Cream', hex: '#64748b' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Rose Gold', hex: '#B76E79' },
                    { name: 'Neon Green', hex: '#39FF14' },
                    { name: 'Kraft', hex: '#8B4513' },
                    { name: 'Recycled Brown', hex: '#8B4513' }
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
                  <h2>Showing {filteredProducts.length} New Arrivals</h2>
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
                      <option value="newest">Sort by: Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="name">Name: A-Z</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-tabs-enhanced">
                {['all', 'just-in', 'limited', 'exclusive', 'trending', 'eco'].map((tab, index) => (
                  <button 
                    key={tab}
                    className={`tab-btn-enhanced ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' && 'All New'}
                    {tab === 'just-in' && '🆕 Just In'}
                    {tab === 'limited' && '⭐ Limited Edition'}
                    {tab === 'exclusive' && '👑 Exclusive'}
                    {tab === 'trending' && '🔥 Trending'}
                    {tab === 'eco' && '🌿 Eco Friendly'}
                  </button>
                ))}
              </div>

              <div className="products-grid-enhanced">
                {isLoading ? (
                  <SkeletonLoader type="product" count={8} />
                ) : filteredProducts.length > 0 ? (
                  sortedProducts.map((product, index) => {
                    const daysAgo = getDaysAgo(product.arrivalDate);
                    return (
                      <div 
                        key={product.id} 
                        className="product-wrapper animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="arrival-badges">
                          <div className="arrival-timer" style={{ color: getNewBadgeColor(daysAgo) }}>
                            <i className="fas fa-sparkles"></i> {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
                          </div>
                          {product.isTrending && (
                            <div className="trending-badge">
                              <i className="fas fa-fire"></i> Trending
                            </div>
                          )}
                          <div className="collection-badge">
                            <i className={getCollectionIcon(product.collection)}></i> {product.collection}
                          </div>
                        </div>
                        <ProductCard product={product} />
                      </div>
                    );
                  })
                ) : (
                  <div className="no-products-found">
                    <i className="fas fa-box-open"></i>
                    <h3>No new arrivals found</h3>
                    <p>Try adjusting your filters or browse all new arrivals</p>
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

export default NewArrivalsEnhanced;
