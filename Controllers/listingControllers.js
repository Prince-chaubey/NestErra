

const ListingModel = require("../Models/Listing");
const { validateListings } = require("../Models/schema");
const ExpressError = require('../utils/expressError');

// Validate Listing Schema
module.exports.checkListings = (req, res, next) => {
  const { error } = validateListings.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Show All Listings
module.exports.getAllListings = async (req, res) => {
  const allListings = await ListingModel.find({});
  res.render("AllListings.ejs", { allListings });
};

// Render New Listing Form
module.exports.renderNewForm = (req, res) => {
  res.render("newListing.ejs");
};

// Create New Listing
module.exports.createListing = async (req, res) => {
   let url=req.file.path;
   let filename=req.file.filname;

  const newListing = new ListingModel(req.body.listing);
  newListing.image = { url,filename }; 
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Show Individual Listing
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const list = await ListingModel.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!list) {
    return next(new ExpressError(404, "Listing not found"));
  }

  res.render("show.ejs", { list });
};

// Delete Listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await ListingModel.findByIdAndDelete(id);
  req.flash("error", "Listing Deleted Successfully!");
  res.redirect("/listings");
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const list = await ListingModel.findById(id);
  res.render("edit.ejs", { list });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let url,filename;

  let editedListing=await ListingModel.findByIdAndUpdate(id, req.body.listing, { new: true });
    if(req.file){
       let url=req.file.path;
       let filename=req.file.filname;
       editedListing.image={url,filename}
       await editedListing.save();
  }

  let imageUrl=editedListing.image.url;
  imageUrl.replace("/upload","/upload/h_300,w_250");
  
  req.flash("success", "Listing edited successfully!");
  res.redirect(`/listings/${id}`);
};
