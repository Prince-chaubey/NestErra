const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ListingModel = require("./Models/Listing.js");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { validateListings, validateReviews } = require("./Models/schema.js");
const Review = require("./Models/Review.js");

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/nexterra");
}
main()
  .then(() => console.log("Database Initialized"))
  .catch((err) => console.log("Error", err));

app.get("/", (req, res) => {
  res.send("Hi I am Root!");
});

// Schema validation middlewares
const checkListings = (req, res, next) => {
  let { error } = validateListings.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

const checkReviews = (req, res, next) => {
  let { error } = validateReviews.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Show all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await ListingModel.find({});
    res.render("AllListings.ejs", { allListings });
  })
);

// Form to add new listing
app.get("/listings/new", (req, res) => {
  res.render("newListing.ejs");
});

// Create listing
app.post(
  "/listings/new",
  checkListings,
  wrapAsync(async (req, res) => {
    const newListing = new ListingModel(req.body);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show individual listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const list = await ListingModel.findById(id).populate("reviews");

    if (!list) {
      return next(new ExpressError(404, "Listing not found"));
    }

    res.render("show.ejs", { list });
  })
);

// Delete a listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await ListingModel.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// Edit form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await ListingModel.findById(id);
    res.render("edit.ejs", { list });
  })
);

// Update listing
app.put(
  "/listings/:id",
  checkListings,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await ListingModel.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/listings/${id}`);
  })
);

// Add review
app.post(
  "/listings/:id/reviews",
  checkReviews,
  wrapAsync(async (req, res) => {
    const listing = await ListingModel.findById(req.params.id);
    const newReview = new Review(req.body.reviews);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);
//Route to delete the reviews for a particular Listings
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;

  const listing = await ListingModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  if (!listing) {
      return res.redirect('/listings');
  }

  await Review.findByIdAndDelete(reviewId);

 
  res.redirect(`/listings/${id}`);
}));


// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
