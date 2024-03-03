const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyNumber: { type: String },
    policyStartDate: { type: Date },
    policyEndDate: { type: Date },
    policyCategory: { type: String },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "lobSchema" },
    companyCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carrierSchema",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userSchema" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
