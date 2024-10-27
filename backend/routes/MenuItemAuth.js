const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  allmenuitems,
  addItem,
  restaurantMenu,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/MenuItemController");
const FetchOwner = require("../middlewares/fetchOwner")



router.post(
  "/additem",
  FetchOwner,
  [
    body("itemname", "Enter a valid Item Name").isLength({ min: 3 }),
    body("description", "Description must be of minimum 5 character").isLength({
      min: 5,
    }),
  ],
  addItem
);

router.get("/fetchallmenuitems", FetchOwner, allmenuitems);

router.get("/fetchrestomenu/:id", restaurantMenu);

router.put("/updatemenuitem/:id", FetchOwner, updateMenuItem);

router.delete("/deletemenuitems/:id", FetchOwner, deleteMenuItem);

module.exports = router;
