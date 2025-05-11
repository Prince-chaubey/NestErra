const express = require("express");
const router = express.Router();
const ListingModel = require("../Models/Listing");
const { validateListings } = require("../Models/schema");
const ExpressError = require('../utils/expressError');
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middlewares/middlewares");
const listingController=require("../Controllers/listingControllers");

router.get("/", wrapAsync(listingController.getAllListings));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/new", listingController.checkListings, wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, listingController.checkListings, wrapAsync(listingController.updateListing));

module.exports = router;