import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../home/components/Navbar';
import { useNavigate } from 'react-router-dom';

const AddProductForm = ({ productId }) => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);
  const [productData, setProductData] = useState({ name: '', header: '', short_description: '', description: '', min_price: '', discounted_price: '', gst_percentage: '', max_price: '', apply_bid: false, stockQuantity: 10, categoryId: '', storeId: '', seller_id: '', return_or_replacement: 'return', return_or_replacement_days: 7, active: false, product_location_pin_code: '' });
  const [sellerId, setSellerId] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageURLs, setImageURLs] = useState(['']);
  const [videoURLs, setVideoURLs] = useState(['']);
  const [showPopup, setShowPopup] = useState(false);
  const apiBaseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`${apiBaseURL}/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        setSellerId(sellerId);
        setProductData(prevData => ({
          ...prevData,
          seller_id: sellerId
        }));
        fetchStoreData(sellerId);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchStoreData = async (sellerId) => {
      try {
        const storeResponse = await axios.get(`${apiBaseURL}/stores/${sellerId}`);
        setStoreData(storeResponse.data);
        console.log(storeResponse.data);
      } catch (error) {
        console.error('Error fetching store data', error);
      }
    };

    axios.get(`${apiBaseURL}/api/product-categories`).then(response => setCategories(response.data));
    if (productId) {
      axios.get(`${apiBaseURL}/api/products/${productId}`).then(response => setProductData(response.data));
    } else if (user && user.userId) {
      fetchSellerDetails();
    }
  }, [productId, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;

    if (type === 'checkbox') {
      updatedValue = checked;
    } else if (type === 'number') {
      updatedValue = value ? parseInt(value, 10) : '';
    }

    setProductData(prevData => ({
      ...prevData,
      [name]: updatedValue
    }));
  };

  const handleImageChange = (index, e) => {
    e.preventDefault()
    const newURLs = [...imageURLs];
    newURLs[index] = e.target.value;
    setImageURLs(newURLs);
  };

  const handleVideoChange = (index, e) => {
    const newURLs = [...videoURLs];
    newURLs[index] = e.target.value;
    setVideoURLs(newURLs);
  };

  const addURLField = (type) => {
    if (type === 'image') {
      setImageURLs([...imageURLs, '']);
    } else if (type === 'video') {
      setVideoURLs([...videoURLs, '']);
    }
  };

  const handleAttributesChange = (index, e) => {
    const updatedAttributes = attributes.map((attr, idx) => idx === index ? { ...attr, [e.target.name]: e.target.value } : attr);
    setAttributes(updatedAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('In line 129');
    try {
      const productDetails = { ...productData };
      const imagesData = imageURLs.map(url => ({ imageUrl: url.trim(), altText: '' }));
      const videosData = videoURLs.filter(url => url.trim() !== '');

      const attributesData = attributes.map(attr => ({
        name: attr.name.trim(),
        value: attr.value.trim()
      }));

      const requestData = {
        productDetails: {
          ...productDetails,
          seller_id: sellerId,
        },
        imagesData,
        videosData,
        attributesData,
      };

      const response = await axios.post(`${apiBaseURL}/api/products/complete-details`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);

      if (response.data.productId) {
        // Show pop-up for 1 second
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          // Redirect to '/list-product' after 1 second
          navigate('/list-product');
        }, 1000);
      }

    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (

    <div>
      <Navbar />
      <form className="mt-8 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg" style={{ width: "80%" }} onSubmit={handleSubmit}>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Select a Category:
              </label>
              <select className="form-control shadow-sm py-1" name="categoryId" value={productData.categoryId} onChange={handleChange}>
                <option value="">Select a Category</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                Select a Store:
              </label>
              {storeData.length > 0 && (
                <select
                  id="store"
                  className="form-control shadow-sm py-1"
                  name="storeId"
                  value={productData.storeId}
                  onChange={handleChange}
                >
                  <option value="">Select a Store</option>
                  {storeData.map(store => (
                    <option key={store.storeId} value={store.storeId}>
                      {store.storeName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>


        <div className="flex mb-0">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product Name:
              </label>
              <input
                required
                id="productName"
                className="form-control shadow-sm py-1"
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Product Name"
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label htmlFor="productHeader" className="block text-sm font-medium text-gray-700">
                Product Header:
              </label>
              <input
                required
                id="productHeader"
                className="form-control shadow-sm py-1"
                name="header"
                value={productData.header}
                onChange={handleChange}
                placeholder="Product Header"
              />
            </div>
          </div>
        </div>


        <div className="flex mb-0">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                Short Description:
              </label>
              <textarea
                id="shortDescription"
                className="form-control shadow-sm py-1 h-20"
                name="short_description"
                value={productData.short_description}
                onChange={handleChange}
                placeholder="Short Description"
              ></textarea>
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                id="description"
                className="form-control shadow-sm py-1 h-20"
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Description"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex mb-0">
          <div className="w-1/4 pr-4">
            <div className="form-group">
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Minimum Price:
              </label>
              <input
                required
                id="minPrice"
                className="form-control shadow-sm py-1"
                name="min_price"
                type="number"
                value={productData.min_price}
                onChange={handleChange}
                placeholder="Minimum Price"
              />
            </div>
          </div>
          <div className="w-1/4 pr-4">
            <div className="form-group">
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                Discounted Price:
              </label>
              <input
                required
                id="discountedPrice"
                className="form-control shadow-sm py-1"
                name="discounted_price"
                type="number"
                value={productData.discounted_price}
                onChange={handleChange}
                placeholder="Discounted Price"
              />
            </div>
          </div>
          <div className="w-1/4 pr-4">
            <div className="form-group">
              <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-700">
                GST Percentage:
              </label>
              <input
                required
                id="gstPercentage"
                className="form-control shadow-sm py-1"
                name="gst_percentage"
                type="number"
                value={productData.gst_percentage}
                onChange={handleChange}
                placeholder="GST Percentage"
              />
            </div>
          </div>
          <div className="w-1/4">
            <div className="form-group">
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Maximum Price:
              </label>
              <input
                required
                id="maxPrice"
                className="form-control shadow-sm py-1"
                name="max_price"
                type="number"
                value={productData.max_price}
                onChange={handleChange}
                placeholder="Maximum Price"
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <label htmlFor="returnOrReplacementDays" className="block text-sm font-medium text-gray-700">
                Return or Replacement Days:
              </label>
              <input
                required
                id="returnOrReplacementDays"
                className="form-control shadow-sm py-1"
                name="return_or_replacement_days"
                type="number"
                value={productData.return_or_replacement_days}
                onChange={handleChange}
                placeholder="Return or Replacement Days"
              />
            </div>
          </div>

          <div className="w-1/2 mt-2">
            <div className="form-group">
              <label htmlFor="returnOrReplacement" className="block text-sm font-medium text-gray-700">
                Return or Replacement:
              </label>
              <select
                id="returnOrReplacement"
                className="form-control shadow-sm py-1"
                name="return_or_replacement"
                value={productData.return_or_replacement}
                onChange={handleChange}
              >
                <option value="return">Return</option>
                <option value="replacement">Replacement</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className='w-1/2 pr-4'>
            <div className="form-group">
              <label htmlFor="productLocationPinCode" className="block text-sm font-medium text-gray-700">
                Product Location Pin Code:
              </label>
              <input
                required
                id="productLocationPinCode"
                className="form-control shadow-sm py-1"
                name="product_location_pin_code"
                value={productData.product_location_pin_code}
                onChange={handleChange}
                placeholder="Product Location Pin Code"
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity:
              </label>
              <input
                required
                id="stockQuantity"
                className="form-control shadow-sm py-1"
                name="stockQuantity"
                type="number"
                value={productData.stockQuantity}
                onChange={handleChange}
                placeholder="Stock Quantity"
              />
            </div>
          </div>
        </div>

        <div className='flex'>
          <div className='w-1/2 pr-4'>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Images:</label>
              {imageURLs.map((url, index) => (
                <div key={index} className="mb-2">
                  <input
                    required
                    type="text"
                    className="form-control shadow-sm py-1"
                    placeholder="Enter image URL"
                    value={url}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                </div>
              ))}
              <button
                className="bg-gray-400 text-black w-48 h-8 rounded"
                onClick={() => addURLField('image')}
                type='button'
              >
                + ADD IMAGE URLs
              </button>
            </div>
          </div>
          <div className='w-1/2'>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Videos:</label>
              {videoURLs.map((url, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control shadow-sm py-1"
                    placeholder="Enter video URL"
                    value={url}
                    onChange={(e) => handleVideoChange(index, e)}
                  />
                </div>
              ))}
              <button
                className="bg-gray-400 text-black w-48 h-8 rounded"
                onClick={() => addURLField('video')}
                type='button'
              >
                + ADD VIDEO URLs
              </button>
            </div>
          </div>
        </div>


        <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
          Add Product Attributes:
        </label>
        <div className="attributes-section flex items-center flex-wrap">

          {attributes.map((attribute, index) => (
            <div className="attribute-row flex items-center space-x-4" key={index}>
              <input
                required
                style={{ width: "640px" }}
                className="border border-gray-700 p-1 shadow-sm"
                name="name"
                value={attribute.name}
                onChange={(e) => handleAttributesChange(index, e)}
                placeholder="Attribute Name"
              />
              <input
                required
                style={{ width: "640px" }}
                className="border border-gray-700 p-1"
                name="value"
                value={attribute.value}
                onChange={(e) => handleAttributesChange(index, e)}
                placeholder="Attribute Value"
              />
              {attributes.length > 1 && (
                <button
                  className="remove-attribute-btn text-3xl font-bold text-white px-1 py-1 rounded-full"
                  onClick={() => removeAttribute(index)}
                  type='button'
                >
                  ⛔
                </button>
              )}
            </div>
          ))}
          <button
            className="ml-4 add-attribute-btn bg-green-500 text-lg font-bold text-white px-1 py-1 rounded-full"
            onClick={addAttribute}
            type='button'
          >
            ➕
          </button>
        </div>

        <button className="submit-btn w-full bg-yellow-400 font-semibold text-black px-4 py-1 rounded mt-4" type="submit">
          Save Product
        </button>
      </form>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded">
            Product saved successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;



// <div className='flex'>
// <div className="w-1/2 pr-4">
//   <div className="form-group">
//     <div className="border border-gray-800 p-1 mt-2 rounded-lg">
//       <label className="flex items-center space-x-2 cursor-pointer">
//         <input
//           name="active"
//           type="checkbox"
//           checked={productData.active}
//           onChange={handleChange}
//           className="ml-4 form-checkbox transform scale-150 text-indigo-500"
//         />
//         <span className="text-l text-gray-700">Active</span>
//       </label>
//     </div>
//   </div>
// </div>

// <div className="w-1/2 pr-4">
//   <div className="form-group">
//     <div className="border border-gray-800 p-1 mt-2 rounded-lg">
//       <label className="flex items-center space-x-2 cursor-pointer">
//         <input
//           name="apply_bid"
//           type="checkbox"
//           checked={productData.apply_bid}
//           onChange={handleChange}
//           className="ml-4 form-checkbox transform scale-150 text-indigo-500"
//         />
//         <span className="text-l text-gray-700">Apply Bid</span>
//       </label>
//     </div>
//   </div>
// </div>

// </div>
