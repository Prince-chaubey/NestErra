const userModel = require("../Models/UserModel");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("signup.ejs");
};

// Signup logic
module.exports.signupUser = async (req, res, next) => {
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
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("login.ejs");
};

// Login logic (after passport.authenticate)
module.exports.loginUser = (req, res) => {
  req.flash(
    "success",
    `Welcome to NextErra @${req.user.username}, You are logged in!`
  );
  res.redirect(res.locals.redirectURL);
};

// Logout user
module.exports.logoutUser = (req, res, next) => {
  const username = req.user.username;
  req.logout((err) => {
    if (err) return next(err);
    req.flash("error", `@${username} You are logged out!`);
    res.redirect("/listings");
  });
};
