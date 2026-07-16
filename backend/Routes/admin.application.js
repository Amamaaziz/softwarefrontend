const express = require("express");
const router = express.Router();

const {
  getAdminApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../Controller/application.controller");
const {
  updateApplicationSchema,
  deleteApplicationSchema,
  getApplicationByIdSchema,
} = require("../validators/application.validator");
const { isAdmin } = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.use(isAdmin);

router.get("/", generalApiLimiter, getAdminApplications);
router.get("/:id", generalApiLimiter, validate(getApplicationByIdSchema), getApplicationById);
router.patch("/:id", generalApiLimiter, validate(updateApplicationSchema), updateApplication);
router.delete("/:id", generalApiLimiter, validate(deleteApplicationSchema), deleteApplication);

module.exports = router;