import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css';

const Accessories = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: []
  });

  useEffect(() => {
    const fetchAccessories = async () => {
      setIsLoading(true);
      try {
        const result = await api.get('/products?category=accessories');
        if (result.success) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.price,
            image: p.images[0],
            badge: (p.tags && p.tags.includes('trending')) ? 'Trending' : (p.tags && p.tags.includes('new')) ? 'New' : '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.subcategory || 'Accessories',
            sizes: p.sizes ? p.sizes.map(s => s.size) : [],
            colors: p.colors ? p.colors.map(c => c.name) : []
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching accessories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const filteredProducts = products.filter(product => {
    if (activeTab === 'trending' && product.badge !== 'Trending') return false;
    if (activeTab === 'new' && product.badge !== 'New') return false;
    if (activeTab === 'bestseller' && product.reviews < 200) return false;
    if (activeTab === 'premium' && product.badge !== 'Premium') return false;
    if (selectedFilters.categories.length > 0 && !selectedFilters.categories.includes(product.category)) return false;
    if (selectedFilters.sizes.length > 0) {
      const hasSelectedSize = product.sizes.some(size => selectedFilters.sizes.includes(size));
      if (!hasSelectedSize) return false;
    }
    if (selectedFilters.colors.length > 0) {
      const hasSelectedColor = product.colors.some(color => selectedFilters.colors.includes(color));
      if (!hasSelectedColor) return false;
    }
    if (selectedFilters.priceRange.length > 0) {
      const inRange = selectedFilters.priceRange.some(range => {
        if (range === 'under-199') return product.price < 199;
        if (range === '199-399') return product.price >= 199 && product.price <= 399;
        if (range === '400-699') return product.price >= 400 && product.price <= 699;
        if (range === 'above-700') return product.price > 700;
        return false;
      });
      if (!inRange) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return b.id - a.id;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      default: return 0;
    }
  });

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: []
    });
  };

  const getFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
  };

  if (isLoading) return <div className="container p-5 text-center"><SkeletonLoader type="product" count={8} /></div>;

  return (
    <div className="category-page">
      <div className="container">
        <section className="tshirt-hero animate-fadeIn">
          <div className="hero-background"><div className="hero-pattern"></div></div>
          <div className="hero-content">
            <h1>JNV Accessories Collection</h1>
            <p>Premium accessories designed exclusively for Navodayans</p>
          </div>
        </section>
        <section className="shop-page-enhanced">
          <div className="shop-layout-enhanced">
            <aside className="filters-sidebar-enhanced">
              <div className="filters-header">
                <h3>Filters</h3>
                {getFilterCount() > 0 && <button onClick={clearAllFilters}>Clear All</button>}
              </div>
              <div className="filter-section">
                <h4>Categories</h4>
                {['Caps', 'Bags', 'Bottles', 'Phone Cases', 'ID Holders', 'Stationery', 'Keychains', 'Sunglasses', 'Watches', 'Belts', 'Wallets', 'Socks'].map(c => (
                  <label key={c} className="filter-label">
                    <input type="checkbox" checked={selectedFilters.categories.includes(c)} onChange={() => handleFilterChange('categories', c)} />
                    {c}
                  </label>
                ))}
              </div>
            </aside>
            <main className="products-main-enhanced">
              <div className="products-header-enhanced">
                <h2>{filteredProducts.length} Products</h2>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Best Rating</option>
                </select>
              </div>
              <div className="products-grid-enhanced">
                {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Accessories;
