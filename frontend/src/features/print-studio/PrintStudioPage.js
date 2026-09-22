import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../../utils/api';
import PrintStudioStyles from './PrintStudioStyles';

const emptyForm = {
  organizationName: '', contactPerson: '', email: '', phone: '', deliveryAddress: '',
  city: '', state: '', pincode: '', requiredDate: '', estimatedBudget: '', additionalNotes: ''
};

const PrintStudioPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [activeSide, setActiveSide] = useState('front');
  const [designs, setDesigns] = useState({ front: { text: 'YOUR IDEA HERE', file: null, preview: '' }, back: { text: 'MAKE YOUR MARK', file: null, preview: '' } });
  const [color, setColor] = useState('#151515');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get('/categories'), api.get('/products?limit=100')])
      .then(([categoryResult, productResult]) => {
        if (!mounted) return;
        const categoryData = categoryResult.success ? (categoryResult.data?.categories || categoryResult.data || []) : [];
        const productData = productResult.success ? (productResult.data?.products || productResult.data || []) : [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setProducts(Array.isArray(productData) ? productData : []);
      })
      .catch(() => mounted && setMessage('We could not load the product catalogue. Please try again.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const selectedCategory = categories.find((item) => item._id === categoryId);
  const filteredProducts = useMemo(() => products.filter((item) => {
    const itemCategory = item.category_id?._id || item.category_id;
    return !categoryId || itemCategory === categoryId;
  }), [products, categoryId]);
  const selectedProduct = products.find((item) => item._id === productId);
  const unitPrice = selectedProduct?.sale_price || selectedProduct?.price || 0;
  const estimate = unitPrice * Number(quantity || 0);

  const selectCategory = (nextCategory) => { setCategoryId(nextCategory); setProductId(''); };
  const chooseFile = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (nextFile.size > 10 * 1024 * 1024) { setMessage('Choose an artwork file smaller than 10 MB.'); return; }
    setDesigns((current) => ({ ...current, [activeSide]: { ...current[activeSide], file: nextFile, preview: nextFile.type.startsWith('image/') ? URL.createObjectURL(nextFile) : '' } }));
    setMessage('');
  };
  const updateDesignText = (event) => setDesigns((current) => ({ ...current, [activeSide]: { ...current[activeSide], text: event.target.value } }));
  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const requestQuote = async (event) => {
    event.preventDefault();
    if (!categoryId || !productId) { setMessage('Choose a product before requesting a quote.'); return; }
    setSubmitting(true); setMessage('');
    const data = new FormData();
    data.append('payload', JSON.stringify({
      ...form,
      estimatedBudget: Number(form.estimatedBudget || estimate),
      products: [{
        productKey: 'studio-design', categoryId, categoryName: selectedCategory?.name || '', productId,
        productName: selectedProduct?.name || '', generalQuantity: Number(quantity),
        designRequirements: `Front: ${designs.front.text || 'Artwork supplied'} | Back: ${designs.back.text || 'Artwork supplied'}`
      }]
    }));
    if (designs.front.file) data.append('attachments_studio-design', designs.front.file);
    if (designs.back.file) data.append('attachments_studio-design', designs.back.file);
    try {
      const result = await api.post('/bulk-orders', data);
      if (!result.success) throw new Error(result.message || 'Unable to submit your request.');
      setMessage(`Quote request ${result.data?.request_number || ''} received. We will be in touch shortly.`);
      setForm(emptyForm); setDesigns({ front: { text: 'YOUR IDEA HERE', file: null, preview: '' }, back: { text: 'MAKE YOUR MARK', file: null, preview: '' } });
    } catch (error) {
      setMessage(error.message || 'Unable to submit your request. Please try again.');
    } finally { setSubmitting(false); }
  };

  return <><PrintStudioStyles /><main className="print-studio">
    <section className="studio-hero">
      <div><p className="studio-eyebrow">Brand era print studio</p><h1>Bring your <em>idea</em><br />to life.</h1><p>Pick a product, add artwork, and send a production-ready quote request in minutes.</p><a href="#designer" className="studio-primary">Start designing <span>→</span></a></div>
      <div className="studio-hero-art"><div className="studio-card-back">MAKE<br />YOUR<br />MARK.</div><div className="studio-hero-shirt"><span>be</span></div><div className="studio-card-front">YOUR<br /><i>BRAND</i></div><div className="studio-stamp">DESIGN<br />• PRINT •<br />DELIVER</div></div>
    </section>
    <section className="studio-benefits"><span>✦ Live mockup preview</span><span>◫ Upload your artwork</span><span>₹ Instant estimate</span><span>✓ Production-ready quote</span></section>
    <section className="designer" id="designer">
      <div className="designer-heading"><p className="studio-eyebrow">Your creative workspace</p><h2>Customize it. <em>Make it yours.</em></h2><p>Start from the catalogue or upload your own design for a fast quote.</p></div>
      <div className="designer-grid">
        <aside className="designer-controls">
          <label>1. Choose a category<select value={categoryId} onChange={(event) => selectCategory(event.target.value)} disabled={loading}><option value="">Select a category</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
          <label>2. Choose a product<select value={productId} onChange={(event) => setProductId(event.target.value)} disabled={!categoryId || loading}><option value="">Select a product</option>{filteredProducts.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
          <label>3. Quantity<div className="studio-quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} /><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div></label>
          <label>4. Product colour<div className="studio-swatches">{['#151515', '#f6f1e9', '#d93528', '#284f68'].map((shade) => <button key={shade} type="button" onClick={() => setColor(shade)} className={color === shade ? 'selected' : ''} style={{ background: shade }} aria-label={`Use ${shade} colour`} />)}</div></label>
          <label>5. {activeSide === 'front' ? 'Front' : 'Back'} message<input value={designs[activeSide].text} maxLength="40" onChange={updateDesignText} placeholder="Your brand message" /></label>
        </aside>
        <div className="studio-canvas-wrap"><div className="canvas-bar"><div className="view-switch"><button type="button" className={activeSide === 'front' ? 'active' : ''} onClick={() => setActiveSide('front')}>Front view</button><button type="button" className={activeSide === 'back' ? 'active' : ''} onClick={() => setActiveSide('back')}>Back view</button></div><span>{selectedProduct?.name || 'Choose a product to begin'}</span></div><div className="studio-canvas"><div className={`product-mockup ${activeSide === 'back' ? 'back-view' : ''}`} style={{ '--product-color': color }}>{designs[activeSide].preview ? <img src={designs[activeSide].preview} alt={`Your uploaded ${activeSide} design preview`} /> : <span>{designs[activeSide].text || 'YOUR IDEA HERE'}</span>}</div></div><div className="side-status"><b>{activeSide === 'front' ? 'Front' : 'Back'} design</b><span>{designs[activeSide].file ? designs[activeSide].file.name : `${activeSide === 'front' ? 'Front' : 'Back'} side has text-only artwork`}</span></div><label className="upload-zone"><input type="file" accept="image/png,image/jpeg,image/webp,application/pdf,image/svg+xml" onChange={chooseFile} /><b>{designs[activeSide].file ? `Replace ${activeSide} artwork` : `Upload ${activeSide} artwork`}</b><small>PNG, JPG, WEBP, SVG or PDF · max 10 MB</small></label></div>
        <aside className="studio-summary"><p>Estimated total</p><strong>{estimate ? `₹${estimate.toLocaleString('en-IN')}` : '—'}</strong><small>{selectedProduct ? `₹${unitPrice.toLocaleString('en-IN')} per item` : 'Pricing appears after you choose a product.'}</small><hr /><p>Ready to order?</p><span>Send this design to our production team for a detailed quote and delivery plan.</span></aside>
      </div>
    </section>
    <section className="quote-section"><div><p className="studio-eyebrow">Quote & production</p><h2>Let’s make it<br /><em>official.</em></h2><p>Share a few delivery details and we will take it from here.</p></div><form onSubmit={requestQuote} className="quote-form"><div className="quote-form-grid"><label>Organisation<input name="organizationName" value={form.organizationName} onChange={updateForm} required /></label><label>Contact person<input name="contactPerson" value={form.contactPerson} onChange={updateForm} required /></label><label>Email<input type="email" name="email" value={form.email} onChange={updateForm} required /></label><label>Phone<input name="phone" value={form.phone} onChange={updateForm} required /></label><label>Delivery address<input name="deliveryAddress" value={form.deliveryAddress} onChange={updateForm} required /></label><label>City<input name="city" value={form.city} onChange={updateForm} required /></label><label>State<input name="state" value={form.state} onChange={updateForm} required /></label><label>Pincode<input name="pincode" inputMode="numeric" value={form.pincode} onChange={updateForm} required /></label><label>Required by<input type="date" name="requiredDate" value={form.requiredDate} onChange={updateForm} required /></label><label>Budget (₹)<input type="number" name="estimatedBudget" min="0" placeholder={String(estimate || '')} value={form.estimatedBudget} onChange={updateForm} /></label></div><label>Anything else we should know?<textarea name="additionalNotes" value={form.additionalNotes} onChange={updateForm} placeholder="Print placement, finish, packaging, or delivery notes" /></label><button className="studio-primary" disabled={submitting}>{submitting ? 'Sending request…' : 'Request my quote'} <span>→</span></button>{message && <p className="studio-message" role="status">{message}</p>}</form></section>
    <section className="studio-next"><p>Looking for ready-to-ship pieces?</p><Link to="/tshirts">Explore apparel <span>→</span></Link><Link to="/bulk-order">Build a larger order <span>→</span></Link></section>
  </main></>;
};

export default PrintStudioPage;
