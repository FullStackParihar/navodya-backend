import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();
  
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      error('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity
      });
      success(`${product.name} added to cart!`);
      onClose();
    } catch (err) {
      error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      success('Removed from wishlist');
    } else {
      addToWishlist(product);
      success('Added to wishlist');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? 'active' : ''}`}></i>
    ));
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="quickview-content">
          <div className="quickview-image">
            <img src={product.image || 'https://via.placeholder.com/400x400?text=Product'} alt={product.name} />
            <div className="image-actions">
              <button className="image-action-btn" onClick={handleWishlistToggle}>
                <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
              </button>
              <button className="image-action-btn">
                <i className="fas fa-share-alt"></i>
              </button>
              <button className="image-action-btn">
                <i className="fas fa-search-plus"></i>
              </button>
            </div>
          </div>
          
          <div className="quickview-info">
            <div className="quickview-header">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <h2>{product.name}</h2>
              <div className="quickview-rating">
                <div className="stars">
                  {renderStars(product.rating || 4)}
                </div>
                <span>({product.reviews || 0} reviews)</span>
              </div>
            </div>
            
            <div className="quickview-price">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="discount-badge">Save ₹{product.originalPrice - product.price}</span>
              )}
            </div>
            
            <p className="quickview-description">{product.description}</p>
            
            <div className="quickview-options">
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-chips">
                    {product.sizes.map(size => (
                      <button 
                        key={size} 
                        className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="color-chips">
                    {product.colors.map(color => (
                      <button 
                        key={color} 
                        className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{ backgroundColor: color.toLowerCase() }}
                      >
                        {selectedColor === color && <i className="fas fa-check"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1" 
                    max="10"
                  />
                  <button 
                    className="quantity-btn" 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="quickview-actions">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </>
                )}
              </button>
              <Link to={`/product/${product.id}`} className="view-details-btn" onClick={onClose}>
                View Full Details
              </Link>
            </div>

            <div className="quickview-features">
              <div className="feature">
                <i className="fas fa-truck"></i>
                <span>Free Delivery</span>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <i className="fas fa-undo"></i>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
