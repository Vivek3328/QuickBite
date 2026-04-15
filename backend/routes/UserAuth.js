const express = require("express");
const router = express.Router();
// const { fetchUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/UserController");
const validateRequest = require("../middleware/validateRequest");
const { registerUserRules, loginUserRules } = require("../validators/userAuth");

router.post(
  "/registeruser",
  registerUserRules,
  validateRequest,
  registerUser
);

router.post(
  "/loginuser",
  loginUserRules,
  validateRequest,
  loginUser
);

// router.get("/getuser", fetchUser, getUser);

module.exports = router;
