/** Mirrors backend/utils/pricing.js for checkout display. */
const GST_RATE = 0.18;
const RESTAURANT_CHARGE = 5;
const DELIVERY_FEE = 3;
const PLATFORM_FEE = 2;

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function computeGrandTotal(subtotal, discountAmount = 0) {
  const d = Math.max(0, Math.min(discountAmount, subtotal));
  const afterDiscount = round2(subtotal - d);
  const gst = round2(afterDiscount * GST_RATE);
  const grandTotal = round2(
    afterDiscount + gst + RESTAURANT_CHARGE + DELIVERY_FEE + PLATFORM_FEE
  );
  return {
    subtotal: round2(subtotal),
    discountAmount: d,
    afterDiscount,
    gst,
    restaurantCharges: RESTAURANT_CHARGE,
    deliveryFee: DELIVERY_FEE,
    platformFee: PLATFORM_FEE,
    grandTotal,
  };
}
