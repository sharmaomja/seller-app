import React, { useState } from 'react';

const ProductDetailPage = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    header: '',
    short_description: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div>
      <form className="max-w-8xl mt-2 mx-auto p-8 bg-white shadow-md rounded-lg">
        <div className="flex mb-0">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <input
                className="form-control"
                name="name"
                value={productDetails.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <input
                className="form-control"
                name="header"
                value={productDetails.header}
                onChange={handleChange}
                placeholder="Product Header"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex mb-0">
          <div className="w-1/2 pr-4">
            <div className="form-group">
              <textarea
                className="form-control h-20"
                name="short_description"
                value={productDetails.short_description}
                onChange={handleChange}
                placeholder="Short Description"
                required
              ></textarea>
            </div>
          </div>

          <div className="w-1/2">
            <div className="form-group">
              <textarea
                className="form-control h-20"
                name="description"
                value={productDetails.description}
                onChange={handleChange}
                placeholder="Description"
                required
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductDetailPage;

