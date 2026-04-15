const { body } = require("express-validator");

const addMenuItemRules = [
  body("itemname", "Enter a valid Item Name").isLength({ min: 3 }),
  body("description", "Description must be of minimum 5 character").isLength({
    min: 5,
  }),
];

module.exports = { addMenuItemRules };
