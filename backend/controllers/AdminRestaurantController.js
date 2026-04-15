const Owner = require("../models/OwnerModel");

const listRestaurantsAdmin = async (req, res) => {
  try {
    const items = await Owner.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, restaurants: items });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load restaurants" });
  }
};

const setRestaurantActive = async (req, res) => {
  try {
    const { isActive } = req.body;
    const o = await Owner.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: Boolean(isActive) } },
      { new: true }
    ).select("-password");
    if (!o) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, restaurant: o });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Update failed" });
  }
};

module.exports = {
  listRestaurantsAdmin,
  setRestaurantActive,
};
