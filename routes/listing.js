const express=require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const {listingSchema}=require("../schema")
const Listing=require("../models/listing")

/* valiadte the listing  (in messed up the required parts in the form (look into it) ) */
const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/",wrapAsync( async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews"); // populate is used for shoeing all the reviews in the listing instead of the object Id
    res.render("listings/show.ejs",{listing});
}))

//post route
router.post("/",validateListing,wrapAsync( async(req,res)=>{
    /* let {title,desc,...}=req.body can be written but for better code we use listing[price] like that (y coz listing object is alredy created in the form) */
    /* if(!req.body){
        throw new ExpressError(400,"Send valid data for listing!");
    } 
    before joi
    */
    let listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings")
    console.log(listing);
}))

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports=router;