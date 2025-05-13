const mongoose=require("mongoose");
const initData=require("./Data.js");
const ListingModel=require("../Models/Listing.js");
if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

async function main(){
     const url="mongodb://127.0.0.1:27017/nexterra";
   await mongoose.connect(url);
}

main().then(()=>console.log("Database Intialised")).catch((err)=>console.log("Error",err));

const initializeDB=async ()=>{
    await ListingModel.deleteMany({});
    const newData=initData.data.map((data)=>{
        return {...data,owner:"6820c58ba04c2309b3b7645a"};
    })
    await ListingModel.insertMany(newData);

    console.log("Data Inserted");
}
initializeDB();

