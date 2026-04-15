/** All values allowed on Order.status (includes payment-completed state). */
const ORDER_STATUSES = [
  "Pending",
  "Paid",
  "Being Baked",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

/** Statuses the owner may set via PUT /orders/updateorder (not Paid; that is set by payment verification). */
const OWNER_SETTABLE_ORDER_STATUSES = ORDER_STATUSES.filter((s) => s !== "Paid");

const ORDER_STATUS_PENDING = "Pending";
const ORDER_STATUS_PAID = "Paid";
const ORDER_STATUS_DELIVERED = "Delivered";

module.exports = {
  ORDER_STATUSES,
  OWNER_SETTABLE_ORDER_STATUSES,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PAID,
  ORDER_STATUS_DELIVERED,
};
