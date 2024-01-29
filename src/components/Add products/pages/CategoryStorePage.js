import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StepperContext } from '../../../context/StepperContext';
import { AuthContext } from '../../../context/AuthContext';

const CategoryAndStorePage = () => {
  const { userData, setUserData } = useContext(StepperContext);
  const [categories, setCategories] = useState([]);
  const [storeData, setStoreData] = useState([]); // Update state name
    const { user } = useContext(AuthContext);
    const [sellerId, setSellerId] = useState([]);

  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:8000/api/product-categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`http://localhost:8000/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        setSellerId(sellerId);
        fetchStoresData(sellerId);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchStoresData = async (sellerId) => {
      try {
        const storeResponse = await axios.get(`http://localhost:8000/stores/${sellerId}`);
        setStoreData(storeResponse.data);
        console.log(storeResponse.data);
      } catch (error) {
        console.error('Error fetching store data', error);
      }
    };

    fetchSellerDetails();
  }, [user.userId]);

  const handleCategoryChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      categoryId: e.target.value,
    }));
  };

  const handleStoreChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      storeId: e.target.value,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 1: Category & Store</h2>
      <div className="form-group">
        <label htmlFor="category">Select a Category:</label>
        <select
          id="category"
          className="form-control"
          name="categoryId"
          value={userData.categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Select a Category</option>
          {categories.map(category => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mt-4">
        <label htmlFor="store">Select a Store:</label>
        <select
          id="store"
          className="form-control"
          name="storeId"
          value={userData.storeId}
          onChange={handleStoreChange}
        >
          <option value="">Select a Store</option>
          {storeData.map(store => ( // Update map function to use storeData
            <option key={store.storeId} value={store.storeId}>
              {store.storeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryAndStorePage;
