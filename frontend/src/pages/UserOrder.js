import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch orders when the component loads
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
          setOrders(response.data); // Set the fetched orders to state
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-600">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200 transition-transform transform hover:scale-105"
            >
              {/* Order ID, Restaurant Name and Status */}
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Order ID: <span className="text-red-600">{order._id}</span>
                  </h2>
                  <h3 className="text-lg font-semibold text-black">
                    Restaurant:{" "}
                    <span className="text-green-600">{order.owner.name}</span>
                  </h3>
                </div>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              {order.item.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center mb-4 border-b pb-4 last:border-b-0"
                >
                  <img
                    src={item.menuitem.image}
                    alt={item.menuitem.itemname}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-red-500 mr-4 shadow"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.menuitem.itemname}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-red-500">
                    ₹{item.menuitem.price}
                  </p>
                </div>
              ))}

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
                    <p className="text-xl font-bold text-gray-900">
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
