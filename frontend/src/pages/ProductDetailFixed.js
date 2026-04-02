import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductDetailFixed = () => {
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product:', id);
        const result = await api.get(`/products/${id}`);
        console.log('Product result:', result);
        
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
            sizes: p.sizes.map(s => s.size),
            colors: p.colors.map(c => c.name),
            inStock: p.is_active && p.sizes.some(s => s.stock > 0),
            stockCount: p.sizes.reduce((total, s) => total + s.stock, 0),
          };
          setProduct(mappedProduct);
          if (mappedProduct.sizes.length > 0) setSelectedSize(mappedProduct.sizes[0]);
          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
        stars.push(<i key={i} className="fas fa-star" style={{ color: '#fbbf24' }}></i>);
      } else {
        stars.push(<i key={i} className="far fa-star" style={{ color: '#d1d5db' }}></i>);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '20px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          
          {/* Product Images */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: selectedImage === idx ? '2px solid #2563eb' : '2px solid #e5e7eb',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedImage(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              
              {/* Product Header */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{product.category}</div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                  {product.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div>{renderStars(product.rating)}</div>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '20px', color: '#9ca3af', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: product.inStock ? '#10b981' : '#ef4444'
                  }}></div>
                  <span style={{ color: product.inStock ? '#10b981' : '#ef4444', fontSize: '14px' }}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                  Description
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                    Size
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '8px 16px',
                          border: `2px solid ${selectedSize === size ? '#2563eb' : '#e5e7eb'}`,
                          backgroundColor: selectedSize === size ? '#2563eb' : 'white',
                          color: selectedSize === size ? 'white' : '#1f2937',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
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
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                    Color
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          padding: '8px 16px',
                          border: `2px solid ${selectedColor === color ? '#2563eb' : '#e5e7eb'}`,
                          backgroundColor: selectedColor === color ? '#2563eb' : 'white',
                          color: selectedColor === color ? 'white' : '#1f2937',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                  Quantity
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '2px solid #e5e7eb', borderRadius: '6px', width: '150px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '8px 12px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    style={{ border: 'none', textAlign: 'center', width: '50px', padding: '8px' }}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    style={{ padding: '8px 12px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                  style={{
                    flex: 2,
                    padding: '16px',
                    backgroundColor: isAddingToCart || !product.inStock ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isAddingToCart || !product.inStock ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  style={{
                    padding: '16px',
                    backgroundColor: isInWishlist(product.id) ? '#ef4444' : 'white',
                    color: isInWishlist(product.id) ? 'white' : '#1f2937',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  {isInWishlist(product.id) ? '♥' : '♡'} Wishlist
                </button>
              </div>

              {/* Features */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🚚</span> Free Delivery
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔒</span> Secure Payment
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>↩️</span> Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailFixed;
