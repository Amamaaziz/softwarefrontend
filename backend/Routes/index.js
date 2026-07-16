// Routes/index.js
// -----------------------------------------------------------------------------
// Central router: mounts every resource router under one place. app.js mounts
// this whole thing under a version prefix (e.g. /api/v1).
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const portfolioRoutes = require("./portfolio.routes");
const authRoutes = require("./auth.routes");

// Cheap liveness endpoint for load balancers / uptime monitors.
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

router.use("/auth", authRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/services", require("./service.routes"));
router.use("/admin/services", require("./admin.service"));
router.use("/blogs", require("./blog.routes"));
router.use("/admin/blogs", require("./admin.blog"));
router.use("/jobs", require("./job.routes"));
router.use("/applications", require("./application.routes"));
router.use("/admin/jobs", require("./admin.job"));
router.use("/admin/applications", require("./admin.application"));

// As you replicate the pattern for the remaining resources, mount them here:
// router.use("/services", require("./service.routes"));
// router.use("/blogs", require("./blog.routes"));
// router.use("/testimonials", require("./testimonial.routes"));
// router.use("/jobs", require("./job.routes"));
// router.use("/applications", require("./application.routes"));
// router.use("/leads", require("./lead.routes"));

module.exports = router;