import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import './ProductDetailEnhanced.css';

const ProductDetailEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedThemeColor, setSelectedThemeColor] = useState('blue');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, comment: '' });

  // Wishlist toggle function
  const handleWishlistToggle = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      error('Product removed from wishlist');
    } else {
      addToWishlist(productId);
      success('Product added to wishlist');
    }
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);
        const result = await api.get(`/products/${id}`);
        
        if (result.success) {
          const p = result.data;
          const mappedProduct = {
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: p.images[0] || 'https://via.placeholder.com/600x800?text=No+Image',
            badge: p.sale_price ? 'Sale' : (p.rating > 4.5 ? 'Bestseller' : ''),
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category_id?.name || 'T-Shirts',
            categorySlug: p.category_id?.slug,
            sizes: p.sizes.map(s => s.size),
            colors: p.colors.map(c => c.name),
            colorMap: p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.hex }), {}),
            inStock: p.is_active && p.sizes.some(s => s.stock > 0),
            stockCount: p.sizes.reduce((total, s) => total + s.stock, 0),
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality', 'Official Alumni Merchandise', 'Durable and Comfortable', 'Easy Care Fabric'
            ],
            specifications: p.specifications || { material: 'Premium Cotton/Fleece', origin: 'Made in India', fit: 'Standard Fit' },
            images: p.images.length > 0 ? p.images : ['https://via.placeholder.com/600x800?text=No+Image']
          };
          setProduct(mappedProduct);
          if (mappedProduct.sizes.length > 0) setSelectedSize(mappedProduct.sizes[0]);
          if (mappedProduct.colors.length > 0) {
            setSelectedThemeColor(mappedProduct.colors[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  useEffect(() => {
    if (product?.dbId) {
      const fetchReviews = async () => {
        try {
          const result = await api.get(`/reviews/${product.dbId}`);
          if (result.success) setReviews(result.data);
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
      };
      fetchReviews();
    }
  }, [product?.dbId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        product_id: product.dbId,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment
      });
      success('Review submitted successfully!');
      setReviewFormData({ rating: 5, comment: '' });
    } catch (err) {
      error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        ...product,
        quantity,
        selectedSize,
        selectedColor: selectedThemeColor
      });
      success('Product added to cart successfully!');
    } catch (err) {
      error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product.inStock) return;
    
    try {
      await addToCart({
        ...product,
        quantity,
        selectedSize,
        selectedColor: selectedThemeColor
      });
      navigate('/checkout');
    } catch (err) {
      error('Failed to process order');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  if (isLoading) return <div className="container p-5 text-center"><SkeletonLoader type="product" count={1} /></div>;
  if (!product) return <div className="container p-5 text-center"><h2>Product Not Found</h2><button onClick={() => navigate('/')}>Back Home</button></div>;

  // Debug: Log product data
  console.log('Product data:', product);
  console.log('Product images:', product.images);
  console.log('Product sizes:', product.sizes);
  console.log('Product colors:', product.colors);

  return (
    <div className="product-detail-page">
      {/* Hero Section */}
      <section className="product-hero-enhanced animate-fadeIn">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slideDown">Product Details</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Premium JNV merchandise with exceptional quality
            </p>
          </div>
        </div>
      </section>

      {/* Product Detail Page */}
      <section className="product-detail-page-enhanced">
        <div className="container">
          <div className="product-layout-enhanced">
            {/* Product Images */}
            <div className="product-images-enhanced animate-slideInLeft">
              <div className="main-image-container">
                <img src={product.images[selectedImage]} alt={product.name} />
                <div className="image-actions">
                  <button className="image-action-btn">
                    <i className="far fa-heart"></i>
                  </button>
                  <button className="image-action-btn">
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button className="image-action-btn">
                    <i className="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>
              <div className="thumbnail-container">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} onClick={() => setSelectedImage(idx)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="product-info-enhanced animate-slideInRight">
              <div className="product-header-enhanced">
                <div className="product-category">{product.category}</div>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating-section">
                  <div className="rating-stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="price-section-enhanced">
                <div className="price-container">
                  <span className="current-price">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">₹{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="discount-badge">Save ₹{product.originalPrice - product.price}</span>
                  )}
                </div>
                <div className="stock-info">
                  <i className={`fas fa-circle ${product.inStock ? 'in-stock' : 'out-stock'}`}></i>
                  <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  {product.inStock && <span className="stock-count">({product.stockCount} available)</span>}
                </div>
              </div>

              <div className="product-description-enhanced">
                <p>{product.description}</p>
              </div>

              <div className="product-options-enhanced">
                <div className="size-selection">
                  <div className="option-header">
                    <h3>Size</h3>
                    <button className="size-guide-btn">
                      <i className="fas fa-ruler"></i>
                      Size Guide
                    </button>
                  </div>
                  <div className="size-options-detail">
                    {product.sizes && product.sizes.map(size => {
                      const isAvailable = true; // You can enhance this with actual stock data
                      return (
                        <button 
                          key={size} 
                          className={`size-option ${selectedSize === size ? 'active' : ''} ${!isAvailable ? 'out-of-stock' : ''}`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          title={isAvailable ? `Size ${size} available` : `Size ${size} out of stock`}
                        >
                          {size}
                          {!isAvailable && <i className="fas fa-times"></i>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="size-info">
                    <i className="fas fa-info-circle"></i>
                    <span>Select your preferred size</span>
                  </div>
                </div>
                
                <div className="color-theme-selection">
                  <h3>Color</h3>
                  <div className="color-theme-options">
                    {product.colors && product.colors.map(color => (
                      <button 
                        key={color} 
                        className={`color-theme-option ${selectedThemeColor === color ? 'active' : ''}`} 
                        onClick={() => setSelectedThemeColor(color)}
                        title={color}
                        style={{ 
                          background: product.colorMap && product.colorMap[color] 
                            ? product.colorMap[color] 
                            : `linear-gradient(135deg, ${color} 0%, ${color} 100%)`
                        }}
                      >
                        <span className="color-theme-name">{color}</span>
                      </button>
                    ))}
                  </div>
                  <div className="color-selection-info">
                    <i className="fas fa-palette"></i>
                    <span>Choose your preferred color</span>
                  </div>
                </div>

                <div className="quantity-selection">
                  <h3>Quantity</h3>
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

              <div className="action-buttons-enhanced">
                <button 
                  className="add-to-cart-btn-enhanced" 
                  onClick={handleAddToCart} 
                  disabled={!product.inStock || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart"></i>
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="buy-now-btn-enhanced" onClick={handleBuyNow} disabled={!product.inStock}>
                  <i className="fas fa-bolt"></i>
                  Buy Now
                </button>
                <button className="wishlist-btn-enhanced" onClick={() => handleWishlistToggle(product.id)}>
                  <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="product-features-enhanced">
                <h4>Key Features</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="product-meta-enhanced">
                <div className="meta-item">
                  <i className="fas fa-truck"></i>
                  <span>Free Shipping on orders above ₹999</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-undo"></i>
                  <span>30-day return policy</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>100% Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section-enhanced">
        <div className="container">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="average-rating">
                <span className="rating-number">{product.rating}</span>
                <div className="rating-stars">
                  {renderStars(product.rating)}
                </div>
                <span className="total-reviews">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="reviews-content">
            <div className="add-review-section">
              <h4>Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <textarea 
                  className="form-control" 
                  value={reviewFormData.comment} 
                  onChange={e => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  placeholder="Your review..."
                />
                <button type="submit" className="submit-review-btn" disabled={isSubmittingReview}>
                  {isSubmittingReview ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-star"></i>
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="review-item">
                  <div className="review-header">
                    <strong>{r.user_id?.name || 'User'}</strong>
                    <div className="review-rating">
                      {renderStars(r.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailEnhanced;
