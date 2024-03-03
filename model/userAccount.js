const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema(
  {
    accountName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAccount", userAccountSchema);
