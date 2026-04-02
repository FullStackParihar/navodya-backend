import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductDetailAmazon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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
            images: p.images.length > 0 ? p.images : ['https://via.placeholder.com/600x800?text=No+Image'],
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category_id?.name || 'T-Shirts',
            sizes: ['S', 'M', 'L', 'XL', '2XL'], // Standard sizes for all products
            colors: ['red', 'yellow', 'blue', 'green', 'black'], // Standard colors for all products
            inStock: p.is_active && p.sizes.some(s => s.stock > 0),
            stockCount: p.sizes.reduce((total, s) => total + s.stock, 0),
            features: p.features && p.features.length > 0 ? p.features : [
              '100% Premium Quality Cotton',
              'Official JNV Alumni Merchandise', 
              'Machine Washable',
              'Comfortable Fit',
              'Durable Print',
              'Breathable Fabric'
            ],
            specifications: {
              material: '100% Cotton',
              origin: 'Made in India',
              fit: 'Regular Fit',
              care: 'Machine Wash',
              sleeve: 'Short Sleeve',
              neck: 'Round Neck',
              ...p.specifications
            }
          };
          setProduct(mappedProduct);
          setSelectedSize('M'); // Default to Medium
          setSelectedColor('blue'); // Default to blue
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
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

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      error('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity
      });
      success(`${product.name} added to cart!`);
    } catch (err) {
      error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      success('Removed from wishlist');
    } else {
      addToWishlist(product);
      success('Added to wishlist');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star" style={{ color: '#ff9900' }}></i>);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: '#ff9900' }}></i>);
      } else {
        stars.push(<i key={i} className="far fa-star" style={{ color: '#ff9900' }}></i>);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ff9900', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#ff9900', color: 'white', border: 'none', borderRadius: '4px' }}>
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Amazon Ember, Arial, sans-serif', backgroundColor: '#e3e6e6' }}>
      {/* Amazon-style Header */}
      <div style={{ backgroundColor: '#131921', color: 'white', padding: '8px 0' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
            ← Back to results
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Left Column - Images */}
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              style={{ width: '100%', height: '500px', objectFit: 'contain', backgroundColor: 'white' }}
            />
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto' }}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      border: selectedImage === idx ? '2px solid #ff9900' : '1px solid #ddd',
                      cursor: 'pointer',
                      borderRadius: '2px'
                    }}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sponsored Products */}
          <div style={{ backgroundColor: 'white', padding: '16px', marginTop: '20px', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#565959', marginBottom: '8px' }}>Sponsored products related to this item</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
                  <div style={{ width: '100%', height: '80px', backgroundColor: '#f0f0f0', borderRadius: '2px', marginBottom: '4px' }}></div>
                  <div style={{ fontSize: '11px', color: '#007185' }}>Similar Product {i}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#B12704' }}>₹{Math.floor(Math.random() * 1000 + 500)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          {/* Product Title and Rating */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '400', lineHeight: '1.3', color: '#0F1111', marginBottom: '12px' }}>
              {product.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div>{renderStars(product.rating)}</div>
              <span style={{ color: '#007185', textDecoration: 'underline', fontSize: '14px', cursor: 'pointer' }}>
                {product.rating} {product.reviews === 1 ? 'rating' : 'ratings'}
              </span>
              <span style={{ color: '#565959', fontSize: '14px' }}>
                | {product.reviews} {product.reviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div style={{ color: '#565959', fontSize: '16px', marginTop: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Brand:</span> JNV Alumni
            </div>
          </div>

          {/* Pricing */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', color: '#B12704', fontWeight: 'bold' }}>₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: '16px', color: '#565959', textDecoration: 'line-through' }}>
                    M.R.P.: ₹{product.originalPrice}
                  </span>
                  <span style={{ fontSize: '16px', color: '#B12704' }}>
                    ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                  </span>
                </>
              )}
            </div>
            
            <div style={{ color: '#565959', fontSize: '14px', marginBottom: '8px' }}>
              Inclusive of all taxes
            </div>
            
            <div style={{ color: '#007185', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>
              FREE delivery {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: product.inStock ? '#007600' : '#B12704',
                borderRadius: '50%'
              }}></div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: product.inStock ? '#007600' : '#B12704'
              }}>
                {product.inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
            
            {product.inStock && (
              <div style={{ color: '#565959', fontSize: '14px' }}>
                {product.stockCount} available
              </div>
            )}
          </div>

          {/* Options */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#0F1111' }}>
                  Size: <span style={{ color: '#B12704' }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
                        border: `1px solid ${selectedSize === size ? '#B12704' : '#D5D9D9'}`,
                        backgroundColor: selectedSize === size ? '#F7F8F8' : 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: selectedSize === size ? 'bold' : 'normal'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#0F1111' }}>
                  Color: <span style={{ color: '#B12704' }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.colors.map(color => {
                    const colorMap = {
                      'red': '#DC2626',
                      'yellow': '#EAB308',
                      'blue': '#2563EB',
                      'green': '#16A34A',
                      'black': '#000000'
                    };
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: `2px solid ${selectedColor === color ? '#B12704' : '#D5D9D9'}`,
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: selectedColor === color ? 'bold' : 'normal'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: colorMap[color],
                          border: '1px solid #ddd',
                          borderRadius: '2px'
                        }}></div>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#0F1111' }}>
                Quantity:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #D5D9D9', borderRadius: '4px', width: '120px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 12px', border: 'none', background: '#F7F8F8', cursor: 'pointer', fontSize: '16px' }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                  style={{ border: 'none', textAlign: 'center', width: '40px', padding: '8px', fontSize: '14px' }}
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  style={{ padding: '8px 12px', border: 'none', background: '#F7F8F8', cursor: 'pointer', fontSize: '16px' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                style={{
                  padding: '12px 20px',
                  backgroundColor: isAddingToCart || !product.inStock ? '#D5D9D9' : '#FFD814',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isAddingToCart || !product.inStock ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  width: '200px'
                }}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                style={{
                  padding: '12px 20px',
                  backgroundColor: !product.inStock ? '#D5D9D9' : '#FFA41C',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: !product.inStock ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  width: '200px'
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Security Message */}
            <div style={{ fontSize: '12px', color: '#565959', marginBottom: '16px' }}>
              <i className="fas fa-lock" style={{ color: '#007600', marginRight: '4px' }}></i>
              Secure transaction
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#007185',
                border: '1px solid #D5D9D9',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isInWishlist(product.id) ? 'Remove from' : 'Add to'} List
            </button>
          </div>

          {/* Product Features */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0F1111' }}>
              About this item
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {product.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '8px', color: '#0F1111', fontSize: '14px', lineHeight: '1.5' }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full Width Sections */}
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Product Details Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ borderBottom: '1px solid #D5D9D9', display: 'flex' }}>
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 24px',
                  backgroundColor: activeTab === tab ? 'white' : '#F7F8F8',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #C7511F' : 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  color: '#0F1111'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div style={{ padding: '24px' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0F1111' }}>
                  Product Description
                </h3>
                <p style={{ lineHeight: '1.6', color: '#0F1111', fontSize: '14px' }}>
                  {product.description}
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0F1111' }}>
                  Product Specifications
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid #E7E7E7' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#565959', width: '30%' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </td>
                        <td style={{ padding: '12px', color: '#0F1111' }}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0F1111' }}>
                  Customer Reviews
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '16px', backgroundColor: '#F7F8F8', borderRadius: '4px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0F1111' }}>
                      {product.rating}
                    </div>
                    <div>{renderStars(product.rating)}</div>
                    <div style={{ fontSize: '14px', color: '#565959' }}>
                      {product.reviews} {product.reviews === 1 ? 'Rating' : 'Ratings'}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#0F1111', width: '60px' }}>
                          {star} {star === 1 ? 'star' : 'stars'}
                        </span>
                        <div style={{ flex: 1, height: '12px', backgroundColor: '#E7E7E7', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${Math.random() * 80 + 10}%`, 
                            height: '100%', 
                            backgroundColor: '#FFD814' 
                          }}></div>
                        </div>
                        <span style={{ fontSize: '14px', color: '#565959', width: '40px', textAlign: 'right' }}>
                          {Math.floor(Math.random() * 100 + 10)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginTop: '24px' }}>
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review._id} style={{ borderBottom: '1px solid #E7E7E7', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div>{renderStars(review.rating)}</div>
                          <span style={{ fontSize: '14px', color: '#0F1111', fontWeight: 'bold' }}>
                            {review.user_id?.name || 'Anonymous'}
                          </span>
                        </div>
                        <p style={{ color: '#0F1111', fontSize: '14px', lineHeight: '1.5' }}>
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#565959', fontSize: '14px' }}>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailAmazon;
