const Owner = require("../models/OwnerModel");

const updateRestaurantSettings = async (req, res) => {
  try {
    const { deliveryEtaMin, lat, lng } = req.body;
    const set = {};

    if (deliveryEtaMin != null && deliveryEtaMin !== "") {
      const n = Number(deliveryEtaMin);
      if (Number.isFinite(n)) {
        set.deliveryEtaMin = Math.min(120, Math.max(10, Math.round(n)));
      }
    }

    if (lat != null && lng != null && lat !== "" && lng !== "") {
      const la = Number(lat);
      const ln = Number(lng);
      if (Number.isFinite(la) && Number.isFinite(ln)) {
        set.location = { lat: la, lng: ln };
      }
    }

    if (Object.keys(set).length === 0) {
      return res.status(400).json({ success: false, error: "No valid fields to update" });
    }

    const owner = await Owner.findByIdAndUpdate(req.owner.id, { $set: set }, { new: true })
      .select("-password")
      .lean();

    return res.json({ success: true, restaurant: owner });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not update settings" });
  }
};

module.exports = { updateRestaurantSettings };
