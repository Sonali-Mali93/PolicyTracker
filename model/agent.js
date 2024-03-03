const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    agentname: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("agent", agentSchema);
