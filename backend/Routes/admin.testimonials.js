const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/auth.middleware");
const {
  listTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  publishTestimonial,
  deleteTestimonial,
} = require("../controller/testimonial.controller");

router.use(isAdmin);
router.get("/", listTestimonials);
router.get("/:id", getTestimonial);
router.post("/", createTestimonial);
router.patch("/:id", updateTestimonial);
router.patch("/:id/publish", publishTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
