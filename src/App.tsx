import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerLayout from './components/CustomerLayout';
import { AuthLandingRedirect, RequireAuth, RequireVerifiedSeller } from './components/RouteGuards';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';
import SellerVerification from './pages/SellerVerification';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/CustomerOrders';
import CustomerProfile from './pages/CustomerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import NearbyRadar from './pages/NearbyRadar';
import FeedRescue from './pages/FeedRescue';

const ImpactDashboard = lazy(() => import('./pages/ImpactDashboard'));

const ImpactRoute = () => <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-text-secondary">Loading impact dashboard…</div>}><ImpactDashboard /></Suspense>;

function App() {
  return <Router><Routes>
    <Route path="auth/sign-in" element={<AuthPage mode="sign-in" />} />
    <Route path="auth/sign-up" element={<AuthPage mode="sign-up" />} />
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="explore" element={<Marketplace />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="products/:productId" element={<ProductDetails />} />
      <Route path="how-it-works" element={<InfoPage />} />
      <Route path="impact" element={<ImpactRoute />} />
      <Route path="nearby" element={<NearbyRadar />} />
      <Route path="for-businesses" element={<InfoPage />} />
      <Route path="seller" element={<AuthLandingRedirect />} />
      <Route path="customer" element={<RequireAuth roles={['customer']} />}>
        <Route element={<CustomerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="wishlist" element={<Favorites />} />
          <Route path="impact" element={<ImpactRoute />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>
      <Route path="favorites" element={<Navigate to="/customer/wishlist" replace />} />
      <Route path="cart" element={<Navigate to="/customer/cart" replace />} />
      <Route path="checkout" element={<Navigate to="/customer/checkout" replace />} />
      <Route path="seller/verification" element={<RequireAuth roles={['seller']}><SellerVerification /></RequireAuth>} />
      {['seller/dashboard', 'seller/products', 'seller/products/new', 'seller/products/:productId/edit', 'seller/orders', 'seller/rescue-deals', 'seller/analytics', 'seller/settings'].map((path) => <Route key={path} path={path} element={<RequireVerifiedSeller><SellerDashboard /></RequireVerifiedSeller>} />)}
      <Route path="seller/feed-rescue" element={<RequireVerifiedSeller><FeedRescue /></RequireVerifiedSeller>} />
      {['admin/dashboard', 'admin/users', 'admin/sellers', 'admin/products', 'admin/orders', 'admin/moderation', 'admin/settings'].map((path) => <Route key={path} path={path} element={<RequireAuth roles={['admin']}><AdminDashboard /></RequireAuth>} />)}
      <Route path="admin" element={<AuthLandingRedirect />} />
      {['about', 'safety', 'privacy', 'terms', 'help', 'contact', 'feed-rescue'].map((slug) => <Route key={slug} path={slug} element={<InfoPage />} />)}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes></Router>;
}

export default App;
