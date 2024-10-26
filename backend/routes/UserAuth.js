const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const fetchUser = require("../middlewares/fetchUser");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/UserController");



router.post(
  "/registeruser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "Enter a valid password").isLength({ min: 4 }),
  ],
  registerUser
);

router.post(
  "/loginuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 4 }),
  ],
  loginUser
);

router.get("/getuser", fetchUser, getUser);

module.exports = router;
