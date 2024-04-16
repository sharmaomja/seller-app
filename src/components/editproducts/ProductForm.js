import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../home/components/Navbar';
import { useNavigate } from 'react-router-dom';

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
    storeId: '',
    attributes: [{ name: '', value: '' }]
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
  const [showAddImagesForm, setShowAddImagesForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const apiBaseURL = process.env.REACT_APP_API_URL;


  const extractImageId = url => {
    const match = url.match(/\/d\/([^/]+)\//);
    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}`;
    } else {
        console.error('Invalid Google Drive image URL:', url);
        return url; 
    }
};

  useEffect(() => {
    console.log(user.userId);
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`${apiBaseURL}/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        console.log(sellerId)
        setSellerId(sellerId);
        fetchStores(sellerId);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchStores = async (fetchedSellerId) => {
      try {
        const response = await axios.get(`${apiBaseURL}/stores/${fetchedSellerId}`);
        console.log('Stores response:', response);
        if (Array.isArray(response.data)) {
          setStores(response.data);
        } else if (response.data && typeof response.data === 'object') {
          setStores([response.data]);
        } else {
          console.error('Unexpected data type received for stores:', response.data);
          setStores([]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setStores([]);
      }
    };

    axios.get(`${apiBaseURL}/api/product-categories`).then(response => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
          formData.append(`productData[${key}]`, value);
        });
        formData.append('categoryData', JSON.stringify({ categoryId: productData.categoryId }));
        formData.append('sellerData', JSON.stringify({ sellerId: productData.sellerId }));
        imageURLs.forEach((url, index) => {
          formData.append(`imagesData[${index}].imageUrl`, url);
        });
        videos.forEach((videoUrl, index) => {
          formData.append(`videosData[${index}]`, videoUrl);
        });
        attributes.forEach((attribute, index) => {
          formData.append(`attributesData[${index}].name`, attribute.name);
          formData.append(`attributesData[${index}].value`, attribute.value);
        });
        await onSave(formData);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/list-product');
        }, 3000); // Set the duration for the pop-up
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.error('Invalid product data:', productData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttributesChange = (index, e) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [e.target.name]: e.target.value
    };
    setAttributes(updatedAttributes);
  };

  const removeAttribute = async (attributeId) => {
    try {
      console.log('Deleting attribute with ID:', attributeId);
  
      // Send a DELETE request to your server endpoint
      const response = await axios.delete(`${apiBaseURL}/api/product-attributes/${attributeId}`);
      
      console.log('Delete attribute response:', response);
  
      // If the deletion was successful, update the local state
      setAttributes(attributes.filter((attribute) => attribute.attributeId !== attributeId));
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };
  
  

  const addNewAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleRemoveImage = async (imageId) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this image?');
    if (shouldRemove) {
      try {
        await axios.delete(`${apiBaseURL}/product-images/${imageId}`);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleToggleAddImagesForm = () => {
    setShowAddImagesForm((prev) => !prev);
  };

  const addURLField = () => {
    setImageURLs([...imageURLs, '']);
  };

  const handleImageChange = (index, e) => {
    const updatedImageURLs = [...imageURLs];
    updatedImageURLs[index] = e.target.value;
    
    // Extract image ID using extractImageId function
    const imageURL = extractImageId(e.target.value);
    console.log(imageURL)
    // Update the state with the extracted image URL
    setImageURLs(updatedImageURLs);
    setImageUrls(prevImageUrls => {
      const newImageUrls = [...prevImageUrls];
      newImageUrls[index] = imageURL;
      return newImageUrls;
    });
  };
  

  const removeImageURL = (index) => {
    const updatedImageURLs = [...imageURLs];
    updatedImageURLs.splice(index, 1);
    setImageURLs(updatedImageURLs);
  };

  const handleImageUrlChange = (index, e) => {
    const updatedImages = [...productData.ProductImage];
    updatedImages[index] = {
      ...updatedImages[index],
      imageUrl: e.target.value,
    };
    setProductData(prevData => ({
      ...prevData,
      ProductImage: updatedImages,
    }));
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

        <div className='flex flex-row space-x-48'>
          <div className="form-group checkbox-group">
            <input className="form-check-input" name="apply_bid" id="apply_bid" type="checkbox" checked={productData.apply_bid} onChange={handleChange} />
            <label htmlFor="apply_bid" className="form-check-label">Apply Bid</label>
          </div>

          <div className="form-group checkbox-group">
            <input className="form-check-input" name="active" id="active" type="checkbox" checked={productData.active} onChange={handleChange} />
            <label htmlFor="active" className="form-check-label">Active</label>
          </div>
        </div>

        <h3>Images:</h3>
        <div className="">
          <div className="flex flex-row space-x-4">
            {product.ProductImage && product.ProductImage.length > 0 && (
              product.ProductImage.map((image, index) => (
                <div key={index} className="media-item w-4/5 relative">
                  <img src={image.imageUrl} alt={`Image ${index}`} className="w-full h-full" />
                  <input
                    type="text"
                    className="form-control"
                    value={image.imageUrl}
                    onChange={(e) => handleImageUrlChange(index, e)}
                    placeholder="Image URL"
                  />
                  <button
                    className="remove-image-button bg-red-500 rounded-lg absolute top-2 right-2 h-8 w-8 text-white"
                    onClick={() => handleRemoveImage(image.imageId)}
                  >
                    x
                  </button>
                </div>
              ))
            )}
          </div>

         <div className="form-group">
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
            Add Product Images:
          </label>
          {!showAddImagesForm ? (
            <button
              className="bg-indigo-500 text-white h-10 w-36 rounded"
              onClick={handleToggleAddImagesForm}
              type="button"
            >
              Add Images
            </button>
          ) : (
            <div className="flex flex-col">
              {imageURLs.map((url, index) => (
                <div key={index} className="mb-2 mr-4 flex flex-row">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={url}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                  <button
                    className="bg-red-500 text-white h-10 w- rounded ml-2"
                    onClick={() => removeImageURL(index)}
                    type='button'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex flex-row space-x-2 w-full">
                <input
                  type="text"
                  className="form-control h-10"
                  placeholder="Enter image URL"
                  value={''}
                  onChange={(e) => handleImageChange(imageURLs.length, e)}
                />
                <button
                  className="bg-indigo-500 text-white h-10 w-36 rounded"
                  onClick={() => addURLField('image')}
                  type='button'
                >
                  Add URLs
                </button>
              </div>
            </div>
             )}
          </div>
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
        </div>

        <div className="attributes-section">
          <h3 className='text-sm font-bold'>Attributes:</h3>
          {attributes.map((attribute, index) => (
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
                className="btn btn-danger"
                type="button"
                onClick={() => removeAttribute(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-primary mt-2"
            type="button"
            onClick={addNewAttribute}
          >
            Add Attribute
          </button>
        </div>


        <button className="btn btn-success w-full" type="submit">Save Product</button>
      </form>
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded">
          Product updated successfully!
        </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;