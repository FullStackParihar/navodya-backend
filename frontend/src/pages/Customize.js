import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import './TShirtsBeautiful.css';

const customizeProducts = [
  {
    id: 'custom-tshirt',
    name: 'JNV Custom T-Shirt',
    description: 'Fully Customizable | Your Design | Premium Cotton',
    price: 599,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: '',
    reviews: 234,
    rating: 4.7,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray', 'Red', 'Blue']
  },
  {
    id: 'custom-hoodie',
    name: 'JNV Custom Hoodie',
    description: 'Personalized Hoodie | Your Art | Fleece Lined',
    price: 899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=300&h=400&fit=crop',
    badge: '',
    reviews: 189,
    rating: 4.8,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Maroon']
  },
  {
    id: 'custom-cap',
    name: 'JNV Custom Cap',
    description: 'Personalized Cap | Embroidered | Adjustable',
    price: 349,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: '',
    reviews: 167,
    rating: 4.5,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy', 'Red', 'Green']
  },
  {
    id: 'custom-tshirt-full',
    name: 'JNV Custom Full Sleeve',
    description: 'Custom Full Sleeve T-Shirt | Premium Quality',
    price: 699,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=400&fit=crop',
    badge: '',
    reviews: 145,
    rating: 4.6,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray']
  }
];

const Customize = () => {
  return (
    <div className="tshirts-beautiful">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-accent">Customize</span> Your Merch
          </h1>
          <p className="page-subtitle">Personalize your JNV merchandise with your own designs</p>
        </div>

        <div className="products-grid">
          {customizeProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="product-wrapper"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customize;
