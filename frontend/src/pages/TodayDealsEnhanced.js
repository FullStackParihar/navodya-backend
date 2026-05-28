import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsBeautiful.css';

const TodayDealsEnhanced = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products');
        if (result.success) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: null,
            image: p.images[0] || 'https://via.placeholder.com/300x400?text=No+Image',
            badge: '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.category,
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="tshirts-beautiful">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-accent">Today's</span> Deals
          </h1>
          <p className="page-subtitle">Special offers and amazing deals for Navodayans</p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <SkeletonLoader type="product" count={8} />
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="product-wrapper"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayDealsEnhanced;
