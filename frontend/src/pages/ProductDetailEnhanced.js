import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './ProductDetailEnhanced.css';

const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="%23f4f1eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23e63322">Brand Era</text></svg>`;
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
              'Premium print quality', 'Customizable for your brand', 'Durable, comfortable finish', 'Made to order in India'
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

  const handleQuantityChange = (delta) => {
    if (delta === 'decrease') {
      setQuantity(Math.max(1, quantity - 1));
    } else if (delta === 'increase') {
      setQuantity(Math.min(10, quantity + 1));
    } else {
      setQuantity(Math.max(1, Math.min(10, parseInt(delta) || 1)));
    }
  };

  const handleImageSelect = (idx) => {
    setSelectedImage(idx);
  };

  const handleAddToQuote = () => {
    success('Product added to quote!');
    navigate('/quote');
  };

  const handleBulkOrder = () => {
    success('Redirecting to bulk order form...');
    navigate('/bulk-order');
  };

  const handleCustomize = () => {
    success('Opening Print Studio...');
    navigate('/print-studio');
  };

  const handleSaveDesign = () => {
    success('Design saved to your collection!');
  };

  const handleAddToKit = () => {
    success('Product added to your kit!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from Brand Era`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
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

  const brandEraFeatures = [
    { icon: 'fa-check-circle', text: 'Best Quality' },
    { icon: 'fa-palette', text: 'Custom Design' },
    { icon: 'fa-tags', text: 'Bulk Pricing' },
    { icon: 'fa-shipping-fast', text: 'On-Time Delivery' }
  ];

  if (isLoading) return <div className="product-detail-page"><div className="container"><SkeletonLoader type="product" count={1} /></div></div>;
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-empty-state">
            <i className="fas fa-box-open"></i>
            <h2>Product Not Found</h2>
            <p>This item may be unavailable or has been removed.</p>
            <Link to="/alumni-kits" className="back-to-kits-btn">Explore brand solutions</Link>
          </div>
        </div>
      </div>
    );
  }

  const imageGallery = product.colorImages?.[selectedColor] || product.images;

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

        {/* Main Content - Two Column Layout */}
        <div className="product-detail-layout">
          {/* LEFT COLUMN: Product Gallery */}
          <div className="product-images-section">
            <div className="main-image-wrapper">
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
              <div className="main-image-container">
                <img 
                  src={imageGallery[selectedImage]} 
                  alt={product.name} 
                  className="main-image" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              </div>

              {imageGallery.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => handleImageSelect(0)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: selectedImage === 0 ? '2px solid #dc2626' : '2px solid var(--border-color)',
                      background: selectedImage === 0 ? '#fef2f2' : 'var(--bg-primary)',
                      color: selectedImage === 0 ? '#dc2626' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className="fas fa-tshirt" style={{ marginRight: '6px' }}></i>Front
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleImageSelect(Math.min(1, imageGallery.length - 1))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: selectedImage !== 0 ? '2px solid #dc2626' : '2px solid var(--border-color)',
                      background: selectedImage !== 0 ? '#fef2f2' : 'var(--bg-primary)',
                      color: selectedImage !== 0 ? '#dc2626' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className="fas fa-tshirt" style={{ marginRight: '6px', transform: 'scaleX(-1)', display: 'inline-block' }}></i>Back
                  </button>
                </div>
              )}
            </div>
            <div className="thumbnail-container">
              {imageGallery.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} 
                  onClick={() => handleImageSelect(idx)}
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

          {/* RIGHT COLUMN: Product Details */}
          <div className="product-info-section">
            <div className="product-header-info">
              <h1 className="product-title">{product.name}</h1>
              
              {/* SKU */}
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>
                  SKU: <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{selectedFabric?.sku || product.dbId?.slice(-8)?.toUpperCase()}</span>
                </span>
              </div>

              {/* Rating Stars with Count */}
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-text">{product.rating.toFixed(1)}</span>
                <span className="reviews-link">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <span className="current-price" style={{ color: '#dc2626' }}>₹{getFabricPrice(selectedFabric) ?? product.price}</span>
              {(selectedFabric?.salePrice !== undefined || (!selectedFabric && product.originalPrice)) && (
                <>
                  <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '12px', fontSize: '1.2rem' }}>₹{selectedFabric?.price ?? product.originalPrice}</span>
                  <span className="discount-badge" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', marginLeft: '12px', fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {Math.round((1 - (getFabricPrice(selectedFabric) ?? product.price) / (selectedFabric?.price ?? product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              <span className={`stock-indicator ${product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'in-stock' : 'out-of-stock'}`}>
                <i className={`fas ${product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                {product.inStock && (selectedFabric?.stock === undefined || selectedFabric.stock > 0) ? 'In Stock' : 'Out of Stock'}
              </span>
              {selectedFabric?.stock !== undefined && <span className="fabric-meta">{selectedFabric.stock} available</span>}
            </div>

            {/* Brand Era Key Features - Icon Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px', marginTop: '8px' }}>
              {brandEraFeatures.map((f, idx) => (
                <div key={idx} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  <span style={{ color: '#16a34a', fontSize: '14px' }}>✅</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Product Options */}
            <div className="product-options">
              {/* Color Selection - Swatches with Name Label */}
              {product.colors.length > 0 && (
                <div className="color-selection">
                  <h3 className="option-title">Select Color: <span style={{ color: 'var(--text-secondary)', textTransform: 'none', fontWeight: 500, letterSpacing: '0' }}>{selectedColor}</span></h3>
                  <div className="color-options-grid">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(0);
                        }}
                        style={{ 
                          backgroundColor: product.colorMap[color] || '#000',
                          border: selectedColor === color ? '3px solid #dc2626' : '3px solid var(--border-color)',
                          boxShadow: selectedColor === color ? '0 0 0 2px var(--bg-primary), 0 0 0 4px rgba(220, 38, 38, 0.2)' : 'none'
                        }}
                        title={color}
                      >
                        {selectedColor === color && <i className="fas fa-check"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection - with Stock Availability */}
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
                          title={isOutOfStock ? `${size} (Out of Stock)` : `${size} - ${stock} in stock`}
                          style={{ position: 'relative', paddingBottom: selectedSize === size ? '0' : undefined }}
                        >
                          <span style={{ display: 'block' }}>{size}</span>
                          {!isOutOfStock && product.sizeStocks && (
                            <span style={{ 
                              display: 'block', 
                              fontSize: '10px', 
                              fontWeight: 500, 
                              marginTop: '2px',
                              opacity: 0.7,
                              textTransform: 'none',
                              letterSpacing: '0'
                            }}>
                              {stock} left
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fabric/Material Selection - Variant Cards with Price */}
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

              {/* Quantity Selector */}
              <div className="quantity-selection">
                <h3 className="option-title">Quantity</h3>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn decrease"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="qty-input" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min="1" 
                    max="10" 
                  />
                  <button 
                    className="qty-btn increase"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= 10}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Action Buttons - Full Width Row */}
            <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={handleCustomize}
                  style={{
                    flex: 1,
                    height: '56px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    border: '2px solid #dc2626',
                    background: '#dc2626',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                  <i className="fas fa-paint-brush"></i>
                  Customize Now
                </button>
                <button 
                  className="add-to-cart-btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart || (product.fabricVariants.length > 0 && !selectedFabric) || (selectedFabric?.stock !== undefined && selectedFabric.stock <= 0)}
                  style={{
                    flex: 1,
                    height: '56px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: !product.inStock || isAddingToCart ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    border: '2px solid #111827',
                    background: '#111827',
                    color: '#ffffff',
                    opacity: !product.inStock || isAddingToCart ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isAddingToCart ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-shopping-bag"></i>}
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {/* Wishlist in quick actions row */}
            </div>

            {/* Quick Action Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px', 
              marginBottom: '32px',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)'
            }}>
              <button 
                type="button"
                onClick={handleSaveDesign}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <i className="fas fa-save" style={{ fontSize: '16px' }}></i>
                Save Design
              </button>
              <button 
                type="button"
                onClick={handleAddToKit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <i className="fas fa-boxes" style={{ fontSize: '16px' }}></i>
                Add to Kit
              </button>
              <button 
                type="button"
                onClick={handleAddToQuote}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <i className="fas fa-file-invoice-dollar" style={{ fontSize: '16px' }}></i>
                Get Quote
              </button>
              <button 
                type="button"
                onClick={handleShare}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <i className="fas fa-share-alt" style={{ fontSize: '16px' }}></i>
                Share
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
              style={activeTab === 'description' ? { borderBottomColor: '#dc2626', color: '#dc2626' } : {}}
            >
              Description
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
              style={activeTab === 'specifications' ? { borderBottomColor: '#dc2626', color: '#dc2626' } : {}}
            >
              Specifications
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={activeTab === 'reviews' ? { borderBottomColor: '#dc2626', color: '#dc2626' } : {}}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <div style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>Why Choose BRAND ERA</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {[
                      { icon: 'fa-leaf', title: 'Premium Materials', desc: 'Sourced from top mills worldwide' },
                      { icon: 'fa-user-tie', title: 'Expert Craftsmanship', desc: 'Attention to detail in every stitch' },
                      { icon: 'fa-recycle', title: 'Eco Friendly', desc: 'Sustainable production practices' },
                      { icon: 'fa-award', title: 'Quality Assured', desc: '6-point QC on every product' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: '#fef2f2', 
                          color: '#dc2626', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div>
                          <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>{item.title}</h5>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <h3>Specifications</h3>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <tr key={key} style={{ borderBottom: idx < Object.keys(product.specifications).length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                          <td style={{ 
                            padding: '16px 20px', 
                            fontWeight: 700, 
                            color: 'var(--text-secondary)', 
                            width: '35%',
                            fontSize: '14px',
                            textTransform: 'capitalize',
                            background: 'var(--bg-primary)'
                          }}>
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td style={{ 
                            padding: '16px 20px', 
                            fontWeight: 500, 
                            color: 'var(--text-primary)',
                            fontSize: '14px'
                          }}>
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
