import React, { useState, useEffect } from 'react';
import api, { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsBeautiful.css';

// Fallback products for hoodies
const fallbackProducts = [
  {
    id: 'classic-navodaya-hoodie',
    dbId: '5',
    name: 'Classic Navodaya Hoodie',
    description: 'Cozy fleece hoodie with JNV logo',
    price: 999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    badge: 'Bestseller',
    reviews: 456,
    rating: 4.9,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'alumni-hoodie',
    dbId: '6',
    name: 'Alumni Special Hoodie',
    description: 'Premium quality hoodie for alumni',
    price: 1199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1626596738752-e34943c79b53?w=400&h=500&fit=crop',
    badge: 'New',
    reviews: 234,
    rating: 4.8,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'campus-zip-hoodie',
    dbId: '7',
    name: 'Campus Zip Hoodie',
    description: 'Zip-up style with campus print',
    price: 1099,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
    badge: 'Hot',
    reviews: 312,
    rating: 4.7,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  },
  {
    id: 'winter-warm-hoodie',
    dbId: '8',
    name: 'Winter Warm Hoodie',
    description: 'Extra warm for winter season',
    price: 1299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
    badge: '',
    reviews: 189,
    rating: 4.6,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'White']
  }
];

const Hoodies = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products?category=hoodies');
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
            category: 'Hoodies',
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Error fetching hoodies:', err);
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
            <span className="title-accent">JNV</span> Hoodies Collection
          </h1>
          <p className="page-subtitle">Cozy & warm hoodies designed exclusively for Navodayans</p>
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

export default Hoodies;
