const initData=require("./data")
const mongoose = require("mongoose");
const Listing=require("../models/listing")

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

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68d56081227dd0a915331054"})); // add the user
    await Listing.insertMany(initData.data);
    console.log("data was initialized!");
}

initDB();