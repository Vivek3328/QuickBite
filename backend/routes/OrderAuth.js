const express = require("express");
const router = express.Router();
const {
  checkout,
  restaurantOrders,
  userOrders,
  updateStatus,
  verifyPayment,
  cancelUserOrder,
  reorderFromOrder,
  ownerSalesSummary,
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

router.put("/cancel/:id", fetchUser, cancelUserOrder);

router.post("/reorder/:id", fetchUser, reorderFromOrder);

router.get("/summary", fetchOwner, ownerSalesSummary);

router.put(
  "/updateorder/:id",
  fetchOwner,
  updateOrderStatusRules,
  validateRequest,
  updateStatus
);

module.exports = router;
