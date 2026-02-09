import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './ProductDetailEnhanced.css';

const ProductDetailEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const result = await response.json();
        
        if (result.success) {
          const p = result.data;
          // Map backend product to frontend format
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
            categoryId: p.category_id?._id,
            categorySlug: p.category_id?.slug,
            sizes: p.sizes.map(s => s.size),
            colors: p.colors.map(c => c.name),
            colorMap: p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.hex }), {}),
            inStock: p.is_active && p.sizes.some(s => s.stock > 0),
            stockCount: p.sizes.reduce((total, s) => total + s.stock, 0),
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality',
              'Official Alumni Merchandise',
              'Durable and Comfortable',
              'Easy Care Fabric'
            ],
            specifications: p.specifications || {
              material: 'Premium Cotton/Fleece',
              origin: 'Made in India',
              fit: 'Standard Fit'
            },
            images: p.images.length > 0 ? p.images : ['https://via.placeholder.com/600x800?text=No+Image']
          };
          setProduct(mappedProduct);
          if (mappedProduct.sizes.length > 0) setSelectedSize(mappedProduct.sizes[0]);
          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);

          // Fetch related products
          if (mappedProduct.categorySlug) {
            const relResponse = await fetch(`http://localhost:5000/api/products?category=${mappedProduct.categorySlug}&limit=4`);
            const relResult = await relResponse.json();
            if (relResult.success) {
              const mappedRelated = relResult.data.products
                .filter(item => item.slug !== id)
                .map(item => ({
                  id: item.slug,
                  dbId: item._id, // Add dbId for wishlist backend sync
                  name: item.name,
                  description: item.description,
                  price: item.sale_price || item.price,
                  originalPrice: item.sale_price ? item.price : null,
                  image: item.images[0],
                  badge: item.sale_price ? 'Sale' : '',
                  reviews: item.review_count || 0,
                  rating: item.rating || 0
                }));
              setRelatedProducts(mappedRelated);
            }
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
          const response = await fetch(`http://localhost:5000/api/reviews/${product.dbId}`);
          const result = await response.json();
          if (result.success) {
            setReviews(result.data);
          }
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
      };
      fetchReviews();
    }
  }, [product?.dbId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!reviewFormData.comment.trim()) {
      error('Please enter a comment');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch(`http://localhost:5000/api/reviews/${product.dbId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewFormData)
      });
      const result = await response.json();

      if (result.success) {
        success('Review submitted successfully!');
        setReviews([result.data, ...reviews]);
        setReviewFormData({ rating: 5, comment: '' });
      } else {
        error(result.message || 'Failed to submit review');
      }
    } catch (err) {
      error('Error submitting review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      error('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    setTimeout(() => {
      const productToAdd = {
        ...product,
        selectedSize,
        selectedColor,
        quantity
      };
      addToCart(productToAdd);
      success(`${product.name} added to cart!`);
      setIsAddingToCart(false);
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      error(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      success(`${product.name} added to wishlist!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      error('Please select a size');
      return;
    }
    
    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    addToCart(productToAdd);
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: 'var(--amazon-orange)' }}></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt" style={{ color: 'var(--amazon-orange)' }}></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star" style={{ color: '#ddd' }}></i>);
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-images-section">
              <SkeletonLoader type="product" count={1} />
            </div>
            <div className="product-info-section">
              <SkeletonLoader type="product" count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-not-found">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <button className="btn-primary" onClick={() => navigate('/tshirts')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb animate-fadeIn">
          <a href="/">Home</a>
          <span className="separator">/</span>
          <a href="/tshirts">T-Shirts</a>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Product Images */}
          <div className="product-images-section animate-slideInLeft">
            <div className="main-image-container">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${product.id || product.dbId}/600/600`;
                }}
              />
              {product.badge && (
                <div className="product-badge-detail">{product.badge}</div>
              )}
            </div>
            
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/${product.id || product.dbId || index}/100/100`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Product Information */}
          <div className="product-info-section animate-slideInRight">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating-section">
                <div className="rating-stars">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-text">{product.rating}</span>
                <span className="reviews-count">({product.reviews} reviews)</span>
              </div>

              <div className="price-section">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">₹{product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="discount-badge">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="stock-status">
                {product.inStock ? (
                  <span className="in-stock">
                    <i className="fas fa-check-circle"></i> In Stock ({product.stockCount} available)
                  </span>
                ) : (
                  <span className="out-of-stock">
                    <i className="fas fa-times-circle"></i> Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            <div className="product-options">
              <div className="size-selection">
                <h3>Size</h3>
                <div className="size-options-detail">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-selection">
                <h3>Color</h3>
                <div className="color-options-detail">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: product.colorMap?.[color] || getColorHex(color) }}
                      title={color}
                    >
                      {selectedColor === color && <i className="fas fa-check"></i>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quantity-selection">
                <h3>Quantity</h3>
                <div className="quantity-controls-detail">
                  <button 
                    className="qty-btn"
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
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </>
                )}
              </button>
              
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
              
              <button 
                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <i className="fas fa-truck"></i>
                <span>Free Delivery</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-undo"></i>
                <span>30-Day Returns</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Payment</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-award"></i>
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-details-tabs animate-fadeIn">
          <div className="tab-navigation">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' && 'Description'}
                {tab === 'specifications' && 'Specifications'}
                {tab === 'reviews' && 'Reviews'}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p>{product.description}</p>
                <div className="product-highlights">
                  <h3>Product Highlights</h3>
                  <ul>
                    <li>Premium quality material for maximum comfort</li>
                    <li>Stylish design perfect for everyday wear</li>
                    <li>Durable construction that lasts wash after wash</li>
                    <li>Perfect fit for all body types</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="specifications-content">
                <h3>Product Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <h3>Customer Reviews</h3>
                <div className="reviews-summary">
                  <div className="overall-rating">
                    <span className="rating-number">{product.rating}</span>
                    <div className="rating-stars-large">
                      {renderStars(product.rating)}
                    </div>
                    <span className="total-reviews">{product.reviews} Reviews</span>
                  </div>
                </div>
                
                <div className="review-filters">
                  <button className="filter-btn active">All Reviews</button>
                  <button className="filter-btn">5 Stars</button>
                  <button className="filter-btn">4 Stars</button>
                  <button className="filter-btn">3 Stars</button>
                  <button className="filter-btn">2 Stars</button>
                  <button className="filter-btn">1 Star</button>
                </div>

                <div className="reviews-list">
                  {/* Add Review Form */}
                  <div className="add-review-section">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="review-form">
                      <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i 
                            key={s} 
                            className={`${reviewFormData.rating >= s ? 'fas' : 'far'} fa-star`}
                            onClick={() => setReviewFormData({ ...reviewFormData, rating: s })}
                          ></i>
                        ))}
                      </div>
                      <textarea
                        placeholder="Share your experience with this product..."
                        value={reviewFormData.comment}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                        required
                      ></textarea>
                      <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.user_id?.name || 'Anonymous User'}</span>
                            <div className="review-rating">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="review-date">
                            {new Date(review.created_at || review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="review-content">
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products-section animate-slideInUp">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct, index) => (
              <div 
                key={relatedProduct.id} 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color hex values
const getColorHex = (colorName) => {
  const colorMap = {
    'Black': '#000000',
    'White': '#ffffff',
    'Navy': '#000080',
    'Gray': '#808080',
    'Maroon': '#800000',
    'Forest Green': '#228B22',
    'Red': '#ff0000',
    'Blue': '#0000ff',
    'Green': '#008000',
    'Yellow': '#64748b',
    'Purple': '#800080',
    'Orange': '#ff6600',
    'Pink': '#ffc0cb',
    'Brown': '#964B00',
    'Cream': '#64748b'
  };
  return colorMap[colorName] || '#000000';
};

export default ProductDetailEnhanced;
