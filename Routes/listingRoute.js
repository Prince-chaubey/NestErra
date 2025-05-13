const express = require("express");
const router = express.Router();
const ListingModel = require("../Models/Listing");
const { validateListings } = require("../Models/schema");
const ExpressError = require('../utils/expressError');
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middlewares/middlewares");
const listingController=require("../Controllers/listingControllers");
const multer = require('multer');
const {storage}=require("../cloudConfig");
const upload = multer({storage});


router.get("/", wrapAsync(listingController.getAllListings));

router.route("/new")
.get(isLoggedIn, listingController.renderNewForm)
 .post(listingController.checkListings,
  upload.single('listing[image]'),
  wrapAsync(listingController.createListing)
);



router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))
.put(
    isLoggedIn,
    isOwner,
    listingController.checkListings,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing)
);


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;
