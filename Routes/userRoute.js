const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middlewares/middlewares");
const userController = require("../Controllers/userController");

// Signup functions
router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signupUser);


// Login functions
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
);


// Logout
router.route("/logout").get(isLoggedIn, userController.logoutUser);

module.exports = router;
