import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiX } from "react-icons/fi";
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
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = "auto";
  };

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          History
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">My orders</h1>
        <p className="mt-2 text-sm text-ink-500">
          Track status and open any order to see line items.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <Skelleton key={index} />)
        ) : orders.length === 0 ? (
          <p className="col-span-full text-center text-ink-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <article
              key={order._id}
              className="surface-card flex min-h-[320px] flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink-400">Order ID</p>
                  <p className="break-all font-mono text-xs text-ink-800">{order._id}</p>
                  <p className="mt-3 text-sm font-semibold text-ink-900">
                    {order.owner.name}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openModal(order)}
                className="btn-secondary mt-6 flex w-full items-center justify-center gap-2 !py-2.5 !text-sm"
              >
                <FiEye className="h-4 w-4" />
                View items
              </button>

              <div className="mt-auto border-t border-ink-100 pt-4">
                <div className="flex justify-between gap-4 text-sm">
                  <div className="text-ink-600">
                    <p className="font-semibold text-ink-800">Ship to</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state}
                    </p>
                    <p className="mt-1">{order.shipping.mobile}</p>
                    <p className="text-xs text-ink-400">{order.shipping.paymode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-400">Total</p>
                    <p className="text-lg font-bold text-brand-700 tabular-nums">
                      ₹{order.totalprice}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
          <div
            className="surface-card relative max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 shadow-card-hover sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h2 className="font-display pr-10 text-xl font-bold text-ink-900">Order details</h2>
            <p className="mt-1 break-all font-mono text-xs text-ink-500">{selectedOrder._id}</p>
            <p className="mt-4 text-sm text-ink-600">
              <span className="font-semibold text-ink-900">{selectedOrder.owner.name}</span>
              {" · "}
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${getStatusStyle(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </p>

            <ul className="mt-6 space-y-4">
              {selectedOrder.item.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-3"
                >
                  <img
                    src={item.menuitem.image}
                    alt={item.menuitem.itemname}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-ink-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink-900">{item.menuitem.itemname}</h3>
                    <p className="text-sm text-ink-500">Qty {item.quantity}</p>
                    <p className="mt-1 font-bold text-brand-700">₹{item.menuitem.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
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

export default UserOrder;
