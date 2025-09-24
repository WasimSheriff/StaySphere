const express=require("express");
const router=express.Router();
const User=require("../models/user")
const wrapAsync=require("../utils/wrapAsync")
const passport=require("passport")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password); // this is used to create a instance in the user database with the salted with the hashed password
        console.log(registeredUser);
        req.flash("success","Welcome to StaySphere!");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    // the try - catch is used to go back to the signup when guy with same user registers with same user name instaed if staying in a balnk page eith th error flash
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}), async(req,res)=>{
    req.flash("success","Welcome to StaySphere");
    res.redirect("/listings");
})
// here the passport gives a built in authenticate method and redirects to login page if worng info and a flah is auto generated aswell 

module.exports=router;