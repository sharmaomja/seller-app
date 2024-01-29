// PricePage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const PricePage = ({ productId, onSave }) => {
  const [Data, setData] = useState({
    min_price: '',
    discounted_price: '',
    gst_percentage: '',
    max_price: '',
    product_location_pin_code: '',
    stockQuantity: 0,
  });

  return (
    <div>
      <form className="max-w-8xl mt-2 mx-auto p-8 bg-white shadow-md rounded-lg">
        {/* Render your price-related form fields here */}
        <div className="flex mb-0">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <input
                className="form-control"
                name="min_price"
                required
                type="number"
                value={Data.min_price}
                placeholder="Minimum Price"
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <input
                className="form-control"
                name="discounted_price"
                required
                type="number"
                value={Data.discounted_price}
                placeholder="Discounted Price"
              />
            </div>
          </div>
        </div>

        <div className='flex mb-0'>
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <input className="form-control" name="gst_percentage" required type="number" value={Data.gst_percentage} placeholder="GST Percentage" />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <input className="form-control" name="max_price" type="number" required value={Data.max_price} placeholder="Maximum Price" />
            </div>
          </div>
        </div>

        <div className="flex">
          <div className='w-1/2 pr-4'>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Product Location Pin Code:</label>
              <input
                className="form-control"
                name="product_location_pin_code"
                value={Data.product_location_pin_code}
                placeholder="Product Location Pin Code"
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2">Stock Quantity:</label>
              <input
                className="form-control"
                name="stockQuantity"
                type="number"
                value={Data.stockQuantity}
                placeholder="Stock Quantity"
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PricePage;

// <button className="submit-btn w-full bg-blue-800 text-white px-4 py-2 rounded mt-2" type="submit">
//           Save Price Details
//         </button>