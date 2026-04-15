import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './SearchPage.css';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    const category = queryParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState(query);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Available pages in the application
    const availablePages = [
        { 
            name: 'Home', 
            route: '/', 
            description: 'Main landing page with featured products',
            keywords: ['home', 'main', 'landing', 'featured'],
            icon: 'fa-home'
        },
        { 
            name: 'T-Shirts', 
            route: '/tshirts', 
            description: 'Browse our complete T-shirt collection',
            keywords: ['tshirt', 't-shirt', 'tees', 'shirts'],
            icon: 'fa-tshirt'
        },
        { 
            name: 'Hoodies', 
            route: '/hoodies', 
            description: 'Premium hoodie collection',
            keywords: ['hoodie', 'hoodies', 'sweatshirt', 'pullover'],
            icon: 'fa-puzzle-piece'
        },
        { 
            name: 'Accessories', 
            route: '/accessories', 
            description: 'Accessories and merchandise',
            keywords: ['accessories', 'merch', 'items', 'gear'],
            icon: 'fa-glasses'
        },
        { 
            name: 'Alumni Kits', 
            route: '/alumni-kits', 
            description: 'Special alumni merchandise kits',
            keywords: ['alumni', 'graduation', 'kit', 'package'],
            icon: 'fa-graduation-cap'
        },
        { 
            name: 'Customize', 
            route: '/customize', 
            description: 'Design your custom merchandise',
            keywords: ['custom', 'design', 'personalize', 'create'],
            icon: 'fa-palette'
        },
        { 
            name: 'Today Deals', 
            route: '/today-deals', 
            description: 'Today\'s special offers and deals',
            keywords: ['deals', 'offers', 'sale', 'discount'],
            icon: 'fa-tag'
        },
        { 
            name: 'New Arrivals', 
            route: '/new-arrivals', 
            description: 'Latest products and collections',
            keywords: ['new', 'arrivals', 'latest', 'fresh'],
            icon: 'fa-sparkles'
        },
        { 
            name: 'Cart', 
            route: '/cart', 
            description: 'View your shopping cart',
            keywords: ['cart', 'basket', 'shopping', 'checkout'],
            icon: 'fa-shopping-cart'
        },
        { 
            name: 'Wishlist', 
            route: '/wishlist', 
            description: 'View your saved items',
            keywords: ['wishlist', 'saved', 'favorites', 'love'],
            icon: 'fa-heart'
        },
        { 
            name: 'Profile', 
            route: '/profile', 
            description: 'Manage your account',
            keywords: ['profile', 'account', 'settings', 'user'],
            icon: 'fa-user'
        },
        { 
            name: 'FAQ', 
            route: '/faq', 
            description: 'Frequently asked questions',
            keywords: ['faq', 'help', 'support', 'questions'],
            icon: 'fa-question-circle'
        },
        { 
            name: 'Bulk Order', 
            route: '/bulk-order', 
            description: 'Place bulk orders',
            keywords: ['bulk', 'wholesale', 'order', 'quantity'],
            icon: 'fa-boxes'
        },
        { 
            name: 'Order Tracking', 
            route: '/order-tracking', 
            description: 'Track your orders',
            keywords: ['track', 'tracking', 'order', 'status'],
            icon: 'fa-truck'
        }
    ];

    // Filter pages based on search query
    const filteredPages = availablePages.filter(page => {
        if (!query) return false;
        const searchLower = query.toLowerCase();
        return (
            page.name.toLowerCase().includes(searchLower) ||
            page.description.toLowerCase().includes(searchLower) ||
            page.keywords.some(keyword => keyword.includes(searchLower))
        );
    });

    // Featured collections for quick navigation
    const featuredCollections = [
        { name: 'Trending Now', route: '/search?q=trending', icon: 'fa-fire' },
        { name: 'Best Sellers', route: '/search?q=bestseller', icon: 'fa-star' },
        { name: 'New Arrivals', route: '/new-arrivals', icon: 'fa-sparkles' },
        { name: 'Sale Items', route: '/search?q=sale', icon: 'fa-tag' },
        { name: 'Custom Designs', route: '/customize', icon: 'fa-palette' },
        { name: 'Alumni Special', route: '/alumni-kits', icon: 'fa-graduation-cap' }
    ];

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams();
            params.set('q', searchQuery.trim());
            navigate(`/search?${params.toString()}`);
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    const handleQuickSearch = (term) => {
        setSearchQuery(term);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <div className="search-page-enhanced">
            {/* Hero Section */}
            <section className="search-hero-enhanced animate-fadeIn">
                <div className="hero-background">
                    <div className="hero-pattern"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="animate-slideDown">Search Products</h1>
                        <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                            Find your favorite JNV merchandise
                        </p>
                        
                        {/* Enhanced Search Form */}
                        <form className="search-form-enhanced animate-slideUp" style={{ animationDelay: '0.3s' }} onSubmit={handleSearch}>
                            <div className="search-input-group">
                                <div className="search-input-wrapper">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        placeholder="Search for products..."
                                        className="search-input"
                                    />
                                    {searchQuery && (
                                        <button 
                                            type="button" 
                                            className="clear-search"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                                <button type="submit" className="search-btn-enhanced">
                                    <i className="fas fa-search"></i>
                                    Search
                                </button>
                            </div>
                            
                            {/* Search Suggestions */}
                            {showSuggestions && (
                                <div className="search-suggestions">
                                    <div className="suggestions-header">
                                        <h4>Popular Searches</h4>
                                    </div>
                                    <div className="suggestions-list">
                                        {['JNV T-Shirt', 'Alumni Hoodie', 'Sports Jersey', 'Campus Wear', 'Navodaya Merch'].map((term, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className="suggestion-item"
                                                onClick={() => handleQuickSearch(term)}
                                            >
                                                <i className="fas fa-clock"></i>
                                                <span>{term}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="featured-collections-section">
                <div className="container">
                    <div className="featured-collections-enhanced">
                        <h3>Featured Collections</h3>
                        <div className="collections-grid">
                            {featuredCollections.map((collection, index) => (
                                <Link
                                    key={index}
                                    to={collection.route}
                                    className="collection-card"
                                >
                                    <div className="collection-icon">
                                        <i className={`fas ${collection.icon}`}></i>
                                    </div>
                                    <h4>{collection.name}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Results */}
            <section className="search-results-section">
                <div className="container">
                    {query && (
                        <div className="search-header-enhanced">
                            <div className="search-info">
                                <h2>Search Results for "{query}"</h2>
                                <p className="results-count">
                                    {isLoading ? 'Searching...' : 
                                     `${filteredPages.length} pages and ${products.length} products found`}
                                </p>
                            </div>
                            
                            <div className="search-toolbar">
                                <div className="sort-options-enhanced">
                                    <label>Sort by:</label>
                                    <select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Avg. Customer Review</option>
                                        <option value="name">Name: A to Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="products-grid-enhanced">
                            {[...Array(8)].map((_, i) => (
                                <SkeletonLoader key={i} type="product" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Pages Results Section */}
                            {filteredPages.length > 0 && (
                                <div className="pages-results-section">
                                    <h3 className="results-section-title">Pages</h3>
                                    <div className="pages-grid">
                                        {filteredPages.map((page) => (
                                            <Link to={page.route} key={page.name} className="page-result-card">
                                                <div className="page-result-icon">
                                                    <i className={`fas ${page.icon}`}></i>
                                                </div>
                                                <div className="page-result-content">
                                                    <h4>{page.name}</h4>
                                                    <p>{page.description}</p>
                                                    <div className="page-result-keywords">
                                                        {page.keywords.slice(0, 3).map((keyword, index) => (
                                                            <span key={index} className="keyword-tag">{keyword}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="page-result-arrow">
                                                    <i className="fas fa-chevron-right"></i>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products Results Section */}
                            {products.length > 0 && (
                                <div className="products-results-section">
                                    <h3 className="results-section-title">Products</h3>
                                    <div className="products-grid-enhanced">
                                        {sortedProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results State */}
                            {filteredPages.length === 0 && products.length === 0 && (
                                <div className="empty-search-enhanced">
                                    <div className="empty-search-content">
                                        <div className="empty-search-icon">
                                            <i className="fas fa-search-minus"></i>
                                        </div>
                                        <h2>No pages or products found</h2>
                                        <p>Try checking your spelling or use more general terms</p>
                                        <div className="empty-search-actions">
                                            <button className="btn-primary" onClick={() => navigate('/')}>
                                                <i className="fas fa-home"></i>
                                                Go Home
                                            </button>
                                            <button className="btn-secondary" onClick={() => navigate('/tshirts')}>
                                                <i className="fas fa-tshirt"></i>
                                                Browse T-Shirts
                                            </button>
                                        </div>
                                        
                                        <div className="search-tips">
                                            <h4>Search Tips:</h4>
                                            <ul>
                                                <li>Try searching for pages like "home", "cart", "profile"</li>
                                                <li>Search for products like "t-shirt", "hoodie", "accessories"</li>
                                                <li>Browse our featured collections below</li>
                                                <li>Use general terms for better results</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SearchPage;
