// Routes/portfolio.routes.js
// -----------------------------------------------------------------------------
// Wires HTTP verbs/paths to portfolio controllers, attaching the correct
// middleware stack per route following the project's request lifecycle:
//   rateLimiter → auth → validate → controller → (errorHandler)
//
// NOTE: coverImage is a plain URL string submitted by ImageUploader.jsx (no
// file upload involved), so this route file does NOT use uploadSingle/
// uploadLimiter — that was leftover from an earlier file-upload design and
// never matched what the frontend actually sends.
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  getAllPortfolios,
  getPortfolioBySlug,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controller/portfolio.controller");

const {
  createPortfolioSchema,
  updatePortfolioSchema,
  deletePortfolioSchema,
  getPortfolioBySlugSchema,
  getAllPortfoliosQuerySchema,
  idParamSchema,
} = require("../validators/portfolio.validator");

const {
  verifyJWT,
  isAdmin,
  optionalAuth,
} = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter } = require("../middleware/rateLimiter.middleware");

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

// Admin-only id-based lookup, used by PortfolioForm.jsx's edit page.
// Placed BEFORE "/:slug" so "id" isn't swallowed as a slug value.
router.get(
  "/id/:id",
  generalApiLimiter,
  verifyJWT,
  isAdmin,
  validate({ params: idParamSchema }),
  getPortfolioById
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
router.post(
  "/",
  generalApiLimiter,
  verifyJWT,
  isAdmin,
  validate(createPortfolioSchema),
  createPortfolio
);

router.patch(
  "/:id",
  generalApiLimiter,
  verifyJWT,
  isAdmin,
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