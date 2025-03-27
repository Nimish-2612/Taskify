const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");
const validation = require("../util/validation");
const passport = require("passport");

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("auth/login", { inputData: sessionData });
}

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
    };
  }
  res.render("auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please Check your input, Password must be atleast 8 characters long, Postal code must be 6 characters long",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
  }

  const user = new User(req.body.email, req.body.password, req.body.fullname);

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try Logging in instead!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "Invalid Credentials - please check your email and Password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      return res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      return res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    return res.redirect("/dashboard");
  });
}

function logout(req,res){
  authUtil.destroyUserAuthSession(req);
  res.redirect('/');
}



module.exports = {
  getLogin: getLogin,
  getSignup: getSignup,
  signup: signup,
  login: login,
  logout:logout,
};
