// Middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");

/**
 * Security model:
 *
 * 1. Token is read from an httpOnly cookie FIRST, falling back to the
 *    Authorization header. httpOnly cookies can't be read by client-side
 *    JS, which is the main defense against token theft via XSS — this is
 *    the recommended pattern for a browser-based admin panel like yours,
 *    over localStorage (which IS readable by any injected script).
 *    The Authorization header fallback exists for non-browser clients
 *    (e.g. scripts, Postman, future mobile use) if you need it.
 *
 * 2. jwt.verify() checks both signature AND expiry — an expired or
 *    tampered token is rejected before any request handler runs.
 *
 * 3. We re-fetch nothing from the DB by default (stateless JWT) for
 *    performance, but the payload is minimal (id, role) — never put
 *    sensitive data in a JWT payload, since it's base64-encoded, NOT
 *    encrypted, and readable by anyone who has the token.
 *
 * 4. Errors are deliberately generic ("Invalid or expired session")
 *    rather than distinguishing "wrong signature" vs "expired" vs
 *    "malformed" to an attacker — that distinction is only useful to
 *    you in logs (errorHandler.middleware.js already logs err.name
 *    for JWT errors), not to the client.
 */

function extractToken(req) {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

/**
 * Verifies the JWT and attaches a minimal, trusted user object to
 * req.user. Does NOT enforce any role — use isAdmin (below) for that.
 * Use this alone on routes that just need "any authenticated request"
 * (rare in this project, but kept generic for future use).
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  // jwt.verify throws JsonWebTokenError / TokenExpiredError on failure —
  // both are already mapped to clean 401s in errorHandler.middleware.js,
  // so we don't need to catch them here; asyncHandler forwards them.
  const decoded = jwt.verify(token, env.JWT_SECRET);

  // Keep req.user minimal and trusted — only what was in the signed
  // payload, nothing pulled from the request itself.
  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
});

/**
 * Enforces that the authenticated user is an admin. Composed of
 * verifyJWT + a role check, so routes only need one middleware:
 *   router.post("/", isAdmin, createPortfolio);
 *
 * This is the middleware that portfolio.controller.js (and every other
 * admin-only controller) assumes has already run before req.user.role
 * is checked defensively inside the controller.
 */
const isAdmin = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (decoded.role !== "admin") {
    // 403, not 404 — this is a real authenticated-but-unauthorized case,
    // unlike the "hide draft existence" pattern used for public content.
    throw new ApiError(403, "Admin access required");
  }

  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
});

/**
 * Optional-auth middleware: attaches req.user if a valid token is
 * present, but does NOT reject the request if it's missing or invalid.
 * Useful for routes that behave differently for admins vs public
 * (e.g. getAllPortfolios supporting ?all=true only when authenticated
 * as admin, but still working for anonymous public requests).
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    // Invalid/expired token on an optional-auth route: treat as
    // anonymous rather than failing the request. Deliberately swallowed
    // here since failure is expected/acceptable in this specific path.
    req.user = undefined;
  }

  next();
});

module.exports = {
  verifyJWT,
  isAdmin,
  optionalAuth,
};