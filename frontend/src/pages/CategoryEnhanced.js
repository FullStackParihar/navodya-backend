import React, { useState, useEffect } from 'react';
import SizeFilter from '../components/SizeFilter';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const CategoryEnhanced = ({ category = 'tshirts' }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      id: product.dbId || product.id,
      quantity: 1,
      selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size',
      selectedColor: 'N/A'
    });
    success(`${product.name} added to cart!`);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products?category=${category}`);
        const result = await response.json();
        
        if (result.success) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: p.images[0] || 'https://via.placeholder.com/400/300?text=No+Image',
            sizes: p.sizes.map(s => s.size),
            rating: p.rating,
            reviews: p.review_count,
            badge: p.sale_price ? 'Sale' : (p.rating > 4.5 ? 'Bestseller' : '')
          }));
          setProducts(mapped);
          setFilteredProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  useEffect(() => {
    let filtered = products;

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedSizes, priceRange, sortBy]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          <p>{filteredProducts.length} products found</p>
        </div>

        <div className="category-content">
          <aside className="filters-sidebar">
            <SizeFilter 
              onSizeChange={handleSizeChange}
              selectedSizes={selectedSizes}
            />
            
            <div className="price-filter">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="product-info">
                    <Link to={`/product/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={i < Math.floor(product.rating) ? 'fas fa-star' : 'far fa-star'}
                          ></i>
                        ))}
                      </div>
                      <span>({product.reviews})</span>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .category-page {
          padding: 2rem 0;
          min-height: 100vh;
        }

        .category-header {
          margin-bottom: 2rem;
        }

        .category-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary, #1e293b);
        }

        .category-header p {
          color: var(--text-secondary, #64748b);
          font-size: 1.125rem;
        }

        .category-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .price-filter {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--bg-primary, white);
          border-radius: 1rem;
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .price-filter h3 {
          margin-bottom: 1rem;
          color: var(--text-primary, #1e293b);
        }

        .price-inputs {
          display: flex;
          gap: 1rem;
        }

        .price-inputs input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .products-toolbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }

        .products-toolbar select {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 0.5rem;
          background: var(--bg-primary, white);
          font-size: 0.875rem;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: var(--bg-primary, white);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: transform 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .product-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--primary-color, #ff6b35);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 1;
        }

        .product-card img {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h3 {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary, #1e293b);
        }

        .product-price {
          margin-bottom: 0.5rem;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color, #2f4a67);
        }

        .original-price {
          text-decoration: line-through;
          color: var(--text-secondary, #64748b);
          margin-left: 0.5rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
        }

        .stars {
          color: var(--primary-light, #56718d);
        }

        @media (max-width: 768px) {
          .category-content {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: static;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryEnhanced;
