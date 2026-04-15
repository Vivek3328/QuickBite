const Coupon = require("../models/CouponModel");
const { validateCouponForSubtotal } = require("../services/couponService");

const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const sub = Number(subtotal);
    if (!Number.isFinite(sub) || sub < 0) {
      return res.status(400).json({ success: false, error: "Invalid subtotal" });
    }
    const result = await validateCouponForSubtotal(code, sub);
    if (!result.ok) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({
      success: true,
      discount: result.discount,
      code: result.coupon ? result.coupon.code : null,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not validate coupon" });
  }
};

const listCoupons = async (req, res) => {
  try {
    const items = await Coupon.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, coupons: items });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not list coupons" });
  }
};

const createCoupon = async (req, res) => {
  try {
    const payload = { ...req.body, code: String(req.body.code || "").toUpperCase().trim() };
    const c = await Coupon.create(payload);
    return res.status(201).json({ success: true, coupon: c });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ success: false, error: err.message || "Create failed" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const c = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!c) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, coupon: c });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ success: false, error: err.message || "Update failed" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Delete failed" });
  }
};

module.exports = {
  validateCoupon,
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
