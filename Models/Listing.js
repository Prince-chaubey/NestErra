const mongoose=require("mongoose");
const Review = require("./Review");
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
    country:String,
    reviews:[
       {
         type:Schema.Types.ObjectId,
         ref:"Review",
       }
    ]
    ,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})


const ListingModel=mongoose.model("Listing",ListingSchema);
module.exports=ListingModel;
