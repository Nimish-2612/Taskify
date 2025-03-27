const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  facebookId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  profilePicture: { type: String },
});

module.exports = mongoose.model("User", userSchema);
