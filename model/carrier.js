const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    companyName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carrier", carrierSchema);
