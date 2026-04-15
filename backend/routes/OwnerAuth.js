const express = require("express");

const router = express.Router();

const {
  registerOwner,
  loginOwner,
  fetchAllOwner,
} = require("../controllers/OwnerController.js");
const validateRequest = require("../middleware/validateRequest");
const { registerOwnerRules } = require("../validators/ownerAuth");

router.post(
  "/registerowner",
  registerOwnerRules,
  validateRequest,
  registerOwner
);

router.post("/loginowner", loginOwner);

router.get("/fetchallowner", fetchAllOwner);

module.exports = router;
