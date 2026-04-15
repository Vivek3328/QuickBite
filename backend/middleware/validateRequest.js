const { validationResult } = require("express-validator");

/**
 * Run after express-validator `body` / `param` chains on the same route.
 */
function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, errors: result.array() });
  }
  next();
}

module.exports = validateRequest;
