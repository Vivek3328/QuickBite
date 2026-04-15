/**
 * Matches CartPage fee breakdown so server-computed totals align with checkout UI.
 */
const GST_RATE = 0.18;
const RESTAURANT_CHARGE = 5;
const DELIVERY_FEE = 3;
const PLATFORM_FEE = 2;

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeFees(subtotal) {
  const gst = round2(subtotal * GST_RATE);
  return {
    subtotal: round2(subtotal),
    gst,
    restaurantCharges: RESTAURANT_CHARGE,
    deliveryFee: DELIVERY_FEE,
    platformFee: PLATFORM_FEE,
  };
}

/**
 * @param {number} subtotal - sum of line items before discount
 * @param {number} discountAmount - discount to subtract from subtotal (before GST)
 */
function computeGrandTotal(subtotal, discountAmount = 0) {
  const d = Math.max(0, Math.min(discountAmount, subtotal));
  const afterDiscount = round2(subtotal - d);
  const fees = computeFees(afterDiscount);
  const grandTotal = round2(
    afterDiscount +
      fees.gst +
      fees.restaurantCharges +
      fees.deliveryFee +
      fees.platformFee
  );
  return {
    ...fees,
    discountAmount: d,
    afterDiscount,
    grandTotal,
  };
}

module.exports = {
  computeFees,
  computeGrandTotal,
  GST_RATE,
  RESTAURANT_CHARGE,
  DELIVERY_FEE,
  PLATFORM_FEE,
};
