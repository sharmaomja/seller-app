import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const { user } = useContext(AuthContext);
  const apiBaseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (user && user.userId) {
      axios.get(`${apiBaseURL}/api/products/seller/${user.userId}`) // Adjust the endpoint as per your API
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [user]);

  const handleDelete = (productId) => {
    axios.delete(`${apiBaseURL}/api/products/${productId}`)
      .then(() => {
        setProducts(products.filter(product => product.productId !== productId));
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Search logic
  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredProducts.map(product => (
        <div key={product.productId} className="product-item">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          {product.images && product.images.length > 0 && (
            <img src={product.images[0].imageUrl} alt={product.name} className="product-image" />
          )}
          <div className="buttons">
            <Link to={`/product/edit/${product.productId}`} className="btn edit-btn">Edit</Link>
            <button onClick={() => handleDelete(product.productId)} className="btn delete-btn">Delete</button>
            <Link to={`/product/${product.productId}`} className="btn view-btn">View Details</Link>
            <Link to={`/product/${product.productId}`} className="btn view-btn">Apply Bid ↗</Link>

          </div>
        </div>
      ))}

      <div className="pagination">
        {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map(number => (
          <button key={number} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
