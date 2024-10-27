const express = require("express");
const router = express.Router();
// const fetchUser = require("../middlewares/fetchUser.js");
// const fetchOwner = require("../middlewares/fetchOwner.js");
// const { body } = require("express-validator");
// const {
//   checkout,
//   restaurantOrders,
//   userOrders,
//   updateStatus,
// } = require("../controllers/OrderController");

// router.post(
//   "/checkout",
//   fetchUser,
//   [
//     body("owner", "Owner is required").not().isEmpty(),
//     body("item", "Items are required").isArray({ min: 1 }),
//     body("totalprice", "Total price is required and must be a number").isFloat({
//       gt: 0,
//     }),
//     body("shipping", "Shipping details are required").not().isEmpty(),
//   ],
//   checkout
// );

// router.get("/myorders/", fetchOwner, restaurantOrders);

// router.get("/userorders", fetchUser, userOrders);

// router.put("/updateorder/:id", fetchOwner, updateStatus);

module.exports = router;
