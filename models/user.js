const mongoose=require("mongoose")
const Schema=mongoose.Schema
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
})

userSchema.plugin(passportLocalMongoose); // create usename and password for the user nad adds some methods aswell

module.exports=mongoose.model("User",userSchema);
