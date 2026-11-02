import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import StorefrontHeader from '../components/StorefrontHeader';
import StorefrontStyles from '../features/storefront/StorefrontStyles';
import './CategoryPage.css';

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();

  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
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
      api.get(`/categories/${categorySlug}/subcategories/${subcategorySlug}`).catch(() => ({ success: false })),
      api.get(`/products?category=${categorySlug}&subcategory=${subcategorySlug}&limit=50`)
    ])
      .then(([catRes, subRes, prodRes]) => {
        if (!alive) return;

        if (catRes.success && catRes.data) {
          setCategory(catRes.data);
        } else {
          setErrorMsg('Parent category not found');
          return;
        }

        if (subRes.success && subRes.data) {
          setSubcategory(subRes.data);
        } else {
          // Fallback: check if subcategory is in category.subcategories
          const found = catRes.data?.subcategories?.find(
            (s) => s.slug === subcategorySlug || s._id === subcategorySlug
          );
          if (found) {
            setSubcategory(found);
          } else {
            // Synthesize fallback metadata from slug
            setSubcategory({
              name: subcategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              slug: subcategorySlug
            });
          }
        }

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data.products || prodRes.data || []);
        }
      })
      .catch((err) => {
        if (alive) {
          console.error('Error loading subcategory page:', err);
          setErrorMsg('Failed to load subcategory data.');
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [categorySlug, subcategorySlug]);

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
            <p>Loading subcategory...</p>
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
              <h3>Subcategory Not Found</h3>
              <p>{errorMsg || 'The subcategory could not be found.'}</p>
              <Link to="/">Back to Homepage</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const subName = subcategory?.name || subcategorySlug;

  return (
    <>
      <StorefrontStyles />
      <main className="sf cat-page">
        <StorefrontHeader />

        {/* Breadcrumb Navigation */}
        <nav className="cat-breadcrumb-bar" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to={`/category/${category.slug}`}>{category.name}</Link>
          <span className="sep">/</span>
          <span className="current">{subName}</span>
        </nav>

        {/* Subcategory Hero Header */}
        <header className="cat-page-hero">
          <div className="cat-page-hero-text">
            <p className="cat-page-kicker">
              <Link to={`/category/${category.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {category.name}
              </Link>{' '}
              &bull; Subcategory
            </p>
            <h1>{subName}</h1>
            {subcategory?.description && <p>{subcategory.description}</p>}
          </div>
          {subcategory?.image && (
            <img
              src={resolveImageUrl(subcategory.image)}
              alt={subName}
              className="cat-page-hero-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </header>

        {/* Products Section */}
        <section className="cat-page-section">
          <div className="cat-page-sec-header">
            <h2>Products in {subName}</h2>
            <p>
              {products.length > 0
                ? `Showing ${products.length} exclusive product${products.length === 1 ? '' : 's'}`
                : 'Products matching this subcategory'}
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
            // Instant product display for subcategory item if no separate products uploaded yet
            <div className="cat-prod-grid">
              {(() => {
                const subItem = {
                  _id: subcategory?._id || 'sub-fallback',
                  name: subName,
                  slug: subcategory?.slug || subcategorySlug,
                  description: subcategory?.description || `Premium ${subName} corporate collection.`,
                  price: subcategory?.price || 999,
                  sale_price: subcategory?.salePrice || 799,
                  images: subcategory?.image ? [subcategory.image] : []
                };
                const cartItem = items.find((i) => i.productSlug === subItem.slug || i.dbId === subItem._id);
                const displayPrice = subItem.sale_price || subItem.price;
                const hasDiscount = subItem.sale_price && subItem.sale_price < subItem.price;

                return (
                  <article key={subItem._id} className="sf-product">
                    <Link to={`/product/${subItem.slug}`} className="sf-product-image">
                      <img
                        src={resolveImageUrl(subItem.images?.[0]) || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={subItem.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                        }}
                      />
                      {hasDiscount && <span>Sale</span>}
                    </Link>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                        <Link to={`/product/${subItem.slug}`}>{subItem.name}</Link>
                      </h3>
                      <p>{subItem.description}</p>
                      <div className="sf-product-bottom">
                        <div>
                          <strong>&#8377;{displayPrice.toLocaleString('en-IN')}</strong>
                          {hasDiscount && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                              &#8377;{subItem.price.toLocaleString('en-IN')}
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
                              handleAddProduct(subItem);
                            }}
                          >
                            Add <b>+</b>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })()}
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

