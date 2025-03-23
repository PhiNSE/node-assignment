const mongoose = require("mongoose");

const userRolesSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userRolesModel = mongoose.model("user_roles", userRolesSchema);
module.exports = userRolesModel;
