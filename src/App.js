import React from 'react';
import Home from './components/home/components/Home';
import SellerLogin from './components/auth/SellerLogin';
import SellerRegistration from './components/auth/SellerRegistration';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/home/Dashboard';
import Profile from './components/home/components/Profile';
import UpdatePassword from './components/auth/UpdatePassword';
import AddProducts from './components/addproducts/AddProductPage';
import ViewProducts from './components/editproducts/ViewProductPage';
import EditProduct from './components/editproducts/EditProductPage';
import OrderList from './components/orders/OrderList';
import ReturnRequests from './components/orders/ReturnRequests';
import ShipmentTracking from './components/orders/ShipmentTracking';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/seller-app" exact element={<Home />} />
          <Route path="/seller-register" element={<SellerRegistration />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/add-product" element={<AddProducts />} />
          <Route path="/list-product" element={<ViewProducts />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/returns" element={<ReturnRequests />} />
          <Route path="/update-status" element={<ShipmentTracking />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
