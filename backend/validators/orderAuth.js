const { body } = require("express-validator");
const { OWNER_SETTABLE_ORDER_STATUSES } = require("../constants/orderStatuses");

const checkoutRules = [
  body("owner", "Owner is required").not().isEmpty(),
  body("item", "Items are required").isArray({ min: 1 }),
  body("item.*.menuitem", "Each line needs a menu item").notEmpty(),
  body("item.*.quantity", "Quantity must be at least 1").isInt({ min: 1 }),
  body("shipping", "Shipping details are required").not().isEmpty(),
  body("couponCode").optional().isString(),
];

const updateOrderStatusRules = [
  body("status")
    .isIn(OWNER_SETTABLE_ORDER_STATUSES)
    .withMessage("Invalid status"),
];

module.exports = { checkoutRules, updateOrderStatusRules };
