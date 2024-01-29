// AttributesReturnsPage.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AttributesReturnsPage = ({ productId, onSave }) => {
  const [productData, setProductData] = useState({
    return_or_replacement: 'Return',
    return_days: 30,
    apply_bid: false,
    active: false,
    attributes: [{ name: '', value: '' }],
  });
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);


  useEffect(() => {
    // Your existing code for fetching data (categories, stores, etc.)
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedValue;
    if (type === 'checkbox') {
      updatedValue = checked;
    } else if (type === 'number') {
      updatedValue = value ? parseInt(value, 10) : '';
    } else {
      updatedValue = value;
    }

    setProductData(prevData => ({
      ...prevData,
      [name]: updatedValue
    }));

    console.log(`Field: ${name}, Value: ${updatedValue}`);
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


  // Add other functions for handling images, videos, attributes, and form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      for (const key in productData) {
        formData.append(key, productData[key]);
      }

      // Your existing code for appending images, videos, and attributes

      const response = await axios.post('http://localhost:8000/api/products/complete-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response.data.productId) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <form className="max-w-8xl mt-2 mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={handleSubmit}>
        {/* Add your form fields here */}
        <div className="flex">
          <div className='w-1/2 pr-4'>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Return Or Replacement:</label>
              <select
                className="form-control"
                name="return_or_replacement"
                value={productData.return_or_replacement}
                onChange={handleChange}
                required
              >
                <option value="Select an Option">Select an option</option>
                <option value="return">Return</option>
                <option value="replacement">Replacement</option>
              </select>
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Return Days:</label>
              <input
                className="form-control"
                name="return_days"
                type="number"
                value={productData.return_days}
                onChange={handleChange}
                placeholder="Return Days"
                required
              />
            </div>
          </div>
        </div>

        <div className='flex'>
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <div className="border border-gray-800 p-1 mt-2 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    name="active"
                    type="checkbox"
                    checked={productData.active}
                    onChange={handleChange}
                    className="ml-4 form-checkbox transform scale-150 text-indigo-500"
                  />
                  <span className="text-l text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="w-1/2 pr-4">
            <div className="form-group">
              <div className="border border-gray-800 p-1 mt-2 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    name="apply_bid"
                    type="checkbox"
                    checked={productData.apply_bid}
                    onChange={handleChange}
                    className="ml-4 form-checkbox transform scale-150 text-indigo-500"
                  />
                  <span className="text-l text-gray-700">Apply Bid</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default AttributesReturnsPage;


// <button className="submit-btn w-full bg-blue-800 text-white px-4 py-2 rounded mt-2" type="submit">
// Save Product
// </button>

// <div className="attributes-section flex items-center flex-wrap">
//           <div className="attribute-row flex items-center space-x-4">
//             <input
//               style={{ width: "450px" }}
//               className="border border-gray-700 p-2"
//               name="name"
//               value={attributes[0].name}
//               onChange={(e) => handleAttributesChange(0, e)}
//               placeholder="Attribute Name"
//             />
//             <input
//               style={{ width: "450px" }}
//               className="border border-gray-700 p-2"
//               name="value"
//               value={attributes[0].value}
//               onChange={(e) => handleAttributesChange(0, e)}
//               placeholder="Attribute Value"
//             />
//           </div>
//           {attributes.length > 1 && (
//             <button
//               className="remove-attribute-btn text-5xl font-bold text-white px-2 py-2 rounded-full"
//               onClick={() => removeAttribute(0)}
//             >
//               ⛔
//             </button>
//           )}
//           <button
//             className="ml-4 add-attribute-btn bg-green-500 text-2xl font-bold text-white px-2 py-2 rounded-full"
//             onClick={addAttribute}
//           >
//             ➕
//           </button>
//         </div>