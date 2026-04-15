const Coupon = require("../models/CouponModel");

function clampDiscount(subtotal, rawDiscount) {
  const d = Math.max(0, Math.min(rawDiscount, subtotal));
  return Math.round(d * 100) / 100;
}

/**
 * Resolve a coupon by code and compute discount for a given item subtotal.
 * @returns {{ ok: boolean, error?: string, discount?: number, coupon?: object }}
 */
async function validateCouponForSubtotal(code, subtotal) {
  if (!code || !String(code).trim()) {
    return { ok: true, discount: 0, coupon: null };
  }
  const upper = String(code).trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: upper });
  if (!coupon || !coupon.isActive) {
    return { ok: false, error: "Invalid or inactive coupon" };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false, error: "Coupon has expired" };
  }
  if (coupon.maxUses != null && coupon.maxUses > 0 && coupon.usesCount >= coupon.maxUses) {
    return { ok: false, error: "Coupon usage limit reached" };
  }
  if (subtotal < (coupon.minAmount || 0)) {
    return {
      ok: false,
      error: `Minimum order ₹${coupon.minAmount} required for this coupon`,
    };
  }

  let raw =
    coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value;
  if (coupon.maxDiscount != null && coupon.maxDiscount > 0) {
    raw = Math.min(raw, coupon.maxDiscount);
  }
  const discount = clampDiscount(subtotal, raw);
  return { ok: true, discount, coupon };
}

async function incrementCouponUse(code) {
  if (!code) return;
  const upper = String(code).trim().toUpperCase();
  await Coupon.updateOne(
    { code: upper },
    { $inc: { usesCount: 1 } }
  );
}

module.exports = {
  validateCouponForSubtotal,
  incrementCouponUse,
};
