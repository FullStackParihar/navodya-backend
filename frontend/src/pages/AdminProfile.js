import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { resolveImageUrl, API_URL } from '../utils/api';
import PrivateRoute from '../components/PrivateRoute';
import { useToast } from '../context/ToastContext';
import './AdminProfile.css';
import BannerManagement from '../components/admin/BannerManagement';

const clothingCategoryPattern = /(t[\s-]?shirts?|hoodies?|polos?|jackets?|shirts?|sweatshirts?|clothing|apparel|wear)/i;

const AdminProfile = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);         // full-page spinner (first load per tab)
  const [isFetching, setIsFetching] = useState(false);  // subtle indicator during pagination/search
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [contests, setContests] = useState([]);
  const [winners, setWinners] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);
  const [bulkOrderPagination, setBulkOrderPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [bulkOrderFilters, setBulkOrderFilters] = useState({ search: '', status: '', sort: 'created_at', order: 'desc' });
  const [bulkOrderStatuses, setBulkOrderStatuses] = useState(['New', 'Under Review', 'Contacted', 'Quotation Sent', 'Approved', 'In Production', 'Completed', 'Rejected', 'Cancelled']);
  const [selectedBulkOrder, setSelectedBulkOrder] = useState(null);
  const [isBulkOrderDetailOpen, setIsBulkOrderDetailOpen] = useState(false);
  const [bulkOrderDetailLoading, setBulkOrderDetailLoading] = useState(false);
  const [bulkOrderUpdating, setBulkOrderUpdating] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [totalProductPages, setTotalProductPages] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'product', 'category'
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Contest Participants Modal states
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);

  // Order detail modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderStatusNote, setOrderStatusNote] = useState('');
  const [orderStatusUpdating, setOrderStatusUpdating] = useState(false);
  const [trackingForm, setTrackingForm] = useState({ carrier: '', tracking_number: '', url: '' });
  const [trackingUpdating, setTrackingUpdating] = useState(false);
  const [liveTrackingInfo, setLiveTrackingInfo] = useState(null);
  const [fetchingLiveTracking, setFetchingLiveTracking] = useState(false);


  const getSafeImage = (value) => {
    if (typeof value !== 'string' || !value.trim()) {
      return 'https://via.placeholder.com/120x120?text=No+Image';
    }
    return resolveImageUrl(value);
  };

  const getProductCategoryLabel = (product) => {
    if (product?.subcategory) return product.subcategory;

    if (product?.category_id && typeof product.category_id === 'object') {
      return product.category_id.name || product.category_id.slug || '—';
    }

    if (product?.category_id) {
      const category = categories.find((cat) => cat._id === product.category_id);
      return category?.name || '—';
    }

    return product?.category || '—';
  };

  const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
  const supportsFabricVariants = clothingCategoryPattern.test(`${selectedCategory?.name || ''} ${selectedCategory?.slug || ''}`);
  const fabricVariants = Array.isArray(formData.fabricVariants) ? formData.fabricVariants : [];
  const hasPolyesterVariant = fabricVariants.some(v => v.name?.trim().toLowerCase() === 'polyester');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userRole === 'admin' || userEmail === 'admin@navodaya.com') {
      setIsAdmin(true);
    } else {
      navigate('/user-profile');
    }
  }, [navigate]);

  // Use refs so fetchData can always read the latest values without being a dependency
  const productPageRef = useRef(productPage);
  const productSearchRef = useRef(productSearch);
  const bulkOrderFiltersRef = useRef(bulkOrderFilters);
  const bulkOrderPageRef = useRef(bulkOrderPagination.page);
  useEffect(() => { productPageRef.current = productPage; }, [productPage]);
  useEffect(() => { productSearchRef.current = productSearch; }, [productSearch]);
  useEffect(() => { bulkOrderFiltersRef.current = bulkOrderFilters; }, [bulkOrderFilters]);
  useEffect(() => { bulkOrderPageRef.current = bulkOrderPagination.page; }, [bulkOrderPagination.page]);

  const lastTabRef = useRef(null);

  const fetchData = async (tab) => {
    // Show full spinner only when switching tabs (first load)
    // For pagination/search within the same tab, just use isFetching
    const isTabChange = tab !== lastTabRef.current;
    if (isTabChange) {
      setLoading(true);
      lastTabRef.current = tab;
    } else {
      setIsFetching(true);
    }
    try {
      let result;
      switch (tab) {
        case 'dashboard':
          result = await api.get('/admin/stats');
          if (result.success) setStats(result.data);
          break;
        case 'products':
        case 'alumni-kits':
          {
            const isAlumni = tab === 'alumni-kits';
            const page = productPageRef.current;
            const search = productSearchRef.current;
            const url = `/products?page=${page}&limit=10&search=${encodeURIComponent(search)}${isAlumni ? '&category=alumni-kit' : '&excludeAlumniKits=true'}`;
            result = await api.get(url);
            if (result.success) {
              setProducts(result.data.products || result.data);
              setTotalProductPages(result.data.pagination?.totalPages || 1);
            }
          }
          break;
        case 'orders':
          result = await api.get('/admin/orders');
          if (result.success) setOrders(result.data);
          break;
        case 'bulk-orders':
          {
            const filters = bulkOrderFiltersRef.current;
            const params = new URLSearchParams({
              page: String(bulkOrderPageRef.current),
              limit: '10',
              sort: filters.sort,
              order: filters.order,
            });
            if (filters.search) params.set('search', filters.search);
            if (filters.status) params.set('status', filters.status);
            result = await api.get(`/admin/bulk-orders?${params.toString()}`);
            if (result.success) {
              setBulkOrders(result.data.items || []);
              setBulkOrderPagination(result.data.pagination || { page: 1, totalPages: 1, total: 0 });
              if (result.data.statuses) setBulkOrderStatuses(result.data.statuses);
            }
          }
          break;
        case 'categories':
          result = await api.get('/categories');
          if (result.success) setCategories(result.data);
          break;
        case 'users':
          result = await api.get('/admin/users');
          if (result.success) setUsers(result.data);
          break;
        case 'coupons':
          result = await api.get('/coupons');
          if (result.success) setCoupons(result.data);
          break;
        case 'contests':
          result = await api.get('/contests?isAdmin=true');
          if (result.success) setContests(result.data);
          break;
        case 'winners':
          result = await api.get('/winners/admin');
          if (result.success) setWinners(result.data);
          const contestsRes = await api.get('/contests?isAdmin=true');
          if (contestsRes.success) setContests(contestsRes.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      error(`Failed to load ${tab}`);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  // Only re-fetch when tab changes or page changes (NOT on productSearch state change)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) {
      fetchData(activeTab);
    }
  }, [isAdmin, activeTab, productPage, bulkOrderPagination.page]); // productSearch intentionally excluded — search only on explicit button/Enter

  // Always fetch categories once when entering Admin Panel
  useEffect(() => {
    if (isAdmin) {
      const fetchCategoriesInitial = async () => {
        try {
          const result = await api.get('/categories');
          if (result.success) setCategories(result.data);
        } catch (err) {
          console.error('Error fetching categories initial:', err);
        }
      };
      fetchCategoriesInitial();
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setProductPage(1);
    setProductSearch('');
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  // CRUD Handlers
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      // Map backend internal keys to frontend form keys if necessary
      const mappedItem = { ...item };
      if (item.category_id) mappedItem.categoryId = typeof item.category_id === 'object' ? item.category_id._id : item.category_id;
      if (item.sale_price) mappedItem.salePrice = item.sale_price;
      mappedItem.fabricVariants = Array.isArray(item.fabric_variants)
        ? item.fabric_variants.map(variant => ({ ...variant, salePrice: variant.sale_price }))
        : [];
      if (clothingCategoryPattern.test(`${item.category_id?.name || ''} ${item.category_id?.slug || ''}`) && !mappedItem.fabricVariants.some(v => v.name?.toLowerCase() === 'cotton')) {
        mappedItem.fabricVariants.unshift({ name: 'Cotton', price: item.price, salePrice: item.sale_price, is_active: true });
      }

      if (item.specifications && typeof item.specifications === 'object') {
        mappedItem.specificationsArray = Object.entries(item.specifications).map(([key, value]) => ({ key, value }));
      } else {
        mappedItem.specificationsArray = [];
      }

      if (type === 'contest') {
        if (mappedItem.startDate) mappedItem.startDate = mappedItem.startDate.split('T')[0];
        if (mappedItem.endDate) mappedItem.endDate = mappedItem.endDate.split('T')[0];
      }
      
      if (type === 'winner') {
        if (mappedItem.contest_id) mappedItem.contest_id = mappedItem.contest_id._id;
        if (mappedItem.user_id) mappedItem.user_id = mappedItem.user_id._id;
      }

      setFormData(mappedItem);
    } else {
      if (type === 'product' || type === 'alumni-kit') {
        if (categories.length === 0) {
          error('Please wait for categories to load or create one first.');
          return;
        }
        let defaultCategoryId = categories[0]?._id || '';
        if (type === 'alumni-kit') {
          const akCat = categories.find(c => c.name === 'Alumni Kit' || c.slug === 'alumni-kit');
          if (akCat) defaultCategoryId = akCat._id;
        }
        const defaultCategory = categories.find(c => c._id === defaultCategoryId);
        const defaultFabricVariants = clothingCategoryPattern.test(`${defaultCategory?.name || ''} ${defaultCategory?.slug || ''}`)
          ? [{ name: 'Cotton', price: 0, salePrice: undefined, stock: '', is_active: true }]
          : [];
        setFormData({
          name: '', slug: '', description: '', price: 0, categoryId: defaultCategoryId, subcategory: '', images: [], sizes: [{ size: 'M', stock: 10 }], colors: [{ name: 'Default' }], fabricVariants: defaultFabricVariants, tags: [], specificationsArray: []
        });
      } else if (type === 'category') {
        setFormData({
          name: '', slug: '', description: '', image: ''
        });
      } else if (type === 'coupon') {
        setFormData({
          code: '', type: 'PERCENTAGE', value: 0, minOrderAmount: 0, maxDiscountAmount: 0, validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], usageLimit: 100
        });
      } else if (type === 'contest') {
        setFormData({
          title: '', description: '', rules: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], bannerImage: '', googleFormLink: '', isActive: true
        });
      } else if (type === 'winner') {
        setFormData({
          contest_id: '', user_id: '', prize: '', isPublished: false, showUserDetails: false
        });
      }
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    if (modalType === 'product' || modalType === 'alumni-kit') {
      if (!formData.name || formData.name.trim().length < 3) {
        error('Product name must be at least 3 characters long.');
        return false;
      }
      if (!formData.slug || !/^[a-z0-9-_]+$/.test(formData.slug)) {
        error('Slug must be lowercase and contain only alphanumeric characters, hyphens, and underscores.');
        return false;
      }
      if (formData.price <= 0) {
        error('Price must be greater than 0.');
        return false;
      }
      if (formData.salePrice !== undefined && formData.salePrice !== '' && Number(formData.salePrice) >= Number(formData.price)) {
        error('Sale price must be less than regular price.');
        return false;
      }
      if (Array.isArray(formData.fabricVariants)) {
        const names = formData.fabricVariants.map(v => String(v.name || '').trim().toLowerCase());
        if (names.some(name => !name) || new Set(names).size !== names.length) {
          error('Fabric names are required and duplicate fabric options are not allowed.');
          return false;
        }
        const extraVariantNames = names.filter(name => name !== 'cotton');
        if (extraVariantNames.filter(name => name === 'polyester').length > 1) {
          error('Polyester can only be added once per product.');
          return false;
        }
        if (formData.fabricVariants.some(v => v.price === '' || v.price === undefined || Number(v.price) < 0)) {
          error('Each fabric option requires a non-negative price.');
          return false;
        }
        if (formData.fabricVariants.some(v => v.name?.toLowerCase() !== 'cotton' && v.salePrice !== undefined && v.salePrice !== '' && (Number(v.salePrice) < 0 || Number(v.salePrice) >= Number(v.price)))) {
          error('Each fabric sale price must be non-negative and less than its regular price.');
          return false;
        }
      }
    } else if (modalType === 'category') {
      if (!formData.name || formData.name.trim().length < 3) {
        error('Category name must be at least 3 characters long.');
        return false;
      }
      if (!formData.slug || !/^[a-z0-9-_]+$/.test(formData.slug)) {
        error('Slug must be lowercase and contain only alphanumeric characters, hyphens, and underscores.');
        return false;
      }
    } else if (modalType === 'coupon') {
      if (!formData.code || !/^[A-Z0-9]+$/.test(formData.code)) {
        error('Coupon code must contain only uppercase alphanumeric characters.');
        return false;
      }
      if (formData.value <= 0) {
        error('Discount value must be greater than 0.');
        return false;
      }
      if (formData.type === 'PERCENTAGE' && formData.value > 100) {
        error('Percentage discount cannot exceed 100%.');
        return false;
      }
      if (formData.minOrderAmount < 0 || formData.maxDiscountAmount < 0 || formData.usageLimit <= 0) {
        error('Amounts must be positive, and usage limit must be greater than 0.');
        return false;
      }
    } else if (modalType === 'contest') {
      if (!formData.title || formData.title.trim().length < 3) {
        error('Contest title must be at least 3 characters long.');
        return false;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        error('Start date must be before or equal to End date.');
        return false;
      }
    } else if (modalType === 'winner') {
      if (!formData.contest_id) {
        error('Please select a contest.');
        return false;
      }
      if (!formData.user_id) {
        error('Please select or enter a winner user ID.');
        return false;
      }
      if (!formData.prize || formData.prize.trim().length === 0) {
        error('Please specify a prize.');
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      let result;
      if (modalType === 'product' || modalType === 'alumni-kit') {
        let hasMainImage = Array.isArray(formData.images) && formData.images.length > 0 && formData.images[0];
        
        if (!hasMainImage) {
          let firstColorImage = null;
          if (Array.isArray(formData.colors)) {
            for (const c of formData.colors) {
              if (Array.isArray(c.images) && c.images.length > 0 && c.images[0]) {
                firstColorImage = c.images[0];
                break;
              }
            }
          }
          if (firstColorImage) {
            formData.images = [firstColorImage];
            hasMainImage = true;
          }
        }

        if (!hasMainImage) {
          error('Please upload at least one main product image or color variant image before saving.');
          return;
        }

        if (formData._id) {
          // When editing, `formData` contains backend snake_case fields as well
          // (`sale_price`, `category_id`, `is_active`). Those can unintentionally
          // overwrite changes. Send only the editable/canonical fields.
          const {
            _id,
            category_id,
            sale_price,
            is_active,
            created_at,
            updated_at,
            specificationsArray,
            fabric_variants,
            ...payload
          } = formData;

          if (specificationsArray) {
            payload.specifications = specificationsArray.reduce((acc, curr) => {
              if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
              return acc;
            }, {});
          }

          result = await api.patch(`/products/${formData._id}`, payload);
        } else {
          const payload = { ...formData };
          if (payload.specificationsArray) {
            payload.specifications = payload.specificationsArray.reduce((acc, curr) => {
              if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
              return acc;
            }, {});
            delete payload.specificationsArray;
          }
          result = await api.post('/products', payload);
        }
      } else if (modalType === 'category') {
        if (formData._id) {
          result = await api.patch(`/categories/${formData._id}`, formData);
        } else {
          result = await api.post('/categories', formData);
        }
      } else if (modalType === 'coupon') {
        if (formData._id) {
          error('Editing coupons is not supported yet. Please delete and recreate.');
          return;
        } else {
          result = await api.post('/coupons', formData);
        }
      } else if (modalType === 'contest') {
        if (formData._id) {
          result = await api.patch(`/contests/${formData._id}`, formData);
        } else {
          result = await api.post('/contests', formData);
        }
      } else if (modalType === 'winner') {
        if (formData._id) {
          result = await api.patch(`/winners/${formData._id}`, formData);
        } else {
          result = await api.post('/winners', formData);
        }
      }
      
      if (result.success) {
        success('Success!');
        setIsModalOpen(false);
        fetchData(activeTab);
      } else {
        error(result.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Admin save error:', err);
      const msg = err?.message || 'An error occurred';
      error(msg);
    }
  };
  
  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleImageUpload = async (e, field = 'images', colorIndex = null) => {
    let file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      file = await compressImage(file);
      
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      const result = await api.post('/upload/upload', uploadData);

      if (result.success) {
        if (field === 'images') {
          const uploadedUrl = result?.data?.url;
          if (!uploadedUrl) {
            error('Upload succeeded but no image URL was returned.');
            return;
          }
          if (colorIndex !== null) {
            setFormData((prev) => {
              const newColors = [...prev.colors];
              if (!newColors[colorIndex].images) newColors[colorIndex].images = [];
              newColors[colorIndex].images.push(uploadedUrl);
              return { ...prev, colors: newColors };
            });
          } else {
            // Keep only one primary image for now (admin table uses first image)
            setFormData((prev) => ({ ...prev, images: [uploadedUrl] }));
          }
        } else {
          setFormData((prev) => ({ ...prev, [field]: result.data.url }));
        }
        success('Image uploaded successfully');
      } else {
        error(result.message || 'Upload failed');
      }
    } catch (err) {
      error('Error uploading image');
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input so same file can be selected again
    }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        let endpoint = '';
        if (type === 'product' || type === 'alumni-kit') endpoint = `/products/${id}`;
        else if (type === 'category') endpoint = `/categories/${id}`;
        else if (type === 'user') endpoint = `/admin/users/${id}`;
        else if (type === 'coupon') endpoint = `/coupons/${id}`;
        else if (type === 'contest') endpoint = `/contests/${id}`;
        else if (type === 'winner') endpoint = `/winners/${id}`;
        
        const result = await api.delete(endpoint);
        if (result.success) {
          success(`${type} deleted`);
          fetchData(activeTab);
        } else {
          error(result.message);
        }
      } catch (err) {
        error('Failed to delete');
      }
    }
  };

  // Quick-status update from the table row dropdown
  const updateOrderStatusQuick = async (orderId, status) => {
    try {
      const result = await api.patch(`/admin/orders/${orderId}/status`, { status });
      if (result.success) {
        success('Order status updated');
        fetchData('orders');
      }
    } catch (err) {
      error('Failed to update order');
    }
  };

  // Helper: color per status
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':    return '#f59e0b';
      case 'PROCESSING': return '#3b82f6';
      case 'SHIPPED':    return '#8b5cf6';
      case 'DELIVERED':  return '#10b981';
      case 'CANCELLED':  return '#ef4444';
      case 'RETURNED':   return '#f97316';
      default:           return '#6b7280';
    }
  };

  // Fetch live tracking from Shipway API
  const handleFetchLiveTracking = async (orderId) => {
    setFetchingLiveTracking(true);
    setLiveTrackingInfo(null);
    try {
      const result = await api.get(`/shipway/tracking/${orderId}`);
      if (result.success && result.data) {
        const trackingPayload = result.data.tracking;
        const trackingData = Array.isArray(trackingPayload) ? trackingPayload[0] : trackingPayload;
        setLiveTrackingInfo(trackingData);

        // Update selected order details (sync status)
        if (result.data.order) {
          setSelectedOrder(result.data.order);
          fetchData('orders'); // Refresh orders list in background
        }

        if (trackingData && trackingData.awb) {
          success('Live tracking data retrieved from Shipway');
        }
      } else {
        error(result.message || 'Failed to fetch live tracking info');
      }
    } catch (err) {
      console.error(err);
      error('Failed to connect to tracking service');
    } finally {
      setFetchingLiveTracking(false);
    }
  };

  // Open order detail modal
  const handleViewOrder = async (orderId) => {
    setIsOrderDetailOpen(true);
    setOrderDetailLoading(true);
    setSelectedOrder(null);
    setOrderStatusNote('');
    setLiveTrackingInfo(null);
    setFetchingLiveTracking(false);
    try {
      const result = await api.get(`/admin/orders/${orderId}`);
      if (result.success) {
        setSelectedOrder(result.data);
        setTrackingForm({
          carrier: result.data.tracking?.carrier || '',
          tracking_number: result.data.tracking?.tracking_number || '',
          url: result.data.tracking?.url || ''
        });
        // Auto-fetch live status
        handleFetchLiveTracking(orderId);
      } else {
        error(result.message || 'Failed to load order details');
        setIsOrderDetailOpen(false);
      }
    } catch (err) {
      error('Failed to load order details');
      setIsOrderDetailOpen(false);
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
    setOrderStatusNote('');
    setLiveTrackingInfo(null);
    setFetchingLiveTracking(false);
  };

  // Status update from within the detail modal
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setOrderStatusUpdating(true);
    try {
      const result = await api.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: orderStatusNote
      });
      if (result.success) {
        success('Order status updated successfully');
        setSelectedOrder(result.data);
        setOrderStatusNote('');
        fetchData('orders');
      } else {
        error(result.message || 'Failed to update status');
      }
    } catch (err) {
      error('Failed to update order status');
    } finally {
      setOrderStatusUpdating(false);
    }
  };

  // Tracking info update from within the detail modal
  const handleUpdateTracking = async (orderId) => {
    setTrackingUpdating(true);
    try {
      const result = await api.patch(`/admin/orders/${orderId}/tracking`, trackingForm);
      if (result.success) {
        success('Tracking information updated');
        setSelectedOrder(result.data);
        fetchData('orders');
      } else {
        error(result.message || 'Failed to update tracking');
      }
    } catch (err) {
      error('Failed to update tracking');
    } finally {
      setTrackingUpdating(false);
    }
  };

  const handleBulkOrderFilterChange = (field, value) => {
    setBulkOrderFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyBulkOrderFilters = () => {
    bulkOrderPageRef.current = 1;
    setBulkOrderPagination(prev => ({ ...prev, page: 1 }));
    fetchData('bulk-orders');
  };

  const handleBulkOrderPageChange = (page) => {
    setBulkOrderPagination(prev => ({ ...prev, page }));
  };

  const handleViewBulkOrder = async (id) => {
    setIsBulkOrderDetailOpen(true);
    setBulkOrderDetailLoading(true);
    setSelectedBulkOrder(null);
    try {
      const result = await api.get(`/admin/bulk-orders/${id}`);
      if (result.success) {
        setSelectedBulkOrder(result.data);
      } else {
        error(result.message || 'Failed to load bulk order');
        setIsBulkOrderDetailOpen(false);
      }
    } catch (err) {
      error('Failed to load bulk order');
      setIsBulkOrderDetailOpen(false);
    } finally {
      setBulkOrderDetailLoading(false);
    }
  };

  const handleCloseBulkOrderDetail = () => {
    setIsBulkOrderDetailOpen(false);
    setSelectedBulkOrder(null);
  };

  const handleUpdateBulkOrderStatus = async (id, status, adminNotes = selectedBulkOrder?.admin_notes || '') => {
    setBulkOrderUpdating(true);
    try {
      const result = await api.patch(`/admin/bulk-orders/${id}/status`, { status, adminNotes });
      if (result.success) {
        success('Bulk order updated');
        setSelectedBulkOrder(result.data);
        fetchData('bulk-orders');
      } else {
        error(result.message || 'Failed to update bulk order');
      }
    } catch (err) {
      error('Failed to update bulk order');
    } finally {
      setBulkOrderUpdating(false);
    }
  };

  const handleUpdateBulkOrderNotes = async () => {
    if (!selectedBulkOrder) return;
    setBulkOrderUpdating(true);
    try {
      const result = await api.patch(`/admin/bulk-orders/${selectedBulkOrder._id}`, {
        adminNotes: selectedBulkOrder.admin_notes || '',
      });
      if (result.success) {
        success('Admin notes saved');
        setSelectedBulkOrder(result.data);
        fetchData('bulk-orders');
      } else {
        error(result.message || 'Failed to save notes');
      }
    } catch (err) {
      error('Failed to save notes');
    } finally {
      setBulkOrderUpdating(false);
    }
  };

  const renderOrderDetailModal = () => {
    if (!isOrderDetailOpen) return null;
    const o = selectedOrder;
    const user = o?.user_id;

    return (
      <div className="admin-modal-overlay" onClick={handleCloseOrderDetail}>
        <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Order Details</h3>
              {o && <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>#{o._id}</span>}
            </div>
            <button className="close-modal" onClick={handleCloseOrderDetail}>&#x2715;</button>
          </div>

          <div className="order-detail-modal-body">
            {orderDetailLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
              </div>
            ) : o ? (
              <div className="order-detail-grid">

                {/* ── Left Column ── */}
                <div className="order-detail-col">

                  {/* Customer Info */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-user" /> Customer
                    </h4>
                    <div className="order-detail-row"><span>Name</span><strong>{user?.name || '—'}</strong></div>
                    <div className="order-detail-row"><span>Email</span><strong>{user?.email || '—'}</strong></div>
                    <div className="order-detail-row"><span>Phone</span><strong>{user?.phone || '—'}</strong></div>
                  </div>

                  {/* Shipping Address */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-map-marker-alt" /> Shipping Address
                    </h4>
                    <div className="order-detail-row"><span>Street</span><strong>{o.shipping_address?.street}</strong></div>
                    <div className="order-detail-row"><span>City</span><strong>{o.shipping_address?.city}</strong></div>
                    <div className="order-detail-row"><span>State</span><strong>{o.shipping_address?.state}</strong></div>
                    <div className="order-detail-row"><span>PIN</span><strong>{o.shipping_address?.zip_code}</strong></div>
                    <div className="order-detail-row"><span>Country</span><strong>{o.shipping_address?.country}</strong></div>
                  </div>

                  {/* Billing Address — shown only if present */}
                  {o.billing_address?.street && (
                    <div className="order-detail-section">
                      <h4 className="order-detail-section-title">
                        <i className="fas fa-file-invoice" /> Billing Address
                      </h4>
                      <div className="order-detail-row"><span>Street</span><strong>{o.billing_address.street}</strong></div>
                      <div className="order-detail-row"><span>City</span><strong>{o.billing_address.city}</strong></div>
                      <div className="order-detail-row"><span>State</span><strong>{o.billing_address.state}</strong></div>
                      <div className="order-detail-row"><span>PIN</span><strong>{o.billing_address.zip_code}</strong></div>
                      <div className="order-detail-row"><span>Country</span><strong>{o.billing_address.country}</strong></div>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-credit-card" /> Payment
                    </h4>
                    <div className="order-detail-row">
                      <span>Method</span>
                      <strong style={{ textTransform: 'uppercase' }}>{o.payment_info?.method || '—'}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Status</span>
                      <span className={`order-pay-badge ${o.payment_info?.status?.toLowerCase()}`}>
                        {o.payment_info?.status || '—'}
                      </span>
                    </div>
                    {o.payment_info?.id && (
                      <div className="order-detail-row">
                        <span>Ref ID</span>
                        <code style={{ fontSize: '11px', wordBreak: 'break-all', color: '#6b7280' }}>{o.payment_info.id}</code>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-receipt" /> Pricing
                    </h4>
                    <div className="order-detail-row"><span>Subtotal</span><strong>₹{o.pricing?.subtotal?.toFixed(2)}</strong></div>
                    {o.pricing?.discount > 0 && (
                      <div className="order-detail-row">
                        <span>Discount</span>
                        <strong style={{ color: '#10b981' }}>−₹{o.pricing.discount?.toFixed(2)}</strong>
                      </div>
                    )}
                    {o.pricing?.shipping_fee > 0 && (
                      <div className="order-detail-row"><span>Shipping</span><strong>₹{o.pricing.shipping_fee?.toFixed(2)}</strong></div>
                    )}
                    {o.pricing?.tax > 0 && (
                      <div className="order-detail-row"><span>Tax</span><strong>₹{o.pricing.tax?.toFixed(2)}</strong></div>
                    )}
                    <div className="order-detail-row order-total-row">
                      <span>Total Payable</span>
                      <strong style={{ fontSize: '16px', color: '#000' }}>₹{o.pricing?.total?.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-calendar-alt" /> Dates
                    </h4>
                    <div className="order-detail-row">
                      <span>Ordered On</span>
                      <strong>{new Date(o.created_at).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="order-detail-row">
                      <span>Last Updated</span>
                      <strong>{new Date(o.updated_at).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* ── Right Column ── */}
                <div className="order-detail-col">

                  {/* Ordered Items */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-box" /> Ordered Items ({o.items?.length})
                    </h4>
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Size / Color</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {o.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={item.image || 'https://via.placeholder.com/40'}
                                  alt={item.name}
                                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb', flexShrink: 0 }}
                                  onError={e => { if (!e.currentTarget.src.includes('placeholder')) e.currentTarget.src = 'https://via.placeholder.com/40'; }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                              </div>
                            </td>
                            <td>
                              {item.size && <span className="item-attr-badge">{item.size}</span>}
                              {item.color && <span className="item-attr-badge color-badge">{item.color}</span>}
                              {item.fabric_name && <span className="item-attr-badge">Fabric: {item.fabric_name}</span>}
                              {!item.size && !item.color && !item.fabric_name && <span style={{ color: '#9ca3af' }}>—</span>}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                            <td>₹{item.price?.toFixed(2)}</td>
                            <td style={{ fontWeight: 700 }}>₹{(item.price * item.quantity)?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Status Update Panel */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-sync-alt" /> Update Order Status
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Current:</span>
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(o.status) + '20',
                          color: getStatusColor(o.status),
                          border: `1px solid ${getStatusColor(o.status)}50`
                        }}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="status-pill-group">
                      {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'].map(s => (
                        <button
                          key={s}
                          className="status-pill-btn"
                          style={{
                            background: o.status === s ? getStatusColor(s) : 'transparent',
                            color: o.status === s ? '#fff' : getStatusColor(s),
                            borderColor: getStatusColor(s),
                            cursor: (orderStatusUpdating || o.status === s) ? 'not-allowed' : 'pointer',
                            opacity: orderStatusUpdating ? 0.6 : 1
                          }}
                          disabled={orderStatusUpdating || o.status === s}
                          onClick={() => handleUpdateOrderStatus(o._id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="order-note-input"
                      placeholder="Optional note (e.g. 'Dispatched via DTDC')…"
                      value={orderStatusNote}
                      onChange={e => setOrderStatusNote(e.target.value)}
                    />
                  </div>

                  {/* Tracking Info */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-truck" /> Tracking Information
                    </h4>
                    {o.tracking?.tracking_number ? (
                      <div className="tracking-display">
                        <div className="order-detail-row"><span>Carrier</span><strong>{o.tracking.carrier || '—'}</strong></div>
                        <div className="order-detail-row"><span>Tracking #</span><code style={{ fontFamily: 'monospace', fontSize: '13px' }}>{o.tracking.tracking_number}</code></div>
                        {o.tracking.url && (
                          <div className="order-detail-row">
                            <span>Link</span>
                            <a href={o.tracking.url} target="_blank" rel="noopener noreferrer" className="tracking-link">
                              Track Shipment ↗
                            </a>
                          </div>
                        )}
                        <button
                          className="save-btn"
                          style={{ 
                            marginTop: '10px', 
                            background: '#2563eb', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '4px', 
                            cursor: fetchingLiveTracking ? 'not-allowed' : 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            width: '100%'
                          }}
                          disabled={fetchingLiveTracking}
                          onClick={() => handleFetchLiveTracking(o._id)}
                        >
                          <i className={`fas ${fetchingLiveTracking ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
                          {fetchingLiveTracking ? 'Fetching Live Status...' : 'Fetch Live Status from Shipway'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>No tracking info added yet.</p>
                        <button
                          className="save-btn"
                          style={{ 
                            background: '#2563eb', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '4px', 
                            cursor: fetchingLiveTracking ? 'not-allowed' : 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            width: '100%'
                          }}
                          disabled={fetchingLiveTracking}
                          onClick={() => handleFetchLiveTracking(o._id)}
                        >
                          <i className={`fas ${fetchingLiveTracking ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
                          {fetchingLiveTracking ? 'Fetching Live Status...' : 'Check Shipway Status'}
                        </button>
                      </div>
                    )}

                    {liveTrackingInfo && (
                      <div style={{ marginTop: '12px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                          Shipway Live Status: <span style={{ color: '#2563eb' }}>{liveTrackingInfo.tracking_details?.shipment_details?.[0]?.current_status || liveTrackingInfo.tracking_details?.shipment_status || 'Unknown'}</span>
                        </div>
                        
                        {/* Scans Timeline */}
                        {liveTrackingInfo.tracking_details?.scans && liveTrackingInfo.tracking_details.scans.length > 0 ? (
                          <div style={{ maxHeight: '180px', overflowY: 'auto', marginTop: '6px', paddingRight: '4px' }}>
                            {liveTrackingInfo.tracking_details.scans.map((scan, sIdx) => (
                              <div key={sIdx} style={{ fontSize: '11px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ color: '#334155', fontWeight: '600' }}>{scan.activity}</div>
                                <div style={{ color: '#64748b', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                                  <span>{scan.location || 'In Transit'}</span>
                                  <span>{scan.date} {scan.time || ''}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>No scan history recorded yet in Shipway.</div>
                        )}
                      </div>
                    )}
                    <div className="tracking-form">
                      <input
                        type="text"
                        placeholder="Carrier (e.g. DTDC, Delhivery, Blue Dart…)"
                        value={trackingForm.carrier}
                        onChange={e => setTrackingForm(p => ({ ...p, carrier: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Tracking Number"
                        value={trackingForm.tracking_number}
                        onChange={e => setTrackingForm(p => ({ ...p, tracking_number: e.target.value }))}
                      />
                      <input
                        type="url"
                        placeholder="Tracking URL (optional)"
                        value={trackingForm.url}
                        onChange={e => setTrackingForm(p => ({ ...p, url: e.target.value }))}
                      />
                      <button
                        className="save-btn"
                        style={{ marginTop: '6px', width: '100%', opacity: trackingUpdating ? 0.6 : 1 }}
                        disabled={trackingUpdating}
                        onClick={() => handleUpdateTracking(o._id)}
                      >
                        <i className="fas fa-save" style={{ marginRight: '6px' }} />
                        {trackingUpdating ? 'Saving…' : 'Save Tracking Info'}
                      </button>
                    </div>
                  </div>

                  {/* Status History Timeline */}
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">
                      <i className="fas fa-history" /> Order History
                    </h4>
                    {(!o.status_history || o.status_history.length === 0) ? (
                      <p style={{ fontSize: '13px', color: '#9ca3af' }}>No status changes recorded yet.</p>
                    ) : (
                      <ol className="order-status-timeline">
                        {[...o.status_history].reverse().map((h, i) => (
                          <li key={i} className="timeline-item">
                            <span
                              className="timeline-dot"
                              style={{ background: getStatusColor(h.status) }}
                            />
                            <div className="timeline-content">
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: getStatusColor(h.status),
                                  fontSize: '12px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                {h.status}
                              </span>
                              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                {new Date(h.changed_at).toLocaleString('en-IN')}
                                {h.changed_by && (
                                  <span style={{ marginLeft: '6px' }}>
                                    by <em style={{ color: '#374151' }}>{h.changed_by}</em>
                                  </span>
                                )}
                              </div>
                              {h.note && (
                                <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px', fontStyle: 'italic', background: '#f9fafb', padding: '4px 8px', borderRadius: '4px' }}>
                                  "{h.note}"
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                </div>{/* end right col */}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };



  const renderDashboard = () => (
    <div className="stats-dashboard">
      <div className="section-header">
        <h2>System Overview</h2>
        <div className="current-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon"><i className="fas fa-users"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon"><i className="fas fa-shopping-bag"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
            <div className="stat-content">
              <div className="stat-number">₹{stats.revenue?.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon"><i className="fas fa-tshirt"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalProducts}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = (isAlumniKits = false) => {
    return (
    <div className="admin-section">
      <div className="section-header product-section-header">
        <div className="admin-toolbar">
          <h2>{isAlumniKits ? 'Alumni Kit Management' : 'Product Management'}</h2>
          <button className="add-btn" onClick={() => handleOpenModal(isAlumniKits ? 'alumni-kit' : 'product')}>
            <i className="fas fa-plus"></i> Add {isAlumniKits ? 'Alumni Kit' : 'Product'}
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="admin-filter-bar">
          <input 
            type="text" 
            placeholder="Search by name or description..." 
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setProductPage(1);
                fetchData(activeTab);
              }
            }}
          />
          <button 
            className="add-btn search-btn" 
            onClick={() => {
              setProductPage(1);
              fetchData(activeTab);
            }}
          >
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No products found
                </td>
              </tr>
            ) : products.map(product => (
              <tr key={product._id}>
                <td>
                  <img
                    src={getSafeImage(product.images?.[0])}
                    alt={product.name}
                    className="table-img"
                    onError={(e) => {
                      if (!e.currentTarget.src.includes('via.placeholder.com')) {
                        e.currentTarget.src = 'https://via.placeholder.com/120x120?text=No+Image';
                      }
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{getProductCategoryLabel(product)}</td>
                <td>
                  <div style={{fontSize: '11px', color: '#6b7280', textDecoration: product.sale_price ? 'line-through' : 'none'}}>MRP: ₹{product.price}</div>
                  {product.sale_price ? <div style={{fontSize: '12px', color: '#22c55e', fontWeight: 'bold'}}>Sale: ₹{product.sale_price} ({Math.round((1 - product.sale_price / product.price) * 100)}% OFF)</div> : null}
                </td>
                <td>{product.sizes?.reduce((acc, s) => acc + s.stock, 0)}</td>
                <td>
                  <button className="action-icon edit" onClick={() => handleOpenModal('product', product)}><i className="fas fa-edit"></i></button>
                  <button className="action-icon delete" onClick={() => deleteItem('product', product._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="admin-pagination">
        <span>Page {productPage} of {totalProductPages}</span>
        <div className="admin-pagination-actions">
          <button 
            className="add-btn" 
            style={{ background: productPage <= 1 ? '#d1d5db' : '#000000', cursor: productPage <= 1 ? 'not-allowed' : 'pointer' }}
            disabled={productPage <= 1}
            onClick={() => setProductPage(prev => Math.max(prev - 1, 1))}
          >
            <i className="fas fa-chevron-left"></i> Prev
          </button>
          <button 
            className="add-btn" 
            style={{ background: productPage >= totalProductPages ? '#d1d5db' : '#000000', cursor: productPage >= totalProductPages ? 'not-allowed' : 'pointer' }}
            disabled={productPage >= totalProductPages}
            onClick={() => setProductPage(prev => Math.min(prev + 1, totalProductPages))}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    );
  };

  const renderCategories = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Category Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal('category')}>
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {/* <th>Image</th> */}
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                {/* <td><img src={cat.image} alt={cat.name} className="table-img" /></td> */}
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.description?.substring(0, 50)}...</td>
                <td>
                  <button className="action-icon edit" onClick={() => handleOpenModal('category', cat)}><i className="fas fa-edit"></i></button>
                  <button className="action-icon delete" onClick={() => deleteItem('category', cat._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Order Management</h2>
        <span style={{ fontSize: '14px', color: '#666' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No orders found
                </td>
              </tr>
            ) : orders.map(order => (
              <tr key={order._id}>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                    #{order._id.substring(0, 8)}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>
                    {order.user_id?.name || '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{order.user_id?.email || ''}</div>
                </td>
                <td style={{ textAlign: 'center' }}>{order.items?.length || 0}</td>
                <td style={{ fontWeight: 600 }}>₹{order.pricing?.total?.toFixed(2)}</td>
                <td>
                  <span className={`order-pay-badge ${order.payment_info?.status?.toLowerCase()}`}>
                    {order.payment_info?.status || '—'}
                  </span>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', textTransform: 'uppercase' }}>
                    {order.payment_info?.method || ''}
                  </div>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatusQuick(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RETURNED">Returned</option>
                  </select>
                </td>
                <td style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="action-icon edit"
                      title="View full order details"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      <i className="fas fa-eye" />
                    </button>
                    <button
                      className="action-icon"
                      style={{ background: '#fef3c7', color: '#d97706' }}
                      title="Download Invoice"
                      onClick={() => window.open(`${API_URL}/orders/${order._id}/invoice?token=${localStorage.getItem('token')}`, '_blank')}
                    >
                      <i className="fas fa-file-invoice" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBulkOrders = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Bulk Orders</h2>
        <span style={{ fontSize: '14px', color: '#666' }}>{bulkOrderPagination.total} request{bulkOrderPagination.total !== 1 ? 's' : ''}</span>
      </div>

      <div className="admin-filters bulk-order-filters">
        <label className="bulk-order-filter-field bulk-order-search-field">
          <span>Search</span>
          <input
            placeholder="Search request, organization, email, phone"
            value={bulkOrderFilters.search}
            onChange={(e) => handleBulkOrderFilterChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyBulkOrderFilters()}
          />
        </label>
        <label className="bulk-order-filter-field">
          <span>Status</span>
          <select value={bulkOrderFilters.status} onChange={(e) => handleBulkOrderFilterChange('status', e.target.value)}>
            <option value="">All Statuses</option>
            {bulkOrderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <button className="add-btn" onClick={applyBulkOrderFilters} type="button">
          <i className="fas fa-filter"></i> Apply
        </button>
      </div>

      {isFetching && <div style={{ marginBottom: '10px', color: '#64748b', fontSize: '13px' }}>Refreshing bulk orders...</div>}

      <div className="admin-table-container bulk-orders-table-container">
        <table className="admin-table bulk-orders-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Organization</th>
              <th>Contact</th>
              <th>Products</th>
              <th>Total Qty</th>
              <th>Required Date</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bulkOrders.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No bulk orders found
                </td>
              </tr>
            ) : bulkOrders.map(order => (
              <tr key={order._id}>
                <td className="bulk-request-cell"><strong>{order.request_number}</strong></td>
                <td className="bulk-org-cell">{order.organization_name}</td>
                <td className="bulk-contact-cell">
                  <div className="bulk-contact-name">{order.contact_person}</div>
                  <div className="bulk-contact-meta">{order.email}</div>
                  <div className="bulk-contact-meta">{order.phone}</div>
                </td>
                <td className="bulk-number-cell">{order.products?.length || 0}</td>
                <td className="bulk-number-cell strong">{order.grand_total_quantity}</td>
                <td className="bulk-date-cell">{new Date(order.required_date).toLocaleDateString('en-IN')}</td>
                <td>₹{Number(order.estimated_budget || 0).toLocaleString('en-IN')}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => handleUpdateBulkOrderStatus(order._id, e.target.value, order.admin_notes || '')}
                  >
                    {bulkOrderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <button className="action-icon edit" title="View bulk order" onClick={() => handleViewBulkOrder(order._id)}>
                    <i className="fas fa-eye" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
        <button className="action-icon" disabled={bulkOrderPagination.page <= 1} onClick={() => handleBulkOrderPageChange(bulkOrderPagination.page - 1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Page {bulkOrderPagination.page} of {bulkOrderPagination.totalPages || 1}
        </span>
        <button className="action-icon" disabled={bulkOrderPagination.page >= bulkOrderPagination.totalPages} onClick={() => handleBulkOrderPageChange(bulkOrderPagination.page + 1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );

  const renderBulkOrderDetailModal = () => {
    if (!isBulkOrderDetailOpen) return null;
    const order = selectedBulkOrder;

    return (
      <div className="admin-modal-overlay" onClick={handleCloseBulkOrderDetail}>
        <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Bulk Order Details</h3>
              {order && <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{order.request_number}</span>}
            </div>
            <button className="close-modal" onClick={handleCloseBulkOrderDetail}>&#x2715;</button>
          </div>

          <div className="order-detail-modal-body">
            {bulkOrderDetailLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
              </div>
            ) : order ? (
              <div className="order-detail-grid">
                <div className="order-detail-col">
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title"><i className="fas fa-building" /> Customer</h4>
                    <div className="order-detail-row"><span>Organization</span><strong>{order.organization_name}</strong></div>
                    <div className="order-detail-row"><span>Contact</span><strong>{order.contact_person}</strong></div>
                    <div className="order-detail-row"><span>Email</span><strong>{order.email}</strong></div>
                    <div className="order-detail-row"><span>Phone</span><strong>{order.phone}</strong></div>
                  </div>

                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title"><i className="fas fa-map-marker-alt" /> Delivery</h4>
                    <div className="order-detail-row"><span>Address</span><strong>{order.delivery_address}</strong></div>
                    <div className="order-detail-row"><span>City</span><strong>{order.city}</strong></div>
                    <div className="order-detail-row"><span>State</span><strong>{order.state}</strong></div>
                    <div className="order-detail-row"><span>Pincode</span><strong>{order.pincode}</strong></div>
                    <div className="order-detail-row"><span>Required Date</span><strong>{new Date(order.required_date).toLocaleDateString('en-IN')}</strong></div>
                    <div className="order-detail-row"><span>Budget</span><strong>₹{Number(order.estimated_budget || 0).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>

                <div className="order-detail-col">
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title"><i className="fas fa-tasks" /> Status</h4>
                    <select
                      className="status-select"
                      value={order.status}
                      disabled={bulkOrderUpdating}
                      onChange={(e) => handleUpdateBulkOrderStatus(order._id, e.target.value, order.admin_notes || '')}
                    >
                      {bulkOrderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <label style={{ display: 'block', marginTop: '14px', fontWeight: 700 }}>Admin Notes</label>
                    <textarea
                      rows="5"
                      value={order.admin_notes || ''}
                      onChange={(e) => setSelectedBulkOrder(prev => ({ ...prev, admin_notes: e.target.value }))}
                      style={{ width: '100%', marginTop: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}
                    />
                    <button className="add-btn" style={{ marginTop: '10px' }} onClick={handleUpdateBulkOrderNotes} disabled={bulkOrderUpdating}>
                      Save Notes
                    </button>
                  </div>

                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title"><i className="fas fa-boxes" /> Summary</h4>
                    <div className="order-detail-row"><span>Products</span><strong>{order.products?.length || 0}</strong></div>
                    <div className="order-detail-row"><span>Total Quantity</span><strong>{order.grand_total_quantity}</strong></div>
                    <div className="order-detail-row"><span>Additional Notes</span><strong>{order.additional_notes || '—'}</strong></div>
                  </div>
                </div>

                <div className="order-detail-section" style={{ gridColumn: '1 / -1' }}>
                  <h4 className="order-detail-section-title"><i className="fas fa-list" /> Products</h4>
                  {(order.products || []).map((product, index) => (
                    <div key={`${product.product_key}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                      <h4 style={{ margin: '0 0 8px' }}>Product {index + 1}: {product.product_name}</h4>
                      <p><strong>Category:</strong> {product.category_name} {product.is_custom_product ? '(Custom)' : ''}</p>
                      <p><strong>Quantity:</strong> {product.total_quantity}</p>
                      <p><strong>Sizes:</strong> {Object.entries(product.size_quantities || {}).filter(([, qty]) => Number(qty) > 0).map(([size, qty]) => `${size.toUpperCase()}: ${qty}`).join(', ') || '—'}</p>
                      <p><strong>General Quantity:</strong> {product.general_quantity || 0}</p>
                      <p><strong>Description:</strong> {product.description || '—'}</p>
                      <p><strong>Specifications:</strong> {product.specifications || '—'}</p>
                      <p><strong>Design Requirements:</strong> {product.design_requirements || '—'}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {(product.attachments || []).map(file => (
                          <a key={file.file_url} href={file.file_url} target="_blank" rel="noreferrer" className="add-btn" style={{ textDecoration: 'none', background: '#eef2ff', color: '#3730a3' }}>
                            <i className="fas fa-paperclip"></i> {file.original_file_name}
                          </a>
                        ))}
                        {(product.attachments || []).length === 0 && <span style={{ color: '#64748b' }}>No attachments</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };



  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="action-icon delete" onClick={() => deleteItem('user', user._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  const fetchParticipants = async (contestId) => {
    try {
      const result = await api.get(`/contests/${contestId}/participants`);
      if (result.success) {
        setParticipants(result.data);
      } else {
        error(result.message || 'Failed to fetch participants');
      }
    } catch (err) {
      error('Error fetching participants');
    }
  };

  const handleExportCSV = () => {
    if (!participants || participants.length === 0) {
      info('No participants to export');
      return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Mobile', 'Participation Date'];
    const csvRows = [headers.join(',')];
    
    participants.forEach(p => {
      const name = p.user_id?.name || 'N/A';
      const email = p.user_id?.email || 'N/A';
      const mobile = p.user_id?.mobile || 'N/A';
      const date = new Date(p.createdAt).toLocaleString();
      
      // Escape commas and quotes for CSV
      const row = [name, email, mobile, date].map(field => `"${String(field).replace(/"/g, '""')}"`);
      csvRows.push(row.join(','));
    });
    
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contest_${selectedContest?.title || 'participants'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PrivateRoute>
      <div className="admin-profile-new">
        {isMobileSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>
        )}
        <div className={`admin-sidebar-new ${isMobileSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <i className="fas fa-shield-alt"></i>
            <span>Navodaya Admin</span>
            <button className="admin-back-website-btn" onClick={() => navigate('/')} title="Back to website" aria-label="Back to website">
              <i className="fas fa-arrow-left"></i>
            </button>
            <button className="sidebar-close-btn" onClick={() => setIsMobileSidebarOpen(false)}>&times;</button>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
              <i className="fas fa-chart-line"></i> Dashboard
            </button>
            <button className={activeTab === 'contests' ? 'active' : ''} onClick={() => handleTabChange('contests')}>
              <i className="fas fa-trophy"></i> Contests
            </button>
            <button className={activeTab === 'winners' ? 'active' : ''} onClick={() => handleTabChange('winners')}>
              <i className="fas fa-medal"></i> Winners
            </button>
            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => handleTabChange('products')}>
              <i className="fas fa-box"></i> Products
            </button>
            <button className={activeTab === 'alumni-kits' ? 'active' : ''} onClick={() => handleTabChange('alumni-kits')}>
              <i className="fas fa-graduation-cap"></i> Alumni Kits
            </button>
            <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>
              <i className="fas fa-tags"></i> Categories
            </button>
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>
              <i className="fas fa-shopping-cart"></i> Orders
            </button>
            <button className={activeTab === 'bulk-orders' ? 'active' : ''} onClick={() => handleTabChange('bulk-orders')}>
              <i className="fas fa-clipboard-list"></i> Bulk Orders
            </button>
            <button className={activeTab === 'users' ? 'active' : ''} onClick={() => handleTabChange('users')}>
              <i className="fas fa-users"></i> Users
            </button>
            <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => handleTabChange('coupons')}>
              <i className="fas fa-ticket-alt"></i> Coupons
            </button>
            <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => handleTabChange('banners')}>
              <i className="fas fa-images"></i> Banner &amp; Offers
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
        
        <div className="admin-mobile-header">
          <button className="mobile-toggle-btn" onClick={() => setIsMobileSidebarOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
          <span className="mobile-title">Navodaya Admin</span>
          <button className="admin-back-website-btn mobile" onClick={() => navigate('/')} title="Back to website" aria-label="Back to website">
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <main className="admin-content-new">
          {loading ? (
            <div className="admin-loader">
              <div className="spinner"></div>
              <p>Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'products' && renderProducts(false)}
              {activeTab === 'alumni-kits' && renderProducts(true)}
              {activeTab === 'categories' && renderCategories()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'bulk-orders' && renderBulkOrders()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'banners' && <BannerManagement />}
              {renderOrderDetailModal()}
              {renderBulkOrderDetailModal()}

              {activeTab === 'coupons' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h2>Coupon Management</h2>
                    <button className="add-btn" onClick={() => handleOpenModal('coupon')}>
                      <i className="fas fa-plus"></i> Add Coupon
                    </button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Usage</th>
                          <th>Expires</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map(coupon => (
                          <tr key={coupon._id}>
                            <td><strong>{coupon.code}</strong></td>
                            <td>{coupon.type}</td>
                            <td>{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                            <td>{coupon.usage_count} / {coupon.usage_limit || '∞'}</td>
                            <td>{new Date(coupon.valid_until).toLocaleDateString()}</td>
                            <td>
                               <button className="action-icon delete" onClick={() => deleteItem('coupon', coupon._id)}>
                                 <i className="fas fa-trash"></i>
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'contests' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h2>Contest Management</h2>
                    <button className="add-btn" onClick={() => handleOpenModal('contest')}>
                      <i className="fas fa-plus"></i> Add Contest
                    </button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contests.map(contest => (
                          <tr key={contest._id}>
                            <td><strong>{contest.title}</strong></td>
                            <td>{contest.isActive ? <span className="status-badge success">Active</span> : <span className="status-badge pending">Inactive</span>}</td>
                            <td>{new Date(contest.startDate).toLocaleDateString()}</td>
                            <td>{new Date(contest.endDate).toLocaleDateString()}</td>
                            <td>
                              <button className="action-icon edit" onClick={() => handleOpenModal('contest', contest)}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-icon info" onClick={() => {
                                setSelectedContest(contest);
                                setIsParticipantsModalOpen(true);
                                fetchParticipants(contest._id);
                              }} title="View Participants">
                                <i className="fas fa-users"></i>
                              </button>
                              <button className="action-icon delete" onClick={() => deleteItem('contest', contest._id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'winners' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h2>Winner Management</h2>
                    <button className="add-btn" onClick={() => handleOpenModal('winner')}>
                      <i className="fas fa-plus"></i> Add Winner
                    </button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Contest</th>
                          <th>Winner (User)</th>
                          <th>Prize</th>
                          <th>Published</th>
                          <th>Show Details</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winners.map(winner => (
                          <tr key={winner._id}>
                            <td>{winner.contest_id?.title || 'Unknown Contest'}</td>
                            <td>{winner.user_id?.name || 'Unknown User'} ({winner.user_id?.email})</td>
                            <td>{winner.prize}</td>
                            <td>{winner.isPublished ? <span className="status-badge success">Yes</span> : <span className="status-badge pending">No</span>}</td>
                            <td>{winner.showUserDetails ? <span className="status-badge success">Yes</span> : <span className="status-badge pending">No</span>}</td>
                            <td>
                              <button className="action-icon edit" onClick={() => handleOpenModal('winner', winner)}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-icon delete" onClick={() => deleteItem('winner', winner._id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* CRUD Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="modal-header">
                <h3>{formData._id ? 'Edit' : 'Add'} {(modalType === 'product' || modalType === 'alumni-kit') ? (modalType === 'alumni-kit' ? 'Alumni Kit' : 'Product') : modalType === 'category' ? 'Category' : modalType === 'coupon' ? 'Coupon' : modalType === 'contest' ? 'Contest' : 'Winner'}</h3>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {(modalType === 'product' || modalType === 'alumni-kit') ? (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Slug</label>
                        <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Base Price</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({
                          ...formData,
                          price: Number(e.target.value),
                          fabricVariants: (formData.fabricVariants || []).map(v => v.name?.toLowerCase() === 'cotton' ? { ...v, price: Number(e.target.value) } : v)
                        })} required />
                      </div>
                      <div className="form-group">
                        <label>Sale Price (Optional)</label>
                        <input type="number" value={formData.salePrice ?? ''} onChange={e => {
                          const salePrice = e.target.value ? Number(e.target.value) : null;
                          setFormData({ ...formData, salePrice, fabricVariants: (formData.fabricVariants || []).map(v => v.name?.toLowerCase() === 'cotton' ? { ...v, salePrice } : v) });
                        }} />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select 
                          value={formData.categoryId} 
                          onChange={e => {
                            const category = categories.find(cat => cat._id === e.target.value);
                            const isClothing = clothingCategoryPattern.test(`${category?.name || ''} ${category?.slug || ''}`);
                            const variants = isClothing
                              ? ((formData.fabricVariants || []).some(v => v.name?.toLowerCase() === 'cotton')
                                ? formData.fabricVariants
                                : [{ name: 'Cotton', price: formData.price, salePrice: formData.salePrice, stock: '', is_active: true }, ...(formData.fabricVariants || [])])
                              : [];
                            setFormData({ ...formData, categoryId: e.target.value, fabricVariants: variants });
                          }}
                          required
                          disabled={modalType === 'alumni-kit'}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Subcategory</label>
                        <input type="text" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} />
                      </div>
                      {supportsFabricVariants && (
                        <div className="form-group fabric-variant-section">
                          <div className="fabric-section-header">
                            <div><label>Fabric Quality</label><small>Add Polyester or a custom quality. Cotton stays mapped to the main product price.</small></div>
                            <div className="fabric-action-buttons">
                              <button
                                type="button"
                                className="add-size-btn"
                                disabled={hasPolyesterVariant}
                                onClick={() => setFormData({
                                  ...formData,
                                  fabricVariants: [...fabricVariants, {
                                    name: 'Polyester',
                                    price: formData.price || 0,
                                    salePrice: formData.salePrice ?? undefined,
                                    stock: '',
                                    is_active: true
                                  }]
                                })}
                              >
                                + Add Polyester
                              </button>
                              <button
                                type="button"
                                className="add-size-btn"
                                onClick={() => setFormData({
                                  ...formData,
                                  fabricVariants: [...fabricVariants, {
                                    name: '',
                                    price: formData.price || 0,
                                    salePrice: undefined,
                                    stock: '',
                                    is_active: true
                                  }]
                                })}
                              >
                                + Add Custom Quality
                              </button>
                            </div>
                          </div>
                          <div className="fabric-default-note">Cotton is the default quality and always uses the main Product Price and Sale Price.</div>
                          {fabricVariants.map((variant, idx) => {
                            const updateVariant = (changes) => {
                              const variants = [...fabricVariants];
                              variants[idx] = { ...variants[idx], ...changes };
                              setFormData({ ...formData, fabricVariants: variants });
                            };
                            const isCottonVariant = variant.name?.toLowerCase() === 'cotton';
                            const isPolyesterVariant = variant.name?.toLowerCase() === 'polyester';
                            return (
                              <div className="fabric-variant-row" key={variant._id || idx}>
                                {isCottonVariant ? (
                                  <div className="fabric-default-label"><strong>Cotton</strong><small>Default quality, uses main product price</small></div>
                                ) : (
                                  <input
                                    aria-label="Fabric name"
                                    placeholder={isPolyesterVariant ? 'Polyester' : 'Custom quality name'}
                                    value={variant.name || ''}
                                    onChange={e => updateVariant({ name: e.target.value })}
                                    readOnly={isPolyesterVariant}
                                    required
                                  />
                                )}
                                <input aria-label="Fabric regular price" type="number" min="0" step="0.01" placeholder={isCottonVariant ? 'Uses main product price' : 'Regular price'} value={isCottonVariant ? formData.price : (variant.price ?? '')} onChange={e => updateVariant({ price: e.target.value === '' ? '' : Number(e.target.value) })} readOnly={isCottonVariant} required />
                                <input aria-label="Fabric sale price" type="number" min="0" step="0.01" placeholder={isCottonVariant ? 'Uses main sale price' : 'Sale price (optional)'} value={isCottonVariant ? (formData.salePrice ?? '') : (variant.salePrice ?? '')} onChange={e => updateVariant({ salePrice: e.target.value === '' ? undefined : Number(e.target.value) })} readOnly={isCottonVariant} />
                                <input aria-label="Fabric stock" type="number" min="0" step="1" placeholder="Stock (optional)" value={variant.stock ?? ''} onChange={e => updateVariant({ stock: e.target.value === '' ? '' : Number(e.target.value) })} />
                                <label className="fabric-active-toggle"><input type="checkbox" checked={isCottonVariant || variant.is_active !== false} disabled={isCottonVariant} onChange={e => updateVariant({ is_active: e.target.checked })} /> Active</label>
                                {!isCottonVariant && <button type="button" className="remove-size-btn" aria-label="Remove fabric" onClick={() => setFormData({ ...formData, fabricVariants: fabricVariants.filter((_, i) => i !== idx) })}>&times;</button>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="form-group">
                        <label>Product Images</label>
                        <div className="image-upload-wrapper">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, 'images')} 
                            disabled={isUploading}
                          />
                          {isUploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                        </div>
                        {formData.images?.length > 0 && (
                          <div className="image-preview-grid">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="preview-item">
                                <img
                                  src={getSafeImage(img)}
                                  alt="Preview"
                                  onError={(e) => {
                                    if (!e.currentTarget.src.includes('placeholder')) {
                                      e.currentTarget.src = 'https://via.placeholder.com/60';
                                    }
                                  }}
                                />
                                <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}>&times;</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Sizes & Stock</label>
                        <div className="sizes-container">
                          {formData.sizes?.map((sizeObj, idx) => (
                            <div key={idx} className="size-row">
                              <input 
                                type="text" 
                                placeholder="Size (e.g. M)" 
                                value={sizeObj.size} 
                                onChange={e => {
                                  const newSizes = [...formData.sizes];
                                  newSizes[idx].size = e.target.value;
                                  setFormData({ ...formData, sizes: newSizes });
                                }} 
                                required
                              />
                              <input 
                                type="number" 
                                placeholder="Stock" 
                                value={sizeObj.stock} 
                                min="0"
                                onChange={e => {
                                  const newSizes = [...formData.sizes];
                                  newSizes[idx].stock = Number(e.target.value);
                                  setFormData({ ...formData, sizes: newSizes });
                                }} 
                                required
                              />
                              <button 
                                type="button" 
                                className="remove-size-btn"
                                onClick={() => {
                                  const newSizes = formData.sizes.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, sizes: newSizes });
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className="add-size-btn"
                            onClick={() => {
                              const newSizes = formData.sizes ? [...formData.sizes] : [];
                              newSizes.push({ size: '', stock: 0 });
                              setFormData({ ...formData, sizes: newSizes });
                            }}
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Color Variants</label>
                        <div className="sizes-container">
                          {formData.colors?.map((color, idx) => (
                            <div key={idx} className="color-row" style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input 
                                  type="text" 
                                  placeholder="Color Name (e.g. Red)" 
                                  value={color.name} 
                                  onChange={e => {
                                    const newColors = [...formData.colors];
                                    newColors[idx].name = e.target.value;
                                    setFormData({ ...formData, colors: newColors });
                                  }} 
                                  required
                                />
                                <input 
                                  type="color" 
                                  value={color.hex || '#000000'} 
                                  onChange={e => {
                                    const newColors = [...formData.colors];
                                    newColors[idx].hex = e.target.value;
                                    setFormData({ ...formData, colors: newColors });
                                  }} 
                                  style={{ width: '50px', padding: '0', height: '42px' }}
                                />
                                <button 
                                  type="button" 
                                  className="remove-size-btn"
                                  onClick={() => {
                                    const newColors = formData.colors.filter((_, i) => i !== idx);
                                    setFormData({ ...formData, colors: newColors });
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                              
                              <div className="image-upload-wrapper" style={{ marginTop: '10px' }}>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Variant Images</label>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={e => handleImageUpload(e, 'images', idx)} 
                                  disabled={isUploading}
                                />
                              </div>
                              {color.images?.length > 0 && (
                                <div className="image-preview-grid" style={{ marginTop: '10px' }}>
                                  {color.images.map((img, i) => (
                                    <div key={i} className="preview-item">
                                      <img src={getSafeImage(img)} alt="Preview" />
                                      <button type="button" onClick={() => {
                                        const newColors = [...formData.colors];
                                        newColors[idx].images = newColors[idx].images.filter((_, imgIndex) => imgIndex !== i);
                                        setFormData({ ...formData, colors: newColors });
                                      }}>&times;</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className="add-size-btn"
                            onClick={() => {
                              const newColors = formData.colors ? [...formData.colors] : [];
                              newColors.push({ name: '', hex: '#000000', images: [] });
                              setFormData({ ...formData, colors: newColors });
                            }}
                          >
                            + Add Color Variant
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Specifications</label>
                        <div className="sizes-container">
                          {formData.specificationsArray?.map((spec, idx) => (
                            <div key={idx} className="size-row">
                              <input 
                                type="text" 
                                placeholder="Key (e.g. Material)" 
                                value={spec.key} 
                                onChange={e => {
                                  const newSpecs = [...formData.specificationsArray];
                                  newSpecs[idx].key = e.target.value;
                                  setFormData({ ...formData, specificationsArray: newSpecs });
                                }} 
                                required
                              />
                              <input 
                                type="text" 
                                placeholder="Value (e.g. 100% Cotton)" 
                                value={spec.value} 
                                onChange={e => {
                                  const newSpecs = [...formData.specificationsArray];
                                  newSpecs[idx].value = e.target.value;
                                  setFormData({ ...formData, specificationsArray: newSpecs });
                                }} 
                                required
                              />
                              <button 
                                type="button" 
                                className="remove-size-btn"
                                onClick={() => {
                                  const newSpecs = formData.specificationsArray.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, specificationsArray: newSpecs });
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className="add-size-btn"
                            onClick={() => {
                              const newSpecs = formData.specificationsArray ? [...formData.specificationsArray] : [];
                              newSpecs.push({ key: '', value: '' });
                              setFormData({ ...formData, specificationsArray: newSpecs });
                            }}
                          >
                            + Add Specification
                          </button>
                        </div>
                      </div>
                    </>
                  ) : modalType === 'coupon' ? (
                    <>
                      <div className="form-group">
                        <label>Coupon Code</label>
                        <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="E.g. SUMMER50" required />
                      </div>
                      <div className="form-group">
                        <label>Discount Type</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FIXED">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Discount Value</label>
                        <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} required />
                      </div>
                      <div className="form-group">
                        <label>Min Order Amount (₹)</label>
                        <input type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Max Discount Amount (₹)</label>
                        <input type="number" value={formData.maxDiscountAmount} onChange={e => setFormData({...formData, maxDiscountAmount: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Usage Limit</label>
                        <input type="number" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Valid Until</label>
                        <input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} required />
                      </div>
                    </>
                  ) : modalType === 'contest' ? (
                    <>
                      <div className="form-group">
                        <label>Contest Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Eligibility Rules</label>
                        <textarea value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Banner Image</label>
                        <div className="image-upload-wrapper">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, 'bannerImage')} 
                            disabled={isUploading}
                          />
                          {isUploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                        </div>
                        {formData.bannerImage && (
                          <div className="preview-item single">
                            <img src={formData.bannerImage} alt="Preview" />
                            <button type="button" onClick={() => setFormData({...formData, bannerImage: ''})}>&times;</button>
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Google Form / Submission Link (Optional)</label>
                        <input 
                          type="url" 
                          value={formData.googleFormLink || ''} 
                          onChange={e => setFormData({...formData, googleFormLink: e.target.value})} 
                          placeholder="https://forms.gle/... or any submission link" 
                        />
                      </div>
                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} id="is-active-checkbox" style={{ width: 'auto', marginRight: '10px' }} />
                        <label htmlFor="is-active-checkbox" style={{ margin: 0 }}>Enable Contest</label>
                      </div>
                    </>
                  ) : modalType === 'winner' ? (
                    <>
                      <div className="form-group">
                        <label>Contest</label>
                        <select 
                          value={formData.contest_id} 
                          onChange={e => setFormData({...formData, contest_id: e.target.value})} 
                          required
                          disabled={!!formData._id}
                        >
                          <option value="">Select a Contest</option>
                          {contests.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>User ID (Winner)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input 
                            type="text" 
                            value={formData.user_id} 
                            onChange={e => setFormData({...formData, user_id: e.target.value})} 
                            required 
                            disabled={!!formData._id}
                            style={{ flex: 1 }}
                          />
                          {!formData._id && formData.contest_id && (
                            <button 
                              type="button" 
                              className="add-btn"
                              style={{ padding: '0 15px', height: '42px', marginTop: 0 }}
                              onClick={async () => {
                                try {
                                  const res = await api.post(`/winners/random/${formData.contest_id}`);
                                  if (res.success) {
                                    setFormData({...formData, user_id: res.data.user_id._id || res.data.user_id});
                                    alert(`Randomly selected user: ${res.data.user_id?.name || res.data.user_id}`);
                                  } else {
                                    alert(res.message || 'Error picking random winner');
                                  }
                                } catch (e) {
                                  alert('Error picking random winner');
                                }
                              }}
                            >
                              <i className="fas fa-dice"></i> Random
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Prize</label>
                        <input type="text" value={formData.prize} onChange={e => setFormData({...formData, prize: e.target.value})} required />
                      </div>
                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                        <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} id="is-published-checkbox" style={{ width: 'auto', marginRight: '10px' }} />
                        <label htmlFor="is-published-checkbox" style={{ margin: 0 }}>Publish Publicly</label>
                      </div>
                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <input type="checkbox" checked={formData.showUserDetails} onChange={e => setFormData({...formData, showUserDetails: e.target.checked})} id="show-user-checkbox" style={{ width: 'auto', marginRight: '10px' }} />
                        <label htmlFor="show-user-checkbox" style={{ margin: 0 }}>Show User Details Publicly (Name/Email)</label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Slug</label>
                        <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Category Image</label>
                        <div className="image-upload-wrapper">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, 'image')} 
                            disabled={isUploading}
                          />
                          {isUploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                        </div>
                        {formData.image && (
                          <div className="preview-item single">
                            <img src={formData.image} alt="Preview" />
                            <button type="button" onClick={() => setFormData({...formData, image: ''})}>&times;</button>
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save {modalType}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Participants Modal */}
        {isParticipantsModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal" style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>Participants: {selectedContest?.title}</h2>
                <button className="close-modal" onClick={() => setIsParticipantsModalOpen(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={handleExportCSV}>
                    <i className="fas fa-file-csv"></i> Export CSV
                  </button>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Date of Entry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>No participants yet.</td>
                        </tr>
                      ) : (
                        participants.map(p => (
                          <tr key={p._id}>
                            <td>{p.user_id?.name || 'N/A'}</td>
                            <td>{p.user_id?.email || 'N/A'}</td>
                            <td>{p.user_id?.mobile || 'N/A'}</td>
                            <td>{new Date(p.createdAt).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default AdminProfile;
