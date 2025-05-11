const express = require("express");
const router = express.Router();
const ListingModel = require("../Models/Listing");
const { validateReviews } = require("../Models/schema");
const ExpressError = require('../utils/expressError');
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../Models/Review");
const { isLoggedIn, isAuthor } = require("../middlewares/middlewares");

// Middleware to validate reviews
const checkReviews = (req, res, next) => {
  const { error } = validateReviews.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Add a review to a listing
router.post(
  "/listings/:id/reviews",
  checkReviews,
  wrapAsync(async (req, res) => {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    if(req.isAuthenticated()){
    const newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    //console.log(newReview.author);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    }
    else return res.redirect("/login");
  })
);

// Delete a review from a listing
router.delete("/listings/:id/reviews/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await ListingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  if (!listing) {
    return res.redirect('/listings');
  }

  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
