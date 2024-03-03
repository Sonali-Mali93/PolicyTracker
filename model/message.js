const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: String,
  day: Date,
  time: Date,
});

module.exports = mongoose.model("Message", messageSchema);
