const express = require("express");
const { fetchUser } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const {
  createAddressRules,
  updateAddressRules,
} = require("../validators/addressApi");
const {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/UserAddressController");

const router = express.Router();

router.get("/", fetchUser, listAddresses);
router.post("/", fetchUser, createAddressRules, validateRequest, createAddress);
router.put("/:id", fetchUser, updateAddressRules, validateRequest, updateAddress);
router.delete("/:id", fetchUser, deleteAddress);

module.exports = router;
