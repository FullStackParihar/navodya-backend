import React, { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsBeautiful.css';

// Fallback products for alumni kits
const fallbackProducts = [
  {
    id: 'silver-jubilee-kit',
    dbId: '13',
    name: 'Silver Jubilee Kit',
    description: 'Special kit for 25th anniversary alumni',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=500&fit=crop',
    badge: 'Special',
    reviews: 123,
    rating: 4.9,
    category: 'Alumni Kits',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy']
  },
  {
    id: 'graduation-kit',
    dbId: '14',
    name: 'Graduation Kit',
    description: 'Perfect gift for graduating students',
    price: 1999,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1627555893653-19380420e195?w=400&h=500&fit=crop',
    badge: 'New',
    reviews: 89,
    rating: 4.8,
    category: 'Alumni Kits',
    sizes: ['One Size'],
    colors: ['Blue']
  },
  {
    id: 'alumni-reunion-kit',
    dbId: '15',
    name: 'Alumni Reunion Kit',
    description: 'Complete kit for reunion events',
    price: 2199,
    originalPrice: 2699,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop',
    badge: 'Hot',
    reviews: 156,
    rating: 4.7,
    category: 'Alumni Kits',
    sizes: ['M', 'L', 'XL'],
    colors: ['Maroon']
  },
  {
    id: 'premium-alumni-kit',
    dbId: '16',
    name: 'Premium Alumni Kit',
    description: 'Luxury kit for distinguished alumni',
    price: 3499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=500&fit=crop',
    badge: 'Premium',
    reviews: 67,
    rating: 4.9,
    category: 'Alumni Kits',
    sizes: ['L', 'XL'],
    colors: ['Black']
  }
];

const AlumniKits = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products?category=alumni-kits');
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
            category: 'Alumni Kits',
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching alumni kits:', err);
        setProducts(fallbackProducts);
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
            <span className="title-accent">JNV</span> Alumni Kits
          </h1>
          <p className="page-subtitle">Special packages designed exclusively for JNV alumni</p>
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

export default AlumniKits;
