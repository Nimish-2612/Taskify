const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
    
function createSessionStore() {
  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });
  store.on("error", function (error) {
    console.error("Session store error:", error);
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
  };
}

module.exports = createSessionConfig;
