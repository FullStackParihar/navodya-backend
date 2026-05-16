import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';

const Momentum = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await api.get('/products?category=momentum');
        if (result.success) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: p.images[0] || 'https://via.placeholder.com/300x400?text=No+Image',
            badge: p.sale_price ? 'Sale' : (p.rating > 4.5 ? 'Bestseller' : ''),
            reviews: p.review_count || 0,
            rating: p.rating || 0
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const badges = ['Bestseller', 'New', 'Sale', 'Popular'];

  return (
    <div className="product-page-container">
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', color: '#0f172a' }}>Mementos</h2>
          <div className="products-grid-new">
            {isLoading ? (
              <SkeletonLoader type="product" count={6} />
            ) : (
              products.map((product, index) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card-new">
                  <div className="product-badge-new">{badges[index % badges.length]}</div>
                  <div className="product-image-new">
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="product-info-new">
                    <h3 className="product-name-new">{product.name}</h3>
                    <p className="product-desc-new">{product.description}</p>
                    <div className="product-rating-new">
                      <div className="stars-new">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <span className="review-count-new">({product.reviews || 100})</span>
                    </div>
                    <div className="product-price-new">
                      <span className="current-price-new">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price-new">₹{product.originalPrice}</span>
                      )}
                      <span className="discount-new">31% OFF</span>
                    </div>
                    <button className="add-to-cart-new">
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Momentum;
