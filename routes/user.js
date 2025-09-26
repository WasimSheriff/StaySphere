const express=require("express");
const router=express.Router();
const User=require("../models/user")
const wrapAsync=require("../utils/wrapAsync")
const passport=require("passport")
const {savedRedirectUrl}=require("../middleware")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password); // this is used to create a instance in the user database with the salted with the hashed password
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{ // to implemen tauto login after the signup of the user addons
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to StaySphere!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    // the try - catch is used to go back to the signup when guy with same user registers with same user name instaed if staying in a balnk page eith th error flash
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}), async(req,res)=>{
    req.flash("success","Welcome to StaySphere");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // refer middleware for info (undrestand the process)
    /* console.log(res.locals.redirectUrl); */
})
// here the passport gives a built in authenticate method and redirects to login page if worng info and a flah is auto generated aswell 

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{ // built in method for logout catches if any err as well
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out!");
        res.redirect("/listings");
    })
})

module.exports=router;