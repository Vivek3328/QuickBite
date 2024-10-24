const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  registerOwner,
  loginOwner,
  fetchAllOwner,
} = require("../controllers/OwnerController.js");

router.post(
  "/registerowner",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "Enter a valid password").isLength({ min: 4 }),
  ],
  registerOwner
);

router.post("/loginowner", loginOwner);

router.get("/fetchallowner", fetchAllOwner);

module.exports = router;
