if(process.env.NODE_ENV!='production'){
    require('dotenv').config()
}

const express=require("express")
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")
const session=require("express-session")
const flash=require("connect-flash") // used to show some confirmation or error (only once)
const passport=require("passport")
const LocalStratergy=require("passport-local")
const User=require("./models/user")

const listingRouter=require("./routes/listing")
const reviewRouter=require("./routes/review")
const userRouter=require("./routes/user")

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

// to store old info of users for a while (research)
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3, //ini mili secs
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    }
}
app.use(session(sessionOptions))
app.use(flash()) // always before the routes

app.use(passport.initialize()) // to let the app know that a single user is accessing the different web pages
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate())); // to authenticate the user logging in the app

passport.serializeUser(User.serializeUser()); // more like to maintain the user to stay till using the website
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); //locals is uswed to store in the local db and used to shoe the msg in index.js in views listing
    res.locals.error=req.flash("error"); //locals is uswed to store in the local db and used to shoe the msg in index.js in views listing
    /* console.log(res.locals.success); */
    res.locals.currUser=req.user; // stores the curr logged in user for the accesing in the navbar 
    next();
})

//moved to routes to reduce the crowd
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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