const express = require("express");
const {
  listRestaurants,
  getRestaurant,
} = require("../controllers/RestaurantController");
const { listReviewsForRestaurant } = require("../controllers/ReviewController");

const router = express.Router();

router.get("/", listRestaurants);
router.get("/:id/reviews", listReviewsForRestaurant);
router.get("/:id", getRestaurant);

module.exports = router;
