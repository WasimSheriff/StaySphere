const User=require("../models/user")

module.exports.getSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async(req,res,next)=>{
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
}

module.exports.getLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to StaySphere");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // refer middleware for info (undrestand the process)
    /* console.log(res.locals.redirectUrl); */
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{ // built in method for logout catches if any err as well
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out!");
        res.redirect("/listings");
    })
}