const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { savedRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");

router
  .route("/signup")
  .get(usersController.getSignUpForm)
  .post(wrapAsync(usersController.signUp));

router
  .route("/login")
  .get(usersController.getLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  ); // here the passport gives a built in authenticate method and redirects to login page if worng info and a flah is auto generated aswell

router.get("/logout", usersController.logout);

module.exports = router;
