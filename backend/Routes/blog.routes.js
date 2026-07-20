const express = require("express");
const router = express.Router();

const { getPublicBlogs, getPublicBlogBySlug } = require("../controller/blog.controller");
const { getBlogBySlugSchema } = require("../validators/blog.validator");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/", generalApiLimiter, getPublicBlogs);
router.get("/:slug", generalApiLimiter, validate(getBlogBySlugSchema), getPublicBlogBySlug);

module.exports = router;