import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FooterEnhanced from './components/FooterEnhanced';
import ThemeSwitch from './components/ThemeSwitch';
import Home from './pages/Home';
import TShirts from './pages/TShirts';
import Hoodies from './pages/Hoodies';
import Accessories from './pages/Accessories';
import AlumniKits from './pages/AlumniKits';
import TodayDealsEnhanced from './pages/TodayDealsEnhanced';
import NewArrivalsEnhanced from './pages/NewArrivalsEnhanced';
import Customize from './pages/Customize';
import ProductDetailEnhanced from './pages/ProductDetailEnhanced';
import BulkOrder from './pages/BulkOrder';
import Payment from './pages/Payment';
import OrderTracking from './pages/OrderTracking';
import CheckoutDashboard from './components/CheckoutDashboard';
import UserPanel from './pages/UserPanel';
import FAQ from './pages/FAQ';
import Feedback from './pages/Feedback';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import ToastContainer from './components/ToastContainer';
import './styles/ui-enhanced.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';

const AppContent = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <Router>
      <div className="App">
        <ThemeSwitch />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tshirts" element={<TShirts />} />
            <Route path="/hoodies" element={<Hoodies />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/alumni-kits" element={<AlumniKits />} />
            <Route path="/today-deals" element={<TodayDealsEnhanced />} />
            <Route path="/today-deals-enhanced" element={<TodayDealsEnhanced />} />
            <Route path="/new-arrivals" element={<NewArrivalsEnhanced />} />
            <Route path="/new-arrivals-enhanced" element={<NewArrivalsEnhanced />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order/:orderId" element={<OrderTracking />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="/checkout" element={<CheckoutDashboard />} />
            <Route path="/product/:id" element={<ProductDetailEnhanced />} />
            <Route path="/product-enhanced/:id" element={<ProductDetailEnhanced />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/admin-profile" element={<PrivateRoute><AdminProfile /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
        <FooterEnhanced />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
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
