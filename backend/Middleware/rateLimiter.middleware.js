// Middleware/rateLimiter.middleware.js

const rateLimit = require("express-rate-limit");
const ApiError = require("../utils/ApiError");
const logger = require("../lib/logger");

/**
 * Multiple rate limiter tiers, applied per-route based on sensitivity —
 * not a single global limiter. Reasoning:
 *
 * - Auth routes (login) are the highest-value target for brute force /
 *   credential stuffing, so they get the strictest limit, keyed by IP.
 * - Public write endpoints (lead/application submissions — anyone can
 *   POST these without auth) need a moderate limit to prevent spam/abuse
 *   without blocking legitimate visitors.
 * - General API reads get a generous limit — mostly a DoS backstop, not
 *   meant to affect normal usage.
 *
 * All limiters share a consistent error response shape (via ApiError)
 * so the frontend doesn't need special-case handling for 429s.
 */

// Shared handler: converts express-rate-limit's default response into
// our standard ApiError JSON shape, and logs the event — repeated 429s
// from the same IP are a useful signal worth watching in production.
function rateLimitHandler(req, res, next, options) {
  logger.warn("Rate limit exceeded", {
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
  });

  const err = new ApiError(
    429,
    options.message || "Too many requests, please try again later"
  );

  res.status(429).json({
    success: false,
    statusCode: 429,
    message: err.message,
    errors: [],
  });
}

/**
 * Strict limiter for authentication routes (login, refresh).
 * 5 attempts per 15 minutes per IP — tight enough to blunt brute force
 * / credential stuffing, loose enough that a real user mistyping their
 * password a couple times doesn't get locked out.
 *
 * skipSuccessfulRequests: true means only FAILED login attempts count
 * toward the limit — a legitimately logged-in admin refreshing tokens
 * repeatedly won't get throttled, only repeated failures will.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true, // adds RateLimit-* headers so clients can back off gracefully
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again in 15 minutes.",
  handler: rateLimitHandler,
});

/**
 * Moderate limiter for public unauthenticated write endpoints — lead
 * submissions, job applications, contact forms. Prevents scripted spam
 * without requiring auth (these routes are intentionally public).
 */
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many submissions from this address. Please try again later.",
  handler: rateLimitHandler,
});

/**
 * General-purpose limiter for the wider API (public GET routes: portfolio,
 * blog, services, testimonials). Generous — this is a DoS backstop, not
 * meant to be felt by normal browsing/traffic.
 */
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please slow down.",
  handler: rateLimitHandler,
});

/**
 * Tighter limiter specifically for file upload endpoints — uploads are
 * comparatively expensive (disk I/O, magic-number verification), so a
 * looser general limit isn't appropriate here.
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many upload requests. Please try again later.",
  handler: rateLimitHandler,
});

module.exports = {
  authLimiter,
  publicWriteLimiter,
  generalApiLimiter,
  uploadLimiter,
};