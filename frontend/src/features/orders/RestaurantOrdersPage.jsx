import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiPackage,
  FiSearch,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { fetchRestaurantOrders, updateOrderStatus } from "@/api/orders";
import { useAuth } from "@/context/AuthContext";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { KitchenOrderCardSkeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import {
  ORDER_STATUS,
  getOrderStatusClasses,
  getOrderProgressPercent,
} from "@/constants/orderStatus";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "New" },
  { id: "beingBaked", label: "Preparing" },
  { id: "outForDelivery", label: "Out" },
  { id: "delivered", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
];

function shortOrderRef(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 8 ? `#${s.slice(-8).toUpperCase()}` : `#${s}`;
}

function formatMoney(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatWhen(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today · ${time}`;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nextActionLabel(status) {
  switch (status) {
    case ORDER_STATUS.pending:
    case ORDER_STATUS.paid:
      return "Start preparing";
    case ORDER_STATUS.beingBaked:
      return "Out for delivery";
    case ORDER_STATUS.outForDelivery:
      return "Mark delivered";
    default:
      return "Advance";
  }
}

function matchesFilter(order, filterId) {
  switch (filterId) {
    case "active":
      return (
        order.status !== ORDER_STATUS.delivered && order.status !== ORDER_STATUS.cancelled
      );
    case "pending":
      return (
        order.status === ORDER_STATUS.pending || order.status === ORDER_STATUS.paid
      );
    case "beingBaked":
      return order.status === ORDER_STATUS.beingBaked;
    case "outForDelivery":
      return order.status === ORDER_STATUS.outForDelivery;
    case "delivered":
      return order.status === ORDER_STATUS.delivered;
    case "cancelled":
      return order.status === ORDER_STATUS.cancelled;
    default:
      return true;
  }
}

const STEPS = [
  { status: ORDER_STATUS.pending, label: "New", Icon: FiClock },
  { status: ORDER_STATUS.beingBaked, label: "Prep", Icon: FiPackage },
  { status: ORDER_STATUS.outForDelivery, label: "Out", Icon: FiTruck },
  { status: ORDER_STATUS.delivered, label: "Done", Icon: FiCheck },
];

function statusStepIndex(status) {
  if (status === ORDER_STATUS.cancelled) return -1;
  if (status === ORDER_STATUS.paid) return 0;
  const i = STEPS.findIndex((s) => s.status === status);
  return i >= 0 ? i : 0;
}

export default function RestaurantOrdersPage() {
  const { ownerToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterId, setFilterId] = useState("active");
  const [search, setSearch] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchRestaurantOrders(ownerToken);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError("An error occurred while fetching orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [ownerToken]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const da = new Date(a.dateOrdered || 0).getTime();
      const db = new Date(b.dateOrdered || 0).getTime();
      return db - da;
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      if (!matchesFilter(order, filterId)) return false;
      if (!q) return true;
      const ref = String(order._id || "").toLowerCase();
      const name = (order.user?.name || "").toLowerCase();
      const email = (order.user?.email || "").toLowerCase();
      const mobile = String(order.shipping?.mobile || "");
      return ref.includes(q) || name.includes(q) || email.includes(q) || mobile.includes(q);
    });
  }, [sortedOrders, filterId, search]);

  const stats = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== ORDER_STATUS.delivered && o.status !== ORDER_STATUS.cancelled
    ).length;
    const delivered = orders.filter((o) => o.status === ORDER_STATUS.delivered).length;
    const cancelled = orders.filter((o) => o.status === ORDER_STATUS.cancelled).length;
    return { active, delivered, cancelled, total: orders.length };
  }, [orders]);

  const advanceStatus = async (orderId, currentStatus) => {
    let newStatus;
    switch (currentStatus) {
      case ORDER_STATUS.pending:
      case ORDER_STATUS.paid:
        newStatus = ORDER_STATUS.beingBaked;
        break;
      case ORDER_STATUS.beingBaked:
        newStatus = ORDER_STATUS.outForDelivery;
        break;
      case ORDER_STATUS.outForDelivery:
        newStatus = ORDER_STATUS.delivered;
        break;
      case ORDER_STATUS.delivered:
      case ORDER_STATUS.cancelled:
        return;
      default:
        newStatus = ORDER_STATUS.pending;
    }

    try {
      await updateOrderStatus(ownerToken, orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
      toast.success("Order updated");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Could not update status.");
    }
  };

  const confirmCancel = async () => {
    if (!cancelOrderId) return;
    try {
      await updateOrderStatus(ownerToken, cancelOrderId, { status: ORDER_STATUS.cancelled });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === cancelOrderId ? { ...order, status: ORDER_STATUS.cancelled } : order
        )
      );
      toast.success("Order cancelled");
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Could not cancel order.");
    } finally {
      setCancelOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(251,146,60,0.08),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-ink-200" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card h-24 animate-pulse bg-ink-100" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <KitchenOrderCardSkeleton key={i} />
            ))}
          </div>
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
    <div className="relative min-h-screen pb-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(251,146,60,0.08),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.restaurantMenu}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-brand-700"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden />
          Menu dashboard
        </Link>

        <header className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Kitchen</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Order queue
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-600">
            Newest orders first. Advance each ticket as prep and dispatch move along — customers
            see updates on their side.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Active</p>
            <p className="mt-1 font-display text-2xl font-bold text-amber-700">{stats.active}</p>
            <p className="text-xs text-ink-500">In progress</p>
          </div>
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Done</p>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-700">{stats.delivered}</p>
            <p className="text-xs text-ink-500">Delivered</p>
          </div>
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Total</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-900">{stats.total}</p>
            <p className="text-xs text-ink-500">All time</p>
          </div>
        </div>

        <div className="sticky top-[4.25rem] z-30 -mx-4 mt-8 border-b border-ink-100/80 bg-ink-50/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID, customer, phone…"
                className="input-field w-full rounded-2xl border-ink-200/80 py-3 pl-11 pr-4 text-base shadow-sm"
                autoComplete="off"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterId(f.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    filterId === f.id
                      ? "bg-ink-900 text-white shadow-sm"
                      : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Showing{" "}
              <span className="font-semibold text-ink-800">{filteredOrders.length}</span>
              {filteredOrders.length === 1 ? " order" : " orders"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.length === 0 ? (
            <div className="surface-card col-span-full border-2 border-dashed border-ink-200 bg-gradient-to-b from-white to-brand-50/20 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <FiPackage className="h-8 w-8" aria-hidden />
              </div>
              <h2 className="mt-6 font-display text-xl font-bold text-ink-900">No orders yet</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
                When customers place orders from your menu, they&apos;ll show up here in real
                time.
              </p>
              <Link to={ROUTES.restaurantMenu} className="btn-primary mt-8 inline-flex">
                Back to menu
              </Link>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="surface-card col-span-full border-dashed border-ink-200 px-6 py-12 text-center">
              <p className="font-semibold text-ink-900">No orders match</p>
              <p className="mt-2 text-sm text-ink-600">
                Try another filter or clear search to see more tickets.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterId("all");
                }}
                className="btn-secondary mt-6"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const stepIdx = statusStepIndex(order.status);
              const isCancelled = order.status === ORDER_STATUS.cancelled;

              return (
                <article
                  key={order._id}
                  className={`surface-card flex h-full flex-col overflow-hidden shadow-sm ${
                    isCancelled ? "border-l-4 border-l-red-400 opacity-95" : "border-l-4 border-l-brand-500"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                        Ticket
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-ink-900">
                        {shortOrderRef(order._id)}
                      </p>
                      {order.dateOrdered ? (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                          <FiClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {formatWhen(order.dateOrdered)}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="px-4 sm:px-5">
                    <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCancelled ? "bg-red-400" : "bg-gradient-to-r from-brand-500 to-brand-600"
                        }`}
                        style={{
                          width: `${getOrderProgressPercent(order.status)}%`,
                        }}
                      />
                    </div>

                    {!isCancelled && (
                      <div className="mt-4 flex justify-between gap-1 sm:gap-2">
                        {STEPS.map((step, i) => {
                          const active = stepIdx >= i;
                          const current = stepIdx === i;
                          const Icon = step.Icon;
                          return (
                            <div
                              key={step.status}
                              className="flex min-w-0 flex-1 flex-col items-center text-center"
                            >
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                                  active
                                    ? current
                                      ? "bg-brand-600 text-white ring-2 ring-brand-200"
                                      : "bg-brand-100 text-brand-800"
                                    : "bg-ink-100 text-ink-400"
                                }`}
                              >
                                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                              </div>
                              <span
                                className={`mt-1.5 hidden text-[10px] font-semibold uppercase tracking-wide sm:block ${
                                  current ? "text-brand-800" : "text-ink-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-ink-100 bg-ink-50/40 p-4 sm:p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-ink-500">
                      Customer & delivery
                    </h3>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-ink-400">Name</dt>
                        <dd className="font-medium text-ink-900">{order.user?.name ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Phone</dt>
                        <dd className="font-medium text-ink-900">{order.shipping?.mobile ?? "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-ink-400">Email</dt>
                        <dd className="break-all text-ink-800">{order.user?.email ?? "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-ink-400">Address</dt>
                        <dd className="text-ink-800">
                          {[order.shipping?.city, order.shipping?.state, order.shipping?.pincode]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-400">Payment</dt>
                        <dd className="text-ink-800">{order.shipping?.paymode ?? "—"}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-t border-ink-100 px-4 py-4 sm:px-5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-ink-500">
                      Line items
                    </h3>
                    <ul className="mt-3 divide-y divide-ink-100">
                      {order.item?.map((line, index) => (
                        <li
                          key={`${order._id}-${index}`}
                          className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <span className="min-w-0 text-sm font-medium text-ink-900">
                            {line.menuitem?.itemname ?? "Item"}
                          </span>
                          <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold tabular-nums text-ink-700">
                            ×{line.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t border-ink-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                        Total
                      </p>
                      <p className="font-display text-xl font-bold tabular-nums text-brand-700">
                        {formatMoney(order.totalprice)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.status !== ORDER_STATUS.delivered &&
                        order.status !== ORDER_STATUS.cancelled && (
                          <button
                            type="button"
                            onClick={() => advanceStatus(order._id, order.status)}
                            className="btn-primary !py-2.5 !text-sm"
                          >
                            {nextActionLabel(order.status)}
                          </button>
                        )}
                      {order.status !== ORDER_STATUS.delivered &&
                        order.status !== ORDER_STATUS.cancelled && (
                          <button
                            type="button"
                            onClick={() => setCancelOrderId(order._id)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                          >
                            <FiXCircle className="h-4 w-4" aria-hidden />
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={Boolean(cancelOrderId)}
        onClose={() => setCancelOrderId(null)}
        title="Cancel this order?"
        message="Only cancel if you cannot fulfil it. The customer may need to be contacted separately."
        onConfirm={confirmCancel}
        onCancel={() => setCancelOrderId(null)}
      />
    </div>
  );
}
