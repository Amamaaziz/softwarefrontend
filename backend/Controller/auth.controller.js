// Controller/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");

/**
 * Single hardcoded admin account model.
 *
 * Critical security point: "hardcoded" does NOT mean the password is a
 * plaintext string sitting in this file or in git. The email and a
 * bcrypt HASH of the password live in environment variables (.env,
 * never committed — confirm .gitignore covers it). This file only ever
 * compares against the hash, never stores or logs the raw password.
 *
 * To generate the hash once, run in a Node REPL or a one-off script:
 *   const bcrypt = require("bcryptjs");
 *   bcrypt.hashSync("your-real-password", 12);
 * Then put the output in ADMIN_PASSWORD_HASH in .env.
 *
 * This structure also means moving to a real multi-admin DB table later
 * only requires changing where these two values come from — the rest of
 * this controller (JWT issuance, cookie handling) stays identical.
 */

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory store mapping refresh token hash -> expiry, so refresh tokens
// can be invalidated on logout even though JWTs are normally stateless.
// NOTE: this resets on server restart and won't scale across multiple
// instances — fine for a single-admin app on one process, but if you
// deploy with multiple instances/replicas later, move this to Redis or
// a DB table. Flagging now so it's not a surprise later.
const activeRefreshTokens = new Map(); // tokenHash -> expiresAt

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id, tokenId: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  activeRefreshTokens.set(hashToken(token), Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  return token;
}

// Cookie options shared by both tokens. secure:true means the cookie is
// only ever sent over HTTPS — this MUST stay true in production; if
// you're testing locally over plain http, NODE_ENV won't be "production"
// so this correctly relaxes only in dev.
function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true, // inaccessible to client-side JS — primary XSS mitigation
    secure: env.NODE_ENV === "production",
    sameSite: "strict", // blocks the cookie being sent on cross-site requests (CSRF mitigation)
    maxAge: maxAgeMs,
    path: "/",
  };
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Deliberately generic error message ("Invalid credentials") for both
 * "email doesn't match" and "password doesn't match" cases — never
 * reveal which one was wrong, since that lets an attacker enumerate
 * valid emails.
 *
 * Rate limiting on this route is handled at the route level via
 * rateLimiter.middleware.js (a stricter limiter than the general API
 * limiter) — this controller doesn't rate-limit itself, since that's a
 * cross-cutting concern that belongs in middleware, not business logic.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Constant-time-safe comparison happens via bcrypt.compare regardless
  // of whether the email matches, to avoid timing differences that could
  // leak whether an email is valid. We always run bcrypt.compare against
  // SOME hash, even on email mismatch, using a dummy hash as a decoy.
  const emailMatches = normalizedEmail === env.ADMIN_EMAIL.toLowerCase();
  const hashToCompare = emailMatches ? env.ADMIN_PASSWORD_HASH : env.DUMMY_PASSWORD_HASH;

  const passwordMatches = await bcrypt.compare(String(password), hashToCompare);

  if (!emailMatches || !passwordMatches) {
    throw new ApiError(401, "Invalid credentials");
  }

  const user = { id: "admin", role: "admin" };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res
    .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
    .cookie("refreshToken", refreshToken, cookieOptions(REFRESH_TOKEN_EXPIRY_MS))
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { id: user.id, role: user.role } }, // never return tokens in the body — cookies only
        "Logged in successfully"
      )
    );
});

/**
 * POST /api/auth/refresh
 * Reads refreshToken from cookie, issues a new accessToken (and rotates
 * the refresh token — "refresh token rotation" limits the damage window
 * if a refresh token is ever stolen, since each one is single-use).
 */
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const tokenHash = hashToken(token);
  const storedExpiry = activeRefreshTokens.get(tokenHash);

  if (!storedExpiry || storedExpiry < Date.now()) {
    throw new ApiError(401, "Refresh token has been revoked or expired");
  }

  // Rotate: invalidate the old refresh token immediately, issue a new one.
  activeRefreshTokens.delete(tokenHash);

  const user = { id: decoded.id, role: "admin" };
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res
    .cookie("accessToken", newAccessToken, cookieOptions(15 * 60 * 1000))
    .cookie("refreshToken", newRefreshToken, cookieOptions(REFRESH_TOKEN_EXPIRY_MS))
    .status(200)
    .json(new ApiResponse(200, null, "Token refreshed"));
});

/**
 * POST /api/auth/logout
 * Clears cookies AND revokes the refresh token server-side, so a stolen
 * refresh token can't be used again even after "logout" — clearing the
 * cookie alone only affects this browser, not a copied token.
 */
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    activeRefreshTokens.delete(hashToken(token));
  }

  res
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: "/" })
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated admin's identity. Requires
 * isAdmin/verifyJWT middleware to have already run (req.user populated).
 * Useful for the admin panel to check session validity on app load.
 */
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  return res.status(200).json(new ApiResponse(200, { user: req.user }));
});

module.exports = {
  login,
  refresh,
  logout,
  getMe,
};