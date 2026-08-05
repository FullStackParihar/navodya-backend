import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import QuickViewModal from './QuickViewModal';
import { resolveImageUrl } from '../utils/api';

const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">Navodaya Trendz</text></svg>`;

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = async () => {
    if (isInCart(product.id)) {
      error('Product is already in cart!');
      return;
    }

    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      await addToCart(product);
      success(`${product.name} added to cart!`);
    } catch (err) {
      error(err.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    const message = isInWishlist(product.id) 
      ? `${product.name} removed from wishlist!`
      : `${product.name} added to wishlist!`;
    success(message);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  return (
    <div 
      className="product-card animate-fadeIn"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <Link to={`/product/${product.dbId || product.id}`}>
          <img 
            src={resolveImageUrl(product.image)} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = fallbackImage;
            }}
          />
        </Link>
        
        <div className="product-actions">
          <button 
            className="action-btn"
            onClick={handleWishlistToggle}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
          </button>
          <button 
            className="action-btn"
            onClick={handleQuickView}
            title="Quick view"
          >
            <i className="far fa-eye"></i>
          </button>
        </div>
        
        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}
        
        {product.originalPrice && product.price < product.originalPrice && (
          <div className="discount-tag" style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 10 }}>
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
        

      </div>
      
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product/${product.dbId || product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-rating">
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
          <span className="rating-count">({product.reviews || 245})</span>
        </div>
        
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice && product.price < product.originalPrice && (
            <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '8px', fontSize: '0.85em' }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        
        <Link 
          to={`/product/${product.dbId || product.id}`}
          className={`add-to-cart ${isHovered ? 'animate-pulse' : ''}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <i className="fas fa-eye"></i> 
          View Product
        </Link>
      </div>
      
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
};

export default ProductCard;
