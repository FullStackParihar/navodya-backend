import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error, info } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    if (isInCart(product.id)) {
      error('Product is already in cart!');
      return;
    }

    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      addToCart(product);
      success(`${product.name} added to cart!`);
    } catch (err) {
      error('Failed to add to cart');
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
    // TODO: Implement quick view modal
    info('Quick view feature coming soon!');
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div 
      className="product-card animate-fadeIn"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
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
        
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
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
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        
        <button 
          className={`add-to-cart ${isAdding ? 'loading' : ''} ${isHovered ? 'animate-pulse' : ''}`}
          onClick={handleAddToCart}
          disabled={isInCart(product.id) || isAdding}
        >
          {isAdding ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> 
              Adding...
            </>
          ) : isInCart(product.id) ? (
            <>
              <i className="fas fa-check"></i> 
              In Cart
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i> 
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
