const mongoose = require("mongoose");

const lobSchema = new mongoose.Schema(
  {
    categoryName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lob", lobSchema);
