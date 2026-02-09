import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { success } = useToast();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    success(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="quickview-content">
          <div className="quickview-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="quickview-info">
            <div className="quickview-header">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <h2>{product.name}</h2>
              <div className="quickview-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < 4 ? 'active' : ''}`}></i>
                  ))}
                </div>
                <span>({product.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="quickview-price">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice}</span>
              )}
            </div>
            
            <p className="quickview-description">{product.description}</p>
            
            <div className="quickview-options">
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-chips">
                    {product.sizes.map(size => (
                      <span key={size} className="size-chip">{size}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="color-chips">
                    {product.colors.map(color => (
                      <span 
                        key={color} 
                        className="color-chip" 
                        title={color}
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="quickview-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <Link to={`/product/${product.id}`} className="view-details-btn">
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
