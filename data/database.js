const mongoose = require("mongoose");

let database; 
async function connectToDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  database = mongoose.connection; 
}

function getDb() {
  if (!database) {
    throw new Error("You must connect to the database first");
  }
 
  return database; 
}

module.exports = { connectToDatabase, getDb };
