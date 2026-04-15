const express = require("express");
const router = express.Router();
const {
  checkout,
  restaurantOrders,
  userOrders,
  updateStatus,
  verifyPayment,
} = require("../controllers/OrderController");
const { fetchOwner, fetchUser } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { checkoutRules, updateOrderStatusRules } = require("../validators/orderAuth");

router.post(
  "/checkout",
  fetchUser,
  checkoutRules,
  validateRequest,
  checkout
);

router.post("/verify-payment", verifyPayment);

router.get("/myorders/", fetchOwner, restaurantOrders);

router.get("/userorders", fetchUser, userOrders);

router.put(
  "/updateorder/:id",
  fetchOwner,
  updateOrderStatusRules,
  validateRequest,
  updateStatus
);

module.exports = router;
