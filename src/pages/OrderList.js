import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const OrderList = ({ sellerId, storeId }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  
  const fetchOrders = async (sellerId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/seller/${sellerId}`);
      const initialStatuses = response.data.reduce((acc, order) => {
        acc[order.orderId] = order.orderStatus;
        return acc;
      }, {});
      setOrderStatuses(initialStatuses);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId) => {
    console.log(user.userId)
    try {
      await axios.put(`http://localhost:8000/api/orders_update/${orderId}`, {
        orderStatus: orderStatuses[orderId],
        userId: user.userId,
        userType: 'seller',
      });
      // Fetch orders again after updating status
      fetchOrders(sellerId);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`http://localhost:8000/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        fetchOrders(sellerId);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    fetchSellerDetails();
  }, [user.userId, sellerId]);

  const formatAddress = (address) => {
    const addressLines = address.split("\\n");
    return addressLines.join(', ');
  };

  return (
    <div>
      <Navbar />
      {/* ... */}
      <div className="max-w-7xl mx-auto mt-4">
        <h2 className="text-xl bg-blue-50 p-2 justify-center items-center rounded-t-lg font-bold mb-2">Your Orders</h2>
        {orders.map((order) => (
          <div key={order.orderId} className="mb-4">
            <h3 className="text-xl font-bold mb-2">Order ID: {order.orderId}</h3>
            <p className="mb-2">
              <strong>Shipping Address:</strong> {formatAddress(order.shippingAddress)}
            </p>
            <table className="max-w-7xl bg-white border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="py-1 px-4 border-b">Product</th>
                  <th className="py-1 px-4 border-b">Quantity</th>
                  <th className="py-1 px-4 border-b">Total Price</th>
                  <th className="py-1 px-4 border-b">Order Status</th>
                  <th className="py-1 px-4 border-b">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {order.OrderItems.map((orderItem) => (
                  <tr key={orderItem.orderItemId}>
                    <td className="py-1 px-4 border-b">{orderItem.Product.name}</td>
                    <td className="py-1 px-4 border-b">{orderItem.quantity}</td>
                    <td className="py-1 px-4 border-b">${orderItem.Product.max_price}</td>
                    <td className="py-1 px-4 border-b">{order.orderStatus}</td>
                    <td className="py-1 px-4 border-b">
                    <select
                      className='bg-gray-200'
                      value={orderStatuses[order.orderId] || ''}
                      onChange={(e) => setOrderStatuses({ ...orderStatuses, [order.orderId]: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => updateOrderStatus(order.orderId)}
                      disabled={!orderStatuses[order.orderId]}
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {/* ... */}
    </div>
  );
};

export default OrderList;
