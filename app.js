const express=require("express")
const app=express();
const mongoose = require("mongoose");
const Listing=require("./models/listing")
const Review=require("./models/review")
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError")
const {listingSchema}=require("./schema")
const {reviewSchema}=require("./schema")

const MONGO_URL="mongodb://127.0.0.1:27017/StaySphere";

main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); // ejs boilreplate
app.use(express.static(path.join(__dirname,"/public"))); // for accessing static files (css)

app.get("/",(req,res)=>{
    console.log("Hi i am 2.0");
})

/* valiadte the listing  (in messed up the required parts in the form (look into it) ) */
const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//validate the review
const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//index route
app.get("/listings",wrapAsync( async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews"); // populate is used for shoeing all the reviews in the listing instead of the object Id
    res.render("listings/show.ejs",{listing});
}))

//post route
app.post("/listings",validateListing,wrapAsync( async(req,res)=>{
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
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

//Reviews
//Post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//delete route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

/* app.get("/testListing",async(req,res)=>{
    let SampleListing=new Listing({
        title:"New Home",
        description:"home sweet home",
        price:1200,
        loaction:"TamilNadu Chennai",
        country:"India",
    });
    await SampleListing.save();
    res.send("success!");
    console.log("sample was saved!")
}) */

/* check again ( "*" )*/
/* app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
}) */

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"}=err;
    res.status(status).render("error",{message});
    /* res.status(status).send(message); */
})

app.listen(8080,()=>{
    console.log("server listening on port 8080")
})