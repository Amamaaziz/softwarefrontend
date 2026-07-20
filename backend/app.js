// app.js
// -----------------------------------------------------------------------------
// Assembles the Express application. Middleware order is deliberate — the last
// two entries (notFound, then errorHandler) MUST stay last.
// -----------------------------------------------------------------------------

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");

const config = require("./config/env");
const logger = require("./lib/logger");
const requestLogger = logger.requestLogger;
const routes = require("./Routes");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/errorHandler.middleware");

const app = express();

// --- Proxy trust -----------------------------------------------------------
app.set("trust proxy", 1);

// --- Security headers --------------------------------------------------
app.use(
  helmet({
    // crossOriginResourcePolicy relaxed so /uploads images can be loaded
    // by your frontend on a different origin/port.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// --- Compression -------------------------------------------------------
app.use(compression());

// --- CORS ------------------------------------------------------------------
if (config.isProd && config.corsOrigins.length === 0) {
  logger.warn(
    "CORS_ORIGINS is empty in production — all cross-origin requests will be allowed. Set CORS_ORIGINS to lock this down."
  );
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (config.corsOrigins.length === 0) return callback(null, true);
    if (config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --- Rate limiting -------------------------------------------------------
// Global: generous ceiling to absorb normal traffic, blocks scraping/abuse.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1", globalLimiter);

// Tighter limiter for auth — brute-force protection on login.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});
app.use("/api/v1/auth/login", authLimiter);

// Contact form / lead submission — prevent spam floods.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Please try again later." },
});
app.use("/api/v1/leads", contactLimiter);

// --- Body & cookie parsing -------------------------------------------------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// --- Request logging -------------------------------------------------------
app.use(requestLogger);

// --- Static uploads --------------------------------------------------------
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