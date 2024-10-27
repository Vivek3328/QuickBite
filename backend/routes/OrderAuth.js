const express = require("express");
const router = express.Router();
// const { body } = require("express-validator");
// const {
//   checkout,
//   restaurantOrders,
//   userOrders,
//   updateStatus,
// } = require("../controllers/OrderController");
// const FetchOwner = require("../middlewares/fetchOwner");
// const FetchUser = require("../middlewares/fetchUser");

// router.post(
//   "/checkout",
//   FetchUser,
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

// router.get("/myorders/", FetchOwner, restaurantOrders);

// router.get("/userorders", FetchUser, userOrders);

// router.put("/updateorder/:id", FetchOwner, updateStatus);

module.exports = router;
