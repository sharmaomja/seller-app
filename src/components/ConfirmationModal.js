import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <p>{message}</p>
        <div className="mt-2 flex flex-col space-y-2">
          <button onClick={onClose} className="text-gray-200 bg-gray-600 p-1 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 p-1 rounded-lg text-white">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
