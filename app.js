const express=require("express")
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")


const listings=require("./routes/listing")
const reviews=require("./routes/review")

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

//moved to routes to reduce the crowd
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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