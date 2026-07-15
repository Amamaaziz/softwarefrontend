// app.js
// -----------------------------------------------------------------------------
// Assembles the Express application. Middleware order is deliberate — the last
// two entries (notFound, then errorHandler) MUST stay last.
// -----------------------------------------------------------------------------

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const config = require("./config/env");
const logger = require("./lib/logger");                      
const requestLogger = logger.requestLogger;   // ← ADD THIS LINE
const routes = require("./Routes");
const notFound = require("./Middleware/notFound.middleware");
const errorHandler = require("./Middleware/errorHandler.middleware");

const app = express();

// --- Proxy trust -----------------------------------------------------------
// Required so express-rate-limit sees the real client IP and secure cookies
// work when running behind a reverse proxy (Nginx, Render, Railway, etc.).
// If you are NOT behind a proxy, set this to false to avoid IP spoofing.
app.set("trust proxy", 1);

// --- CORS ------------------------------------------------------------------
// Origins come from CORS_ORIGINS in env so your two frontends + admin subdomain
// can all be allowlisted without code changes. credentials:true is mandatory
// because auth uses httpOnly cookies.
if (config.isProd && config.corsOrigins.length === 0) {
  logger.warn(
    "CORS_ORIGINS is empty in production — all cross-origin requests will be allowed. Set CORS_ORIGINS to lock this down."
  );
}

const corsOptions = {
  origin(origin, callback) {
    // No Origin header = same-origin, curl, or server-to-server → allow.
    if (!origin) return callback(null, true);
    // Empty allowlist → allow all (convenient in dev; warned about in prod above).
    if (config.corsOrigins.length === 0) return callback(null, true);
    if (config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --- Body & cookie parsing -------------------------------------------------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// --- Request logging -------------------------------------------------------
app.use(requestLogger);

// --- Static uploads --------------------------------------------------------
// Files written by upload.middleware.js are served read-only from /uploads.
app.use(
  "/uploads",
  express.static(path.join(__dirname, config.UPLOAD_DIR), {
    index: false,
    dotfiles: "ignore",
  })
);

// --- API routes ------------------------------------------------------------
app.use("/api/v1", routes);

// --- 404 + centralized error handling (MUST be last) -----------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;