import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { resolveImageUrl } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import StorefrontStyles from './StorefrontStyles';

const pageData = {
  '/tshirts': ['Custom T-shirts', 'Made to be worn, remembered, and talked about.', 'T-Shirts'],
  '/hoodies': ['Custom Hoodies', 'Comfort that carries your identity further.', 'Hoodies'],
  '/accessories': ['Custom Accessories', 'The small details that make a big impression.', 'Accessories'],
  '/alumni-kits': ['Alumni & School Kits', 'Everything your community needs, made to belong together.', 'Alumni'],
  '/today-deals': ["Today's Favourites", 'Limited-time picks for your next big idea.', ''],
  '/new-arrivals': ['Freshly printed', 'New ways to make your mark.', '']
};
const categories = [
  ['T-Shirts', '/tshirts', 'Wear your brand'], ['Hoodies', '/hoodies', 'Layer up'], ['Accessories', '/accessories', 'Carry it everywhere'], ['Brand Kits', '/alumni-kits', 'Made for belonging']
];

const ProductTile = ({ product, onAdd }) => (
  <article className="sf-product">
    <Link to={`/product/${product.slug}`} className="sf-product-image">
      <img src={resolveImageUrl(product.images?.[0])} alt={product.name} />
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

const ProductSection = ({ title, products, loading, onAdd }) => (
  <section className="sf-section sf-products">
    <div className="sf-title">
      <div>
        <p className="sf-kicker">The crowd favourites</p>
        <h2>{title}</h2>
      </div>
      <Link to="/print-studio">Custom design &rarr;</Link>
    </div>
    {loading ? (
      <p className="sf-loading">Loading products&hellip;</p>
    ) : products.length ? (
      <div className="sf-products-grid">
        {products.map((product) => <ProductTile product={product} onAdd={onAdd} key={product._id} />)}
      </div>
    ) : (
      <p className="sf-loading">Products will appear here as soon as the catalogue is available.</p>
    )}
  </section>
);

/* ── Shared Footer (same on every storefront page) ─────────────────── */
const SharedFooter = () => (
  <footer className="sf-footer">
    <div className="sf-footer-inner">
      <div className="sf-footer-brand">
        <div className="sf-logo"><img src="/brlogo.png" alt="Brand Era" /></div>
        <p className="sf-footer-tagline">Design. Print. Brand. Deliver.</p>
        <p className="sf-footer-sub">Custom merchandise, print, and branded essentials made for your next big idea.</p>
      </div>
      <div className="sf-footer-links">
        <div className="sf-footer-col">
          <h4>Products</h4>
          <Link to="/tshirts">T-Shirts</Link>
          <Link to="/hoodies">Hoodies</Link>
          <Link to="/accessories">Accessories</Link>
          <Link to="/alumni-kits">Alumni Kits</Link>
        </div>
        <div className="sf-footer-col">
          <h4>Services</h4>
          <Link to="/print-studio">Design Studio</Link>
          <Link to="/bulk-order">Bulk Orders</Link>
          <Link to="/account">My Account</Link>
        </div>
        <div className="sf-footer-col">
          <h4>Company</h4>
          <Link to="/about-us">About Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/feedback">Feedback</Link>
        </div>
        <div className="sf-footer-col">
          <h4>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
        </div>
      </div>
    </div>
    <div className="sf-footer-bottom">
      <span>&copy; {new Date().getFullYear()} Brand Era. All rights reserved.</span>
      <div className="sf-footer-bottom-links">
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/disclaimer">Disclaimer</Link>
        <Link to="/faq">Support</Link>
      </div>
    </div>
  </footer>
);

const StorefrontPage = () => {
  const location = useLocation();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const isHome = location.pathname === '/';
  const current = pageData[location.pathname] || pageData['/tshirts'];

  useEffect(() => {
    let alive = true;
    api.get('/products?limit=60')
      .then((result) => { if (!alive) return; setProducts(result.success ? (result.data?.products || result.data || []) : []); })
      .catch(() => alive && setNotice('The catalogue is temporarily unavailable.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const displayedProducts = useMemo(() => {
    const filter = current?.[2]?.toLowerCase();
    return (filter
      ? products.filter((item) => `${item.category_id?.name || ''} ${item.name || ''}`.toLowerCase().includes(filter))
      : products
    ).slice(0, 12);
  }, [products, current]);

  const addProduct = async (product) => {
    try {
      await addToCart({
        id: product.slug, productSlug: product.slug, dbId: product._id, name: product.name,
        price: product.sale_price || product.price || 0, image: product.images?.[0],
        sizes: product.sizes || [], colors: product.colors || [], quantity: 1
      });
      setNotice(`${product.name} added to your cart.`);
    } catch (error) {
      setNotice(error.message || 'Please sign in to add this item.');
    }
  };

  const userRole = localStorage.getItem('userRole') || 'user';
  const isAdmin = userRole === 'admin' || localStorage.getItem('userEmail') === 'admin@navodaya.com';

  return (
    <>
      <StorefrontStyles />
      <main className="sf">
        {/* ── NAV ──────────────────────────────── */}
        <header className="sf-header">
          <Link to="/" className="sf-logo"><img src="/brlogo.png" alt="Brand Era" /></Link>
          <nav>
            <Link to="/products">Products</Link>
            <Link to="/alumni-kits">Solutions</Link>
            <Link to="/print-studio">Design studio</Link>
            <Link to="/bulk-order">Bulk orders</Link>
          </nav>
          <div className="sf-header-actions">
            <Link to="/search" style={{ fontSize: '24px', display: 'inline-flex', alignItems: 'center' }}>&#8981;</Link>
            {isAdmin && <Link to="/admin-profile" style={{ display: 'inline-flex', alignItems: 'center', color: '#e63322', fontWeight: 'bold' }}>👑 Admin</Link>}
            <Link to="/account" style={{ display: 'inline-flex', alignItems: 'center' }}>Account</Link>
            <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center' }}>Cart{totalItems ? ` (${totalItems})` : ''} <b>&rarr;</b></Link>
          </div>
        </header>

        {/* ── HOME vs CATEGORY ─────────────────── */}
        {isHome ? (
          <>
            <section className="sf-hero">
              <div className="sf-hero-copy">
                <p className="sf-kicker">One partner. Every possibility.</p>
                <h1>Everything your<br /><em>brand</em> needs.</h1>
                <p>Create a brand people notice—and never forget. Print, apparel, merchandise, and gifting, made beautifully simple.</p>
                <div>
                  <Link className="sf-primary" to="/tshirts">Shop products <span>&rarr;</span></Link>
                  <Link className="sf-secondary" to="/print-studio">Start designing</Link>
                </div>
                <section className="sf-stats">
                  <span><b>10K+</b>happy customers</span>
                  <span><b>4.8/5</b>average rating</span>
                  <span><b>48 hrs</b>design turnaround</span>
                </section>
              </div>
              <div className="sf-hero-art">
                <div className="sf-dot">QUALITY<br />PRINTS</div>
                <div className="sf-back-card">MAKE<br />YOUR<br />MARK.</div>
                <div className="sf-shirt">be</div>
                <div className="sf-front-card">BRAND<br /><i>ERA</i></div>
                <div className="sf-mug">be</div>
              </div>
            </section>

            <section className="sf-strip">
              <p>Start creating</p>
              {categories.map(([name, path]) => <Link key={name} to={path}>{name} <span>&#8599;</span></Link>)}
            </section>

            <section className="sf-section">
              <div className="sf-title">
                <div>
                  <p className="sf-kicker">Made for where you are going</p>
                  <h2>A better way to build<br />a <em>memorable</em> brand.</h2>
                </div>
                <Link to="/print-studio">Explore Print Studio &rarr;</Link>
              </div>
              <div className="sf-solutions">
                <Link to="/print-studio" className="sf-solution dark"><small>01</small><h3>Starting<br />something new?</h3><p>Get the essentials to launch with confidence.</p><b>Build your kit &rarr;</b></Link>
                <Link to="/alumni-kits" className="sf-solution paper"><small>02</small><h3>Ready to look<br />more polished?</h3><p>Bring every branded detail into focus.</p><i>CREATIVE<br />STUDIO</i><b>Find your fit &rarr;</b></Link>
                <Link to="/bulk-order" className="sf-solution red"><small>03</small><h3>Need it made<br />at scale?</h3><p>Simple, reliable production for bigger ideas.</p><b>Request a quote &rarr;</b></Link>
              </div>
            </section>

            <section className="sf-feature">
              <div className="sf-feature-art"><span>be</span><i>DESIGN • PRINT • BRAND • DELIVER •</i></div>
              <div>
                <p className="sf-kicker">Make it unmistakably yours</p>
                <h2>From a blank canvas<br />to a <em>big impression.</em></h2>
                <p>Upload your logo, use a flexible template, or work with our team to get every detail right.</p>
                <ul>
                  <li><b>01</b> Choose a product or kit</li>
                  <li><b>02</b> Customize your way</li>
                  <li><b>03</b> Approve, print, and receive</li>
                </ul>
                <Link className="sf-primary" to="/print-studio">Open Print Studio <span>&rarr;</span></Link>
              </div>
            </section>

            <ProductSection title="Ideas made real." products={products.slice(0, 4)} loading={loading} onAdd={addProduct} />

            <section className="sf-kit">
              <div>
                <p className="sf-kicker">Bring it all together</p>
                <h2>Your brand,<br />in a box.</h2>
                <p>Build a coordinated collection that looks intentional, everywhere it shows up.</p>
                <Link className="sf-light" to="/print-studio">Build your brand kit &rarr;</Link>
              </div>
              <div className="sf-kit-art"><b>BRAND<br /><i>ERA</i></b><span>Your next<br />big idea.</span></div>
            </section>
          </>
        ) : (
          <>
            <section className="sf-category-hero">
              <p className="sf-kicker">Custom printed. Made for you.</p>
              <h1>{current[0]}</h1>
              <p>{current[1]}</p>
              <Link className="sf-primary" to="/print-studio">Customize your own <span>&rarr;</span></Link>
            </section>
            <ProductSection title={current[0]} products={displayedProducts} loading={loading} onAdd={addProduct} />
          </>
        )}

        {/* ── TRUST BAR ────────────────────────── */}
        <section className="sf-promise">
          <span>&#10022; Premium print quality</span>
          <span>&#9647; Free delivery over &#8377;999</span>
          <span>&#9635; Secure payments</span>
          <span>&#10003; Made for your brand</span>
        </section>

        {/* ── SHARED FOOTER ────────────────────── */}
        <SharedFooter />

        {/* ── TOAST ────────────────────────────── */}
        {notice && <button className="sf-notice" onClick={() => setNotice('')}>{notice} &times;</button>}
      </main>
    </>
  );
};

export default StorefrontPage;
