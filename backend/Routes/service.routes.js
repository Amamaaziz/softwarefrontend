const express = require("express");
const router = express.Router();

const { getPublicServices, getPublicServiceBySlug } = require("../controller/service.controller");
const { getServiceBySlugSchema } = require("../validators/service.validator");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/", generalApiLimiter, getPublicServices);
router.get("/:slug", generalApiLimiter, validate(getServiceBySlugSchema), getPublicServiceBySlug);

module.exports = router;