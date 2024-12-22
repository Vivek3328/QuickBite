import React from "react";
import { useNavigate } from "react-router-dom";
import successImg from "../assets/success.png";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/user-orders"); // Update this path based on your routing setup
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <img src={successImg} alt="Order Successful" className="w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-700 mt-4">
          Thank you for your order. You can view the details in your order
          history.
        </p>
        <button
          onClick={handleViewOrders}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
