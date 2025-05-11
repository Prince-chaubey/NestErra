const express = require("express");
const router = express.Router();
const ListingModel = require("../Models/Listing");
const { validateListings } = require("../Models/schema");
const ExpressError = require('../utils/expressError');
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middlewares/middlewares");

// Schema validation middleware
const checkListings = (req, res, next) => {
  const { error } = validateListings.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await ListingModel.find({});
    res.render("AllListings.ejs", { allListings });
  })
);

// Form to add new listing
router.get("/new",
  isLoggedIn, 
  (req, res) => { 
    res.render("newListing.ejs");
});

// Create listing
router.post(
  "/new",
  checkListings,
  wrapAsync(async (req, res) => {
    const newListing = new ListingModel(req.body.listing);
    newListing.owner=req.user._id;
    req.flash("success","New Listing Created!");
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show individual listing
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const list = await ListingModel.findById(id).populate("owner").populate({
      path:"reviews",
      populate:{
        path:"author",
      }
    });

    if (!list) {
      return next(new ExpressError(404, "Listing not found"));
    }

    res.render("show.ejs", { list });
  })
);

// Delete a listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await ListingModel.findByIdAndDelete(id);
    req.flash("error","Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

// Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await ListingModel.findById(id);
    res.render("edit.ejs", { list });
  })
);

// Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  checkListings,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    await ListingModel.findByIdAndUpdate(id, req.body.listing, { new: true }); 
    req.flash("success","Listing edited successfully!");
    res.redirect(`/listings/${id}`);
  })
);



module.exports = router;
