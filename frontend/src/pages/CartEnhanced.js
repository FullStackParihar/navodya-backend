import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './CartEnhanced.css';

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

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;
const GST_RATE = 0.18;

const CartEnhanced = () => {
  const { items, totalAmount, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toggleWishlist, addToWishlist } = useWishlist();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  useEffect(() => {
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
      setUpdating(true);
      updateQuantity(id, newQuantity);
      success('Cart updated successfully');
      setTimeout(() => setUpdating(false), 300);
    }
  };

  const handleRemove = (id, name) => {
    removeFromCart(id);
    error(`${name} removed from cart`);
  };

  const handleMoveToWishlist = (item) => {
    const wishlistItem = {
      id: item.productSlug || item.id,
      dbId: item.dbId,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      badge: item.badge || '',
      reviews: item.reviews || 0,
      selectedFabric: item.selectedFabric || null
    };
    addToWishlist(wishlistItem);
    removeFromCart(item.id);
    success(`${item.name} moved to wishlist`);
  };

  const handleApplyPromo = async () => {
    const code = (couponCode || promoCode).trim();
    if (!code) {
      setCouponError('Please enter a coupon code');
      error('Please enter a coupon code');
      return;
    }

    setCouponError('');
    setIsLoading(true);

    try {
      const response = await api.post('/coupons/validate', { code, orderAmount: totalAmount });
      if (response.success) {
        const discountAmount = response.data.discountAmount || 0;
        setCouponDiscount(discountAmount);
        setDiscount(discountAmount);
        setAppliedCoupon(code.toUpperCase());
        setPromoCode(code);
        success(`Coupon applied! You saved ₹${discountAmount}`);
      } else {
        setCouponError(response.message || 'Invalid coupon code');
        setCouponDiscount(0);
        setDiscount(0);
        setAppliedCoupon(null);
        error(response.message || 'Invalid coupon code');
      }
    } catch (err) {
      setTimeout(() => {
        if (code.toUpperCase() === 'JNV2024') {
          setCouponDiscount(399);
          setDiscount(399);
          setAppliedCoupon('JNV2024');
          success('Promo code applied! You saved ₹399');
        } else if (code.toUpperCase() === 'ALUMNI20') {
          const d = Math.floor(totalAmount * 0.2);
          setCouponDiscount(d);
          setDiscount(d);
          setAppliedCoupon('ALUMNI20');
          success('20% discount applied!');
        } else {
          setCouponError('Invalid promo code');
          setCouponDiscount(0);
          setDiscount(0);
          setAppliedCoupon(null);
          error('Invalid promo code');
        }
      }, 1000);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      setCouponDiscount(0);
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponCode('');
      setPromoCode('');
      success('Cart cleared');
    }
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

  const calculateShipping = () => {
    return totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  };

  const calculateTax = () => {
    const beforeTax = calculateTotal();
    return Math.floor(beforeTax * GST_RATE / (1 + GST_RATE));
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateShipping();
  };

  const shippingProgress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - totalAmount, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="era-cart-page">
        <div className="era-cart-container">
          <div className="era-breadcrumb">
            <Link to="/">Home</Link>
            <span className="era-breadcrumb-sep">/</span>
            <span className="era-breadcrumb-current">Cart</span>
          </div>

          <div className="era-page-heading-wrap">
            <h1 className="era-page-heading">Shopping Cart</h1>
            <div className="era-heading-underline"></div>
          </div>

          <div className="era-empty-cart">
            <div className="era-empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2 className="era-empty-title">Your cart is empty</h2>
            <p className="era-empty-subtitle">Looks like you haven't added anything yet</p>
            <Link to="/" className="era-btn-primary-lg">
              <i className="fas fa-shopping-bag"></i>
              Start Shopping
            </Link>
          </div>

          <div className="era-features-strip">
            <div className="era-feature-item">
              <i className="fas fa-truck"></i>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above ₹999</p>
              </div>
            </div>
            <div className="era-feature-item">
              <i className="fas fa-lock"></i>
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure checkout</p>
              </div>
            </div>
            <div className="era-feature-item">
              <i className="fas fa-undo"></i>
              <div>
                <h4>Easy Returns</h4>
                <p>7-day return policy</p>
              </div>
            </div>
            <div className="era-feature-item">
              <i className="fas fa-headset"></i>
              <div>
                <h4>24/7 Support</h4>
                <p>Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="era-cart-page">
      <div className="era-cart-container">
        <div className="era-breadcrumb">
          <Link to="/">Home</Link>
          <span className="era-breadcrumb-sep">/</span>
          <span className="era-breadcrumb-current">Cart</span>
        </div>

        <div className="era-page-heading-wrap">
          <h1 className="era-page-heading">Shopping Cart</h1>
          <div className="era-heading-underline"></div>
          <p className="era-items-subheading">
            <strong>{items.length}</strong> {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="era-two-column-layout">
          <div className="era-left-column">
            <div className="era-items-header">
              <Link to="/" className="era-continue-shopping">
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </Link>
              {items.length > 0 && (
                <button className="era-clear-cart-btn" onClick={handleClearCart}>
                  <i className="fas fa-trash"></i>
                  Clear Cart
                </button>
              )}
            </div>

            <div className="era-cart-items-list">
              {items.map((item, index) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div key={item.id} className="era-cart-item-card" style={{ animationDelay: `${index * 0.05}s` }}>
                    <button
                      className="era-item-remove-btn"
                      onClick={() => handleRemove(item.id, item.name)}
                      title="Remove item"
                    >
                      <i className="fas fa-times"></i>
                    </button>

                    <div className="era-item-thumbnail">
                      <Link to={`/product/${item.productSlug || item.id}`}>
                        <img src={resolveImageUrl(item.image)} alt={item.name} />
                      </Link>
                    </div>

                    <div className="era-item-content">
                      <h3 className="era-item-name">
                        <Link to={`/product/${item.productSlug || item.id}`}>{item.name}</Link>
                      </h3>

                      <div className="era-item-variants">
                        {item.selectedSize && item.selectedSize !== 'Free Size' && (
                          <span className="era-variant-pill">{item.selectedSize}</span>
                        )}
                        {item.selectedColor && item.selectedColor !== 'N/A' && (
                          <span className="era-variant-pill">{item.selectedColor}</span>
                        )}
                        {item.fabricName && (
                          <span className="era-variant-pill era-fabric-pill">{item.fabricName}</span>
                        )}
                      </div>

                      <button
                        className="era-wishlist-link"
                        onClick={() => handleMoveToWishlist(item)}
                      >
                        <i className="far fa-heart"></i>
                        Move to wishlist
                      </button>

                      <div className="era-item-price-block">
                        <span className="era-unit-price">₹{item.price}</span>
                        <span className="era-price-multiply">×</span>
                        <span className="era-qty-num">{item.quantity}</span>
                        <span className="era-price-equals">=</span>
                        <span className="era-line-total">₹{lineTotal}</span>
                      </div>

                      <div className="era-quantity-row">
                        <div className="era-quantity-selector">
                          <button
                            className="era-qty-btn era-qty-minus"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="era-qty-input"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                            max="10"
                            disabled={updating}
                          />
                          <button
                            className="era-qty-btn era-qty-plus"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10 || updating}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="era-right-column">
            <div className="era-order-summary-card">
              <div className="era-summary-header">
                <h3>Order Summary</h3>
                {calculateSavings() > 0 && (
                  <span className="era-savings-tag">
                    Save ₹{calculateSavings()}
                  </span>
                )}
              </div>

              <div className="era-summary-body">
                <div className="era-summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="era-summary-amount">₹{totalAmount}</span>
                </div>

                {discount > 0 && (
                  <div className="era-summary-row era-discount-row">
                    <span>Discount {appliedCoupon && `(${appliedCoupon})`}</span>
                    <span className="era-summary-discount">−₹{discount}</span>
                  </div>
                )}

                <div className="era-summary-row">
                  <span>Shipping</span>
                  <span className="era-summary-shipping">
                    {calculateShipping() === 0 ? (
                      <span className="era-shipping-free">FREE</span>
                    ) : (
                      `₹${calculateShipping()}`
                    )}
                  </span>
                </div>

                {shippingRemaining > 0 && (
                  <div className="era-shipping-progress-wrap">
                    <div className="era-shipping-progress-bar">
                      <div
                        className="era-shipping-progress-fill"
                        style={{ width: `${shippingProgress}%` }}
                      ></div>
                    </div>
                    <p className="era-shipping-hint">
                      Add <strong>₹{shippingRemaining}</strong> more to unlock <span className="era-free-red">FREE Shipping</span>
                    </p>
                  </div>
                )}

                <div className="era-summary-row">
                  <span>GST (Included)</span>
                  <span className="era-summary-tax">₹{calculateTax()}</span>
                </div>

                <div className="era-summary-divider"></div>

                <div className="era-grand-total-row">
                  <span>Grand Total</span>
                  <span className="era-grand-total-amount">₹{calculateGrandTotal()}</span>
                </div>

                <div className="era-coupon-section">
                  <div className="era-coupon-form">
                    <input
                      type="text"
                      className="era-coupon-input"
                      placeholder="Enter coupon code"
                      value={couponCode || promoCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setPromoCode(e.target.value);
                        setCouponError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                    <button
                      className="era-coupon-apply-btn"
                      onClick={handleApplyPromo}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {couponError && <p className="era-coupon-error">{couponError}</p>}
                  {appliedCoupon && !couponError && (
                    <p className="era-coupon-applied">
                      <i className="fas fa-check-circle"></i> {appliedCoupon} applied
                    </p>
                  )}
                </div>

                <button className="era-checkout-btn" onClick={handleCheckout}>
                  <i className="fas fa-lock"></i>
                  Proceed to Checkout
                  <span className="era-checkout-count">({totalItems} items)</span>
                </button>

                <div className="era-trust-badges-row">
                  <div className="era-trust-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="era-trust-item">
                    <i className="fas fa-credit-card"></i>
                    <span>Verified</span>
                  </div>
                  <div className="era-trust-item">
                    <i className="fas fa-lock"></i>
                    <span>SSL</span>
                  </div>
                </div>

                <div className="era-payment-icons-row">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <i className="fab fa-cc-stripe"></i>
                </div>

                <Link to="/bulk-order" className="era-quote-btn">
                  <i className="fas fa-file-alt"></i>
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="era-features-strip">
          <div className="era-feature-item">
            <i className="fas fa-truck"></i>
            <div>
              <h4>Free Shipping</h4>
              <p>On orders above ₹999</p>
            </div>
          </div>
          <div className="era-feature-item">
            <i className="fas fa-lock"></i>
            <div>
              <h4>Secure Payment</h4>
              <p>100% secure checkout</p>
            </div>
          </div>
          <div className="era-feature-item">
            <i className="fas fa-undo"></i>
            <div>
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
          <div className="era-feature-item">
            <i className="fas fa-headset"></i>
            <div>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEnhanced;
