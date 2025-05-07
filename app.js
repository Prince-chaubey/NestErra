const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const ListingModel=require("./Models/Listing.js");
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const wrapAsync=require("./utils/wrapAsync.js")


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/nexterra')
}

main().then(()=>console.log("Database Intialised")).catch((err)=>console.log("Error",err));

app.get("/",(req,res)=>{
   res.send("Hii I am Root!");
})

//Index Route to show the all listings at once
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await ListingModel.find({});
    res.render("AllListings.ejs",{allListings});  


}))
//Route to show form to add new List
app.get("/listings/new",(req,res)=>{
    res.render("newListing.ejs");
})

//Route to save new Listing into Existing Listings
app.post("/listings/new",wrapAsync(async(req,res)=>{
      
    const {title,image,description,price,location,country}=req.body;
    const newListing=new ListingModel({
        title,
        description,
        image,
        price,
        location,
        country
    })
    await newListing.save();
    res.redirect("/listings");

}))

//Read Route to show a particular Listing
app.get("/listings/:id",wrapAsync(async(req,res)=>{
     
    const id=req.params.id;
    const list= await ListingModel.findById(id);
    res.render("show.ejs",{list});
  
}))


//Delete Route to delete a single Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
            
    const id=req.params.id;
    await ListingModel.findByIdAndDelete(id);
    res.redirect("/listings");


}))
//Route to save updates
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    const id=req.params.id;
    const {title,description,image,price,location,country}=req.body;
    
     await ListingModel.findByIdAndUpdate(id,{
        title,
        description,
        image,
        price,
        location,
        country
     },{new:true});
     res.redirect(`/listings/${id}`);
}))

//Route to show Edit form
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
         
    const id=req.params.id;
    const list=await ListingModel.findById(id);
    res.render("edit.ejs",{list});

}))

app.use((err,res,req,next)=>{
    res.send("Something went wrong!");
    next();
})

app.listen(8080,()=>{
    console.log("Everything is running on port 8080");
});

