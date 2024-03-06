import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './ProductForm';
import './EditProduct.css';

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

  const handleSave  = async (formData) => {

    console.log(formData);
    try {
      await axios.put(`http://localhost:8000/api/products/${productId}/complete-details`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Product updated successfully');
      // Additional success handling here
    } catch (error) {
      console.error('Error updating product:', error);
      // Additional error handling here
    }
  };

  if (!product) return <div>Loading...</div>;

  return <ProductForm product={product} onSave={handleSave} isEditing={true} />;
};

export default EditProduct;