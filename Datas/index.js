const mongoose=require("mongoose");
const initData=require("./Data.js");
const ListingModel=require("../Models/Listing.js");

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/nexterra')
}

main().then(()=>console.log("Database Intialised")).catch((err)=>console.log("Error",err));

const initializeDB=async ()=>{
    await ListingModel.deleteMany({});
    const newData=initData.data.map((data)=>{
        return {...data,owner:"681e5f033ca3c8ccc4adbeaf"};
    })
    await ListingModel.insertMany(newData);

    console.log("Data Inserted");
}
initializeDB();

