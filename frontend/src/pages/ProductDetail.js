import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Sample product data (in a real app, this would come from an API)
const productData = {
  1: {
    id: 1,
    name: 'JNV Classic T-Shirt',
    description: 'Show your Navodaya pride with our classic JNV T-shirt. Made from premium 100% cotton, this comfortable and durable t-shirt features the iconic JNV logo with custom design options for your school and batch year.',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'
    ],
    badge: 'Bestseller',
    reviews: 245,
    rating: 4.5
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  const product = productData[id];

  if (!product) {
    return (
      <div>
        <section className="page-header">
          <div className="container">
            <h1>Product Not Found</h1>
            <p>The product you're looking for doesn't exist.</p>
          </div>
        </section>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#ffffff' },
    { name: 'navy', hex: '#000080' },
    { name: 'red', hex: '#ff0000' },
    { name: 'blue', hex: '#0000ff' }
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/tshirts">T-Shirts</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="product-detail-page">
        <div className="container">
          <div className="product-detail-layout">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                <img src={product.images[selectedImage]} alt={product.name} />
              </div>
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`View ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <h1>{product.name}</h1>
                <div className="product-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="product-price">
                <span className="current-price">₹{product.price}</span>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </div>

              <div className="product-badges">
                <span className="badge">{product.badge}</span>
                <span className="badge">Premium Quality</span>
                <span className="badge">Custom Design</span>
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              {/* Size Selection */}
              <div className="size-selection">
                <h3>Select Size</h3>
                <div className="size-options">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <a href="#size-guide" className="size-guide-link">Size Guide</a>
              </div>

              {/* Color Selection */}
              <div className="color-selection">
                <h3>Select Color</h3>
                <div className="color-options">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                      style={{ background: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="qty-btn decrease"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="qty-input" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    min="1" 
                    max="10" 
                  />
                  <button 
                    className="qty-btn increase"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                >
                  <i className="fas fa-shopping-bag"></i> 
                  {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                </button>
                <button className="buy-now-btn">
                  <i className="fas fa-bolt"></i> Buy Now
                </button>
                <button 
                  className="wishlist-btn"
                  onClick={handleWishlistToggle}
                  style={{ color: isInWishlist(product.id) ? 'var(--primary-color)' : '' }}
                >
                  <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
              </div>

              {/* Product Features */}
              <div className="product-features">
                <div className="feature">
                  <i className="fas fa-truck"></i>
                  <span>Free Shipping above ₹799</span>
                </div>
                <div className="feature">
                  <i className="fas fa-undo"></i>
                  <span>7 Days Return</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="feature">
                  <i className="fas fa-paint-brush"></i>
                  <span>Custom Design Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="product-tabs">
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
            <button 
              className={`tab-btn ${activeTab === 'size-guide' ? 'active' : ''}`}
              onClick={() => setActiveTab('size-guide')}
            >
              Size Guide
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'details' && (
              <div id="details" className="tab-pane active">
                <div className="details-grid">
                  <div className="detail-section">
                    <h3>Material & Care</h3>
                    <ul>
                      <li>100% Premium Cotton</li>
                      <li>Machine washable</li>
                      <li>Do not bleach</li>
                      <li>Tumble dry low</li>
                      <li>Iron on medium heat</li>
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h3>Features</h3>
                    <ul>
                      <li>Round neck design</li>
                      <li>Short sleeves</li>
                      <li>Printed JNV logo</li>
                      <li>Custom batch year option</li>
                      <li>Available in multiple colors</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
