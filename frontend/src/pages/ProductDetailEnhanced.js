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
const objectIdPattern = /^[a-f\d]{24}$/i;
const getFabricPrice = (fabric) => fabric ? (fabric.salePrice ?? fabric.price) : null;

const getCategoryLink = (slug) => {
  const categoryLinks = {
    'alumni-kit': '/alumni-kits',
    tshirts: '/tshirts',
    hoodies: '/hoodies',
    accessories: '/accessories'
  };
  return categoryLinks[slug] || '/';
};

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
  const [selectedFabric, setSelectedFabric] = useState(null);
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
        const endpoint = objectIdPattern.test(id) ? `/products/id/${id}` : `/products/${id}`;
        const result = await api.get(endpoint);
        
        if (result.success) {
          const p = result.data;
          
          // Show only sizes that are actually configured in the backend.
          const backendSizes = Array.isArray(p.sizes) ? p.sizes.filter(s => s?.size) : [];
          const productSizes = backendSizes.map(s => s.size);
          const hasSizeVariants = backendSizes.length > 0;
          const stockCount = backendSizes.reduce((total, s) => total + (Number(s.stock) || 0), 0);
          
          const mappedProduct = {
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: resolveImageUrl(p.images[0] || 'https://via.placeholder.com/600x800?text=No+Image'),
            badge: p.rating > 4.5 ? 'Bestseller' : '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category_id?.name || 'T-Shirts',
            categorySlug: p.category_id?.slug,
            sizes: productSizes,
            sizeStocks: backendSizes.reduce((acc, s) => ({ ...acc, [s.size]: s.stock }), {}),
            colors: Array.isArray(p.colors) ? p.colors.map(c => c.name) : [],
            colorMap: Array.isArray(p.colors) ? p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.hex }), {}) : {},
            colorImages: Array.isArray(p.colors) ? p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.images?.length > 0 ? c.images.map(img => resolveImageUrl(img)) : null }), {}) : {},
            fabricVariants: Array.isArray(p.fabric_variants) ? p.fabric_variants.filter(v => v.is_active).map(v => ({ ...v, salePrice: v.sale_price })) : [],
            inStock: p.is_active && (!hasSizeVariants || stockCount > 0),
            stockCount: hasSizeVariants ? stockCount : null,
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality', 'Official Alumni Merchandise', 'Durable and Comfortable', 'Easy Care Fabric'
            ],
            specifications: p.specifications || { material: 'Premium Cotton/Fleece', origin: 'Made in India', fit: 'Standard Fit' },
            images: p.images.length > 0 ? p.images.map(img => resolveImageUrl(img)) : [resolveImageUrl('https://via.placeholder.com/600x800?text=No+Image')]
          };
          setProduct(mappedProduct);
          setSelectedFabric(mappedProduct.fabricVariants.find(v => v.name?.toLowerCase() === 'cotton') || mappedProduct.fabricVariants[0] || null);
          
          // Select first available (in stock) size, or fallback to first option
          const firstInStockSize = productSizes.find(size => {
            const stock = backendSizes.find(s => s.size === size)?.stock;
            return stock !== undefined ? stock > 0 : true;
          });
          if (firstInStockSize) {
            setSelectedSize(firstInStockSize);
          } else if (mappedProduct.sizes.length > 0) {
            setSelectedSize(mappedProduct.sizes[0]);
          } else {
            setSelectedSize('');
          }

          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);

          if (mappedProduct.categorySlug) {
            const relResult = await api.get(`/products?category=${mappedProduct.categorySlug}&limit=4`);
            if (relResult.success) {
              const mappedRelated = relResult.data.products
                .filter(item => item._id !== mappedProduct.dbId)
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
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
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
    if (product.sizes.length > 0 && !selectedSize) {
      error('Please select a size');
      return;
    }
    if (product.fabricVariants.length > 0 && !selectedFabric) {
      error('Please select a fabric quality');
      return;
    }
    setIsAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await addToCart({ ...product, price: getFabricPrice(selectedFabric) ?? product.price, originalPrice: selectedFabric?.salePrice !== undefined ? selectedFabric.price : product.originalPrice, selectedSize, selectedColor, selectedFabric, quantity });
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
      addToWishlist({ ...product, price: getFabricPrice(selectedFabric) ?? product.price, originalPrice: selectedFabric?.salePrice !== undefined ? selectedFabric.price : product.originalPrice, selectedFabric });
      success(`${product.name} added to wishlist!`);
    }
  };

  const handleBuyNow = async () => {
    if (product.sizes.length > 0 && !selectedSize) {
      error('Please select a size');
      return;
    }
    if (product.fabricVariants.length > 0 && !selectedFabric) {
      error('Please select a fabric quality');
      return;
    }
    try {
      await addToCart({ ...product, price: getFabricPrice(selectedFabric) ?? product.price, originalPrice: selectedFabric?.salePrice !== undefined ? selectedFabric.price : product.originalPrice, selectedSize, selectedColor, selectedFabric, quantity });
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
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-empty-state">
            <i className="fas fa-box-open"></i>
            <h2>Product Not Found</h2>
            <p>This item may be unavailable or has been removed.</p>
            <Link to="/alumni-kits" className="back-to-kits-btn">Back to Alumni Kits</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to={getCategoryLink(product.categorySlug)}>{product.category}</Link>
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
                  src={(product.colorImages?.[selectedColor] || product.images)[selectedImage]} 
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
              {(product.colorImages?.[selectedColor] || product.images).map((img, idx) => (
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
              <span className="current-price">₹{getFabricPrice(selectedFabric) ?? product.price}</span>
              {(selectedFabric?.salePrice !== undefined || (!selectedFabric && product.originalPrice)) && (
                <>
                  <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '12px', fontSize: '1.2rem' }}>₹{selectedFabric?.price ?? product.originalPrice}</span>
                  <span className="discount-badge" style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', marginLeft: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                    {Math.round((1 - (getFabricPrice(selectedFabric) ?? product.price) / (selectedFabric?.price ?? product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="stock-status">
              <span className={`stock-indicator ${product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'in-stock' : 'out-of-stock'}`}>
                <i className={`fas ${product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'In Stock' : 'Out of Stock'}
              </span>
              {selectedFabric?.stock !== undefined && <span className="fabric-meta">{selectedFabric.stock} available</span>}
              {selectedFabric?.sku && <span className="fabric-meta">SKU: {selectedFabric.sku}</span>}
            </div>

            <div className="product-options">
              {product.fabricVariants.length > 0 && (
                <div className="fabric-quality-selection">
                  <h3 className="option-title">Fabric Quality</h3>
                  <div className="fabric-quality-grid" role="radiogroup" aria-label="Fabric Quality">
                    {product.fabricVariants.map(variant => {
                      const unavailable = variant.stock !== undefined && variant.stock <= 0;
                      return (
                        <button type="button" role="radio" aria-checked={selectedFabric?._id === variant._id}
                          key={variant._id} disabled={unavailable}
                          className={`fabric-quality-option ${selectedFabric?._id === variant._id ? 'active' : ''}`}
                          onClick={() => setSelectedFabric(variant)}>
                          <span>{variant.name}</span><strong>₹{variant.salePrice ?? variant.price}</strong>
                          {variant.salePrice !== undefined && <small><s>₹{variant.price}</s> · {Math.round((1 - variant.salePrice / variant.price) * 100)}% off</small>}
                          {unavailable && <small>Out of stock</small>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="size-selection">
                  <div className="option-header">
                    <h3 className="option-title">Select Size</h3>
                    <button className="size-guide-btn">Size Guide</button>
                  </div>
                  <div className="size-options-grid">
                    {product.sizes.map(size => {
                      const stock = product.sizeStocks?.[size] !== undefined ? product.sizeStocks[size] : 0;
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
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="color-selection">
                  <h3 className="option-title">Select Color</h3>
                  <div className="color-options-grid">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(0);
                        }}
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
                disabled={!product.inStock || isAddingToCart || (product.fabricVariants.length > 0 && !selectedFabric) || (selectedFabric?.stock !== undefined && selectedFabric.stock <= 0)}
              >
                <i className="fas fa-shopping-bag"></i>
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock || (product.fabricVariants.length > 0 && !selectedFabric) || (selectedFabric?.stock !== undefined && selectedFabric.stock <= 0)}
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
