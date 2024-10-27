const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  checkout,
  restaurantOrders,
  userOrders,
  updateStatus,
} = require("../controllers/OrderController");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchOwner = async (req, res, next) => {//get the user from jwt token and Add Id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.owner = data.owner;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
}

const fetchUser = async (req, res, next) => {
  //Get the user from jwt token and add id to object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
}

router.post(
  "/checkout",
  fetchUser,
  [
    body("owner", "Owner is required").not().isEmpty(),
    body("item", "Items are required").isArray({ min: 1 }),
    body("totalprice", "Total price is required and must be a number").isFloat({
      gt: 0,
    }),
    body("shipping", "Shipping details are required").not().isEmpty(),
  ],
  checkout
);

router.get("/myorders/", fetchOwner, restaurantOrders);

router.get("/userorders", fetchUser, userOrders);

router.put("/updateorder/:id", fetchOwner, updateStatus);

module.exports = router;
