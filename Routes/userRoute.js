const express = require("express");
const router = express.Router();
const userModel = require("../Models/UserModel");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new userModel({ email, username });

    try {
        await userModel.register(newUser, password);
        console.log("Registered");
        req.flash("success", `${username}, welcome to NextErra!`);
        res.redirect("/"); // Redirect after signup
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("login.ejs");
})

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),
async(req,res)=>{
    res.flash("success",`Welcome to NextErra! You are logged in!`);
}
);

module.exports = router;
