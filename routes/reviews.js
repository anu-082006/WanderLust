const express = require('express');
const router = express.Router({mergeParams: true});//mergeParams: true is used to access the params from the parent route (/listings/:id) in this router (/reviews)
const Listing = require('../models/listings');//.. to go to parent directory
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

//Review Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;