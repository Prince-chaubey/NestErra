const express = require("express");
const router = express.Router();
const passport = require("passport");
const userModel = require("../Models/UserModel");
const { isLoggedIn, saveRedirectUrl } = require("../middlewares/middlewares");

// Signup form
router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Signup logic
router.post("/signup", async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new userModel({ email, username });

    try {
        const registeredUser = await userModel.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `${username}, welcome to NextErra!`);
            res.redirect("/login");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// Login form
router.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Login logic
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", `Welcome to NextErra @${req.user.username}, You are logged in!`);
        res.redirect(res.locals.redirectURL);
    }
);

// Logout
router.get("/logout", isLoggedIn, (req, res, next) => {
    const username = req.user.username;
    req.logout((err) => {
        if (err) return next(err);
        req.flash("error", `@${username} You are logged out!`);
        res.redirect("/listings");
    });
});

module.exports = router;
