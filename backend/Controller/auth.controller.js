// Controller/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");

/**
 * Single admin account, now backed by the `users` table in Postgres
 * instead of .env values. There is still no roles table — every row in
 * `users` is implicitly "admin", so the token payload hardcodes
 * role: "admin" rather than reading a column that doesn't exist.
 *
 * DUMMY_PASSWORD_HASH in .env is still used below as a timing-attack
 * decoy when the email doesn't match any user.
 */

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory store mapping refresh token hash -> expiry, so refresh tokens
// can be invalidated on logout even though JWTs are normally stateless.
// Resets on server restart — fine for a single-process app; move to
// Redis/DB if you ever run multiple instances.
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

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAgeMs,
    path: "/",
  };
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Looks up the user by email in Postgres. Always runs bcrypt.compare
 * against SOME hash — the user's real hash if found, DUMMY_PASSWORD_HASH
 * otherwise — so response timing never reveals whether an email exists.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  const hashToCompare = user?.passwordHash || env.DUMMY_PASSWORD_HASH;
  const passwordMatches = await bcrypt.compare(String(password), hashToCompare);

  if (!user || !user.isActive || !passwordMatches) {
    throw new ApiError(401, "Invalid credentials");
  }

  const tokenUser = { id: user.id, role: "admin" };

  const accessToken = generateAccessToken(tokenUser);
  const refreshToken = generateRefreshToken(tokenUser);

  res
    .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
    .cookie("refreshToken", refreshToken, cookieOptions(REFRESH_TOKEN_EXPIRY_MS))
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { id: user.id, name: user.name, email: user.email, role: "admin" } },
        "Logged in successfully"
      )
    );
});

/**
 * POST /api/auth/refresh
 * Unchanged from before — operates purely on the JWT/cookie layer,
 * never touched the admin's identity source directly.
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
 * Unchanged — clears cookies and revokes the refresh token server-side.
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
 * Now checks the database instead of trusting the JWT payload alone —
 * confirms the user still exists and is active before responding.
 */
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !user.isActive) throw new ApiError(401, "Not authenticated");

  return res.status(200).json(
    new ApiResponse(200, { user: { id: user.id, name: user.name, email: user.email, role: "admin" } })
  );
});

module.exports = {
  login,
  refresh,
  logout,
  getMe,
};