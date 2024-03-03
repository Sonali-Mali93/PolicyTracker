const express = require("express");
const app = express();
const mongoose = require("mongoose");
const os = require("os");
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = require("./route/route");

app.use(express.json());
app.use("/", router);

try {
  mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
}

// CPU Utilization tracking for the main server process
setInterval(() => {
  const cpuUsage = os.loadavg()[0];
  console.log(`Main Server Process - Current CPU Usage: ${cpuUsage}%`);
  if (cpuUsage > 70) {
    console.log(
      "Main Server Process - CPU usage exceeds 70%. Restarting server..."
    );
    process.exit(); 
  }
}, 5000); 

app.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running on port", 3000);
});
