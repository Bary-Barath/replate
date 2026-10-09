import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Marketplace />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="seller" element={<SellerDashboard />} />
          {/* <Route path="admin" element={<AdminDashboard />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
