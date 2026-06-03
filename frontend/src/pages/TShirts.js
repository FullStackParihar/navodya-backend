import React, { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsBeautiful.css';

// Fallback products if API is not available
const fallbackProducts = [
  {
    id: 'navodaya-proud-tshirt',
    dbId: '1',
    name: 'Navodaya Proud T-Shirt',
    description: 'Premium cotton T-shirt with Navodaya branding',
    price: 499,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    badge: 'Bestseller',
    reviews: 234,
    rating: 4.8,
    category: 'Classic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'jnv-alumni-tshirt',
    dbId: '2',
    name: 'JNV Alumni T-Shirt',
    description: 'Exclusive for Navodaya Alumni',
    price: 549,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1622445275463-04147b1e7c10?w=400&h=500&fit=crop',
    badge: 'New',
    reviews: 156,
    rating: 4.9,
    category: 'Alumni',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'campus-retro-tshirt',
    dbId: '3',
    name: 'Campus Retro T-Shirt',
    description: 'Vintage style JNV campus design',
    price: 449,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&h=500&fit=crop',
    badge: 'Hot',
    reviews: 312,
    rating: 4.7,
    category: 'Retro',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'jnv-spirit-tshirt',
    dbId: '4',
    name: 'JNV Spirit T-Shirt',
    description: 'Comfortable fit with school colors',
    price: 399,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
    badge: '',
    reviews: 189,
    rating: 4.6,
    category: 'Comfort',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  }
];

const TShirts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTShirts = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products?category=tshirts');
        if (result.success && result.data.products.length > 0) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: null,
            image: resolveImageUrl(p.images[0] || 'https://via.placeholder.com/300x400?text=No+Image'),
            badge: '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: 'Classic',
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        } else {
          // Use fallback if no products from API
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching T-Shirts:', err);
        // Use fallback if API fails
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTShirts();
  }, []);

  return (
    <div className="tshirts-beautiful">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-accent">JNV</span> T-Shirts Collection
          </h1>
          <p className="page-subtitle">Premium quality T-shirts designed exclusively for Navodayans</p>
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
                style={{ '--delay': `${index * 0.08}s` }}
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

export default TShirts;
