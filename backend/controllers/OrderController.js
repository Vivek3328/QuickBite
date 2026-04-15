const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Review = require("../models/ReviewModel");
const MenuItem = require("../models/MenuItemModel");
const Owner = require("../models/OwnerModel");
const crypto = require("crypto");
const razorpayInstance = require("../utils/razorpay");
const {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PAID,
  USER_CANCELLABLE_STATUSES,
} = require("../constants/orderStatuses");
const { computeGrandTotal } = require("../utils/pricing");
const {
  validateCouponForSubtotal,
  incrementCouponUse,
} = require("../services/couponService");

const checkout = async (req, res) => {
  try {
    const { item: lineItems, shipping, owner: ownerId, couponCode } = req.body;

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ success: false, error: "No items in order" });
    }

    const ownerDoc = await Owner.findById(ownerId).select("isActive").lean();
    if (!ownerDoc) {
      return res.status(400).json({ success: false, error: "Restaurant not found" });
    }
    if (ownerDoc.isActive === false) {
      return res.status(400).json({ success: false, error: "Restaurant is unavailable" });
    }

    let subtotal = 0;
    const resolvedLines = [];

    for (const line of lineItems) {
      const { menuitem: menuId, quantity } = line;
      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      const mi = await MenuItem.findById(menuId).lean();
      if (!mi) {
        return res.status(400).json({ success: false, error: `Invalid menu item ${menuId}` });
      }
      if (mi.owner.toString() !== String(ownerId)) {
        return res.status(400).json({ success: false, error: "Item does not belong to restaurant" });
      }
      if (mi.isOutOfStock) {
        return res.status(400).json({
          success: false,
          error: `Out of stock: ${mi.itemname}`,
        });
      }
      subtotal += mi.price * qty;
      resolvedLines.push({
        menuitem: menuId,
        quantity: qty,
      });
    }

    const couponResult = await validateCouponForSubtotal(couponCode, subtotal);
    if (!couponResult.ok) {
      return res.status(400).json({ success: false, error: couponResult.error });
    }

    const pricing = computeGrandTotal(subtotal, couponResult.discount || 0);
    const amountPaise = Math.round(pricing.grandTotal * 100);
    if (amountPaise < 100) {
      return res.status(400).json({ success: false, error: "Order total too low" });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const now = new Date();
    const order = await Order.create({
      user: req.user.id,
      owner: ownerId,
      item: resolvedLines,
      shipping,
      totalprice: pricing.grandTotal,
      discountAmount: pricing.discountAmount,
      couponCode: couponResult.coupon ? couponResult.coupon.code : "",
      status: ORDER_STATUS_PENDING,
      statusHistory: [{ status: ORDER_STATUS_PENDING, at: now }],
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      razorpayOrder,
      order,
      pricing,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        $set: { status: ORDER_STATUS_PAID },
        $push: { statusHistory: { status: ORDER_STATUS_PAID, at: new Date() } },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.couponCode) {
      await incrementCouponUse(order.couponCode);
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/Payment-success?reference=${razorpay_payment_id}`
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const restaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.owner.id })
      .populate("user")
      .populate("item.menuitem")
      .sort({ dateOrdered: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const userOrders = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.status) {
      const statuses = String(req.query.status)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (statuses.length) filter.status = { $in: statuses };
    }
    if (req.query.from || req.query.to) {
      filter.dateOrdered = {};
      if (req.query.from) filter.dateOrdered.$gte = new Date(req.query.from);
      if (req.query.to) filter.dateOrdered.$lte = new Date(req.query.to);
    }

    const orders = await Order.find(filter)
      .populate("item.menuitem")
      .populate("owner")
      .sort({ dateOrdered: -1 })
      .lean();

    const orderIds = orders.map((o) => o._id);
    const existingReviews = await Review.find({
      user: req.user.id,
      order: { $in: orderIds },
    })
      .select("order")
      .lean();
    const reviewedIds = new Set(existingReviews.map((r) => String(r.order)));

    const enriched = orders.map((o) => ({
      ...o,
      hasReview: reviewedIds.has(String(o._id)),
    }));

    return res.status(200).json(enriched);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const updateStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.owner.toString() !== req.owner.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status },
        $push: { statusHistory: { status, at: new Date() } },
      },
      { new: true }
    );

    return res.json({ success: true, order });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    if (!USER_CANCELLABLE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: "This order can no longer be cancelled",
      });
    }
    const cancelled = "Cancelled";
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: cancelled },
        $push: { statusHistory: { status: cancelled, at: new Date() } },
      },
      { new: true }
    )
      .populate("item.menuitem")
      .populate("owner")
      .lean();

    return res.json({ success: true, order: updated });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const reorderFromOrder = async (req, res) => {
  try {
    const prev = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();
    if (!prev) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const ids = prev.item.map((i) => i.menuitem);
    const items = await MenuItem.find({
      _id: { $in: ids },
      owner: prev.owner,
    }).lean();

    const byId = new Map(items.map((m) => [String(m._id), m]));
    const cartPayload = [];
    let skipped = 0;
    for (const line of prev.item) {
      const mi = byId.get(String(line.menuitem));
      if (!mi || mi.isOutOfStock) {
        skipped += 1;
        continue;
      }
      cartPayload.push({
        ...mi,
        owner: String(prev.owner),
        reorderQty: line.quantity,
      });
    }

    return res.json({
      success: true,
      items: cartPayload,
      skippedOutOfStock: skipped,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

const ownerSalesSummary = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.owner.id);
    const revenueStatuses = ["Paid", "Being Baked", "Out for Delivery", "Delivered"];

    const [totals] = await Order.aggregate([
      {
        $match: {
          owner: ownerId,
          status: { $in: revenueStatuses },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalprice" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [recent] = await Order.aggregate([
      {
        $match: {
          owner: ownerId,
          status: { $in: revenueStatuses },
          dateOrdered: { $gte: last30 },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalprice" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    return res.json({
      success: true,
      allTime: {
        revenue: totals?.revenue ?? 0,
        orderCount: totals?.orderCount ?? 0,
      },
      last30Days: {
        revenue: recent?.revenue ?? 0,
        orderCount: recent?.orderCount ?? 0,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

module.exports = {
  checkout,
  verifyPayment,
  restaurantOrders,
  userOrders,
  updateStatus,
  cancelUserOrder,
  reorderFromOrder,
  ownerSalesSummary,
};
