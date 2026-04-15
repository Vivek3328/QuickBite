const { body } = require("express-validator");

const addressFields = [
  body("label").optional().trim().isLength({ max: 40 }),
  body("fullName").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("line1").trim().notEmpty().withMessage("Address line is required"),
  body("line2").optional().trim().isLength({ max: 200 }),
  body("city").trim().notEmpty(),
  body("state").trim().notEmpty(),
  body("pincode").trim().notEmpty(),
  body("isDefault").optional().isBoolean(),
];

const createAddressRules = [...addressFields];

const updateAddressRules = [
  body("label").optional().trim().isLength({ max: 40 }),
  body("fullName").optional().trim().notEmpty(),
  body("phone").optional().trim().notEmpty(),
  body("line1").optional().trim().notEmpty(),
  body("line2").optional().trim().isLength({ max: 200 }),
  body("city").optional().trim().notEmpty(),
  body("state").optional().trim().notEmpty(),
  body("pincode").optional().trim().notEmpty(),
  body("isDefault").optional().isBoolean(),
];

module.exports = { createAddressRules, updateAddressRules };
