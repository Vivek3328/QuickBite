const express = require("express");
const { fetchUser } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { createReviewRules } = require("../validators/reviewApi");
const { createReview } = require("../controllers/ReviewController");

const router = express.Router();

router.post("/", fetchUser, createReviewRules, validateRequest, createReview);

module.exports = router;
