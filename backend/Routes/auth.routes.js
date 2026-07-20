// Routes/auth.routes.js
// -----------------------------------------------------------------------------
// Auth endpoints for the single hardcoded admin. Included here because you need
// login → access token before you can exercise the admin-only portfolio writes
// during end-to-end testing.
//
// authLimiter (5/15min) guards login/refresh against brute force.
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  login,
  refresh,
  logout,
  getMe,
} = require("../controller/auth.controller");
const { verifyJWT } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter.middleware");

// If you add validators/auth.validator.js with a loginSchema, wire it in:
// const validate = require("../Middleware/validate.middleware");
// const { loginSchema } = require("../validators/auth.validator");

router.post("/login", authLimiter, /* validate(loginSchema), */ login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);
router.get("/me", verifyJWT, getMe);

module.exports = router;