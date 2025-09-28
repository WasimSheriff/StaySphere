const express = require("express");
const router = express.Router({ mergeParams: true }); //visit this (to merge the parent and child routes p-/listings/:id/reviews c-/:reviewId)
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewsController = require("../controllers/reviews");

//Post route
//need to be logged to give review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview)
);

//delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
