const express = require("express");
const { adminAuth } = require("../middleware/adminAuth");
const {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/CouponController");
const {
  listRestaurantsAdmin,
  setRestaurantActive,
} = require("../controllers/AdminRestaurantController");

const router = express.Router();

router.use(adminAuth);

router.get("/coupons", listCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

router.get("/restaurants", listRestaurantsAdmin);
router.patch("/restaurants/:id", setRestaurantActive);

module.exports = router;
