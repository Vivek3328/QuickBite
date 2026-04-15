const { body } = require("express-validator");

const createReviewRules = [
  body("orderId").isMongoId().withMessage("Valid order is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("comment").optional().isString().isLength({ max: 2000 }),
];

module.exports = { createReviewRules };
