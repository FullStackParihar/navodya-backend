import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

const TShirtsEnhanced = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'All', value: 'All' },
    { name: 'Round Neck', value: 'Round Neck' },
    { name: 'V-Neck', value: 'V-Neck' },
    { name: 'Polo', value: 'Polo' },
    { name: 'Full Sleeve', value: 'Full Sleeve' },
    { name: 'Oversized', value: 'Oversized' },
    { name: 'Dry Fit', value: 'Dry Fit' },
    { name: 'Hoodies', value: 'Hoodies' }
  ]);
  const [visibleCount, setVisibleCount] = useState(8);

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#0A1172' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Maroon', hex: '#7F1D1D' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Royal Blue', hex: '#4169E1' }
  ];
  const fabricOptions = [
    { name: 'Cotton', value: 'Cotton' },
    { name: 'Polyester', value: 'Polyester' },
    { name: 'Dry Fit', value: 'Dry Fit' },
    { name: 'Blend', value: 'Blend' },
    { name: 'Fleece', value: 'Fleece' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/products';
        const params = new URLSearchParams();
        params.append('category', 'tshirts');
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('subcategory', selectedCategory.toLowerCase().replace(/\s+/g, '-'));
        }
        url += `?${params.toString()}`;
        const result = await api.get(url);
        if (result.success && result.data.products?.length > 0) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description || (p.short_description || ''),
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: resolveImageUrl(p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300x400?text=No+Image'),
            badge: p.badge || (p.sale_price ? 'Sale' : (p.featured ? 'Featured' : '')),
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.subcategory || p.category || 'Classic',
            sizes: p.sizes ? p.sizes.map(s => s.size || s) : [],
            colors: p.colors ? p.colors.map(c => c.name || c) : [],
            fabric: p.fabric || 'Cotton'
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching T-Shirts:', err);
        setError(err.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(8);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorName) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const handleFabricToggle = (fabric) => {
    setSelectedFabrics(prev =>
      prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(8);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSortBy('featured');
    setVisibleCount(8);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'All') count++;
    if (searchQuery) count++;
    if (minPrice || maxPrice) count++;
    count += selectedSizes.length;
    count += selectedColors.length;
    count += selectedFabrics.length;
    return count;
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    if (minPrice && product.price < Number(minPrice)) return false;
    if (maxPrice && product.price > Number(maxPrice)) return false;

    if (selectedSizes.length > 0) {
      const hasSize = product.sizes && product.sizes.some(s => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    if (selectedColors.length > 0) {
      const hasColor = product.colors && product.colors.some(c =>
        selectedColors.some(sc => c && c.toLowerCase().includes(sc.toLowerCase()))
      );
      if (!hasColor) return false;
    }

    if (selectedFabrics.length > 0) {
      const hasFabric = selectedFabrics.some(f =>
        product.fabric && product.fabric.toLowerCase().includes(f.toLowerCase())
      );
      if (!hasFabric) return false;
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
        return (b.dbId || b.id || '').localeCompare(a.dbId || a.id || '');
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'featured':
      default:
        return 0;
    }
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="brand-era-tshirts-page">
      <section className="be-hero-section">
        <div className="be-hero-bg"></div>
        <div className="be-hero-pattern"></div>
        <div className="container be-hero-container">
          <nav className="be-breadcrumb">
            <Link to="/" className="be-breadcrumb-link">Home</Link>
            <span className="be-breadcrumb-sep">/</span>
            <Link to="/shop" className="be-breadcrumb-link">Shop</Link>
            <span className="be-breadcrumb-sep">/</span>
            <span className="be-breadcrumb-current">T-Shirts</span>
          </nav>
          <div className="be-hero-content">
            <div className="be-hero-accent-line"></div>
            <h1 className="be-hero-title">T-Shirts</h1>
            <p className="be-hero-subtitle">Premium custom printed t-shirts for your brand</p>
            <div className="be-hero-stats">
              <div className="be-hero-stat">
                <span className="be-hero-stat-num">{loading ? '--' : sortedProducts.length}+</span>
                <span className="be-hero-stat-label">Styles</span>
              </div>
              <div className="be-hero-stat-divider"></div>
              <div className="be-hero-stat">
                <span className="be-hero-stat-num">4.5★</span>
                <span className="be-hero-stat-label">Rating</span>
              </div>
              <div className="be-hero-stat-divider"></div>
              <div className="be-hero-stat">
                <span className="be-hero-stat-num">10K+</span>
                <span className="be-hero-stat-label">Sold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="be-shop-section">
        <div className="container be-shop-container">
          <div className="be-shop-layout">
            <aside className="be-sidebar">
              <div className="be-sidebar-header">
                <h3 className="be-sidebar-title">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <button className="be-clear-filters-btn" onClick={clearAllFilters}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                    Clear ({getActiveFilterCount()})
                  </button>
                )}
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Search</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-search-wrapper">
                  <svg className="be-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    className="be-search-input"
                    placeholder="Search t-shirts..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Categories</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-category-list">
                  {categories.map(cat => (
                    <label key={cat.value} className="be-checkbox-label">
                      <input
                        type="checkbox"
                        className="be-checkbox"
                        checked={selectedCategory === cat.value}
                        onChange={() => handleCategoryChange(cat.value)}
                      />
                      <span className="be-checkbox-custom"></span>
                      <span className="be-checkbox-text">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Price Range</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-price-range">
                  <div className="be-price-input-group">
                    <span className="be-price-currency">₹</span>
                    <input
                      type="number"
                      className="be-price-input"
                      placeholder="Min"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      min="0"
                    />
                  </div>
                  <span className="be-price-dash">—</span>
                  <div className="be-price-input-group">
                    <span className="be-price-currency">₹</span>
                    <input
                      type="number"
                      className="be-price-input"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Size</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-size-chips">
                  {sizeOptions.map(size => (
                    <button
                      key={size}
                      type="button"
                      className={`be-size-chip ${selectedSizes.includes(size) ? 'active' : ''}`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Color</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-color-swatches">
                  {colorOptions.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      className={`be-color-swatch ${selectedColors.includes(color.name) ? 'active' : ''} ${color.name === 'White' ? 'be-swatch-light' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      onClick={() => handleColorToggle(color.name)}
                    >
                      {selectedColors.includes(color.name) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color.name === 'White' || color.name === 'Black' ? '#E11D48' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="be-filter-section">
                <h4 className="be-filter-heading">
                  <span className="be-filter-heading-text">Fabric</span>
                  <span className="be-filter-heading-underline"></span>
                </h4>
                <div className="be-fabric-list">
                  {fabricOptions.map(fab => (
                    <label key={fab.value} className="be-checkbox-label">
                      <input
                        type="checkbox"
                        className="be-checkbox"
                        checked={selectedFabrics.includes(fab.value)}
                        onChange={() => handleFabricToggle(fab.value)}
                      />
                      <span className="be-checkbox-custom"></span>
                      <span className="be-checkbox-text">{fab.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {getActiveFilterCount() > 0 && (
                <button className="be-clear-filters-outline-btn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </aside>

            <main className="be-content-area">
              <div className="be-content-topbar">
                <div className="be-results-label">
                  <span className="be-results-count">{loading ? '...' : sortedProducts.length}</span>
                  <span className="be-results-text">Products found</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="be-active-filter-badge">{getActiveFilterCount()} filters</span>
                  )}
                </div>
                <div className="be-sort-wrapper">
                  <label className="be-sort-label">Sort By:</label>
                  <select className="be-sort-select" value={sortBy} onChange={handleSortChange}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price Low-High</option>
                    <option value="price-high">Price High-Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="be-error-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <h3>Something went wrong</h3>
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="be-products-grid">
                  <SkeletonLoader type="product" count={8} />
                </div>
              ) : sortedProducts.length > 0 ? (
                <>
                  <div className="be-products-grid">
                    {visibleProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="be-product-card-wrapper"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="be-load-more-wrapper">
                      <button className="be-load-more-btn" onClick={handleLoadMore}>
                        <span>Load More</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="be-empty-state">
                  <div className="be-empty-state-card">
                    <div className="be-empty-icon-wrap">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                    <h3 className="be-empty-title">No products found</h3>
                    <p className="be-empty-text">
                      We couldn't find any t-shirts matching your criteria.
                      Try adjusting your filters or search terms.
                    </p>
                    <button className="be-empty-btn" onClick={clearAllFilters}>
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <section className="be-bulk-cta-section">
        <div className="container be-bulk-cta-container">
          <div className="be-bulk-cta-card">
            <div className="be-bulk-cta-bg"></div>
            <div className="be-bulk-cta-content">
              <div className="be-bulk-cta-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z"/>
                  <path d="M9 5h6v2H9z"/>
                </svg>
                Bulk Orders
              </div>
              <h2 className="be-bulk-cta-title">Need bulk pricing?</h2>
              <p className="be-bulk-cta-text">
                Order 10+ pieces and unlock exclusive wholesale discounts.
                Perfect for teams, events, batches & reunions.
              </p>
              <ul className="be-bulk-cta-features">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Up to 40% OFF on bulk orders
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Free custom design support
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Priority production & delivery
                </li>
              </ul>
              <Link to="/bulk-order" className="be-bulk-cta-btn">
                Get Bulk Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
            <div className="be-bulk-cta-visual">
              <div className="be-bulk-blob be-bulk-blob-1"></div>
              <div className="be-bulk-blob be-bulk-blob-2"></div>
              <div className="be-bulk-icon-stack">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TShirtsEnhanced;
