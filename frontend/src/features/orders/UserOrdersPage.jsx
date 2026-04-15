import { useEffect, useState } from "react";
import { FiEye, FiStar, FiX } from "react-icons/fi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchUserOrders } from "@/api/orders";
import { createReview } from "@/api/reviews";
import { useAuth } from "@/context/AuthContext";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getOrderStatusClasses, ORDER_STATUS } from "@/constants/orderStatus";

export default function UserOrdersPage() {
  const { userToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const data = await fetchUserOrders(userToken);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError("An error occurred while fetching orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [userToken]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = "";
  };

  const openReview = (order) => {
    setReviewOrder(order);
    setReviewRating(0);
    setReviewComment("");
    document.body.style.overflow = "hidden";
  };

  const closeReview = () => {
    setReviewOrder(null);
    setReviewRating(0);
    setReviewComment("");
    if (!isModalOpen) {
      document.body.style.overflow = "";
    }
  };

  const submitReview = async () => {
    if (!reviewOrder || !userToken || reviewRating < 1) {
      toast.error("Pick a star rating");
      return;
    }
    setReviewSubmitting(true);
    try {
      await createReview(userToken, {
        orderId: reviewOrder._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === reviewOrder._id ? { ...o, hasReview: true } : o
        )
      );
      if (selectedOrder?._id === reviewOrder._id) {
        setSelectedOrder((o) => (o ? { ...o, hasReview: true } : null));
      }
      toast.success("Thanks for your review!");
      closeReview();
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.error ||
        "Could not submit review";
      toast.error(msg);
    } finally {
      setReviewSubmitting(false);
    }
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
          Track status, view items, and rate orders after delivery.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : orders.length === 0 ? (
          <p className="col-span-full text-center text-ink-500">No orders yet.</p>
        ) : (
          orders.map((order) => {
            const canReview =
              order.status === ORDER_STATUS.delivered && !order.hasReview;
            return (
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
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getOrderStatusClasses(
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

                {canReview ? (
                  <button
                    type="button"
                    onClick={() => openReview(order)}
                    className="btn-primary mt-3 flex w-full items-center justify-center gap-2 !py-2.5 !text-sm"
                  >
                    <FiStar className="h-4 w-4" />
                    Rate order
                  </button>
                ) : order.status === ORDER_STATUS.delivered && order.hasReview ? (
                  <p className="mt-3 text-center text-xs font-medium text-emerald-700">
                    You rated this order
                  </p>
                ) : null}

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
            );
          })
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
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${getOrderStatusClasses(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </p>

            <ul className="mt-6 space-y-4">
              {selectedOrder.item.map((line, index) => (
                <li
                  key={index}
                  className="flex gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-3"
                >
                  <img
                    src={line.menuitem?.image}
                    alt={line.menuitem?.itemname ?? ""}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-ink-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink-900">{line.menuitem?.itemname}</h3>
                    <p className="text-sm text-ink-500">Qty {line.quantity}</p>
                    <p className="mt-1 font-bold text-brand-700">₹{line.menuitem?.price}</p>
                  </div>
                </li>
              ))}
            </ul>

            {selectedOrder.status === ORDER_STATUS.delivered && !selectedOrder.hasReview ? (
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  openReview(selectedOrder);
                }}
                className="btn-primary mt-6 flex w-full items-center justify-center gap-2 !py-2.5 !text-sm"
              >
                <FiStar className="h-4 w-4" />
                Rate this order
              </button>
            ) : null}
          </div>
        </div>
      )}

      {reviewOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
          <div
            className="surface-card relative w-full max-w-md p-6 shadow-card-hover sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
          >
            <button
              type="button"
              onClick={closeReview}
              className="absolute right-4 top-4 rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h2 id="review-title" className="font-display pr-10 text-xl font-bold text-ink-900">
              Rate {reviewOrder.owner?.name ?? "restaurant"}
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              How was your food and delivery? Your rating helps others choose.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewRating(n)}
                  className="rounded-lg p-1 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={`${n} stars`}
                >
                  {n <= reviewRating ? (
                    <FaStar className="h-10 w-10 text-amber-400 sm:h-11 sm:w-11" aria-hidden />
                  ) : (
                    <FaRegStar className="h-10 w-10 text-ink-200 sm:h-11 sm:w-11" aria-hidden />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-sm text-ink-500">
              {reviewRating > 0 ? `${reviewRating} / 5` : "Tap a star to rate"}
            </p>

            <label htmlFor="review-comment" className="mt-6 block text-sm font-semibold text-ink-800">
              Comment (optional)
            </label>
            <textarea
              id="review-comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="What stood out?"
              className="input-field mt-2 w-full resize-none rounded-xl py-3 text-sm"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeReview} className="btn-secondary order-2 sm:order-1">
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReview}
                disabled={reviewSubmitting || reviewRating < 1}
                className="btn-primary order-1 sm:order-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewSubmitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
