const express=require("express");
const router=express.Router({ mergeParams: true }) //visit this (to merge the parent and child routes p-/listings/:id/reviews c-/:reviewId)
const wrapAsync=require("../utils/wrapAsync")
const Review=require("../models/review")
const Listing=require("../models/listing")
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware")

//Post route
//need to be logged to give review
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id; // onwer of th review
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}))

module.exports=router