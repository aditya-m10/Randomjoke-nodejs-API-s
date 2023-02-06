const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  isLogged: {
    type: Boolean,
    default: false,
    required: true,
  },
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
