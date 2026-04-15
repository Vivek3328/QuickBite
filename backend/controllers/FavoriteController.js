const Favorite = require("../models/FavoriteModel");
const Owner = require("../models/OwnerModel");

const listFavorites = async (req, res) => {
  try {
    const items = await Favorite.find({ user: req.user.id })
      .populate({
        path: "owner",
        select: "-password",
      })
      .sort({ createdAt: -1 })
      .lean();

    const restaurants = items.map((f) => f.owner).filter(Boolean);
    return res.json({ success: true, restaurants });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load favorites" });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { ownerId } = req.body;
    const exists = await Owner.findById(ownerId).select("_id").lean();
    if (!exists) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }
    try {
      await Favorite.create({ user: req.user.id, owner: ownerId });
      return res.status(201).json({ success: true });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(200).json({ success: true });
      }
      throw e;
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not save favorite" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    await Favorite.deleteOne({ user: req.user.id, owner: req.params.ownerId });
    return res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not remove favorite" });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const fav = await Favorite.findOne({
      user: req.user.id,
      owner: req.params.ownerId,
    }).lean();
    return res.json({ success: true, isFavorite: Boolean(fav) });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not check favorite" });
  }
};

module.exports = { listFavorites, addFavorite, removeFavorite, checkFavorite };
