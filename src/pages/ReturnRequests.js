import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ReturnRequests = ({ productId }) => {
  const [returnRequests, setReturnRequests] = useState([]);

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const response = await axios.get(`/api/returns/product/${productId}`);
        setReturnRequests(response.data.returnRequests);
      } catch (error) {
        console.error('Error fetching return requests:', error);
      }
    };

    fetchReturnRequests();
  }, [productId]);

  return (
   <div>
   <Navbar/>
   <div className="container mx-auto mt-8">
   <h2 className="text-3xl font-bold mb-4">Return Requests</h2>
   <table className="min-w-full bg-white border border-gray-300">
     <thead>
       <tr>
         <th className="py-2 px-4 border-b">Return ID</th>
         <th className="py-2 px-4 border-b">Customer Name</th>
         <th className="py-2 px-4 border-b">Reason</th>
         <th className="py-2 px-4 border-b">Status</th>
       </tr>
     </thead>
     <tbody>
       {returnRequests.map((request) => (
         <tr key={request.returnId}>
           <td className="py-2 px-4 border-b">{request.returnId}</td>
           <td className="py-2 px-4 border-b">{request.customerName}</td>
           <td className="py-2 px-4 border-b">{request.reason}</td>
           <td className="py-2 px-4 border-b">{request.status}</td>
         </tr>
       ))}
     </tbody>
   </table>
 </div>
   </div>
  );
};

export default ReturnRequests;
