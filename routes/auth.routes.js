const express = require("express");
const passport = require("passport");
const authController = require("../controller/auth.controller");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login-failed",
  })
);

router.get("/auth/login-failed", (req, res) => {
  res.send(
    "<h1>Facebook Login Failed</h1><a href='/auth/facebook'>Try again</a>"
  );
});

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((error) => {
      if (error) {
        console.log("Error destroying session:", error);
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.redirect("/"); // Redirect to home or login page after logout
    });
  });
});

module.exports = router;
