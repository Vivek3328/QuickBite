const express = require("express");
const { validateCoupon } = require("../controllers/CouponController");

const router = express.Router();

router.post("/validate", validateCoupon);

module.exports = router;
