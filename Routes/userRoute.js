const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middlewares/middlewares");
const userController = require("../Controllers/userController");

// Signup
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signupUser);

// Login
router.get("/login", userController.renderLoginForm);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
);

// Logout
router.get("/logout", isLoggedIn, userController.logoutUser);

module.exports = router;
