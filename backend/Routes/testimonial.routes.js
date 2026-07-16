const express = require("express");
const router = express.Router();
const { getPublicTestimonials } = require("../controller/testimonial.controller");

router.get("/", getPublicTestimonials);

module.exports = router;