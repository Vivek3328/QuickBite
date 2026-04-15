const express = require("express");
const router = express.Router();
const { fetchUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUser,
  updateUserProfile,
} = require("../controllers/UserController");
const validateRequest = require("../middleware/validateRequest");
const {
  registerUserRules,
  loginUserRules,
  updateUserProfileRules,
} = require("../validators/userAuth");

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

router.get("/me", fetchUser, getUser);

router.put(
  "/me",
  fetchUser,
  updateUserProfileRules,
  validateRequest,
  updateUserProfile
);

module.exports = router;
