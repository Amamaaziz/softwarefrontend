const express = require("express");
const router = express.Router();

const { submitApplication } = require("../controller/application.controller");
const { submitApplicationSchema } = require("../validators/application.validator");
const validate = require("../middleware/validate.middleware");
const { publicWriteLimiter } = require("../middleware/rateLimiter.middleware");
const { uploadResume } = require("../utils/upload");
const { pushResumeToCloudinary } = require("../middleware/cloudinaryResume.middleware");

router.post(
  "/",
  publicWriteLimiter,
  uploadResume.single("resume"),
  pushResumeToCloudinary,
  validate(submitApplicationSchema),
  submitApplication
);

module.exports = router;