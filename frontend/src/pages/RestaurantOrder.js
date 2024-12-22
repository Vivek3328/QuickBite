import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestaurantOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/orders/myorders`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("ownerToken"),
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

  const updateStatus = async (orderId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case "Pending":
        newStatus = "Being Baked";
        break;
      case "Being Baked":
        newStatus = "Out for Delivery";
        break;
      case "Out for Delivery":
        newStatus = "Delivered";
        break;
      case "Delivered":
      case "Cancelled":
        return;
      default:
        newStatus = "Pending";
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/orders/updateorder/${orderId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("ownerToken"),
          },
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success('Status Updated')
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/orders/updateorder/${orderId}`,
        { status: "Cancelled" },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("ownerToken"),
          },
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "Pending":
        return 25;
      case "Being Baked":
        return 50;
      case "Out for Delivery":
        return 75;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="container mx-auto max-w-4xl px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-red-600">
          Restaurant Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 border border-gray-200 text-sm md:text-base"
            >
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Order ID: <span className="text-red-600">{order._id}</span>
                </h2>
                <span
                  className={`text-xs md:text-sm font-semibold px-2 py-1 rounded ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${getProgressPercentage(order.status)}%`,
                  }}
                />
              </div>

              <div className="mb-2 md:mb-4 p-3 md:p-4 border border-gray-300 rounded">
                <h3 className="text-sm font-semibold text-gray-800">
                  Customer Details
                </h3>
                <p className="text-gray-600 text-sm">Name: {order.user.name}</p>
                <p className="text-gray-600 text-sm">Email: {order.user.email}</p>
                <p className="text-gray-600 text-sm">Mobile: {order.shipping.mobile}</p>
                <p className="text-gray-600 text-sm">
                  Address: {order.shipping.city}, {order.shipping.state},{" "}
                  {order.shipping.pincode}
                </p>
                <p className="text-gray-600 text-sm">
                  Payment Mode: {order.shipping.paymode}
                </p>
              </div>

              <div className="mb-2 md:mb-4">
                <h3 className="text-md font-semibold text-gray-800 mb-1">
                  Ordered Items
                </h3>
                <ul className="space-y-1 md:space-y-2">
                  {order.item.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center md:p-2 border-b border-gray-300"
                    >
                      <span className="text-gray-700 text-sm">
                        {item.menuitem.itemname}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center gap-10 md:gap-20">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 ml-2">
                    <p className="font-semibold text-gray-800">Total:</p>
                    <p className="text-base font-bold text-gray-900">
                      ₹{order.totalprice}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-1 md:space-x-2 mt-2 md:mt-4">
                  {order.status !== "Delivered" &&
                    order.status !== "Cancelled" && (
                      <button
                        onClick={() => updateStatus(order._id, order.status)}
                        className="bg-blue-500 text-white text-sm md:text-sm px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 transition duration-200"
                      >
                        Update Status
                      </button>
                    )}
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 text-white text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer hideProgressBar={true} position="top-center" />
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-600";
    case "Being Baked":
      return "bg-orange-200 text-orange-600";
    case "Out for Delivery":
      return "bg-blue-200 text-blue-600";
    case "Delivered":
      return "bg-green-200 text-green-600";
    case "Cancelled":
      return "bg-red-200 text-red-600";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

export default RestaurantOrder;
