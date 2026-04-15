import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success("Status updated");
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
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-ink-200" />
          <div className="surface-card h-64 animate-pulse bg-ink-100" />
          <div className="surface-card h-64 animate-pulse bg-ink-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Kitchen
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">Orders</h1>
        <p className="mt-2 text-sm text-ink-500">
          Track progress and update status as you prepare each order.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {orders.length === 0 ? (
          <div className="surface-card p-12 text-center text-ink-600">No orders yet.</div>
        ) : (
          orders.map((order) => (
            <article key={order._id} className="surface-card overflow-hidden p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Order
                  </p>
                  <p className="mt-1 break-all font-mono text-sm text-ink-800">{order._id}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
                  style={{
                    width: `${getProgressPercentage(order.status)}%`,
                  }}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                <h3 className="text-sm font-semibold text-ink-900">Customer</h3>
                <dl className="mt-3 space-y-1 text-sm text-ink-600">
                  <div>
                    <span className="text-ink-400">Name:</span> {order.user.name}
                  </div>
                  <div>
                    <span className="text-ink-400">Email:</span> {order.user.email}
                  </div>
                  <div>
                    <span className="text-ink-400">Mobile:</span> {order.shipping.mobile}
                  </div>
                  <div>
                    <span className="text-ink-400">Address:</span> {order.shipping.city},{" "}
                    {order.shipping.state} {order.shipping.pincode}
                  </div>
                  <div>
                    <span className="text-ink-400">Payment:</span> {order.shipping.paymode}
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-ink-900">Items</h3>
                <ul className="mt-3 divide-y divide-ink-100">
                  {order.item.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between gap-4 py-3 text-sm first:pt-0"
                    >
                      <span className="text-ink-800">{item.menuitem.itemname}</span>
                      <span className="shrink-0 tabular-nums text-ink-500">
                        ×{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-6">
                <p className="text-lg font-bold text-ink-900">
                  Total{" "}
                  <span className="text-brand-700 tabular-nums">₹{order.totalprice}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.status !== "Delivered" && order.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(order._id, order.status)}
                      className="btn-primary !py-2 !text-sm"
                    >
                      Advance status
                    </button>
                  )}
                  {order.status !== "Delivered" && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order._id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <ToastContainer hideProgressBar={true} position="top-center" theme="light" />
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Being Baked":
      return "bg-orange-100 text-orange-800";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800";
    case "Delivered":
      return "bg-emerald-100 text-emerald-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-ink-100 text-ink-700";
  }
};

export default RestaurantOrder;
