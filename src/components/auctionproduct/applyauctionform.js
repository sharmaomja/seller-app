import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CreateAuctionForm = ({ productId, onClose = () => { } }) => {
  const { user } = useContext(AuthContext);
  const [sellerId, setSellerId] = useState('');
  const [formData, setFormData] = useState({
    sellerId: '',
    productId: productId,
    startTime: '',
    endTime: '',
    startingBid: '',
    reservePrice: '',
    status: 'active', // Assuming 'created' is the default status
  });
  const apiBaseURL = process.env.REACT_APP_API_URL;
  


  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`${apiBaseURL}/sellerdetail/user/${user.userId}`);
        const fetchedSellerId = sellerResponse.data.sellerId;
        setSellerId(fetchedSellerId);
        setFormData({ ...formData, sellerId: fetchedSellerId });
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    fetchSellerDetails();
    const currentDateTime = new Date().toISOString().slice(0, 16);
    setFormData({ ...formData, startTime: currentDateTime });
  }, [user.userId]);

  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseURL}/api/auctions`, formData);
      console.log('Auction created:', response.data);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 1000); // Close after 1 second
    } catch (error) {
      console.error('Error creating auction:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Auction</h2>
      {error && <div className="text-red-500">{error}</div>}
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded-lg">
            Bid created successfully.
          </div>
        </div>
      )}  
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">Seller ID:</label>
            <input type="text" id="sellerId" name="sellerId" value={sellerId} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" readOnly />
          </div>
          <div className="w-1/2">
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID:</label>
            <input type="text" id="productId" name="productId" value={formData.productId} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required readOnly />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time:</label>
            <input type="datetime-local" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required />
          </div>
          <div className="w-1/2">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time:</label>
            <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required />
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700">Starting Bid:</label>
          <input type="number" id="startingBid" name="startingBid" value={formData.startingBid} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required />
        </div>

        <div className="w-full">
          <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700">Reserve Price:</label>
          <input type="number" id="reservePrice" name="reservePrice" value={formData.reservePrice} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
        </div>

        <button type="submit" className="bg-yellow-400 text-gray-800 w-full h-10 font-semibold rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Create Auction</button>

      </form>
    </div>
  );
};

export default CreateAuctionForm;
