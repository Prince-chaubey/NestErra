const express = require("express");
const router = express.Router();
const userModel = require("../Models/UserModel");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middlewares/middlewares");

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new userModel({ email, username });

    try {
        const registeredUser=await userModel.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err) next(err);
            req.flash("success", `${username}, welcome to NextErra!`);
            res.redirect("/");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),
async(req,res)=>{
    req.flash("success",`Welcome to NextErra @${req.user.username} You are logged in!`);
    res.redirect(res.locals.redirectURL);
}
);

router.get("/logout",
    isLoggedIn,
    (req,res)=>{
    const username=req.user.username;
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("error",`@${username} You are logged out !`);
        res.redirect("/listings");
    })
})

module.exports = router;
