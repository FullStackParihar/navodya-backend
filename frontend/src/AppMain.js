import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FooterEnhanced from './components/FooterEnhanced';
import ThemeSwitch from './components/ThemeSwitch';
import HomePage from './pages/HomePage';
import TShirtsPage from './pages/TShirtsPage';
import HoodiesPage from './pages/HoodiesPage';
import AccessoriesPage from './pages/AccessoriesPage';
import AlumniKitsPage from './pages/AlumniKitsPage';
import TodayDealsEnhanced from './pages/TodayDealsEnhanced';
import NewArrivalsEnhanced from './pages/NewArrivalsEnhanced';
import CustomizePage from './pages/CustomizePage';
import ProductDetailEnhanced from './pages/ProductDetailEnhanced';
import BulkOrderPage from './pages/BulkOrderPage';
import PaymentPage from './pages/PaymentPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CheckoutDashboard from './components/CheckoutDashboard';
import UserPanelPage from './pages/UserPanelPage';
import FAQPage from './pages/FAQPage';
import FeedbackPage from './pages/FeedbackPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import LoginPage from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import ToastContainer from './components/ToastContainer';
import './styles/ui-enhanced.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';

const AppMain = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="App">
              <ThemeSwitch />
              <Header />
              <main>
                <Routes>
                  {/* Main Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tshirts" element={<TShirtsPage />} />
                  <Route path="/hoodies" element={<HoodiesPage />} />
                  <Route path="/accessories" element={<AccessoriesPage />} />
                  <Route path="/alumni-kits" element={<AlumniKitsPage />} />
                  <Route path="/today-deals" element={<TodayDealsEnhanced />} />
                  <Route path="/new-arrivals" element={<NewArrivalsEnhanced />} />
                  <Route path="/customize" element={<CustomizePage />} />
                  <Route path="/bulk-order" element={<BulkOrderPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/order/:orderId" element={<OrderTrackingPage />} />
                  <Route path="/track/:orderId" element={<OrderTrackingPage />} />
                  <Route path="/checkout" element={<CheckoutDashboard />} />
                  <Route path="/product/:id" element={<ProductDetailEnhanced />} />
                  <Route path="/product-enhanced/:id" element={<ProductDetailEnhanced />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  
                  {/* User Authentication */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                  <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                  <Route path="/account" element={<PrivateRoute><UserPanelPage /></PrivateRoute>} />
                  <Route path="/admin-profile" element={<PrivateRoute><AdminProfile /></PrivateRoute>} />
                  
                  {/* Additional Pages */}
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                </Routes>
              </main>
              <FooterEnhanced />
              <ToastContainer toasts={toasts} removeToast={removeToast} />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
};

export default AppMain;
