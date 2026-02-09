import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

// Enhanced Customizable products with personalization options
const customizeProducts = [
  {
    id: 79,
    name: 'JNV Custom T-Shirt',
    description: 'Fully Customizable | Your Design | Premium Cotton',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: 'Custom',
    reviews: 234,
    rating: 4.7,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray', 'Red', 'Blue'],
    customizationOptions: ['Text', 'Logo', 'Image', 'Number', 'Name']
  },
  {
    id: 80,
    name: 'JNV Custom Hoodie',
    description: 'Personalized Hoodie | Your Art | Fleece Lined',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'Design',
    reviews: 189,
    rating: 4.8,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Maroon'],
    customizationOptions: ['Text', 'Logo', 'Image', 'Number', 'Name', 'Quote']
  },
  {
    id: 81,
    name: 'JNV Custom Cap',
    description: 'Personalized Cap | Embroidered | Adjustable',
    price: 349,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Embroidery',
    reviews: 167,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy', 'Red', 'Green'],
    customizationOptions: ['Text', 'Logo', 'Initials', 'Number']
  },
  {
    id: 82,
    name: 'JNV Custom Phone Case',
    description: 'Custom Design | Your Photos | Shockproof',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    badge: 'Photo',
    reviews: 145,
    rating: 4.4,
    category: 'Accessories',
    sizes: ['iPhone', 'Android', 'Universal'],
    colors: ['Clear', 'Black', 'White', 'Pink', 'Blue'],
    customizationOptions: ['Photo', 'Text', 'Logo', 'Pattern', 'Quote']
  },
  {
    id: 83,
    name: 'JNV Custom Water Bottle',
    description: 'Personalized Bottle | Your Design | Insulated',
    price: 249,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Print',
    reviews: 123,
    rating: 4.3,
    category: 'Accessories',
    sizes: ['500ml', '750ml', '1L'],
    colors: ['Silver', 'Black', 'White', 'Blue', 'Green'],
    customizationOptions: ['Text', 'Logo', 'Image', 'Name', 'Quote']
  },
  {
    id: 84,
    name: 'JNV Custom Backpack',
    description: 'Design Your Bag | Custom Print | Multiple Pockets',
    price: 999,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    badge: 'Print',
    reviews: 198,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray', 'Forest Green'],
    customizationOptions: ['Text', 'Logo', 'Image', 'Pattern', 'Name']
  },
  {
    id: 85,
    name: 'JNV Custom Jersey',
    description: 'Personalized Jersey | Your Number | Team Name',
    price: 799,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    badge: 'Sports',
    reviews: 267,
    rating: 4.7,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Red', 'Black', 'Green'],
    customizationOptions: ['Number', 'Name', 'Team Name', 'Logo', 'Position']
  },
  {
    id: 86,
    name: 'JNV Custom Mug',
    description: 'Personalized Mug | Your Design | Ceramic',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=400&fit=crop',
    badge: 'Print',
    reviews: 156,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['11oz', '15oz'],
    colors: ['White', 'Black', 'Blue', 'Red'],
    customizationOptions: ['Photo', 'Text', 'Logo', 'Quote', 'Name']
  },
  {
    id: 87,
    name: 'JNV Custom Notebook',
    description: 'Personalized Notebook | Custom Cover | Premium Paper',
    price: 179,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1563013544-b8e825b3e4c8?w=300&h=400&fit=crop',
    badge: 'Cover',
    reviews: 134,
    rating: 4.4,
    category: 'Accessories',
    sizes: ['A5', 'A4'],
    colors: ['Black', 'Blue', 'Red', 'Green', 'Brown'],
    customizationOptions: ['Name', 'Logo', 'Quote', 'Image', 'Pattern']
  },
  {
    id: 88,
    name: 'JNV Custom Keychain',
    description: 'Personalized Keychain | Engraved | Metal',
    price: 99,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'Engrave',
    reviews: 189,
    rating: 4.2,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Black', 'Blue'],
    customizationOptions: ['Initials', 'Name', 'Date', 'Logo', 'Message']
  },
  {
    id: 89,
    name: 'JNV Custom Wallet',
    description: 'Personalized Wallet | Embossed | Genuine Leather',
    price: 449,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop',
    badge: 'Leather',
    reviews: 145,
    rating: 4.6,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan', 'Burgundy'],
    customizationOptions: ['Initials', 'Name', 'Logo', 'Pattern', 'Date']
  },
  {
    id: 90,
    name: 'JNV Custom Alumni Kit',
    description: 'Fully Customizable Kit | Your Batch | Premium Items',
    price: 1799,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1523381210434-274e6fd17544?w=300&h=400&fit=crop',
    badge: 'Premium',
    reviews: 278,
    rating: 4.8,
    category: 'Alumni Kits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Maroon', 'Gold'],
    customizationOptions: ['Batch Year', 'Name', 'Quote', 'Logo', 'Photo']
  }
];

const Customize = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [],
    customizationTypes: []
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

  const filteredProducts = customizeProducts.filter(product => {
    // Tab filtering
    if (activeTab === 'text' && !product.customizationOptions.includes('Text')) return false;
    if (activeTab === 'photo' && !product.customizationOptions.includes('Photo')) return false;
    if (activeTab === 'logo' && !product.customizationOptions.includes('Logo')) return false;
    if (activeTab === 'premium' && product.price < 500) return false;
    
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
        if (range === '400-799') return product.price >= 400 && product.price <= 799;
        if (range === 'above-800') return product.price > 800;
        return false;
      });
      if (!inRange) return false;
    }
    
    // Customization type filtering
    if (selectedFilters.customizationTypes.length > 0) {
      const hasSelectedType = product.customizationOptions.some(option => 
        selectedFilters.customizationTypes.includes(option)
      );
      if (!hasSelectedType) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.reviews - a.reviews;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'options':
        return b.customizationOptions.length - a.customizationOptions.length;
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
      customizationTypes: []
    });
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
  };

  const getCustomizationIcon = (option) => {
    switch(option) {
      case 'Text': return 'fas fa-font';
      case 'Logo': return 'fas fa-crown';
      case 'Image': return 'fas fa-image';
      case 'Photo': return 'fas fa-camera';
      case 'Number': return 'fas fa-hashtag';
      case 'Name': return 'fas fa-user';
      case 'Quote': return 'fas fa-quote-left';
      case 'Initials': return 'fas fa-signature';
      case 'Date': return 'fas fa-calendar';
      case 'Team Name': return 'fas fa-users';
      case 'Position': return 'fas fa-running';
      case 'Pattern': return 'fas fa-th';
      case 'Message': return 'fas fa-envelope';
      case 'Batch Year': return 'fas fa-graduation-cap';
      default: return 'fas fa-palette';
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
            <h1 className="animate-slideDown">Customize Your JNV Gear</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Design your own unique JNV merchandise with personal touches
            </p>
            <div className="hero-stats animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="stat">
                <span className="stat-number">{customizeProducts.length}</span>
                <span className="stat-label">Customizable Items</span>
              </div>
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Design Options</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Possibilities</span>
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
                <h3>Customization Filters</h3>
                {getFilterCount() > 0 && (
                  <button className="clear-filters" onClick={clearAllFilters}>
                    Clear All ({getFilterCount()})
                  </button>
                )}
              </div>

              <div className="filter-section">
                <h4>Product Categories</h4>
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
                        {customizeProducts.filter(p => p.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Customization Types</h4>
                <div className="filter-options">
                  {['Text', 'Logo', 'Image', 'Photo', 'Number', 'Name', 'Quote', 'Initials', 'Date', 'Team Name', 'Position', 'Pattern', 'Message', 'Batch Year'].map(type => (
                    <label key={type} className="filter-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.customizationTypes.includes(type)}
                        onChange={() => handleFilterChange('customizationTypes', type)}
                      />
                      <span className="filter-text">
                        <i className={getCustomizationIcon(type)} style={{ marginRight: '8px', fontSize: '12px' }}></i>
                        {type}
                      </span>
                      <span className="filter-count">
                        {customizeProducts.filter(p => p.customizationOptions.includes(type)).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-options">
                  {['One Size', 'iPhone', 'Android', 'Universal', '500ml', '750ml', '1L', '11oz', '15oz', 'A5', 'A4', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
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
                    { value: '400-799', label: '₹400 - ₹799' },
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
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Black', hex: '#000000' },
                    { name: 'Navy', hex: '#000080' },
                    { name: 'Gray', hex: '#808080' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Blue', hex: '#0000ff' },
                    { name: 'Green', hex: '#008000' },
                    { name: 'Maroon', hex: '#800000' },
                    { name: 'Silver', hex: '#C0C0C0' },
                    { name: 'Forest Green', hex: '#228B22' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Brown', hex: '#964B00' },
                    { name: 'Tan', hex: '#D2B48C' },
                    { name: 'Burgundy', hex: '#800020' },
                    { name: 'Gold', hex: '#64748b' },
                    { name: 'Clear', hex: '#f0f0f0' }
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
                  <h2>Showing {filteredProducts.length} Customizable Items</h2>
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
                      <option value="popular">Sort by: Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                      <option value="name">Name: A-Z</option>
                      <option value="options">Most Options</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-tabs-enhanced">
                {['all', 'text', 'photo', 'logo', 'premium'].map((tab, index) => (
                  <button 
                    key={tab}
                    className={`tab-btn-enhanced ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' && 'All Customizable'}
                    {tab === 'text' && '📝 Text Design'}
                    {tab === 'photo' && '📷 Photo Print'}
                    {tab === 'logo' && '👑 Logo Design'}
                    {tab === 'premium' && '💎 Premium Items'}
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
                      <div className="customization-badge">
                        <i className="fas fa-palette"></i> {product.customizationOptions.length} Options
                      </div>
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="no-products-found">
                    <i className="fas fa-paint-brush"></i>
                    <h3>No customizable items found</h3>
                    <p>Try adjusting your filters or browse all customizable items</p>
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

export default Customize;
