// ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              onConfirm(); // Execute the confirm action
              onClose(); // Close modal
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onCancel(); // Execute the cancel action
              onClose(); // Close modal
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
