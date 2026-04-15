const express = require("express");
const router = express.Router();
const {
  allmenuitems,
  addItem,
  restaurantMenu,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/MenuItemController");
const { fetchOwner } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { addMenuItemRules } = require("../validators/menuItemAuth");

router.post(
  "/additem",
  fetchOwner,
  addMenuItemRules,
  validateRequest,
  addItem
);

router.get("/fetchallmenuitems", fetchOwner, allmenuitems);

router.get("/fetchrestomenu/:id", restaurantMenu);

router.put("/updatemenuitem/:id", fetchOwner, updateMenuItem);

router.delete("/deletemenuitems/:id", fetchOwner, deleteMenuItem);

module.exports = router;
