const { ref } = require("joi");
const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://www.vectorstock.com/royalty-free-vectors/404-page-not-found-vectors",
        set:v=>!v || v.trim()===""? "https://www.vectorstock.com/royalty-free-vectors/404-page-not-found-vectors":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
})

//to delete all the reviews when the listing is removed
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;