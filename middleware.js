const Listing=require("./models/listing")
const Review=require("./models/review")
const ExpressError=require("./utils/ExpressError")
const {listingSchema,reviewSchema}=require("./schema")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; // when without loggin a person tries to access some page then after loggin he goes back to the same page again addons
        req.flash("error","You Must be Logged in to create a Listing"); // to check if the user is logged in before he create a listing
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You aren't the owner of the listing!");
        res.redirect(`/listings/${id}`);
    }
    next();
}

/* valiadte the listing  (in messed up the required parts in the form (look into it) ) */
module.exports.validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//validate the review
module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//to handle the corrcet poeple deleting corrcet reviews
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You aren't the author of the review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}