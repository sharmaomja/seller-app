import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ConfirmationModal from '../ConfirmationModal';
import Navbar from '../home/components/Navbar';


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
      <Navbar />
      <div className="view-products-container p-4">
        <h1 className="text-3xl font-semibold mb-4 text-center">Products</h1>
        <button
          onClick={handleAddProductClick}
          className="bg-yellow-300 text-black h-10 w-1/3 mr-10 rounded-lg mb-6"
        >
          Add Product
        </button>
        <input
          type="text"
          placeholder="           Search products..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-900 bg-gray-100 rounded-md h-10 mb-4 w-1/2 mx-auto"
        />
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-3">Store</th>
                <th className="py-2 px-3">Product Name</th>
                <th className="py-2 px-3">Max Price</th>
                <th className="py-2 px-3">Min Price</th>
                <th className="py-2 px-3">Discounted Price</th>
                <th className="py-2 px-3">Stock</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.productId} className="border-b border-gray-300">
                  <td className="py-2 px-3">{product.Store.storeName}</td>
                  <td className="py-1 px-2">
                    <Link to={`/product/${product.productId}`} className="text-blue-500 hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-2 px-3">₹{product.max_price}</td>
                  <td className="py-2 px-3">₹{product.min_price}</td>
                  <td className="py-2 px-3">₹{product.discounted_price}</td>
                  <td className="py-2 px-3">{product.stockQuantity}</td>
                  <td className="py-2 px-3">{product.ProductCategory?.name}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleEditClick(product.productId)}
                      className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openModal(product.productId)}
                      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Delete
                    </button>   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination mt-6 flex justify-center">
          {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className="bg-gray-500 text-white py-2 px-3 rounded-lg mx-1"
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
