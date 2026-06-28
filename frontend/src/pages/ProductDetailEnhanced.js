import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './ProductDetailEnhanced.css';

const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%2394a3b8">Navodaya Trendz</text></svg>`;

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
        const result = await api.get(`/products/id/${id}`);
        
        if (result.success) {
          const p = result.data;
          
          // Get all sizes from database, even if stock is 0
          let productSizes = [];
          if (p.sizes && p.sizes.length > 0) {
            productSizes = p.sizes.map(s => s.size);
          } else {
            productSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
          }
          
          const mappedProduct = {
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: null,
            image: resolveImageUrl(p.images[0] || 'https://via.placeholder.com/600x800?text=No+Image'),
            badge: p.rating > 4.5 ? 'Bestseller' : '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category_id?.name || 'T-Shirts',
            categorySlug: p.category_id?.slug,
            sizes: productSizes,
            sizeStocks: p.sizes && p.sizes.length > 0 ? p.sizes.reduce((acc, s) => ({ ...acc, [s.size]: s.stock }), {}) : {},
            colors: p.colors.map(c => c.name),
            colorMap: p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.hex }), {}),
            inStock: p.is_active && p.sizes.some(s => s.stock > 0),
            stockCount: p.sizes.reduce((total, s) => total + s.stock, 0),
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality', 'Official Alumni Merchandise', 'Durable and Comfortable', 'Easy Care Fabric'
            ],
            specifications: p.specifications || { material: 'Premium Cotton/Fleece', origin: 'Made in India', fit: 'Standard Fit' },
            images: p.images.length > 0 ? p.images.map(img => resolveImageUrl(img)) : [resolveImageUrl('https://via.placeholder.com/600x800?text=No+Image')]
          };
          setProduct(mappedProduct);
          
          // Select first available (in stock) size, or fallback to first option
          const firstInStockSize = productSizes.find(size => {
            const stock = p.sizes?.find(s => s.size === size)?.stock;
            return stock !== undefined ? stock > 0 : true;
          });
          if (firstInStockSize) {
            setSelectedSize(firstInStockSize);
          } else if (mappedProduct.sizes.length > 0) {
            setSelectedSize(mappedProduct.sizes[0]);
          }

          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);

          if (mappedProduct.categorySlug) {
            const relResult = await api.get(`/products?category=${mappedProduct.categorySlug}&limit=4`);
            if (relResult.success) {
              const mappedRelated = relResult.data.products
                .filter(item => item._id !== id)
                .map(item => ({
                  id: item.slug,
                  dbId: item._id,
                  name: item.name,
                  price: item.sale_price || item.price,
                  image: resolveImageUrl(item.images[0]),
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
      const result = await api.post(`/reviews/${product.dbId}`, reviewFormData);
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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      error('Please select a size');
      return;
    }
    setIsAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await addToCart({ ...product, selectedSize, selectedColor, quantity });
      success(`${product.name} added to cart!`);
    } catch (err) {
      error(err.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
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

  const handleBuyNow = async () => {
    if (!selectedSize) {
      error('Please select a size');
      return;
    }
    try {
      await addToCart({ ...product, selectedSize, selectedColor, quantity });
      navigate('/cart');
    } catch (err) {
      error(err.message || 'Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i key={i} className={`${i < Math.floor(rating) ? 'fas' : 'far'} fa-star`} style={{ color: 'var(--text-primary)' }}></i>
      );
    }
    return stars;
  };

  if (isLoading) return <div className="product-detail-page"><div className="container"><SkeletonLoader type="product" count={1} /></div></div>;
  if (!product) return <div className="product-detail-page"><div className="container"><h2>Product Not Found</h2><Link to="/" className="btn btn-primary mt-3">Back Home</Link></div></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to={`/products?category=${product.categorySlug || 'all'}`}>{product.category}</Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="product-detail-layout">
          {/* Image Gallery */}
          <div className="product-images-section">
            <div className="main-image-wrapper">
              <div className="main-image-container">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="main-image" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              </div>

            </div>
            <div className="thumbnail-container">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} 
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`Product view ${idx + 1}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header-info">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-text">{product.rating.toFixed(1)}</span>
                <span className="reviews-link">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
            </div>

            <div className="stock-status">
              <span className={`stock-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                <i className={`fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="product-options">
              {/* Size Selection */}
              <div className="size-selection">
                <div className="option-header">
                  <h3 className="option-title">Select Size</h3>
                  <button className="size-guide-btn">Size Guide</button>
                </div>
                <div className="size-options-grid">
                  {product.sizes.map(size => {
                    const stock = product.sizeStocks?.[size] !== undefined ? product.sizeStocks[size] : 10;
                    const isOutOfStock = stock <= 0;
                    return (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        title={isOutOfStock ? `${size} (Out of Stock)` : ''}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="color-selection">
                  <h3 className="option-title">Select Color</h3>
                  <div className="color-options-grid">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: product.colorMap[color] || '#000' }}
                        title={color}
                      >
                        {selectedColor === color && <i className="fas fa-check"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="quantity-selection">
                <h3 className="option-title">Quantity</h3>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn decrease"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="qty-input" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1" 
                    max="10" 
                  />
                  <button 
                    className="qty-btn increase"
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
                <i className="fas fa-shopping-bag"></i>
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
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
                title="Add to Wishlist"
              >
                <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              {product.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <i className="fas fa-check"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs-section">
          <div className="tab-navigation">
            <button 
              className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <div className="add-review-section">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <textarea 
                      className="review-textarea" 
                      value={reviewFormData.comment} 
                      onChange={e => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                      placeholder="Share your thoughts about this product..."
                      rows="4"
                    />
                    <button type="submit" className="submit-review-btn" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                  ) : (
                    reviews.map(r => (
                      <div key={r._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <strong>{r.user_id?.name || 'User'}</strong>
                            <span className="review-date">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div className="review-rating">
                            {renderStars(r.rating)}
                          </div>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((prod, idx) => (
                <ProductCard key={idx} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;
