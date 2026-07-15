// Routes/portfolio.routes.js
// -----------------------------------------------------------------------------
// Wires HTTP verbs/paths to portfolio controllers, attaching the correct
// middleware stack per route following the project's request lifecycle:
//   rateLimiter → auth → (upload) → validate → controller → (errorHandler)
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  getAllPortfolios,
  getPortfolioBySlug,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../Controller/portfolio.controller");

const {
  createPortfolioSchema,
  updatePortfolioSchema,
  deletePortfolioSchema,
  getPortfolioBySlugSchema,
  getAllPortfoliosQuerySchema,
} = require("../validators/portfolio.validator");

const {
  verifyJWT,
  isAdmin,
  optionalAuth,
} = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validate.middleware");
const { uploadSingle } = require("../Middleware/upload.middleware");
const {
  generalApiLimiter,
  uploadLimiter,
} = require("../Middleware/rateLimiter.middleware");

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------
// optionalAuth attaches req.user if a token is present but never rejects. This
// lets the controller optionally widen results (e.g. include unpublished items)
// for an authenticated admin, while anonymous callers get published-only.
router.get(
  "/",
  generalApiLimiter,
  optionalAuth,
  validate(getAllPortfoliosQuerySchema),
  getAllPortfolios
);

router.get(
  "/:slug",
  generalApiLimiter,
  optionalAuth,
  validate(getPortfolioBySlugSchema),
  getPortfolioBySlug
);

// ---------------------------------------------------------------------------
// Admin writes
// ---------------------------------------------------------------------------
// Order matters: uploadSingle() runs BEFORE validate() so that multipart text
// fields are parsed onto req.body by the time Zod inspects them, and the file
// lands on req.file.
//
// NOTE on coverImage: coverImage arrives as an uploaded FILE (req.file), not a
// body text field. If createPortfolioSchema requires `coverImage` as a body
// string, either (a) drop it from the schema and let the controller set it from
// req.file.filename, or (b) inject `req.body.coverImage = req.file?.filename`
// before validate() runs. The controller is the natural place to map req.file →
// the stored path.
router.post(
  "/",
  uploadLimiter,
  verifyJWT,
  isAdmin,
  uploadSingle("coverImage"),
  validate(createPortfolioSchema),
  createPortfolio
);

router.patch(
  "/:id",
  uploadLimiter,
  verifyJWT,
  isAdmin,
  uploadSingle("coverImage"), // optional on update; controller keeps existing if no file
  validate(updatePortfolioSchema),
  updatePortfolio
);

router.delete(
  "/:id",
  generalApiLimiter,
  verifyJWT,
  isAdmin,
  validate(deletePortfolioSchema),
  deletePortfolio
);

module.exports = router;