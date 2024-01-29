import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import '../styles/EditProduct.css';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams(); // Get productId from route parameters

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/complete-details/${productId}`)
      .then(response => {
        const receivedProduct = response.data;
        console.log('Received Product Data:', receivedProduct);
        setProduct(receivedProduct);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  const handleSave = (updatedProduct) => {
    console.log("Updated Product", updatedProduct)
    axios.put(`http://localhost:8000/api/products/${productId}/complete-details`, updatedProduct)
      .then(() => console.log('Product updated successfully'))
      .catch(error => console.error('Error updating product:', error));
  };

  if (!product) return <div>Loading...</div>;

  return <ProductForm product={product} onSave={handleSave} isEditing={true} />;
};

export default EditProduct;
