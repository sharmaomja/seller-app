import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../home/components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const OrderList = ({ sellerId, storeId }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  const fetchOrders = async (sellerId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/seller/${sellerId}`);
      const initialStatuses = response.data.reduce((acc, order) => {
        acc[order.orderId] = order.orderStatus;
        return acc;
      }, {});
      setOrderStatuses(initialStatuses);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId) => {
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

  const handleSearchTermChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = orders.filter(order =>
      order.OrderItems.some(orderItem => orderItem.Product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="mt-4 mx-auto" style={{ width: "1700px" }}>
        <h2 className="text-2xl p-1 rounded-t-lg font-semibold mb-2 text-center bg-gray-200">
          Your Orders
        </h2>

        <div className="flex justify-center mb-1 text-black">
          <input
            type="text"
            placeholder="    Search by product name"
            className="h-10 w-full rounded-md border border-gray-700 text-black bg-gray-50 focus:outline-none focus:border-gray-500"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>

        {currentOrders.map((order) => (
          <div key={order.orderId} className="mb-2 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="font-bold md:mb-0 text-sm ml-4">Order ID: #{order.orderId}</h3>
              <div className="flex border-t border-gray-300 md:mt-0 md:border-t-0 md:ml-4 md:w-1/2">
                <p className="text-l font-bold mb-1">Shipping Address:</p>
                <div className="rounded-lg">
                  <p className="text-m font-semibold ml-4 bg-gray-100 text-gray-700 break-words">{formatAddress(order.shippingAddress)}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-m">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4" style={{ width: "500px" }}>Product</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Total Price</th>
                    <th className="py-2 px-4">Order Status</th>
                    <th className="py-2 px-4">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.OrderItems.map((orderItem) => (
                    <tr key={orderItem.orderItemId} className="bg-gray-100">
                      <td className="py-2 px-4">{orderItem.Product.name}</td>
                      <td className="py-2 px-4">{orderItem.quantity}</td>
                      <td className="py-2 px-4">₹{orderItem.Product.max_price}</td>
                      <td className="py-2 px-4">{order.orderStatus}</td>
                      <td className="py-2 px-4">
                        <select
                          className="bg-gray-200 mr-2 px-3 py-1 rounded"
                          value={orderStatuses[order.orderId] || ''}
                          onChange={(e) =>
                            setOrderStatuses({ ...orderStatuses, [order.orderId]: e.target.value })
                          }
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
                          className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition duration-300"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <ul className="flex">
          {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
            <li key={index} className="mx-1">
              <button
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-gray-200' : 'bg-white hover:bg-gray-300'
                  } focus:outline-none`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderList;
