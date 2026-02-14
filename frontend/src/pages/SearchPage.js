import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './TShirtsEnhanced.css'; // Reuse category styles

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
                        category: p.subcategory || 'General'
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
        <div className="category-page search-results-page">
            <div className="container">
                <div className="category-header">
                    <h1>Search Results for "{query}" {category !== 'All' && `in ${category}`}</h1>
                    <p>{products.length} products found</p>
                </div>

                <div className="products-toolbar">
                    <div className="sort-options">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Avg. Customer Review</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="products-grid">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonLoader key={i} type="product" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="products-grid">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <i className="fas fa-search-minus"></i>
                        <h2>No products found</h2>
                        <p>Try checking your spelling or use more general terms</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Go Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
