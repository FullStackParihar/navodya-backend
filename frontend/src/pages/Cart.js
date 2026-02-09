import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import CartSummary from '../components/CartSummary';
import CheckoutProgress from '../components/CheckoutProgress';
import SkeletonLoader from '../components/SkeletonLoader';
import './CartEnhanced.css';

// Sample recommended products
const recommendedProducts = [
  {
    id: 13,
    name: 'JNV Baseball Cap',
    description: 'Adjustable | Embroidered Logo',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Hot',
    reviews: 156
  },
  {
    id: 14,
    name: 'JNV Backpack',
    description: 'Waterproof | Laptop Compartment',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    reviews: 98
  },
  {
    id: 15,
    name: 'JNV Water Bottle',
    description: 'Stainless Steel | Insulated',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 78
  },
  {
    id: 16,
    name: 'JNV Phone Case',
    description: 'Protective | Custom Design',
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    reviews: 134
  }
];

const Cart = () => {
  const { items, totalAmount, updateQuantity, removeFromCart } = useCart();
  const { success, error } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(199);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for recommended products
    const timer = setTimeout(() => {
      setRecommendedLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      error('Item removed from cart');
    } else if (newQuantity > 10) {
      error('Maximum quantity is 10');
    } else {
      updateQuantity(id, newQuantity);
      success('Cart updated successfully');
    }
  };

  const handleRemoveItem = (id, name) => {
    removeFromCart(id);
    error(`${name} removed from cart`);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      error('Please enter a promo code');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'JNV2024') {
        setDiscount(399);
        success('Promo code applied! You saved ₹399');
      } else if (promoCode.toUpperCase() === 'ALUMNI20') {
        setDiscount(Math.floor(totalAmount * 0.2));
        success('20% discount applied!');
      } else {
        error('Invalid promo code');
        setDiscount(199);
      }
      setIsLoading(false);
    }, 1000);
  };

  const calculateTotal = () => {
    return Math.max(0, totalAmount - discount);
  };

  const calculateSavings = () => {
    const originalTotal = items.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);
    return originalTotal - totalAmount + discount;
  };

  if (items.length === 0) {
    return (
      <div>
        {/* Hero Section */}
        <section className="cart-hero animate-fadeIn">
          <div className="hero-background">
            <div className="hero-pattern"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <h1 className="animate-slideDown">Shopping Cart</h1>
              <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Your cart is currently empty
              </p>
            </div>
          </div>
        </section>

        {/* Empty Cart */}
        <section className="empty-cart-section">
          <div className="container">
            <div className="empty-cart-enhanced animate-fadeIn">
              <div className="empty-cart-icon animate-bounce">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h2 className="animate-slideUp">Your cart is empty</h2>
              <p className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Add some JNV merchandise to get started!
              </p>
              <div className="empty-cart-actions animate-slideUp" style={{ animationDelay: '0.2s' }}>
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
      <section className="cart-hero animate-fadeIn">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slideDown">Shopping Cart</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </section>

      {/* Cart Page */}
      <section className="cart-page-enhanced">
        <div className="container">
          {/* Checkout Progress */}
          <CheckoutProgress currentStep={1} />
          
          <div className="cart-layout-enhanced">
            {/* Cart Items */}
            <div className="cart-items-enhanced animate-slideInLeft">
              <div className="cart-header">
                <h2>Your Items</h2>
                <span className="item-count">{items.length} items</span>
              </div>

              <div className="cart-items-list">
                {items.map((item, index) => (
                  <div key={item.id} className="cart-item-enhanced animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="item-image-enhanced">
                      <img src={item.image} alt={item.name} />
                      {item.badge && (
                        <span className="item-badge">{item.badge}</span>
                      )}
                    </div>
                    
                    <div className="item-details-enhanced">
                      <h3>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p>{item.description}</p>
                      <div className="item-price-enhanced">
                        <span className="current-price">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="original-price">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-quantity-enhanced">
                      <label className="qty-label">Quantity</label>
                      <div className="quantity-controls-enhanced">
                        <button 
                          className="qty-btn decrease"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          className="qty-input" 
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          max="10"
                        />
                        <button 
                          className="qty-btn increase"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-total-enhanced">
                      <label className="total-label">Total</label>
                      <span className="total-price">₹{item.price * item.quantity}</span>
                      {item.originalPrice && (
                        <span className="savings">Save ₹{(item.originalPrice - item.price) * item.quantity}</span>
                      )}
                    </div>
                    
                    <div className="item-actions-enhanced">
                      <button 
                        className="action-btn save"
                        title="Save for later"
                      >
                        <i className="far fa-heart"></i>
                      </button>
                      <button 
                        className="action-btn remove"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        title="Remove item"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary - Mobile */}
              <div className="cart-summary-mobile">
                <CartSummary 
                  cartItems={items} 
                  showCheckoutButton={true}
                  className="mobile-summary"
                />
              </div>
            </div>

            {/* Order Summary - Desktop */}
            <div className="order-summary-enhanced animate-slideInRight">
              <CartSummary 
                cartItems={items} 
                showCheckoutButton={true}
                className="desktop-summary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="recommended-products-section">
        <div className="container">
          <div className="recommended-header">
            <h2>You might also like</h2>
            <p>Complete your JNV collection with these popular items</p>
          </div>
          
          <div className="recommended-products-grid">
            {recommendedProducts.map((product, index) => (
              <div key={product.id} className="recommended-product-card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
