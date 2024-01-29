import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/forget-password', { email });
      setMessage('Check your email to reset your password.');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-72">
        <h2 className="text-center text-lg font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter email"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
            Reset Password
          </button>
        </form>
        {message && <div className="text-green-500 text-center mt-2">{message}</div>}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
