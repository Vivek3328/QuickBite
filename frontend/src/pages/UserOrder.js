import React, { useEffect, useState } from "react";
import axios from "axios";
import Skelleton from "../components/Skelleton";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/orders/userorders`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("userToken"),
            },
          }
        );

        if (response.status === 200) {
          setOrders(response.data);
        } else {
          setError("Failed to load orders.");
        }
      } catch (err) {
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable body scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = "auto"; // Enable body scrolling
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4 mt-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-red-600">
          My Orders
        </h1>
        {/* Grid Layout for Order Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skelleton key={index} />
            ))
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No orders found.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200 flex flex-col justify-between min-h-[350px] transition-all hover:scale-105 transform hover:shadow-xl"
              >
                {/* Order ID, Restaurant Name and Status */}
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-md md:text-lg font-bold text-black">
                      Order ID:{" "}
                      <span className="text-red-600">{order._id}</span>
                    </h2>
                    <h3 className="text-sm md:text-md font-semibold text-black">
                      Restaurant:{" "}
                      <span className="text-green-600">{order.owner.name}</span>
                    </h3>
                  </div>
                  <span
                    className={`text-xs md:text-sm font-semibold px-2 py-1 rounded ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Improved View Items Button */}
                <button
                  onClick={() => openModal(order)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full transition duration-300 hover:bg-blue-700 hover:scale-105 transform"
                >
                  <i className="fas fa-eye mr-2"></i> View Order Items
                </button>

                {/* Total Price and Shipping Info */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-gray-800">
                        Shipping Details
                      </p>
                      <p>
                        {order.shipping.city}, {order.shipping.state}
                      </p>
                      <p>Mobile: {order.shipping.mobile}</p>
                      <p>Payment Mode: {order.shipping.paymode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Total: ₹{order.totalprice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for displaying order items */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-auto transition-opacity duration-300 opacity-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto transition-all transform relative">
            {/* Close Icon (X) */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Details
            </h2>

            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                Order ID: {selectedOrder._id}
              </h3>
              <p className="text-gray-700">
                Restaurant: {selectedOrder.owner.name}
              </p>
              <p className="text-gray-700">Status: {selectedOrder.status}</p>
            </div>

            <div className="space-y-4">
              {selectedOrder.item.map((item, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={item.menuitem.image}
                    alt={item.menuitem.itemname}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border-2 border-red-500 mr-4 shadow"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.menuitem.itemname}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-lg text-red-500">
                      ₹{item.menuitem.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-600";
    case "Completed":
      return "bg-green-200 text-green-600";
    case "Cancelled":
      return "bg-red-200 text-red-600";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

export default UserOrder;
