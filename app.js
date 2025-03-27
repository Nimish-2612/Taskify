const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
require("./util/facebook-authentication"); // Facebook strategy config
const db = require("./data/database");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const todosRoutes = require("./routes/todos-routes");
const calendarRoutes = require("./routes/calendar.routes")
// const protectRoutesMiddleware =require('./middlewares/protect-routes');

const createSessionConfig = require("./config/session");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs"); //set some options for express application
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

// Session configuration
app.use(session(createSessionConfig()));

// Initialize Passport and use sessions for persistent login
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check login status for views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Routes

app.use(baseRoutes);
app.use(authRoutes);
app.use(todosRoutes,protectRoutesMiddleware);
app.use(calendarRoutes,protectRoutesMiddleware);


try{

db.connectToDatabase()
  .then(function () {
    app.listen(5000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database");
    console.log(error);
  });
}catch(error){
  return (error);
}