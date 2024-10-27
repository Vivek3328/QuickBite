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
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchOwner = async (req, res, next) => {//get the user from jwt token and Add Id to req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.owner = data.owner;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
}

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
