const mongoose = require("mongoose");
const emailRegexConstant = require("../constant/email-regex.constant");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validator: (value) => {
        return emailRegexConstant.test(value);
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_roles",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
