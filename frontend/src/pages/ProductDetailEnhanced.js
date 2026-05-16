import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
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

  const fixedSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

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
            sizes: fixedSizes,
            colors: p.colors.map(c => c.name),
            colorMap: p.colors.reduce((acc, c) => ({ ...acc, [c.name]: c.hex }), {}),
            inStock: p.is_active,
            stockCount: 100,
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality', 'Official Alumni Merchandise', 'Durable and Comfortable', 'Easy Care Fabric'
            ],
            specifications: p.specifications || { material: 'Premium Cotton/Fleece', origin: 'Made in India', fit: 'Standard Fit' },
            images: p.images.length > 0 ? p.images : ['https://via.placeholder.com/600x800?text=No+Image']
          };
          setProduct(mappedProduct);
          setSelectedSize('M');
          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);

          if (mappedProduct.categorySlug) {
            const relResult = await api.get(`/products?category=${mappedProduct.categorySlug}&limit=4`);
            if (relResult.success) {
              const mappedRelated = relResult.data.products
                .filter(item => item.slug !== id)
                .map(item => ({
                  id: item.slug,
                  dbId: item._id,
                  name: item.name,
                  price: item.sale_price || item.price,
                  image: item.images[0],
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      error('Please select a size');
      return;
    }
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart({ ...product, selectedSize, selectedColor, quantity });
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
    addToCart({ ...product, selectedSize, selectedColor, quantity });
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i key={i} className={`${i < Math.floor(rating) ? 'fas' : 'far'} fa-star`} style={{ color: '#f59e0b' }}></i>
      );
    }
    return stars;
  };

  if (isLoading) return <div className="container p-5 text-center"><SkeletonLoader type="product" count={1} /></div>;
  if (!product) return <div className="container p-5 text-center"><h2>Product Not Found</h2><button onClick={() => navigate('/')}>Back Home</button></div>;

  return (
    <div className="product-detail-page" style={{ paddingTop: '40px', paddingBottom: '60px', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <nav style={{ marginBottom: '24px', color: '#64748b', fontSize: '14px' }}>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</a> &gt; 
          <span style={{ marginLeft: '8px', color: '#64748b' }}> {product.name}</span>
        </nav>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div>
            <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={product.images[selectedImage]} alt={product.name} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #2563eb' : '2px solid #e2e8f0',
                    flexShrink: 0
                  }} 
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {renderStars(product.rating)}
                <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '14px' }}>({product.reviews} reviews)</span>
              </div>
              {product.originalPrice && (
                <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>₹{product.price}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '20px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
              )}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Select Size</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    style={{ 
                      padding: '12px 20px', 
                      border: selectedSize === s ? '2px solid #2563eb' : '2px solid #e2e8f0', 
                      borderRadius: '8px', 
                      background: selectedSize === s ? '#eff6ff' : 'white',
                      color: selectedSize === s ? '#2563eb' : '#0f172a',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }} 
                    onClick={() => setSelectedSize(s)}
                    onMouseOver={(e) => {
                      if (selectedSize !== s) {
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedSize !== s) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {product.colors.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Select Color</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map(c => (
                    <button 
                      key={c} 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        border: selectedColor === c ? '3px solid #2563eb' : '2px solid #e2e8f0', 
                        background: product.colorMap[c] || '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }} 
                      onClick={() => setSelectedColor(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Quantity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  style={{ width: '40px', height: '40px', borderRadius: '8px', border: '2px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  style={{ width: '40px', height: '40px', borderRadius: '8px', border: '2px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <button 
                style={{ 
                  flex: 1, 
                  padding: '16px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  background: '#2563eb',
                  color: 'white',
                  transition: 'all 0.2s'
                }} 
                onClick={handleAddToCart} 
                disabled={!product.inStock || isAddingToCart}
                onMouseOver={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#1d4ed8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#2563eb';
                  }
                }}
              >
                {isAddingToCart ? (
                  <><i className="fas fa-spinner fa-spin"></i> Adding...</>
                ) : (
                  <><i className="fas fa-cart-plus"></i> Add to Cart</>
                )}
              </button>
              <button 
                style={{ 
                  flex: 1, 
                  padding: '16px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  background: '#0f172a',
                  color: 'white',
                  transition: 'all 0.2s'
                }} 
                onClick={handleBuyNow} 
                disabled={!product.inStock}
                onMouseOver={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#1e293b';
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#0f172a';
                  }
                }}
              >
                <i className="fas fa-bolt"></i> Buy Now
              </button>
              <button 
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '10px', 
                  border: isInWishlist(product.id) ? '2px solid #dc2626' : '2px solid #e2e8f0', 
                  background: isInWishlist(product.id) ? '#fef2f2' : 'white', 
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: isInWishlist(product.id) ? '#dc2626' : '#64748b',
                  transition: 'all 0.2s'
                }} 
                onClick={handleWishlistToggle}
              >
                <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Description</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {product.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {relatedProducts.map((p) => (
                <div key={p.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', cursor: 'pointer' }} onClick={() => navigate(`/product/${p.id}`)}>
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>{p.name}</h3>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;
