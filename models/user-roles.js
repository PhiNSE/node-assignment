const mongoose = require("mongoose");

const userRolesSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
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
