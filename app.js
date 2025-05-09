const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const listingRoute=require("./Routes/listingRoute");
const reviewRoute=require("./Routes/reviewRoute");
const sessions=require("express-session");
const flash=require("express-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const userModel=require("./Models/User.js");


app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions={
  secret:"secretCode",
  resave:false,
  saveUninitialized:true,
  Cookie:{
    expires:Date.now() +1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true
  }
};

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/nexterra");
}
main()
  .then(() => console.log("Database Initialized"))
  .catch((err) => console.log("Error", err));

app.get("/", (req, res) => {
  res.send("Hi I am Root!");
});

app.use(sessions(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

//Listing Routes fetched by Express-Routes
app.use("/listings",listingRoute);
app.use("/",reviewRoute);


// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
