const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
