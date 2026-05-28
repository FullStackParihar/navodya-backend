import React, { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsBeautiful.css';

// Fallback products for accessories
const fallbackProducts = [
  {
    id: 'jnv-baseball-cap',
    dbId: '9',
    name: 'JNV Baseball Cap',
    description: 'Adjustable cap with embroidered logo',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    badge: 'Bestseller',
    reviews: 567,
    rating: 4.8,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Navy Blue', 'Black', 'White']
  },
  {
    id: 'navodaya-water-bottle',
    dbId: '10',
    name: 'Navodaya Water Bottle',
    description: 'Stainless steel insulated bottle',
    price: 499,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1602143403490-42c665fd7239?w=400&h=500&fit=crop',
    badge: 'New',
    reviews: 234,
    rating: 4.9,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Blue', 'Green', 'Silver']
  },
  {
    id: 'jnv-backpack',
    dbId: '11',
    name: 'JNV Backpack',
    description: 'Durable backpack with laptop compartment',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    badge: 'Hot',
    reviews: 389,
    rating: 4.7,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Navy', 'Black', 'Grey']
  },
  {
    id: 'alumni-key-chain',
    dbId: '12',
    name: 'Alumni Key Chain',
    description: 'Premium metal key chain',
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&h=500&fit=crop',
    badge: '',
    reviews: 156,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold']
  }
];

const Accessories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products?category=accessories');
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
            category: 'Accessories',
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching accessories:', err);
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
            <span className="title-accent">JNV</span> Accessories Collection
          </h1>
          <p className="page-subtitle">Complete your Navodaya look with our exclusive accessories</p>
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

export default Accessories;
