import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const MainPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to login page
    navigate('/seller-login');
  };

  return (
    <div className="bg-blue-50 h-screen flex flex-col items-center justify-center text-white">
      <img src={logo} alt="BidsB2C Logo" className="mb-6 h-96 w-96 rounded-full" />
      <h1 className="text-4xl text-black font-bold mb-6">Welcome to the BidsB2C Seller App</h1>
      <button
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
      {/* Additional content can be added here */}
    </div>
  );
};

export default MainPage;
