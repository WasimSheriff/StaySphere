const express=require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync")
const Listing=require("../models/listing")
const {isLoggedIn,isOwner,validateListing}=require("../middleware")

router.get("/",wrapAsync( async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner"); // populate is used for shoeing all the reviews in the listing instead of the object Id both owner and review
    // for the display of the author of the review
    if(!listing){
        req.flash("error","Listing Not Found!");
        return res.redirect("/listings"); // after return it must come out of the function or it will go to the deleted listings again so error comes
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}))

//post route
router.post("/",isLoggedIn,validateListing,wrapAsync( async(req,res)=>{
    /* let {title,desc,...}=req.body can be written but for better code we use listing[price] like that (y coz listing object is alredy created in the form) */
    /* if(!req.body){
        throw new ExpressError(400,"Send valid data for listing!");
    } 
    before joi
    */
    let listing=req.body.listing;
    const newListing=new Listing(listing);
    newListing.owner=req.user._id; // mappin the owners with the listing
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings")
    console.log(listing);
}))

//edit route    //is owner functions is used make only the owner edit delete update their listing --> it is middleware
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not Found!");
        return res.redirect("/listings"); // after return it must come out of the function or it will go to the deleted listings again so error comes
    }
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}))

module.exports=router;