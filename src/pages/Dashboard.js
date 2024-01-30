import React, { useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


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
    <div className="flex flex-col items-center justify-center mt-36">
      <div className="max-w-6xl bg-gray-300 my-4 p-8 rounded-md shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>

        <div className="flex flex-col space-y-3">
          {/* Dashboard Button */}
          <Link to="/dashboard" className="bg-yellow-50 text-black px-4 py-2 rounded-md">Dashboard</Link>

          {/* Add Products Button */}
          <Link to="/add-product" className="bg-yellow-100 text-black px-4 py-2 rounded-md">Add Products</Link>

          {/* Your Products Button */}
          <Link to="/list-product" className="bg-yellow-200 text-black px-4 py-2 rounded-md">Your Products</Link>

          {/* Your Profile Button */}
          <Link to="/profile" className="bg-yellow-300 text-black px-4 py-2 rounded-md">Your Profile</Link>

          {/* View Orders Button */}
          <Link to="/orders" className="bg-yellow-400 text-black px-4 py-2 rounded-md">View Orders</Link>

          {/* Returns Button */}
          <Link to="/returns" className="bg-yellow-500 text-black px-4 py-2 rounded-md">Returns</Link>

          {/* Update Status Button */}
          <Link to="/update-status" className="bg-yellow-600 text-black px-4 py-2 rounded-md">Update Status</Link>

          {/* Sign Out Button */}
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md">Sign Out</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
