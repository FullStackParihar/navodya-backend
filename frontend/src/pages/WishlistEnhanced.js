import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './WishlistEnhanced.css';

const recentlyViewedProducts = [
  {
    id: 17,
    name: 'JNV Sports Jersey',
    description: 'Performance Fabric | Breathable',
    price: 549,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 312
  },
  {
    id: 18,
    name: 'JNV Track Pants',
    description: 'Comfort Fit | Quick Dry',
    price: 449,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
    reviews: 178
  },
  {
    id: 19,
    name: 'JNV ID Card Holder',
    description: 'Premium Leather | Custom Engraving',
    price: 99,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 89
  },
  {
    id: 20,
    name: 'JNV Notebook Set',
    description: 'Premium Paper | Custom Cover',
    price: 249,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1563013544-b8e825b3e4c8?w=300&h=400&fit=crop',
    reviews: 156
  }
];

const suggestionProducts = [
  {
    id: 21,
    name: 'JNV Premium Hoodie',
    description: 'Premium Cotton | Warm & Cozy',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    badge: 'Best Seller',
    reviews: 542
  },
  {
    id: 22,
    name: 'JNV Classic Cap',
    description: 'Adjustable Fit | Premium Stitch',
    price: 299,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=400&fit=crop',
    reviews: 234
  },
  {
    id: 23,
    name: 'JNV Backpack',
    description: '15" Laptop Compartment | Water Resistant',
    price: 799,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop',
    badge: 'Popular',
    reviews: 418
  },
  {
    id: 24,
    name: 'JNV Alumni T-Shirt',
    description: 'Classic Fit | Premium Print',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    reviews: 376
  }
];

const WishlistEnhanced = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyLoading, setRecentlyLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentlyLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await addToCart(product);
      success(`${product.name} added to cart!`);
      removeFromWishlist(product.id);
    } catch (err) {
      error(err.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = (id, name) => {
    removeFromWishlist(id);
    error(`${name} removed from wishlist`);
  };

  const handleClearAll = () => {
    clearWishlist();
    error('Wishlist cleared');
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'date':
      default:
        return b.id - a.id;
    }
  });

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalSavings = () => {
    return items.reduce((total, item) => {
      const savings = item.originalPrice ? item.originalPrice - item.price : 0;
      return total + savings;
    }, 0);
  };

  const getUniqueCategories = () => {
    const cats = new Set(items.map(item => item.category || 'General'));
    return cats.size;
  };

  const getThisWeekCount = () => {
    return Math.min(items.length, Math.floor(Math.random() * items.length) + 1);
  };

  const getDiscountPercent = (original, current) => {
    if (!original) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  if (items.length === 0) {
    return (
      <div className="era-wishlist-page">
        <section className="era-hero-banner">
          <div className="era-hero-bg">
            <div className="era-hero-red-gradient era-gradient-1"></div>
            <div className="era-hero-red-gradient era-gradient-2"></div>
            <div className="era-hero-red-gradient era-gradient-3"></div>
          </div>
          <div className="era-container">
            <nav className="era-breadcrumb">
              <Link to="/" className="era-breadcrumb-link">
                <i className="fas fa-home"></i> Home
              </Link>
              <span className="era-breadcrumb-sep"><i className="fas fa-chevron-right"></i></span>
              <span className="era-breadcrumb-current">Wishlist</span>
            </nav>
            <div className="era-hero-content">
              <h1 className="era-hero-title">
                My Wishlist
                <span className="era-title-underline"></span>
              </h1>
              <p className="era-hero-subtitle">Save your favorite JNV merchandise for later</p>
            </div>
            <div className="era-stat-row">
              <div className="era-stat-pill">
                <i className="fas fa-heart era-stat-icon"></i>
                <span className="era-stat-val">0</span>
                <span className="era-stat-label">items saved</span>
              </div>
              <div className="era-stat-pill">
                <i className="fas fa-folder era-stat-icon"></i>
                <span className="era-stat-val">0</span>
                <span className="era-stat-label">categories</span>
              </div>
              <div className="era-stat-pill">
                <i className="fas fa-calendar-week era-stat-icon"></i>
                <span className="era-stat-val">0</span>
                <span className="era-stat-label">added this week</span>
              </div>
            </div>
            <div className="era-action-row">
              <Link to="/" className="era-continue-link">
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </section>

        <section className="era-empty-section">
          <div className="era-container">
            <div className="era-empty-card">
              <div className="era-empty-heart-wrap">
                <div className="era-empty-pulse"></div>
                <div className="era-empty-heart">
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              <h2 className="era-empty-heading">Your wishlist is empty</h2>
              <p className="era-empty-subtitle">
                Save your favorite products. Add items you love to your wishlist.
              </p>
              <Link to="/" className="era-btn-primary">
                <i className="fas fa-compass"></i> Explore Products
              </Link>
            </div>

            <div className="era-suggestions-block animate-fadeIn">
              <div className="era-section-header">
                <h3 className="era-section-title">
                  <span className="era-title-accent-red"></span>
                  Recommended For You
                </h3>
                <Link to="/" className="era-view-all">View All <i className="fas fa-chevron-right"></i></Link>
              </div>
              <div className="era-suggestions-grid">
                {recentlyLoading ? (
                  <SkeletonLoader type="product" count={4} />
                ) : (
                  suggestionProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="era-wishlist-page">
      <section className="era-hero-banner">
        <div className="era-hero-bg">
          <div className="era-hero-red-gradient era-gradient-1"></div>
          <div className="era-hero-red-gradient era-gradient-2"></div>
          <div className="era-hero-red-gradient era-gradient-3"></div>
        </div>
        <div className="era-container">
          <nav className="era-breadcrumb">
            <Link to="/" className="era-breadcrumb-link">
              <i className="fas fa-home"></i> Home
            </Link>
            <span className="era-breadcrumb-sep"><i className="fas fa-chevron-right"></i></span>
            <span className="era-breadcrumb-current">Wishlist</span>
          </nav>
          <div className="era-hero-content">
            <h1 className="era-hero-title">
              My Wishlist
              <span className="era-title-underline"></span>
            </h1>
            <p className="era-hero-subtitle">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <div className="era-stat-row">
            <div className="era-stat-pill">
              <i className="fas fa-heart era-stat-icon"></i>
              <span className="era-stat-val">{items.length}</span>
              <span className="era-stat-label">items saved</span>
            </div>
            <div className="era-stat-pill">
              <i className="fas fa-folder era-stat-icon"></i>
              <span className="era-stat-val">{getUniqueCategories()}</span>
              <span className="era-stat-label">categories</span>
            </div>
            <div className="era-stat-pill">
              <i className="fas fa-calendar-week era-stat-icon"></i>
              <span className="era-stat-val">{getThisWeekCount()}</span>
              <span className="era-stat-label">added this week</span>
            </div>
          </div>
          <div className="era-action-row">
            <Link to="/" className="era-continue-link">
              <i className="fas fa-arrow-left"></i> Continue Shopping
            </Link>
            <button className="era-clear-btn-outline" onClick={handleClearAll}>
              <i className="fas fa-trash-alt"></i> Clear Wishlist
            </button>
          </div>
        </div>
      </section>

      <section className="era-wishlist-content">
        <div className="era-container">
          <div className="era-toolbar-row">
            <div className="era-toolbar-info">
              <h2 className="era-wishlist-heading">
                Saved Products
                <span className="era-heading-count">{items.length}</span>
              </h2>
              <div className="era-toolbar-meta">
                <span className="era-total-val">Total Value: <strong>₹{calculateTotalValue()}</strong></span>
                {calculateTotalSavings() > 0 && (
                  <span className="era-savings-tag">
                    <i className="fas fa-tags"></i> You Save ₹{calculateTotalSavings()}
                  </span>
                )}
              </div>
            </div>
            <div className="era-toolbar-controls">
              <div className="era-sort-wrap">
                <label className="era-sort-label">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="era-sort-select"
                >
                  <option value="date">Date Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="era-wishlist-grid">
            {sortedItems.map((item, index) => {
              const discount = getDiscountPercent(item.originalPrice, item.price);
              return (
                <div
                  key={item.id}
                  className="era-wish-card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <Link to={`/product/${item.id}`} className="era-card-image-link">
                    <div className="era-card-image">
                      <img src={item.image} alt={item.name} />
                      <div className="era-heart-badge">
                        <i className="fas fa-heart"></i>
                      </div>
                      {discount > 0 && (
                        <div className="era-discount-badge">-{discount}%</div>
                      )}
                      {item.badge && (
                        <div className="era-product-badge">{item.badge}</div>
                      )}
                    </div>
                  </Link>

                  <button
                    className="era-remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  <div className="era-card-body">
                    <Link to={`/product/${item.id}`} className="era-card-name">
                      {item.name}
                    </Link>

                    <div className="era-card-rating">
                      <div className="era-stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < 4 ? 'star-active' : 'star-gray'}${i === 4 ? '-alt' : ''}`}
                          ></i>
                        ))}
                        <i className="fas fa-star-half-alt star-half"></i>
                      </div>
                      <span className="era-review-count">({item.reviews || 245})</span>
                    </div>

                    <div className="era-price-block">
                      <span className="era-current-price">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="era-original-price">₹{item.originalPrice}</span>
                      )}
                      {discount > 0 && (
                        <span className="era-discount-chip">-{discount}%</span>
                      )}
                    </div>

                    <div className="era-card-actions">
                      <button
                        className="era-addcart-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <>
                            <i className="fas fa-shopping-bag"></i>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <Link to={`/product/${item.id}`} className="era-viewproduct-btn">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="era-recently-block animate-slideInRight">
            <div className="era-section-header">
              <h3 className="era-section-title">
                <span className="era-title-accent-red"></span>
                Recently Viewed
              </h3>
              <Link to="/tshirts" className="era-view-all">View All Products <i className="fas fa-chevron-right"></i></Link>
            </div>
            <div className="era-recently-grid">
              {recentlyLoading ? (
                <SkeletonLoader type="product" count={4} />
              ) : (
                recentlyViewedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WishlistEnhanced;
