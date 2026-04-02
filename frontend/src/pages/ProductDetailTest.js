import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const ProductDetailTest = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product:', id);
        const result = await api.get(`/products/${id}`);
        console.log('Product result:', result);
        if (result.success) {
          setProduct(result.data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.name}</h1>
      <p>Price: ₹{product.price}</p>
      <p>Description: {product.description}</p>
      <img src={product.images[0]} alt={product.name} style={{ maxWidth: '300px' }} />
    </div>
  );
};

export default ProductDetailTest;
