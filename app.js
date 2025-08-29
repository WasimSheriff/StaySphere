const express=require("express")
const app=express();
const mongoose = require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")

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

//index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//post route
app.post("/listings",async(req,res)=>{
    /* let {title,desc,...}=req.body can be written but for better code we use listing[price] like that (y coz listing object is alredy created in the form) */
    let listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings")
    console.log(listing);
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

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

app.listen(8080,()=>{
    console.log("server listening on port 8080")
})