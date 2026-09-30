import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import SearchBar from '../components/SearchBar';
import './SearchPage.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const category = queryParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        let endpoint = `/products?search=${encodeURIComponent(query)}`;
        if (category !== 'All') {
          endpoint += `&category=${category.toLowerCase().replace(' ', '-')}`;
        }
        const result = await api.get(endpoint);

        if (result.success) {
          const mapped = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.price,
            image: p.images[0],
            badge: p.tags.includes('trending') ? 'Trending' : p.tags.includes('new') ? 'New' : '',
            reviews: p.review_count || 0,
            rating: p.rating || 0,
            category: p.subcategory || 'General',
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setIsLoading(false);
    }
  }, [query, category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="sp-page">
      {/* Hero Header */}
      <div className="sp-hero">
        <div className="sp-hero-bg-shape sp-shape-1" />
        <div className="sp-hero-bg-shape sp-shape-2" />
        <div className="sp-hero-content">
          <div className="sp-breadcrumb">
            <span onClick={() => navigate('/')} className="sp-breadcrumb-link">Home</span>
            <i className="fas fa-chevron-right" />
            <span>Search</span>
          </div>
          <h1 className="sp-hero-title">
            {query ? (
              <>
                Results for{' '}
                <span className="sp-query-highlight">"{query}"</span>
              </>
            ) : (
              'Search Products'
            )}
          </h1>
          {category !== 'All' && (
            <div className="sp-category-badge">
              <i className="fas fa-filter" /> {category}
            </div>
          )}
          {/* Embedded search bar */}
          <div className="sp-search-bar-wrap">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="sp-container">
        {/* Toolbar */}
        <div className="sp-toolbar">
          <div className="sp-results-meta">
            {!isLoading && (
              <>
                <span className="sp-count-pill">{products.length}</span>
                <span className="sp-count-label">
                  {products.length === 1 ? 'product' : 'products'} found
                </span>
              </>
            )}
          </div>
          <div className="sp-sort-wrap">
            <label className="sp-sort-label">
              <i className="fas fa-sort-amount-down" /> Sort by
            </label>
            <div className="sp-select-wrap">
              <select
                className="sp-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down sp-select-arrow" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="sp-grid">
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} type="product" />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="sp-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          /* No results for query */
          <div className="sp-empty">
            <div className="sp-empty-icon-wrap">
              <i className="fas fa-search-minus" />
            </div>
            <h2 className="sp-empty-title">No products found</h2>
            <p className="sp-empty-desc">
              We couldn't find anything matching{' '}
              <strong>"{query}"</strong>. Try a different keyword or browse our categories.
            </p>
            <div className="sp-empty-actions">
              <button className="sp-btn-primary" onClick={() => navigate('/')}>
                <i className="fas fa-home" /> Go Home
              </button>
              <button className="sp-btn-outline" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left" /> Go Back
              </button>
            </div>
          </div>
        ) : (
          /* No query entered — prompt to search */
          <div className="sp-empty">
            <div className="sp-empty-icon-wrap">
              <i className="fas fa-search" />
            </div>
            <h2 className="sp-empty-title">What are you looking for?</h2>
            <p className="sp-empty-desc">
              Type a product name in the search bar above to find T-Shirts, Hoodies, Accessories, and more.
            </p>
            <div className="sp-empty-actions">
              <button className="sp-btn-primary" onClick={() => navigate('/')}>
                <i className="fas fa-home" /> Browse All Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
