export const ORDER_STATUS = {
  pending: "Pending",
  beingBaked: "Being Baked",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function getOrderStatusClasses(status) {
  switch (status) {
    case ORDER_STATUS.pending:
      return "bg-amber-100 text-amber-800";
    case ORDER_STATUS.beingBaked:
      return "bg-orange-100 text-orange-800";
    case ORDER_STATUS.outForDelivery:
      return "bg-sky-100 text-sky-800";
    case ORDER_STATUS.delivered:
      return "bg-emerald-100 text-emerald-800";
    case ORDER_STATUS.cancelled:
      return "bg-red-100 text-red-800";
    default:
      return "bg-ink-100 text-ink-700";
  }
}

export function getOrderProgressPercent(status) {
  switch (status) {
    case ORDER_STATUS.pending:
      return 25;
    case ORDER_STATUS.beingBaked:
      return 50;
    case ORDER_STATUS.outForDelivery:
      return 75;
    case ORDER_STATUS.delivered:
      return 100;
    case ORDER_STATUS.cancelled:
      return 0;
    default:
      return 0;
  }
}
