// Import other necessary libraries/components
import React, { useState } from 'react';
import Stepper from './pages/Stepper';
import StepperControl from './pages/StepperControl';
import CategoryStorePage from './pages/CategoryStorePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import PriceReturnsPage from './pages/PricePage';
import AttributesPage from './pages/AttributesReturnsPage';
import ImageVideoPage from './pages/ImageVideoPage';
import { StepperContext } from '../../context/StepperContext';
import Navbar from '../Navbar';
import axios from 'axios'; // Import axios

export default function Main() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState('');
  const [finalData, setFinalData] = useState([]);

  const steps = [
    'Category & Store', 'Product Details', 'Prices', 'Attributes', 'Images & Videos'
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <CategoryStorePage />;
      case 2:
        return <ProductDetailsPage />;
      case 3:
        return <PriceReturnsPage />;
      case 4:
        return <AttributesPage />;
      case 5:
        return <ImageVideoPage />;
      default:
        return null;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;

    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  // Updated handleSubmit function
  const handleSubmit = async () => {
    // Get the data from StepperContext or other sources as needed
    const formData = new FormData(); // Define formData here

    try {
      // Your existing code for appending data to formData

      // Send the request to the backend
      const response = await axios.post('http://localhost:8000/api/products/complete-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response.data.productId) {
        // Handle success logic here, e.g., navigate to a success page
        console.log('Product saved successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='bg-slate-50 md:w-2/3 mx-auto shadow-xl rounded-2xl pb-2'>
        <div className='container horizontal mt-5'>
          <Stepper steps={steps} currentStep={currentStep} />
          <div className='my-10 p-10'>
            <StepperContext.Provider value={{ userData, setUserData, finalData, setFinalData }}>
              {displayStep(currentStep)}
            </StepperContext.Provider>
          </div>
        </div>
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
