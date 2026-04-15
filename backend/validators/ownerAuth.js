const { body } = require("express-validator");

const registerOwnerRules = [
  body("email", "Enter a valid Email").isEmail(),
  body("name", "Enter a valid name").isLength({ min: 5 }),
  body("password", "Enter a valid password").isLength({ min: 4 }),
];

module.exports = { registerOwnerRules };
