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

const fetchOwner = require("../middlewares/fetchOwner.js");

router.post(
  "/additem",
  fetchOwner,
  [
    body("itemname", "Enter a valid Item Name").isLength({ min: 3 }),
    body("description", "Description must be of minimum 5 character").isLength({
      min: 5,
    }),
  ],
  addItem
);

router.get("/fetchallmenuitems", fetchOwner, allmenuitems);

router.get("/fetchrestomenu/:id", restaurantMenu);

router.put("/updatemenuitem/:id", fetchOwner, updateMenuItem);

router.delete("/deletemenuitems/:id", fetchOwner, deleteMenuItem);

module.exports = router;
