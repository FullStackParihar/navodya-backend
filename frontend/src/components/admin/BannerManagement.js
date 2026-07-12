import React, { useEffect, useState } from 'react';
import api, { resolveImageUrl } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import './BannerManagement.css';

const emptyForm = {
  title: '', subtitle: '', offerText: '', buttonText: '', buttonLink: '',
  displayOrder: 0, isActive: true, startDate: '', endDate: '', imageUrl: '', imagePublicId: ''
};

const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

export default function BannerManagement() {
  const { success, error } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const result = await api.get('/admin/banners');
      if (!result.success) throw new Error(result.message);
      setBanners(result.data || []);
    } catch (err) { error(err.message || 'Failed to load banners'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openForm = (banner) => {
    setEditingId(banner?._id || null);
    setForm(banner ? {
      ...emptyForm, ...banner,
      startDate: dateValue(banner.startDate), endDate: dateValue(banner.endDate)
    } : { ...emptyForm, displayOrder: banners.length });
    setModalOpen(true);
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return error('Only JPG, PNG, and WebP images are allowed');
    if (file.size > 9 * 1024 * 1024) return error('Image must be 9 MB or smaller');
    setUploading(true);
    try {
      const body = new FormData(); body.append('image', file);
      const result = await api.post('/admin/banners/upload', body);
      if (!result.success) throw new Error(result.message);
      setForm(current => ({ ...current, imageUrl: result.data.url, imagePublicId: result.data.publicId }));
      success('Image uploaded');
    } catch (err) { error(err.message || 'Image upload failed'); }
    finally { setUploading(false); }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.imageUrl) return error('Please upload a banner image');
    if (form.endDate && form.startDate && form.endDate < form.startDate) return error('End date must be on or after start date');
    setSaving(true);
    try {
      const payload = { ...form, displayOrder: Number(form.displayOrder), startDate: form.startDate || null, endDate: form.endDate || null };
      const result = editingId ? await api.put(`/admin/banners/${editingId}`, payload) : await api.post('/admin/banners', payload);
      if (!result.success) throw new Error(result.message);
      success(editingId ? 'Banner updated' : 'Banner created');
      setModalOpen(false); await load();
    } catch (err) { error(err.message || 'Could not save banner'); }
    finally { setSaving(false); }
  };

  const toggle = async (banner) => {
    const result = await api.patch(`/admin/banners/${banner._id}/status`, { isActive: !banner.isActive });
    if (result.success) { setBanners(list => list.map(item => item._id === banner._id ? result.data : item)); success(result.message); }
    else error(result.message || 'Could not update status');
  };

  const remove = async (banner) => {
    if (!window.confirm(`Delete “${banner.title}”? This cannot be undone.`)) return;
    const result = await api.delete(`/admin/banners/${banner._id}`);
    if (result.success) { setBanners(list => list.filter(item => item._id !== banner._id)); success('Banner deleted'); }
    else error(result.message || 'Could not delete banner');
  };

  const move = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= banners.length) return;
    const reordered = [...banners];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    const normalized = reordered.map((item, order) => ({ ...item, displayOrder: order }));
    setBanners(normalized);
    const result = await api.patch('/admin/banners/reorder', { items: normalized.map(item => ({ id: item._id, displayOrder: item.displayOrder })) });
    if (result.success) { setBanners(result.data); success('Banner order updated'); }
    else { error(result.message || 'Could not reorder banners'); load(); }
  };

  return <div className="admin-section banner-admin">
    <div className="section-header"><h2>Banner &amp; Offers</h2><button className="add-btn" onClick={() => openForm()}><i className="fas fa-plus" /> Add Banner</button></div>
    {loading ? <div className="banner-admin-state">Loading banners…</div> : banners.length === 0 ? <div className="banner-admin-state">No banners yet. Add your first homepage banner.</div> :
      <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Order</th><th>Banner</th><th>Title / Offer</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{banners.map((banner, index) => <tr key={banner._id}>
          <td><div className="banner-order"><strong>{banner.displayOrder}</strong><button disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${banner.title} up`}>↑</button><button disabled={index === banners.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${banner.title} down`}>↓</button></div></td>
          <td><img className="banner-thumbnail" src={resolveImageUrl(banner.imageUrl)} alt="" /></td>
          <td><strong>{banner.title}</strong><small>{banner.offerText || 'No offer text'}</small></td>
          <td><small>{dateValue(banner.startDate) || 'Immediately'}<br />to {dateValue(banner.endDate) || 'No end date'}</small></td>
          <td><button className={`banner-status ${banner.isActive ? 'active' : ''}`} onClick={() => toggle(banner)}>{banner.isActive ? 'Active' : 'Inactive'}</button></td>
          <td><div className="banner-actions"><button onClick={() => openForm(banner)} aria-label={`Edit ${banner.title}`}><i className="fas fa-edit" /></button><button className="danger" onClick={() => remove(banner)} aria-label={`Delete ${banner.title}`}><i className="fas fa-trash" /></button></div></td>
        </tr>)}</tbody></table></div>}

    {modalOpen && <div className="admin-modal-overlay" onMouseDown={e => e.target === e.currentTarget && setModalOpen(false)}><div className="admin-modal banner-modal" role="dialog" aria-modal="true" aria-labelledby="banner-form-title">
      <div className="modal-header"><h3 id="banner-form-title">{editingId ? 'Edit Banner' : 'Add Banner'}</h3><button onClick={() => setModalOpen(false)} aria-label="Close">&times;</button></div>
      <form onSubmit={save}><div className="banner-form-grid">
        <label className="wide">Banner image *<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} /><small>JPG, PNG or WebP, maximum 9 MB. Recommended 1600 × 650.</small></label>
        {form.imageUrl && <img className="banner-form-image wide" src={resolveImageUrl(form.imageUrl)} alt="Banner preview" />}
        <label>Title *<input required maxLength="120" value={form.title} onChange={e => setForm({...form, title:e.target.value})} /></label>
        <label>Offer text<input maxLength="100" value={form.offerText} onChange={e => setForm({...form, offerText:e.target.value})} /></label>
        <label className="wide">Subtitle / description<textarea maxLength="300" value={form.subtitle} onChange={e => setForm({...form, subtitle:e.target.value})} /></label>
        <label>Button text<input maxLength="50" value={form.buttonText} onChange={e => setForm({...form, buttonText:e.target.value})} /></label>
        <label>Button link<input maxLength="500" placeholder="/tshirts or https://…" value={form.buttonLink} onChange={e => setForm({...form, buttonLink:e.target.value})} /></label>
        <label>Display order<input type="number" min="0" required value={form.displayOrder} onChange={e => setForm({...form, displayOrder:e.target.value})} /></label>
        <label className="banner-check"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive:e.target.checked})} /> Active</label>
        <label>Start date (optional)<input type="date" value={form.startDate} onChange={e => setForm({...form, startDate:e.target.value})} /></label>
        <label>End date (optional)<input type="date" min={form.startDate || undefined} value={form.endDate} onChange={e => setForm({...form, endDate:e.target.value})} /></label>
      </div><div className="banner-modal-actions"><button type="button" onClick={() => setPreviewOpen(true)} disabled={!form.imageUrl}>Preview</button><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="add-btn" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save Banner'}</button></div></form>
    </div></div>}
    {previewOpen && <div className="admin-modal-overlay banner-preview-overlay" onClick={() => setPreviewOpen(false)}><div className="banner-live-preview" onClick={e => e.stopPropagation()} style={{backgroundImage:`linear-gradient(90deg, rgba(8,15,30,.82), rgba(8,15,30,.18)), url(${resolveImageUrl(form.imageUrl)})`}}><div>{form.offerText && <span>{form.offerText}</span>}<h2>{form.title || 'Banner title'}</h2><p>{form.subtitle}</p>{form.buttonText && <b>{form.buttonText}</b>}</div><button aria-label="Close preview" onClick={() => setPreviewOpen(false)}>&times;</button></div></div>}
  </div>;
}
