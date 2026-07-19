const express = require("express");
const router = express.Router();

const { getAdminJobs, getJobById, createJob, updateJob, deleteJob } = require("../Controller/job.controller");
const { createJobSchema, updateJobSchema, deleteJobSchema, getJobByIdSchema } = require("../validators/job.validator");
const { verifyJWT, isAdmin } = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.use(verifyJWT, isAdmin);

router.get("/", generalApiLimiter, getAdminJobs);
router.get("/:id", generalApiLimiter, validate(getJobByIdSchema), getJobById);
router.post("/", generalApiLimiter, validate(createJobSchema), createJob);
router.patch("/:id", generalApiLimiter, validate(updateJobSchema), updateJob);
router.delete("/:id", generalApiLimiter, validate(deleteJobSchema), deleteJob);

module.exports = router;