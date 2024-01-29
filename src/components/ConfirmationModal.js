import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <p>{message}</p>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="mr-2 text-gray-700">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
