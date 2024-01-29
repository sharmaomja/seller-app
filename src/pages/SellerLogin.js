// src/pages/SellerLogin.js
import React, { useState,  useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SellerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/sellerLogin', formData);
      const userData = {
        userId: response.data.userId,
        userType: response.data.userType,
        role: response.data.role,
        firstName: response.data.firstName,
        lastName: response.data.lastName
        // add other relevant user fields
      };
      if (response.data.generated_password) {
        navigate('/update-password', { state: { email: formData.email } });
      } else {
        login(response.data.token, userData);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white shadow-md rounded-md p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Seller Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full h-10 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
          {error && <div className="text-red-500">{error}</div>}

          <div className="flex flex-col items-center mt-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            <Link to="/seller-register" className="text-blue-500 hover:underline mt-2">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};


export default SellerLogin;
