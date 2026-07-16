const express = require("express");
const router = express.Router();

const { getPublicBlogs, getPublicBlogBySlug } = require("../Controller/blog.controller");
const { getBlogBySlugSchema } = require("../validators/blog.validator");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.get("/", generalApiLimiter, getPublicBlogs);
router.get("/:slug", generalApiLimiter, validate(getBlogBySlugSchema), getPublicBlogBySlug);

module.exports = router;