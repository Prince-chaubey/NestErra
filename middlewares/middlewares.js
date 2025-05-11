const ListingModel = require("../Models/Listing");
const Review = require("../Models/Review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in to access this!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
        delete req.session.redirectURL;
    } else {
        res.locals.redirectURL = "/listings";
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;  
    const listing = await ListingModel.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission for it!");
        return res.redirect("/listings");
    }

    next();
};
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;

    let review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You don't have permission for it!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
