import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const ProductForm = ({ product, onSave, isEditing }) => {
  const [productData, setProductData] = useState({
    name: '',
    header: '',
    short_description: '',
    description: '',
    min_price: '',
    discounted_price: '',
    gst_percentage: '',
    max_price: '',
    categoryId: '',
    apply_bid: false,
    stockQuantity: 0,
    return_or_replacement: 'return',
    return_or_replacement_days: 30,
    active: false,
    product_location_pin_code: '',
    storeId: ''
  });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState(['']);
  const [videos, setVideos] = useState([]);
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);
  const { user } = useContext(AuthContext);
  const [sellerId, setSellerId] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    console.log(user.userId);
    const fetchSellerDetails = async () => {
      try {

        const sellerResponse = await axios.get(`http://localhost:8000/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        console.log(sellerId)
        setSellerId(sellerId);

        // If editing, no need to fetch stores again as they are already loaded
        //if (!isEditing) {
        fetchStores(sellerId);
        //}
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchStores = async (fetchedSellerId) => {
      try {
        const response = await axios.get(`http://localhost:8000/stores/${fetchedSellerId}`);
        console.log('Stores response:', response);

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setStores(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // Handle the case when it's a single object by converting it into an array
          setStores([response.data]);
        } else {
          console.error('Unexpected data type received for stores:', response.data);
          setStores([]); // Set it to an empty array if the response is neither an array nor an object
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setStores([]); // Set to an empty array in case of error
      }
    };


    axios.get('http://localhost:8000/api/product-categories').then(response => {
      setCategories(response.data);
    });

    if (isEditing && product) {
      fetchSellerDetails();
      setProductData(product);
      setAttributes(product.attributes || []);
      setImages(product.images || []);
      setVideos(product.videos || []);
      setImageUrls(product.imageUrls || []);
    } else if (user && user.userId) {
      fetchSellerDetails();
    }
  }, [product, isEditing, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => setImages(e.target.files);
  const handleVideoChange = (e) => setVideos(e.target.files);

  const handleAttributesChange = (index, e) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [e.target.name]: e.target.value
    };
    setAttributes(updatedAttributes);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, idx) => idx !== index));
  };
  // Function to handle adding new attributes
  const addNewAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };



  const addURLField = (type) => {
    if (type === 'image') {
      setImageURLs([...imageURLs, '']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const formData = new FormData();

        // Add product data to formData
        Object.keys(productData).forEach(key => {
          if (productData[key] !== null && typeof productData[key] === 'object' && !(productData[key] instanceof File)) {
            // Stringify nested objects, except File objects
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        });

        // Add images to formData
        Array.from(images).forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });

        // Add videos to formData
        Array.from(videos).forEach((video, index) => {
          formData.append(`videos[${index}]`, video);
        });

        // Add attributes to formData
        attributes.forEach((attribute, index) => {
          formData.append(`attributes[${index}].name`, attribute.name);
          formData.append(`attributes[${index}].value`, attribute.value);
        });

        // Add categoryData and sellerData to formData
        if (productData.categoryData) {
          formData.append('categoryData', JSON.stringify(productData.categoryData));
        }
        if (productData.sellerData) {
          formData.append('sellerData', JSON.stringify(productData.sellerData));
        }

        // Log formData keys and values for debugging
        for (const [key, value] of formData) {
          console.log(key, value);
        }

        // Make PUT request
        await axios.put(`http://localhost:8000/api/products/${product.productId}/complete-details`, formData);

        onSave();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.error('Invalid product data:', productData);
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit} className="product-form mt-4 shadow-lg">
        <div className="form-group">
          <label htmlFor="categoryId">Category:</label>
          <select className="form-control" name="categoryId" id="categoryId" value={productData.categoryId} onChange={handleChange}>
            <option value="">Select a Category</option>
            {categories.map(category => <option key={category.categoryId} value={category.categoryId}>{category.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="storeId">Store:</label>
          <select className="form-control" name="storeId" id="storeId" value={productData.storeId} onChange={handleChange}>
            <option value="">Select a Store</option>
            {stores.map(store => <option key={store.storeId} value={store.storeId}>{store.storeName}</option>)}
          </select>
        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="name">Product Name:</label>
            <input className="form-control" name="name" id="name" value={productData.name} onChange={handleChange} placeholder="Product Name" />
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="header">Product Header:</label>
            <input className="form-control" name="header" id="header" value={productData.header} onChange={handleChange} placeholder="Product Header" />
          </div>
        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="short_description">Short Description:</label>
            <textarea className="form-control" name="short_description" id="short_description" value={productData.short_description} onChange={handleChange} placeholder="Short Description" />
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="description">Description:</label>
            <textarea className="form-control" name="description" id="description" value={productData.description} onChange={handleChange} placeholder="Description" />
          </div>
        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="min_price">Minimum Price:</label>
            <input className="form-control" name="min_price" id="min_price" type="number" value={productData.min_price} onChange={handleChange} placeholder="Minimum Price" />
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="discounted_price">Discounted Price:</label>
            <input className="form-control" name="discounted_price" id="discounted_price" type="number" value={productData.discounted_price} onChange={handleChange} placeholder="Discounted Price" />
          </div>

        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="gst_percentage">GST Percentage:</label>
            <input className="form-control" name="gst_percentage" id="gst_percentage" type="number" value={productData.gst_percentage} onChange={handleChange} placeholder="GST Percentage" />
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="max_price">Maximum Price:</label>
            <input className="form-control" name="max_price" id="max_price" type="number" value={productData.max_price} onChange={handleChange} placeholder="Maximum Price" />
          </div>
        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="stockQuantity">Stock Quantity:</label>
            <input className="form-control" name="stockQuantity" id="stockQuantity" type="number" value={productData.stockQuantity} onChange={handleChange} placeholder="Stock Quantity" />
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="return_or_replacement_days">Return or Replacement Days:</label>
            <input className="form-control" name="return_or_replacement_days" id="return_or_replacement_days" type="number" value={productData.return_or_replacement_days} onChange={handleChange} placeholder="Return or Replacement Days" />
          </div>
        </div>

        <div className='flex space-x-2'>
          <div className="form-group w-1/2">
            <label htmlFor="return_or_replacement">Return or Replacement:</label>
            <select className="form-control" name="return_or_replacement" id="return_or_replacement" value={productData.return_or_replacement} onChange={handleChange}>
              <option value="return">Return</option>
              <option value="replacement">Replacement</option>
            </select>
          </div>

          <div className="form-group w-1/2">
            <label htmlFor="product_location_pin_code">Product Location Pin Code:</label>
            <input className="form-control" name="product_location_pin_code" id="product_location_pin_code" value={productData.product_location_pin_code} onChange={handleChange} placeholder="Product Location Pin Code" />
          </div>

        </div>

        <div className="form-group checkbox-group">
          <input className="form-check-input" name="apply_bid" id="apply_bid" type="checkbox" checked={productData.apply_bid} onChange={handleChange} />
          <label htmlFor="apply_bid" className="form-check-label">Apply Bid</label>
        </div>

        <div className="form-group checkbox-group">
          <input className="form-check-input" name="active" id="active" type="checkbox" checked={productData.active} onChange={handleChange} />
          <label htmlFor="active" className="form-check-label">Active</label>
        </div>

        <div className="attributes-section">
          <h3 className='text-sm font-bold'>Add or Modify Attributes:</h3>
          {product.ProductAttributes && product.ProductAttributes.map((attribute, index) => (
            <div key={index} className="attribute-row flex space-x-2">
              <input
                className="form-control"
                name="name"
                value={attribute.name}
                onChange={(e) => handleAttributesChange(index, e)}
                placeholder="Attribute Name"
              />
              <input
                className="form-control"
                name="value"
                value={attribute.value}
                onChange={(e) => handleAttributesChange(index, e)}
                placeholder="Attribute Value"
              />
              <button
                className="btn btn-danger "
                type="button"
                onClick={() => removeAttribute(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="btn btn-primary" type="button" onClick={addNewAttribute}>
            Add Attribute
          </button>
        </div>

        <div className="images-section">
          <h3>Images:</h3>
          <div className="media-gallery">
            {product && product.images && product.images.length > 0 && (
              product.images.map((image, index) => (
                <div key={index} className="media-item">
                  <img src={image.imageUrl} alt={`Image ${index}`} />
                  {/* You can add additional information or actions related to images here */}
                </div>
              ))
            )}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Images:</label>
              {imageURLs.map((url, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control w-full"
                    placeholder="Enter image URL"
                    value={url}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                </div>
              ))}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => addURLField('image')}
                type='button'
              >
                + Add Image URL
              </button>
            </div>
          </div>


        </div>

        <button className="btn btn-success" type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default ProductForm;