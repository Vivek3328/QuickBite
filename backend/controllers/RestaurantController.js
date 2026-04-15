const Owner = require("../models/OwnerModel");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter({ q, restaurantType, cuisine }) {
  const parts = [];
  if (restaurantType === "veg" || restaurantType === "non-veg") {
    parts.push({ restaurantType });
  }
  if (cuisine && String(cuisine).trim()) {
    parts.push({
      foodtype: new RegExp(escapeRegex(String(cuisine).trim()), "i"),
    });
  }
  if (q && String(q).trim()) {
    const rx = new RegExp(escapeRegex(String(q).trim()), "i");
    parts.push({ $or: [{ name: rx }, { foodtype: rx }, { address: rx }] });
  }
  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];
  return { $and: parts };
}

function sortOption(sort) {
  switch (sort) {
    case "name":
      return { name: 1 };
    case "newest":
      return { createdAt: -1 };
    case "rating":
    default:
      return { avgRating: -1, reviewCount: -1 };
  }
}

const listRestaurants = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const filter = buildFilter({
      q: req.query.q,
      restaurantType: req.query.restaurantType,
      cuisine: req.query.cuisine,
    });
    const sort = sortOption(req.query.sort);

    const [items, total] = await Promise.all([
      Owner.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Owner.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      restaurants: items,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load restaurants" });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id).select("-password").lean();
    if (!owner) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }
    return res.json({ success: true, restaurant: owner });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load restaurant" });
  }
};

module.exports = { listRestaurants, getRestaurant };
