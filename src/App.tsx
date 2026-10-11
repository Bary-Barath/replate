import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Marketplace />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="seller" element={<SellerDashboard />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="favorites" element={<Favorites />} />
          {['about', 'how-it-works', 'impact', 'safety', 'privacy', 'terms', 'help', 'contact', 'feed-rescue'].map((slug) => (
            <Route key={slug} path={slug} element={<InfoPage />} />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
