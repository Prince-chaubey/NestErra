const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const ListingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        required:true,
    },
    price:Number,
    location:String,
    country:String
})


const ListingModel=mongoose.model("Listing",ListingSchema);
module.exports=ListingModel;
