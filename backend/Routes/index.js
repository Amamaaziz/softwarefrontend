const express = require("express");
const router = express.Router();

const portfolioRoutes = require("./portfolio.routes");
const authRoutes = require("./auth.routes");

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
router.use("/leads", require("./lead.routes"));
router.use("/admin/leads", require("./admin.leads"));

module.exports = router;