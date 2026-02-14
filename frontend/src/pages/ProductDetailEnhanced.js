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
        <i key={i} className={`${i < Math.floor(rating) ? 'fas' : 'far'} fa-star`} style={{ color: 'var(--amazon-orange)' }}></i>
      );
    }
    return stars;
  };

  if (isLoading) return <div className="container p-5 text-center"><SkeletonLoader type="product" count={1} /></div>;
  if (!product) return <div className="container p-5 text-center"><h2>Product Not Found</h2><button onClick={() => navigate('/')}>Back Home</button></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <a href="/">Home</a> / <a href="/tshirts">Products</a> / <span className="current">{product.name}</span>
        </nav>
        <div className="product-detail-layout">
          <div className="product-images-section">
            <div className="main-image-container">
              <img src={product.images[selectedImage]} alt={product.name} className="main-image" />
            </div>
            <div className="thumbnail-container">
              {product.images.map((img, idx) => (
                <div key={idx} className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} onClick={() => setSelectedImage(idx)}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
            </div>
            <div className="product-options">
              <div className="size-selection">
                <h3>Size</h3>
                <div className="size-options-detail">
                  {product.sizes.map(s => (
                    <button key={s} className={`size-option ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock || isAddingToCart}>Add to Cart</button>
              <button className="buy-now-btn" onClick={handleBuyNow} disabled={!product.inStock}>Buy Now</button>
              <button className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} onClick={handleWishlistToggle}>
                <i className="fas fa-heart"></i>
              </button>
            </div>
            <div className="product-description mt-4">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        
        <div className="reviews-section mt-5">
          <div className="tab-navigation">
            <button className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
          </div>
          <div className="tab-content">
            <div className="add-review-section mb-4">
              <h4>Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <textarea 
                  className="form-control mb-2" 
                  value={reviewFormData.comment} 
                  onChange={e => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  placeholder="Your review..."
                />
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="review-item border-bottom py-3">
                  <strong>{r.user_id?.name || 'User'}</strong> - {renderStars(r.rating)}
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;
