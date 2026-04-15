const { body } = require("express-validator");
const { OWNER_SETTABLE_ORDER_STATUSES } = require("../constants/orderStatuses");

const checkoutRules = [
  body("owner", "Owner is required").not().isEmpty(),
  body("item", "Items are required").isArray({ min: 1 }),
  body("totalprice", "Total price is required and must be a number").isFloat({
    gt: 0,
  }),
  body("shipping", "Shipping details are required").not().isEmpty(),
];

const updateOrderStatusRules = [
  body("status")
    .isIn(OWNER_SETTABLE_ORDER_STATUSES)
    .withMessage("Invalid status"),
];

module.exports = { checkoutRules, updateOrderStatusRules };
