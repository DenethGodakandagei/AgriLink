
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard/SellerDashboard';
import Overview from './pages/SellerDashboard/components/Overview';
import Products from './pages/SellerDashboard/components/Products';
import Orders from './pages/SellerDashboard/components/Orders';

import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
