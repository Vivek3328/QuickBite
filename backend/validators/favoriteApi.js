const { body } = require("express-validator");

const addFavoriteRules = [
  body("ownerId").notEmpty().withMessage("Restaurant is required").isMongoId(),
];

module.exports = { addFavoriteRules };
