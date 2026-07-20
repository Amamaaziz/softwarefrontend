const express = require("express");
const router = express.Router();

const { getPublicJobs, getPublicJobBySlug, } = require("../controller/job.controller");
const { submitApplication } = require("../controller/application.controller");
const { getJobBySlugSchema } = require("../validators/job.validator");
const { submitApplicationSchema } = require("../validators/application.validator");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter, publicWriteLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/", generalApiLimiter, getPublicJobs);
router.get("/:slug", generalApiLimiter, validate(getJobBySlugSchema), getPublicJobBySlug);

module.exports = router;

// Application submission is mounted separately at /applications in
// Routes/index.js — see below — since it's not nested under /jobs.
module.exports.submitApplicationHandlers = [
  publicWriteLimiter,
  validate(submitApplicationSchema),
  submitApplication,
];