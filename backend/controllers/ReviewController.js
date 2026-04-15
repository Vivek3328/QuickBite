const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");
const Owner = require("../models/OwnerModel");
const { ORDER_STATUS_DELIVERED } = require("../constants/orderStatuses");

async function recalcOwnerRating(ownerId) {
  const agg = await Review.aggregate([
    { $match: { owner: ownerId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
  const row = agg[0];
  const avgRating = row ? Math.round(row.avgRating * 10) / 10 : 0;
  const reviewCount = row ? row.reviewCount : 0;
  await Owner.findByIdAndUpdate(ownerId, { $set: { avgRating, reviewCount } });
}

const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== userId) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    if (order.status !== ORDER_STATUS_DELIVERED) {
      return res
        .status(400)
        .json({ success: false, error: "You can review after the order is delivered" });
    }

    const dup = await Review.findOne({ order: orderId });
    if (dup) {
      return res.status(400).json({ success: false, error: "This order was already reviewed" });
    }

    await Review.create({
      user: userId,
      owner: order.owner,
      order: orderId,
      rating,
      comment: comment || "",
    });

    await recalcOwnerRating(order.owner);

    const review = await Review.findOne({ order: orderId })
      .populate("user", "name")
      .lean();

    return res.status(201).json({ success: true, review });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not save review" });
  }
};

const listReviewsForRestaurant = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ owner: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name")
        .lean(),
      Review.countDocuments({ owner: req.params.id }),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      reviews,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load reviews" });
  }
};

module.exports = { createReview, listReviewsForRestaurant, recalcOwnerRating };
