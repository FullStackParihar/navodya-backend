import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

// Sample recently viewed products
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

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyLoading, setRecentlyLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Simulate loading for recently viewed products
    const timer = setTimeout(() => {
      setRecentlyLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product) => {
    setIsLoading(true);
    setTimeout(() => {
      addToCart(product);
      success(`${product.name} added to cart!`);
      removeFromWishlist(product.id);
      setIsLoading(false);
    }, 500);
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

  if (items.length === 0) {
    return (
      <div>
        {/* Hero Section */}
        <section className="wishlist-hero animate-fadeIn">
          <div className="hero-background">
            <div className="hero-pattern"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <h1 className="animate-slideDown">My Wishlist</h1>
              <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Save your favorite JNV merchandise for later
              </p>
            </div>
          </div>
        </section>

        {/* Empty Wishlist */}
        <section className="empty-wishlist-section">
          <div className="container">
            <div className="empty-wishlist-enhanced animate-fadeIn">
              <div className="empty-wishlist-icon animate-bounce">
                <i className="far fa-heart"></i>
              </div>
              <h2 className="animate-slideUp">Your wishlist is empty</h2>
              <p className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Add items you love to keep them here!
              </p>
              <div className="empty-wishlist-actions animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <Link to="/" className="btn-primary">
                  <i className="fas fa-shopping-bag"></i> Continue Shopping
                </Link>
                <Link to="/tshirts" className="btn-secondary">
                  <i className="fas fa-tshirt"></i> Browse T-Shirts
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="wishlist-hero animate-fadeIn">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slideDown">My Wishlist</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Page */}
      <section className="wishlist-page-enhanced">
        <div className="container">
          {/* Wishlist Header */}
          <div className="wishlist-header-enhanced animate-slideInLeft">
            <div className="wishlist-info-enhanced">
              <h2>My Wishlist</h2>
              <div className="wishlist-stats">
                <span className="item-count">{items.length} items</span>
                <span className="total-value">Total Value: ₹{calculateTotalValue()}</span>
                {calculateTotalSavings() > 0 && (
                  <span className="total-savings">You save ₹{calculateTotalSavings()}</span>
                )}
              </div>
            </div>
            <div className="wishlist-actions-enhanced">
              <div className="sort-dropdown">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">Sort by: Date Added</option>
                  <option value="name">Sort by: Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button className="clear-wishlist-btn" onClick={handleClearAll}>
                <i className="fas fa-trash"></i> Clear All
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="wishlist-items-enhanced">
            {sortedItems.map((item, index) => (
              <div key={item.id} className="wishlist-item-enhanced animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="item-image-enhanced">
                  <img src={item.image} alt={item.name} />
                  {item.badge && (
                    <div className="item-badge">{item.badge}</div>
                  )}
                  <div className="item-overlay">
                    <Link to={`/product/${item.id}`} className="quick-view-btn">
                      <i className="far fa-eye"></i>
                    </Link>
                  </div>
                </div>
                
                <div className="item-details-enhanced">
                  <h3>
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p>{item.description}</p>
                  
                  <div className="item-rating-enhanced">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < 4 ? 'active' : ''}`}
                          style={{ color: i < 4 ? 'var(--amazon-orange)' : '#ddd' }}
                        ></i>
                      ))}
                      <i className="fas fa-star-half-alt" style={{ color: 'var(--amazon-orange)' }}></i>
                    </div>
                    <span className="rating-count">({item.reviews || 245})</span>
                  </div>
                  
                  <div className="item-price-enhanced">
                    <span className="current-price">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="original-price">₹{item.originalPrice}</span>
                    )}
                    {item.originalPrice && (
                      <span className="savings">Save ₹{item.originalPrice - item.price}</span>
                    )}
                  </div>
                </div>
                
                <div className="item-actions-enhanced">
                  <button 
                    className="add-to-cart-btn-enhanced"
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
                  <button 
                    className="remove-wishlist-btn-enhanced"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Viewed */}
          <div className="recently-viewed-enhanced animate-slideInRight">
            <div className="recently-header">
              <h3>Recently Viewed</h3>
              <Link to="/tshirts" className="view-all-link">View All Products</Link>
            </div>
            <div className="recently-grid-enhanced">
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

export default Wishlist;
