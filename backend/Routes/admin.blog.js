const express = require("express");
const router = express.Router();

const {
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../Controller/blog.controller");

const {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  idParamSchema,
} = require("../validators/blog.validator");

const { isAdmin } = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.use(isAdmin);

router.get("/", generalApiLimiter, getAdminBlogs);
router.get("/:id", generalApiLimiter, validate({ params: idParamSchema }), getBlogById);
router.post("/", generalApiLimiter, validate(createBlogSchema), createBlog);
router.patch("/:id", generalApiLimiter, validate(updateBlogSchema), updateBlog);
router.delete("/:id", generalApiLimiter, validate(deleteBlogSchema), deleteBlog);

module.exports = router;