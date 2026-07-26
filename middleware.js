const Listing = require('./models/listings');
const ExpressError = require('./utils/ExpressError.js');
const Review = require('./models/review');
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing || String(listing.owner?._id || listing.owner) !== String(req.user._id)) {
        req.flash("error", "You don't have the permission to edit");
        return res.redirect("/listings");
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review || String(review.author?._id || review.author) !== String(req.user._id)) {
        req.flash("error", "You don't have the permission to edit");
        return res.redirect("/listings");
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
};

module.exports.validateReview = validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
};