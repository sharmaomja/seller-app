import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo2.png'; 

const MainPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/seller-login');
  };

  return (
    <div className="bg-yellow-50 h-screen flex flex-col items-center justify-center text-white">
      <img src={logo} alt="BidsB2C Logo" className="mb-24 shadow-lg" style={{height:"300px", width:"1400px"}}/>
      <h1 className="text-4xl text-gray-700 font-bold mb-6">WELCOME TO THE BIDSB2C SELLER APP</h1>
      <button
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-600 font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default MainPage;
