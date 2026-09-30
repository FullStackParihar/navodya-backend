import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import StorefrontStyles from '../features/storefront/StorefrontStyles';

const CATEGORIES = [
  { key: 'all',         label: 'All Products',  filter: '',             subtitle: 'Browse our full range of custom merchandise — t-shirts, hoodies, accessories and more.' },
  { key: 'tshirts',     label: 'T-Shirts',      filter: 'T-Shirts',     subtitle: 'Custom printed tees made to be worn, remembered, and talked about.' },
  { key: 'hoodies',     label: 'Hoodies',       filter: 'Hoodies',      subtitle: 'Comfort that carries your identity further. Custom hoodies for every occasion.' },
  { key: 'accessories', label: 'Accessories',   filter: 'Accessories',  subtitle: 'The small details that make a big impression. Bags, caps, bottles and more.' },
  { key: 'alumni',      label: 'Alumni Kits',   filter: 'Alumni',       subtitle: 'Everything your community needs, made to belong together.' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Featured' },
  { key: 'price-asc',  label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'name-asc',   label: 'Name: A to Z' },
];

const ProductTile = ({ product, onAdd }) => (
  <article className="sf-product">
    <Link to={'/product/' + product.slug} className="sf-product-image">
      <img src={resolveImageUrl(product.images?.[0])} alt={product.name} loading="lazy" />
      <span>{product.sale_price ? 'Sale' : 'Customizable'}</span>
    </Link>
    <div>
      <h3>{product.name}</h3>
      <p>{product.description || 'Crafted around your idea.'}</p>
      <div className="sf-product-bottom">
        <strong>&#8377;{(product.sale_price || product.price || 0).toLocaleString('en-IN')}</strong>
        <button onClick={() => onAdd(product)}>Add <b>+</b></button>
      </div>
    </div>
  </article>
);

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'default';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get('/products?limit=200')
      .then(res => { if (!alive) return; setProducts(res.success ? (res.data?.products || res.data || []) : []); })
      .catch(() => alive && setNotice('Could not load products. Please try again.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const displayed = useMemo(() => {
    const catObj = CATEGORIES.find(c => c.key === activeCategory);
    const filterWord = catObj?.filter?.toLowerCase() || '';
    let list = products.filter(p => {
      const matchCat = !filterWord || ((p.category_id?.name || '') + ' ' + (p.name || '')).toLowerCase().includes(filterWord);
      const matchQ = !searchQuery || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQ;
    });
    switch (activeSort) {
      case 'price-asc':  list = [...list].sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)); break;
      case 'price-desc': list = [...list].sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)); break;
      case 'name-asc':   list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      default: break;
    }
    return list;
  }, [products, activeCategory, activeSort, searchQuery]);

  const setParam = (key, val) => {
    setSearchParams(prev => { const next = new URLSearchParams(prev); if (val) next.set(key, val); else next.delete(key); return next; });
  };

  const handleSearch = (e) => { e.preventDefault(); setParam('q', searchInput.trim()); };

  const addProduct = async (product) => {
    try {
      await addToCart({ id: product.slug, productSlug: product.slug, dbId: product._id, name: product.name, price: product.sale_price || product.price || 0, image: product.images?.[0], sizes: product.sizes || [], colors: product.colors || [], quantity: 1 });
      success(product.name + ' added to cart!');
    } catch (err) { toastError(err.message || 'Please sign in to add items.'); }
  };

  const s = {
    filterBar: { display:'flex', flexWrap:'wrap', gap:'16px', alignItems:'center', justifyContent:'space-between', padding:'18px 5.5vw', background:'#fff', borderBottom:'1px solid #e5e7eb', position:'sticky', top:'65px', zIndex:90, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
    catTabs:   { display:'flex', flexWrap:'wrap', gap:'8px' },
    catTab:    { padding:'8px 18px', borderRadius:'999px', border:'1.5px solid #d1d5db', background:'transparent', color:'#374151', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' },
    catTabActive: { background:'#e63322', borderColor:'#e63322', color:'#fff' },
    filterRight: { display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' },
    searchForm:  { display:'flex', border:'1.5px solid #d1d5db', borderRadius:'8px', overflow:'hidden' },
    searchInput: { border:'none', outline:'none', padding:'8px 12px', fontSize:'13px', fontFamily:'inherit', width:'180px', background:'#f9fafb' },
    searchBtn:   { border:'none', background:'#e63322', color:'#fff', padding:'8px 14px', fontSize:'16px', cursor:'pointer', fontFamily:'inherit' },
    sortSelect:  { padding:'8px 12px', border:'1.5px solid #d1d5db', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', background:'#f9fafb', cursor:'pointer', outline:'none' },
    resultsRow:  { display:'flex', alignItems:'center', gap:'12px', padding:'12px 5.5vw 0' },
    resultsCount:{ fontSize:'14px', color:'#6b7280' },
    clearSearch: { background:'none', border:'1px solid #d1d5db', borderRadius:'6px', padding:'4px 10px', fontSize:'12px', cursor:'pointer', color:'#6b7280', fontFamily:'inherit' },
    emptyState:  { textAlign:'center', padding:'80px 24px', color:'#374151' },
    emptyIcon:   { fontSize:'56px', marginBottom:'16px' },
    resetBtn:    { marginTop:'20px', padding:'10px 24px', background:'#e63322', color:'#fff', border:'none', borderRadius:'30px', fontSize:'14px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit' },
  };

  const userRole = localStorage.getItem('userRole') || 'user';
  const isAdmin = userRole === 'admin' || localStorage.getItem('userEmail') === 'admin@navodaya.com';

  return (
    <>
      <StorefrontStyles />
      <main className="sf">
        <header className="sf-header">
          <Link to="/" className="sf-logo"><img src="/brlogo.png" alt="Brand Era" /></Link>
          <nav>
            <Link to="/products">Products</Link>
            <Link to="/alumni-kits">Solutions</Link>
            <Link to="/print-studio">Design Studio</Link>
            <Link to="/bulk-order">Bulk Orders</Link>
          </nav>
          <div className="sf-header-actions">
            <Link to="/search" style={{ fontSize:'24px', display:'inline-flex', alignItems:'center' }}>&#8981;</Link>
            {isAdmin && <Link to="/admin-profile" style={{ display: 'inline-flex', alignItems: 'center', color: '#e63322', fontWeight: 'bold' }}>👑 Admin</Link>}
            <Link to="/account" style={{ display:'inline-flex', alignItems:'center' }}>Account</Link>
            <Link to="/cart" style={{ display:'inline-flex', alignItems:'center' }}>Cart <b>&rarr;</b></Link>
          </div>
        </header>

        <section className="sf-category-hero">
          <p className="sf-kicker">Brand Era Collection</p>
          <h1>{CATEGORIES.find(c => c.key === activeCategory)?.label || 'All Products'}</h1>
          <p>{CATEGORIES.find(c => c.key === activeCategory)?.subtitle || ''}</p>
        </section>

        <div style={s.filterBar}>
          <div style={s.catTabs}>
            {CATEGORIES.map(cat => (
              <button key={cat.key} style={{ ...s.catTab, ...(activeCategory === cat.key ? s.catTabActive : {}) }} onClick={() => setParam('category', cat.key === 'all' ? '' : cat.key)}>
                {cat.label}
              </button>
            ))}
          </div>
          <div style={s.filterRight}>
            <form onSubmit={handleSearch} style={s.searchForm}>
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search products..." style={s.searchInput} />
              <button type="submit" style={s.searchBtn}>&#8981;</button>
            </form>
            <select value={activeSort} onChange={e => setParam('sort', e.target.value)} style={s.sortSelect}>
              {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div style={s.resultsRow}>
          {!loading && <span style={s.resultsCount}>{displayed.length} product{displayed.length !== 1 ? 's' : ''}{searchQuery && <> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}</span>}
          {searchQuery && <button style={s.clearSearch} onClick={() => { setSearchInput(''); setParam('q', ''); }}>x Clear</button>}
        </div>

        <section className="sf-section sf-products" style={{ paddingTop:'24px' }}>
          {loading ? (
            <p className="sf-loading">Loading products&hellip;</p>
          ) : displayed.length ? (
            <div className="sf-products-grid">{displayed.map(p => <ProductTile key={p._id} product={p} onAdd={addProduct} />)}</div>
          ) : (
            <div style={s.emptyState}>
              <p style={s.emptyIcon}>🛍️</p>
              <h3>No products found</h3>
              <p>Try a different category or clear your search.</p>
              <button style={s.resetBtn} onClick={() => { setSearchInput(''); setSearchParams({}); }}>Reset filters</button>
            </div>
          )}
        </section>

        {notice && <button className="sf-notice" onClick={() => setNotice('')}>{notice} &times;</button>}

        <footer className="sf-footer">
          <div className="sf-footer-inner">
            <div className="sf-footer-brand">
              <div className="sf-logo"><img src="/brlogo.png" alt="Brand Era" /></div>
              <p className="sf-footer-tagline">Design. Print. Brand. Deliver.</p>
              <p className="sf-footer-sub">Custom merchandise made beautifully simple.</p>
            </div>
            <div className="sf-footer-links">
              <div className="sf-footer-col"><h4>Products</h4><Link to="/tshirts">T-Shirts</Link><Link to="/hoodies">Hoodies</Link><Link to="/accessories">Accessories</Link><Link to="/alumni-kits">Alumni Kits</Link></div>
              <div className="sf-footer-col"><h4>Services</h4><Link to="/print-studio">Design Studio</Link><Link to="/bulk-order">Bulk Orders</Link><Link to="/account">My Account</Link></div>
              <div className="sf-footer-col"><h4>Company</h4><Link to="/about-us">About Us</Link><Link to="/faq">FAQ</Link><Link to="/feedback">Feedback</Link></div>
              <div className="sf-footer-col"><h4>Legal</h4><Link to="/privacy-policy">Privacy Policy</Link><Link to="/refund-policy">Refund Policy</Link><Link to="/terms">Terms</Link></div>
            </div>
          </div>
          <div className="sf-footer-bottom">
            <span>&copy; {new Date().getFullYear()} Brand Era. All rights reserved.</span>
            <div className="sf-footer-bottom-links"><Link to="/privacy-policy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/faq">Support</Link></div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default AllProductsPage;
