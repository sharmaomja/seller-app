import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import SellerLogin from './pages/SellerLogin';
import SellerRegistration from './pages/SellerRegistration';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import UpdatePassword from './pages/UpdatePassword';
import AddProducts from './pages/AddProductPage';
import ViewProducts from './pages/ViewProductPage';
import EditProduct from './pages/EditProductPage';
import OrderList from './pages/OrderList';
import ReturnRequests from './pages/ReturnRequests';
import ShipmentTracking from './pages/ShipmentTracking';
import Main from './components/Add products/Main';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/seller-register" element={<SellerRegistration />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/add-product"  element={<AddProducts />} />
          <Route path="/list-product" element={<ViewProducts />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/returns" element={<ReturnRequests />} />
          <Route path="/update-status" element={<ShipmentTracking />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/product" element={<Main />} />
          {/* Additional routes */}
        </Routes>
      </Router>
  </AuthProvider>
    
  );
}

export default App;
