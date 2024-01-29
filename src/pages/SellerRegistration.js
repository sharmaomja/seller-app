import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'seller'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/users/register', formData);
      navigate('/seller-login');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white shadow-md rounded-md p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Seller Registration</h2>
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
          <div className="flex flex-col">
            <label htmlFor="firstName" className="mb-1 text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="mb-1 text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gstn" className="mb-1 text-gray-700">
              GSTN (Goods and Services Tax Number)
            </label>
            <input
              type="text"
              id="gstn"
              name="gstn"
              placeholder="GSTN"
              onChange={handleChange}
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="storeName" className="mb-1 text-gray-700">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              placeholder="Store Name"
              onChange={handleChange}
              className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-24 h-10 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300 transform hover:scale-105"
          >
            Register
          </button>
          {error && <div className="text-red-500">{error}</div>}
          <Link to="/seller-login" className="ml-20 text-blue-500 mt-4 hover:underline">Already a seller? Login here</Link>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;
