import React, { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const Dashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/seller-login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/seller-login');
  };

  if (!isLoggedIn) return null;
  return (
    <div>
    <Navbar/>
    <div className="flex flex-col items-center justify-center mt-24">
      <div className="max-w-6xl bg-gray-50 my-4 p-8 shadow-lg text-center">
        <h1 className="text-3xl text-gray-600 font-semibold mb-4">Welcome to the Dashboard</h1>

        <div className="flex flex-col space-y-3">
          {/* Dashboard Button */}
          {/* Add Products Button */}
          <Link to="/add-product" className="bg-yellow-200 text-black px-4 py-2 rounded-full">Add Product</Link>

          {/* Your Products Button */}
          <Link to="/list-product" className="bg-yellow-200 text-black px-4 py-2 rounded-full">All Products</Link>

          {/* Your Profile Button */}
          <Link to="/profile" className="bg-yellow-300 text-black px-4 py-2 rounded-full">My Account</Link>

          {/* View Orders Button */}
          <Link to="/orders" className="bg-yellow-300 text-black px-4 py-2 rounded-full">My Orders</Link>

          {/* Returns Button */}
          <Link to="/returns" className="bg-yellow-400 text-black px-4 py-2 rounded-full">Returns</Link>

          {/* Update Status Button */}
          <Link to="/update-status" className="bg-yellow-400 text-black px-4 py-2 rounded-full">Update Status</Link>

          {/* Sign Out Button */}
          <button onClick={handleLogout} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full">Sign Out</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
