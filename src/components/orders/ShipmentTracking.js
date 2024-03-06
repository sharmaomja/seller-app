import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../home/components/Navbar';

const ShipmentTracking = ({ sellerId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [shippingStatus, setShippingStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/seller/${sellerId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [sellerId]);

  const handleStatusUpdate = async () => {
    try {
      // Assuming you have an API endpoint to update the shipping status
      await axios.put(`/api/orders/${selectedOrderId}/update-status`, {
        status: shippingStatus,
      });

      // Refresh the orders after the update
      const response = await axios.get(`/api/orders/seller/${sellerId}`);
      setOrders(response.data.orders);

      // Reset selectedOrderId and shippingStatus after update
      setSelectedOrderId(null);
      setShippingStatus('');
    } catch (error) {
      console.error('Error updating shipping status:', error);
    }
  };

  return (
   <div>
   <Navbar/>
   <div className="container mx-auto mt-8">
   <h2 className="text-3xl font-bold mb-4">Shipment Tracking</h2>
   <div className="flex">
     <div className="w-1/2">
       <h3 className="text-xl font-bold mb-2">Order List</h3>
       <ul className="list-disc pl-4">
         {orders.map((order) => (
           <li
             key={order.orderId}
             className="cursor-pointer text-blue-500 hover:underline"
             onClick={() => setSelectedOrderId(order.orderId)}
           >
             {order.orderId} - {order.productName}
           </li>
         ))}
       </ul>
     </div>
     {selectedOrderId && (
       <div className="w-1/2">
         <h3 className="text-xl font-bold mb-2">Update Shipping Status</h3>
         <div className="mb-4">
           <label htmlFor="shippingStatus" className="block text-sm font-medium text-gray-700">
             Shipping Status:
           </label>
           <input
             type="text"
             id="shippingStatus"
             name="shippingStatus"
             value={shippingStatus}
             onChange={(e) => setShippingStatus(e.target.value)}
             className="mt-1 p-2 border rounded-md w-full"
             placeholder="Enter shipping status"
           />
         </div>
         <button
           onClick={handleStatusUpdate}
           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
         >
           Update Status
         </button>
       </div>
     )}
   </div>
 </div>
   </div>
  );
};

export default ShipmentTracking;
