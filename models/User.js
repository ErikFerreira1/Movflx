const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  favorites: [{type: Number}]
});

module.exports = User;
