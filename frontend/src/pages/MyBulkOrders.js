import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const STATUSES = [
  'New',
  'Under Review',
  'Contacted',
  'Quotation Sent',
  'Approved',
  'In Production',
  'Completed',
  'Rejected',
  'Cancelled',
];

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
};

const sizeEntries = (sizes = {}) => Object.entries(sizes).filter(([, qty]) => Number(qty) > 0);

const MyBulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [profileEmail, setProfileEmail] = useState(localStorage.getItem('userEmail') || '');

  const currentPage = pagination.page || 1;
  const totalPages = Math.max(1, pagination.totalPages || 1);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(pagination.limit || 10),
    });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return params.toString();
  }, [currentPage, pagination.limit, search, status]);

  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const profileResult = await api.get('/auth/profile');
        if (mounted && profileResult.success) {
          const profile = profileResult.data?.user || profileResult.data;
          setProfileEmail(profile?.email || localStorage.getItem('userEmail') || '');
        }
        const result = await api.get(`/bulk-orders/my-orders?${queryString}`);
        if (!mounted) return;
        if (!result.success) {
          setErrorMessage(result.message || 'Unable to load bulk orders.');
          setOrders([]);
          return;
        }
        setOrders(result.data?.items || []);
        setPagination(result.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      } catch (error) {
        if (mounted) {
          setErrorMessage('Network or server error. Please try again.');
          setOrders([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadOrders();
    return () => {
      mounted = false;
    };
  }, [queryString]);

  const applySearch = (event) => {
    event.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    setStatus(event.target.value);
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page: Math.min(Math.max(1, page), totalPages) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetails = async (id) => {
    setDetailLoading(true);
    setDetailError('');
    setSelectedOrder(null);
    try {
      const result = await api.get(`/bulk-orders/my-orders/${id}`);
      if (!result.success) {
        setDetailError(result.message || 'Unable to load bulk order details.');
        return;
      }
      setSelectedOrder(result.data);
    } catch (error) {
      setDetailError('Network or server error. Please try again.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    setDetailError('');
    setDetailLoading(false);
  };

  return (
    <div className="my-bulk-orders-page">
      <div className="my-bulk-container">
        <header className="my-bulk-header">
          <div>
            <p>Customer dashboard</p>
            <h1>My Bulk Orders</h1>
            {profileEmail && <span className="my-bulk-account">Showing orders for {profileEmail}</span>}
          </div>
        </header>

        <section className="my-bulk-toolbar">
          <form className="my-bulk-search" onSubmit={applySearch}>
            <label htmlFor="bulk-order-search">Search by Request ID</label>
            <div>
              <input
                id="bulk-order-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="BO-2026-0001"
              />
              <button type="submit">Search</button>
            </div>
          </form>

          <label className="my-bulk-filter" htmlFor="bulk-order-status">
            <span>Status</span>
            <select id="bulk-order-status" value={status} onChange={handleStatusChange}>
              <option value="">All statuses</option>
              {STATUSES.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </section>

        {errorMessage && <div className="my-bulk-alert error">{errorMessage}</div>}

        <section className="my-bulk-list">
          {loading ? (
            <div className="my-bulk-state">
              <i className="fas fa-spinner fa-spin" />
              <p>Loading your bulk orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="my-bulk-state">
              <i className="fas fa-clipboard-list" />
              <h2>No bulk orders found</h2>
              <p>
                {search || status
                  ? 'No bulk order matches the current search or status filter.'
                  : 'Your submitted bulk order requests will appear here for the logged-in account.'}
              </p>
              {profileEmail && <p className="my-bulk-hint">Logged-in email: {profileEmail}</p>}
            </div>
          ) : (
            <>
              <div className="my-bulk-table-wrap">
                <table className="my-bulk-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Organization</th>
                      <th>Products</th>
                      <th>Total Qty</th>
                      <th>Required Date</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td data-label="Request ID"><strong>{order.request_number}</strong></td>
                        <td data-label="Organization">{order.organization_name}</td>
                        <td data-label="Products">{order.products?.length || 0}</td>
                        <td data-label="Total Qty">{order.grand_total_quantity}</td>
                        <td data-label="Required Date">{formatDate(order.required_date)}</td>
                        <td data-label="Budget">{formatCurrency(order.estimated_budget)}</td>
                        <td data-label="Status"><span className="my-bulk-status">{order.status}</span></td>
                        <td data-label="Submitted">{formatDate(order.created_at)}</td>
                        <td data-label="Action">
                          <button className="my-bulk-view-btn" type="button" onClick={() => openDetails(order._id)}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="my-bulk-pagination">
                <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1}>
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages}>
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {(detailLoading || detailError || selectedOrder) && (
        <div className="my-bulk-modal-backdrop" role="presentation" onClick={closeDetails}>
          <div className="my-bulk-modal" role="dialog" aria-modal="true" aria-label="Bulk order details" onClick={(event) => event.stopPropagation()}>
            <button className="my-bulk-close" type="button" onClick={closeDetails} aria-label="Close details">
              <i className="fas fa-times" />
            </button>

            {detailLoading ? (
              <div className="my-bulk-state">
                <i className="fas fa-spinner fa-spin" />
                <p>Loading details...</p>
              </div>
            ) : detailError ? (
              <div className="my-bulk-alert error">{detailError}</div>
            ) : selectedOrder && (
              <>
                <div className="my-bulk-modal-head">
                  <div>
                    <p>{selectedOrder.request_number}</p>
                    <h2>{selectedOrder.organization_name}</h2>
                  </div>
                  <span className="my-bulk-status">{selectedOrder.status}</span>
                </div>

                {selectedOrder.customer_message && (
                  <div className="my-bulk-alert info">{selectedOrder.customer_message}</div>
                )}

                <div className="my-bulk-detail-grid">
                  <section>
                    <h3>Contact Details</h3>
                    <dl>
                      <div><dt>Contact Person</dt><dd>{selectedOrder.contact_person}</dd></div>
                      <div><dt>Email</dt><dd>{selectedOrder.email}</dd></div>
                      <div><dt>Phone</dt><dd>{selectedOrder.phone}</dd></div>
                    </dl>
                  </section>

                  <section>
                    <h3>Delivery Details</h3>
                    <dl>
                      <div><dt>Address</dt><dd>{selectedOrder.delivery_address}</dd></div>
                      <div><dt>City</dt><dd>{selectedOrder.city}</dd></div>
                      <div><dt>State</dt><dd>{selectedOrder.state}</dd></div>
                      <div><dt>Pincode</dt><dd>{selectedOrder.pincode}</dd></div>
                      <div><dt>Required Date</dt><dd>{formatDate(selectedOrder.required_date)}</dd></div>
                      <div><dt>Estimated Budget</dt><dd>{formatCurrency(selectedOrder.estimated_budget)}</dd></div>
                    </dl>
                  </section>
                </div>

                {selectedOrder.additional_notes && (
                  <section className="my-bulk-notes">
                    <h3>Notes</h3>
                    <p>{selectedOrder.additional_notes}</p>
                  </section>
                )}

                <section className="my-bulk-products">
                  <h3>Products</h3>
                  {(selectedOrder.products || []).map((product, index) => (
                    <article className="my-bulk-product" key={product.product_key || index}>
                      <div className="my-bulk-product-head">
                        <div>
                          <h4>{product.product_name}</h4>
                          <p>{product.category_name} | Total Qty: {product.total_quantity}</p>
                        </div>
                        {product.is_custom_product && <span>Custom</span>}
                      </div>

                      {(product.description || product.specifications || product.design_requirements) && (
                        <div className="my-bulk-product-copy">
                          {product.description && <p><strong>Description:</strong> {product.description}</p>}
                          {product.specifications && <p><strong>Specifications:</strong> {product.specifications}</p>}
                          {product.design_requirements && <p><strong>Design:</strong> {product.design_requirements}</p>}
                        </div>
                      )}

                      <div className="my-bulk-sizes">
                        {sizeEntries(product.size_quantities).map(([size, qty]) => (
                          <span key={size}>{size.toUpperCase()}: {qty}</span>
                        ))}
                        {Number(product.general_quantity) > 0 && <span>General: {product.general_quantity}</span>}
                      </div>

                      {product.attachments?.length > 0 && (
                        <div className="my-bulk-attachments">
                          <h5>Attachments</h5>
                          {product.attachments.map(file => (
                            <a key={file.stored_file_name} href={file.file_url} target="_blank" rel="noreferrer">
                              <i className="fas fa-paperclip" />
                              {file.original_file_name}
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .my-bulk-orders-page {
          min-height: 100vh;
          background: #f6f8fb;
          padding: 32px 0 56px;
        }
        .my-bulk-container {
          width: min(100% - 32px, 1180px);
          margin: 0 auto;
        }
        .my-bulk-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .my-bulk-header p {
          margin: 0 0 6px;
          color: #2f4a67;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }
        .my-bulk-header h1 {
          margin: 0;
          color: #111827;
          font-size: 34px;
          line-height: 1.1;
        }
        .my-bulk-account {
          display: inline-block;
          margin-top: 8px;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }
        .my-bulk-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 240px;
          gap: 14px;
          align-items: end;
          margin-bottom: 16px;
        }
        .my-bulk-search,
        .my-bulk-filter {
          display: grid;
          gap: 8px;
          color: #334155;
          font-weight: 800;
          font-size: 13px;
        }
        .my-bulk-search div {
          display: flex;
          gap: 8px;
        }
        .my-bulk-search input,
        .my-bulk-filter select {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px 14px;
          background: #ffffff;
          color: #111827;
          font: inherit;
        }
        .my-bulk-search button,
        .my-bulk-view-btn,
        .my-bulk-pagination button {
          border: 0;
          border-radius: 8px;
          background: #2f4a67;
          color: #ffffff;
          font-weight: 800;
          cursor: pointer;
          padding: 12px 16px;
          white-space: nowrap;
        }
        .my-bulk-list,
        .my-bulk-state,
        .my-bulk-modal,
        .my-bulk-detail-grid section,
        .my-bulk-notes,
        .my-bulk-product {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .my-bulk-list {
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }
        .my-bulk-table-wrap {
          width: 100%;
          overflow-x: auto;
        }
        .my-bulk-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }
        .my-bulk-table th,
        .my-bulk-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e5e7eb;
          color: #334155;
          text-align: left;
          vertical-align: middle;
        }
        .my-bulk-table th {
          background: #f8fafc;
          color: #0f172a;
          font-size: 12px;
          text-transform: uppercase;
        }
        .my-bulk-table strong {
          color: #111827;
        }
        .my-bulk-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }
        .my-bulk-state {
          margin: 0;
          padding: 48px 18px;
          text-align: center;
          color: #64748b;
        }
        .my-bulk-state i {
          color: #2f4a67;
          font-size: 30px;
          margin-bottom: 12px;
        }
        .my-bulk-state h2 {
          margin: 0 0 8px;
          color: #111827;
        }
        .my-bulk-state p {
          margin: 0;
        }
        .my-bulk-state .my-bulk-hint {
          margin-top: 8px;
          color: #334155;
          font-weight: 800;
        }
        .my-bulk-alert {
          margin-bottom: 16px;
          border-radius: 8px;
          padding: 12px 14px;
          font-weight: 700;
        }
        .my-bulk-alert.error {
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }
        .my-bulk-alert.info {
          color: #1d4ed8;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }
        .my-bulk-pagination {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 14px;
          color: #334155;
          font-weight: 800;
        }
        .my-bulk-pagination button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .my-bulk-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 28px 16px;
          background: rgba(15, 23, 42, 0.55);
          overflow-y: auto;
        }
        .my-bulk-modal {
          position: relative;
          width: min(100%, 920px);
          padding: 24px;
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.25);
        }
        .my-bulk-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 8px;
          background: #f1f5f9;
          color: #111827;
          cursor: pointer;
        }
        .my-bulk-modal-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          padding-right: 48px;
          margin-bottom: 18px;
        }
        .my-bulk-modal-head p {
          margin: 0 0 6px;
          color: #2f4a67;
          font-weight: 900;
        }
        .my-bulk-modal-head h2 {
          margin: 0;
          color: #111827;
          font-size: 28px;
        }
        .my-bulk-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .my-bulk-detail-grid section,
        .my-bulk-notes,
        .my-bulk-product {
          padding: 16px;
        }
        .my-bulk-detail-grid h3,
        .my-bulk-notes h3,
        .my-bulk-products h3 {
          margin: 0 0 12px;
          color: #111827;
        }
        .my-bulk-detail-grid dl {
          display: grid;
          gap: 10px;
          margin: 0;
        }
        .my-bulk-detail-grid dt {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .my-bulk-detail-grid dd {
          margin: 3px 0 0;
          color: #111827;
          font-weight: 700;
          overflow-wrap: anywhere;
        }
        .my-bulk-notes {
          margin-top: 14px;
        }
        .my-bulk-notes p {
          margin: 0;
          color: #334155;
          line-height: 1.6;
        }
        .my-bulk-products {
          margin-top: 18px;
        }
        .my-bulk-product {
          margin-bottom: 12px;
        }
        .my-bulk-product-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .my-bulk-product-head h4 {
          margin: 0 0 4px;
          color: #111827;
        }
        .my-bulk-product-head p,
        .my-bulk-product-copy p {
          margin: 0 0 6px;
          color: #475569;
          line-height: 1.5;
        }
        .my-bulk-product-head span {
          align-self: flex-start;
          border-radius: 999px;
          padding: 5px 9px;
          background: #f8fafc;
          color: #334155;
          font-size: 12px;
          font-weight: 900;
        }
        .my-bulk-sizes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .my-bulk-sizes span {
          border-radius: 8px;
          background: #f1f5f9;
          color: #334155;
          padding: 6px 9px;
          font-weight: 800;
          font-size: 12px;
        }
        .my-bulk-attachments {
          display: grid;
          gap: 8px;
          margin-top: 14px;
        }
        .my-bulk-attachments h5 {
          margin: 0;
          color: #111827;
        }
        .my-bulk-attachments a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2f4a67;
          font-weight: 800;
          text-decoration: none;
          overflow-wrap: anywhere;
        }
        @media (max-width: 900px) {
          .my-bulk-toolbar,
          .my-bulk-detail-grid {
            grid-template-columns: 1fr;
          }
          .my-bulk-table {
            min-width: 0;
          }
          .my-bulk-table thead {
            display: none;
          }
          .my-bulk-table,
          .my-bulk-table tbody,
          .my-bulk-table tr,
          .my-bulk-table td {
            display: block;
            width: 100%;
          }
          .my-bulk-table tr {
            border-bottom: 1px solid #e5e7eb;
            padding: 12px;
          }
          .my-bulk-table td {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            border: 0;
            padding: 8px 0;
            text-align: right;
          }
          .my-bulk-table td::before {
            content: attr(data-label);
            color: #64748b;
            font-weight: 900;
            text-align: left;
          }
          .my-bulk-view-btn {
            width: 100%;
            justify-content: center;
          }
          .my-bulk-table td[data-label="Action"] {
            display: block;
          }
          .my-bulk-table td[data-label="Action"]::before {
            display: none;
          }
        }
        @media (max-width: 520px) {
          .my-bulk-orders-page {
            padding-top: 22px;
          }
          .my-bulk-container {
            width: min(100% - 20px, 1180px);
          }
          .my-bulk-header h1 {
            font-size: 28px;
          }
          .my-bulk-search div,
          .my-bulk-pagination,
          .my-bulk-modal-head,
          .my-bulk-product-head {
            flex-direction: column;
            align-items: stretch;
          }
          .my-bulk-search button,
          .my-bulk-pagination button {
            width: 100%;
          }
          .my-bulk-pagination span {
            text-align: center;
          }
          .my-bulk-modal-backdrop {
            padding: 12px 10px;
          }
          .my-bulk-modal {
            padding: 18px 14px;
          }
          .my-bulk-modal-head {
            padding-right: 44px;
          }
          .my-bulk-modal-head h2 {
            font-size: 22px;
          }
          .my-bulk-table td {
            flex-direction: column;
            gap: 4px;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBulkOrders;
