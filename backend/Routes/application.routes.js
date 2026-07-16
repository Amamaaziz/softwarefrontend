const express = require("express");
const router = express.Router();

const { submitApplication } = require("../Controller/application.controller");
const { submitApplicationSchema } = require("../validators/application.validator");
const validate = require("../Middleware/validate.middleware");
const { publicWriteLimiter } = require("../Middleware/rateLimiter.middleware");
const { uploadResume } = require("../utils/upload");

router.post(
  "/",
  publicWriteLimiter,
  uploadResume.single("resume"),
  validate(submitApplicationSchema),
  submitApplication
);

module.exports = router;