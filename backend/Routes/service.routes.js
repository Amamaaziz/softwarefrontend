const express = require("express");
const router = express.Router();

const { getPublicServices, getPublicServiceBySlug } = require("../Controller/service.controller");
const { getServiceBySlugSchema } = require("../validators/service.validator");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.get("/", generalApiLimiter, getPublicServices);
router.get("/:slug", generalApiLimiter, validate(getServiceBySlugSchema), getPublicServiceBySlug);

module.exports = router;