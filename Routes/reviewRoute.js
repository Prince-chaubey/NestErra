const express = require("express");
const router = express.Router();
const ListingModel = require("../Models/Listing");
const { validateReviews } = require("../Models/schema");
const ExpressError = require('../utils/expressError');
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../Models/Review");
const { isLoggedIn, isAuthor } = require("../middlewares/middlewares");
const reviewController=require("../Controllers/reviewController");

// Create Review
router.post(
  "/listings/:id/reviews",
  reviewController.checkReviews,
  wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
  "/listings/:id/reviews/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;