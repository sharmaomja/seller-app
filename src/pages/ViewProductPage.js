import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal'; 
import Navbar from '../components/Navbar';


const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Change as needed
  const { user } = useContext(AuthContext);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (user && user.userId) {
        try {
          const sellerResponse = await axios.get(`http://localhost:8000/sellerdetail/user/${user.userId}`);
          const sellerId = sellerResponse.data.sellerId;
          fetchProducts(sellerId);
        } catch (error) {
          console.error('Error fetching seller details:', error);
        }
      }
    };

    const fetchProducts = async (sellerId) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/seller/${sellerId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchSellerDetails();
  }, [user]);

  const handleEditClick = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleAddProductClick = () => {
    navigate('/add-product');
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${selectedProductId}/complete-details`);
      setProducts(products.filter(product => product.productId !== selectedProductId));
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Search filter
  const filteredProducts = searchTerm
    ? currentProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentProducts;

    return (
     <div>
     <Navbar/>
     <div className="view-products-container p-8">
     <h1 className="text-3xl font-bold mb-6">Your Products</h1>
     <button
       onClick={handleAddProductClick}
       className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
     >
       Add Product
     </button>
     <input
       type="text"
       placeholder="Search products..."
       onChange={(e) => setSearchTerm(e.target.value)}
       className="border ml-10 border-gray-300 rounded-md px-3 py-2 mb-4"
     />
     <table className="w-full border-collapse border border-gray-300">
       <thead>
         <tr className="bg-gray-200">
           <th className="py-2 px-4">Product Name</th>
           <th className="py-2 px-4">Price</th>
           <th className="py-2 px-4">Stock</th>
           <th className="py-2 px-4">Category</th>
           <th className="py-2 px-4">Actions</th>
         </tr>
       </thead>
       <tbody>
         {filteredProducts.map((product) => (
           <tr key={product.productId} className="border-b border-gray-300">
             <td className="py-2 px-4">
               <Link to={`/product/${product.productId}`} className="text-blue-500 hover:underline">
                 {product.name}
               </Link>
             </td>
             <td className="py-2 px-4">${product.min_price}</td>
             <td className="py-2 px-4">{product.stockQuantity}</td>
             <td className="py-2 px-4">{product.ProductCategory?.name}</td>
             <td className="py-2 px-4">
               <button
                 onClick={() => handleEditClick(product.productId)}
                 className="bg-green-500 text-white py-1 px-2 rounded-md mr-2"
               >
                 Edit
               </button>
               <button
                 onClick={() => openModal(product.productId)}
                 className="bg-red-500 text-white py-1 px-2 rounded-md"
               >
                 Delete
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
     <div className="pagination mt-4">
       {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
         <button
           key={number + 1}
           onClick={() => paginate(number + 1)}
           className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
         >
           {number + 1}
         </button>
       ))}
     </div>
     <ConfirmationModal
       isOpen={isModalOpen}
       onClose={closeModal}
       onConfirm={handleDeleteClick}
       message="Are you sure you want to delete this product?"
     />
   </div>
     </div>
    );
          }

export default ViewProducts;
