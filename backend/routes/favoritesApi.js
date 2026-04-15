const express = require("express");
const { fetchUser } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { addFavoriteRules } = require("../validators/favoriteApi");
const {
  listFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require("../controllers/FavoriteController");

const router = express.Router();

router.get("/", fetchUser, listFavorites);
router.get("/:ownerId/check", fetchUser, checkFavorite);
router.post("/", fetchUser, addFavoriteRules, validateRequest, addFavorite);
router.delete("/:ownerId", fetchUser, removeFavorite);

module.exports = router;
