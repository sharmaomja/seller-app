import React from 'react';

const StepperControl = ({ handleClick, currentStep, steps, handleSubmit }) => {
  return (
    <div className={`container flex justify-around mt-4 mb-8`}>
      <button
        onClick={() => handleClick()}
        className={`bg-indigo-400 text-gray-700 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-3 border-gray-400 hover:bg-slate-600 hover:text-white transition duration-200 ease-in-out ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Back
      </button>
      <button
        onClick={() => currentStep === steps.length ? handleSubmit() : handleClick("next")}
        className={`bg-green-400 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-3 border-gray-400 hover:bg-green-600 hover:text-white transition duration-200 ease-in-out`}>
        {currentStep === steps.length ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default StepperControl;
