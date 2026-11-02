import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import StorefrontHeader from '../components/StorefrontHeader';
import StorefrontStyles from '../features/storefront/StorefrontStyles';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErrorMsg('');

    Promise.all([
      api.get(`/categories/${categorySlug}`),
      api.get(`/products?category=${categorySlug}&limit=50`)
    ])
      .then(([catRes, prodRes]) => {
        if (!alive) return;
        if (catRes.success && catRes.data) {
          setCategory(catRes.data);
          setSubcategories(catRes.data.subcategories || []);
        } else {
          setErrorMsg('Category not found');
        }

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data.products || prodRes.data || []);
        }
      })
      .catch((err) => {
        if (alive) {
          console.error('Error loading category:', err);
          setErrorMsg('Failed to load category details.');
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [categorySlug]);

  const handleAddProduct = async (product) => {
    try {
      await addToCart({
        id: product.slug,
        productSlug: product.slug,
        dbId: product._id,
        name: product.name,
        price: product.sale_price || product.price || 0,
        image: product.images?.[0],
        sizes: product.sizes || [],
        colors: product.colors || [],
        quantity: 1
      });
      setNotice(`${product.name} added to cart.`);
    } catch (err) {
      setNotice(err.message || 'Please sign in to add this item.');
    }
  };

  if (loading) {
    return (
      <>
        <StorefrontStyles />
        <main className="sf cat-page">
          <StorefrontHeader />
          <div className="cat-page-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading category...</p>
          </div>
        </main>
      </>
    );
  }

  if (errorMsg || !category) {
    return (
      <>
        <StorefrontStyles />
        <main className="sf cat-page">
          <StorefrontHeader />
          <div className="cat-breadcrumb-bar">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Category</span>
          </div>
          <div className="cat-page-section">
            <div className="cat-page-empty">
              <i className="fas fa-folder-open"></i>
              <h3>Category Not Found</h3>
              <p>The category you are looking for does not exist or may have been deactivated.</p>
              <Link to="/">Back to Homepage</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StorefrontStyles />
      <main className="sf cat-page">
        <StorefrontHeader />

        {/* Breadcrumb Navigation */}
        <nav className="cat-breadcrumb-bar" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">{category.name}</span>
        </nav>

        {/* Category Hero / Header */}
        <header className="cat-page-hero">
          <div className="cat-page-hero-text">
            <p className="cat-page-kicker">Department</p>
            <h1>{category.name}</h1>
            {category.description && <p>{category.description}</p>}
          </div>
          {category.image && (
            <img
              src={resolveImageUrl(category.image)}
              alt={category.name}
              className="cat-page-hero-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </header>

        {/* Subcategories Section */}
        {subcategories.length > 0 && (
          <section className="cat-page-section" style={{ background: '#ffffff', borderBottom: '1px solid var(--line)' }}>
            <div className="cat-page-sec-header">
              <h2>Explore Subcategories</h2>
              <p>Choose a specialized collection under {category.name}</p>
            </div>
            <div className="cat-sub-grid">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id || sub.slug}
                  to={`/category/${categorySlug}/${sub.slug}`}
                  className="cat-sub-card"
                >
                  <div className="cat-sub-card-img">
                    <img
                      src={resolveImageUrl(sub.image) || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(sub.name)}
                      alt={sub.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(sub.name);
                      }}
                    />
                  </div>
                  <div className="cat-sub-card-body">
                    <h3>{sub.name}</h3>
                    {sub.description && <p>{sub.description}</p>}
                    <span className="cat-sub-card-link">View products &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="cat-page-section">
          <div className="cat-page-sec-header">
            <h2>Products in {category.name}</h2>
            <p>
              {products.length > 0
                ? `Showing ${products.length} product${products.length === 1 ? '' : 's'}`
                : 'Browse available products'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="cat-prod-grid">
              {products.map((product) => {
                const cartItem = items.find((i) => i.productSlug === product.slug || i.dbId === product._id);
                const displayPrice = product.sale_price || product.price || 0;
                const hasDiscount = product.sale_price && product.sale_price < product.price;

                return (
                  <article key={product._id} className="sf-product">
                    <Link to={`/product/${product.slug}`} className="sf-product-image">
                      <img
                        src={resolveImageUrl(product.images?.[0]) || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                        }}
                      />
                      {hasDiscount && <span>Sale</span>}
                    </Link>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                        <Link to={`/product/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p>{product.description || 'Custom crafted for you.'}</p>
                      <div className="sf-product-bottom">
                        <div>
                          <strong>&#8377;{displayPrice.toLocaleString('en-IN')}</strong>
                          {hasDiscount && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                              &#8377;{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {cartItem ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: '#ffe4e1',
                              borderRadius: '20px',
                              padding: '4px 10px'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                cartItem.quantity > 1
                                  ? updateQuantity(cartItem.id, cartItem.quantity - 1)
                                  : removeFromCart(cartItem.id);
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#e63322',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: 0
                              }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#e63322' }}>
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                updateQuantity(cartItem.id, cartItem.quantity + 1);
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#e63322',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: 0
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddProduct(product);
                            }}
                          >
                            Add <b>+</b>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="cat-page-empty">
              <i className="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>There are no products currently listed directly in {category.name}. Check subcategories above or explore other categories.</p>
              <Link to="/products">Explore All Products</Link>
            </div>
          )}
        </section>

        {notice && (
          <button className="sf-notice" onClick={() => setNotice('')}>
            {notice} &times;
          </button>
        )}
      </main>
    </>
  );
}

