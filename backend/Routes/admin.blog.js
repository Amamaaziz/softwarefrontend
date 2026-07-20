const express = require("express");
const router = express.Router();

const {
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog.controller");

const {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  idParamSchema,
} = require("../validators/blog.validator");

const { isAdmin } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter } = require("../middleware/rateLimiter.middleware");

router.use(isAdmin);

router.get("/", generalApiLimiter, getAdminBlogs);
router.get("/:id", generalApiLimiter, validate({ params: idParamSchema }), getBlogById);
router.post("/", generalApiLimiter, validate(createBlogSchema), createBlog);
router.patch("/:id", generalApiLimiter, validate(updateBlogSchema), updateBlog);
router.delete("/:id", generalApiLimiter, validate(deleteBlogSchema), deleteBlog);

module.exports = router;