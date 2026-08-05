import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import FooterEnhanced from './components/FooterEnhanced';
import ThemeSwitch from './components/ThemeSwitch';
import HomeEpic from './pages/HomeEpic';
import TShirts from './pages/TShirts';
import Hoodies from './pages/Hoodies';
import Accessories from './pages/Accessories';
import AlumniKits from './pages/AlumniKits';

import TodayDealsEnhanced from './pages/TodayDealsEnhanced';
import NewArrivalsEnhanced from './pages/NewArrivalsEnhanced';
import AboutUs from './pages/AboutUs';
import ProductDetailEnhanced from './pages/ProductDetailEnhanced';
import BulkOrder from './pages/BulkOrder';
import MyBulkOrders from './pages/MyBulkOrders';
import Payment from './pages/Payment';
import OrderTracking from './pages/OrderTracking';
import CheckoutDashboard from './components/CheckoutDashboard';
import UserPanel from './pages/UserPanel';
import FAQ from './pages/FAQ';
import Feedback from './pages/Feedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import Disclaimer from './pages/Disclaimer';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import SearchPage from './pages/SearchPage';
import ScrollToTop from './components/ScrollToTop';
import ToastContainer from './components/ToastContainer';
import './styles/ui-enhanced.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Events from './pages/Events';
import Login from './pages/Login';
import Contests from './pages/Contests';
import Winners from './pages/Winners';

const AppShell = ({ toasts, removeToast }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-profile');

  return (
    <>
      <ScrollToTop />
      <div className={`App ${isAdminRoute ? 'admin-app' : 'public-app'}`}>
        {!isAdminRoute && <ThemeSwitch />}
        {!isAdminRoute && <Header />}
        <main className={isAdminRoute ? 'admin-main' : 'public-main'}>
          <Routes>
          <Route path="/" element={<HomeEpic />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tshirts" element={<TShirts />} />
          <Route path="/hoodies" element={<Hoodies />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/alumni-kits" element={<AlumniKits />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={<Contests />} />
          <Route path="/winners" element={<Winners />} />

          <Route path="/today-deals" element={<TodayDealsEnhanced />} />
          <Route path="/today-deals-enhanced" element={<TodayDealsEnhanced />} />
          <Route path="/new-arrivals" element={<NewArrivalsEnhanced />} />
          <Route path="/new-arrivals-enhanced" element={<NewArrivalsEnhanced />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/bulk-order" element={<BulkOrder />} />
          <Route path="/my-bulk-orders" element={<PrivateRoute><MyBulkOrders /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/order/:orderId" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          <Route path="/track/:orderId" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutDashboard /></PrivateRoute>} />
          <Route path="/product/:id" element={<ProductDetailEnhanced />} />
          <Route path="/product-enhanced/:id" element={<ProductDetailEnhanced />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/admin-profile" element={<PrivateRoute><AdminProfile /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
           <Route path="/faq" element={<FAQ />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        {!isAdminRoute && <FooterEnhanced />}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </>
  );
};

const AppContent = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <Router>
      <AppShell toasts={toasts} removeToast={removeToast} />
    </Router>
  );
};

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
