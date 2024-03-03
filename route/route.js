const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const controller = require("../controller/controller");
const router = express.Router();

router.post("/", upload.single("file"), controller.uploadCsv);
router.get("/search/policy/:username", controller.serachPolicyByUsername);
router.get("/aggregated-policies", controller.aggregatedPoliciesByUser);
router.post("/schedule-message", controller.scheduleMessage);

module.exports = router;
