const mongoose=require("mongoose");
const initData=require("./Data.js");
const ListingModel=require("../Models/Listing.js");

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/nexterra')
}

main().then(()=>console.log("Database Intialised")).catch((err)=>console.log("Error",err));

const initializeDB=async ()=>{
    await ListingModel.deleteMany({});
    await ListingModel.insertMany(initData.data);
    console.log("Data Inserted");
}
initializeDB();

