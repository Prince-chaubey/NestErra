const ListingModel = require("../Models/Listing");
const Review = require("../Models/Review");
const { validateReviews } = require("../Models/schema");
const ExpressError = require("../utils/expressError");

// Middleware: Validate Review Schema
module.exports.checkReviews = (req, res, next) => {
  const { error } = validateReviews.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Add a Review to a Listing
module.exports.createReview = async (req, res) => {
  const listing = await ListingModel.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  if (req.isAuthenticated()) {
    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  } else {
    res.redirect("/login");
  }
};

// Delete a Review from a Listing
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await ListingModel.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  if (!listing) {
    return res.redirect("/listings");
  }

  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
