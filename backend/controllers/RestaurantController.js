const Owner = require("../models/OwnerModel");
const { distanceKm } = require("../utils/geo");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter({ q, restaurantType, cuisine, minRating, maxCostForTwo, minCostForTwo }) {
  const parts = [{ $or: [{ isActive: true }, { isActive: { $exists: false } }] }];

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
  const mr = parseFloat(minRating, 10);
  if (Number.isFinite(mr) && mr > 0) {
    parts.push({ avgRating: { $gte: mr } });
  }
  const maxC = parseFloat(maxCostForTwo, 10);
  if (Number.isFinite(maxC) && maxC >= 0) {
    parts.push({ costForTwo: { $lte: maxC } });
  }
  const minC = parseFloat(minCostForTwo, 10);
  if (Number.isFinite(minC) && minC >= 0) {
    parts.push({ costForTwo: { $gte: minC } });
  }

  if (parts.length === 1) return parts[0];
  return { $and: parts };
}

function sortOption(sort) {
  switch (sort) {
    case "name":
      return { name: 1 };
    case "newest":
      return { createdAt: -1 };
    case "costLow":
      return { costForTwo: 1 };
    case "costHigh":
      return { costForTwo: -1 };
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
      minRating: req.query.minRating,
      maxCostForTwo: req.query.maxCostForTwo,
      minCostForTwo: req.query.minCostForTwo,
    });
    const sortKey = req.query.sort || "rating";
    const sort = sortOption(sortKey);

    const userLat = parseFloat(req.query.lat, 10);
    const userLng = parseFloat(req.query.lng, 10);

    const total = await Owner.countDocuments(filter);

    let items;
    if (sortKey === "distance" && Number.isFinite(userLat) && Number.isFinite(userLng)) {
      const pool = await Owner.find(filter).select("-password").lean();
      items = pool
        .map((o) => {
          const lat = o.location?.lat;
          const lng = o.location?.lng;
          let dist = null;
          if (typeof lat === "number" && typeof lng === "number") {
            dist = distanceKm(userLat, userLng, lat, lng);
          }
          return { ...o, distanceKm: dist };
        })
        .sort((a, b) => {
          const da = a.distanceKm == null ? 99999 : a.distanceKm;
          const db = b.distanceKm == null ? 99999 : b.distanceKm;
          return da - db;
        })
        .slice(skip, skip + limit);
    } else {
      items = await Owner.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      items = items.map((o) => {
        const lat = o.location?.lat;
        const lng = o.location?.lng;
        let dist = null;
        if (
          Number.isFinite(userLat) &&
          Number.isFinite(userLng) &&
          typeof lat === "number" &&
          typeof lng === "number"
        ) {
          dist = distanceKm(userLat, userLng, lat, lng);
        }
        return { ...o, distanceKm: dist };
      });
    }

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
    if (owner.isActive === false) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }
    return res.json({ success: true, restaurant: owner });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load restaurant" });
  }
};

module.exports = { listRestaurants, getRestaurant };
