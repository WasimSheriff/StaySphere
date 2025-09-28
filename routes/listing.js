const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer=require("multer") //get multipart form
const {storage}=require("../cloudConfig")
const upload=multer({storage}) // get the data from the multipart forms (for uploading of images) it stoes the images in itself created folder called uploads (before) now it saves in the cloudinary 

//simplyfying the readability by useing controllers(MVC) for all the routes
// now usign router.route
// single route multiple http calls (simplification)

//Index Route //post route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.addListing));
  

//new route //above :id or it will consider as :id/new
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route //update route //delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route    //is owner functions is used make only the owner edit delete update their listing --> it is middleware
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
