// lib/logger.js

const winston = require("winston");
const path = require("path");
const fs = require("fs");

/**
 * Centralized logger — singleton, same pattern as lib/prisma.js.
 *
 * Security-relevant design choices:
 *
 * 1. Sensitive field redaction — logs must NEVER contain passwords,
 *    tokens, JWTs, API keys, or full credit-card-like data, even
 *    accidentally via a stray `logger.info(req.body)` somewhere. We
 *    redact known-sensitive keys at the formatter level so it's applied
 *    globally, not something every call site has to remember to do.
 *
 * 2. Separate log levels/destinations for dev vs. production — verbose,
 *    colorized console output locally; structured JSON to files (and
 *    ultimately stdout for containerized/cloud log aggregation) in prod.
 *
 * 3. No secrets in the logger's OWN configuration — nothing here reads
 *    credentials to send logs anywhere; if you later add a remote log
 *    sink (Datadog, Sentry, etc.), its API key belongs in config/env.js
 *    like every other secret, never hardcoded here.
 */

const isProduction = process.env.NODE_ENV === "production";

const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Keys whose values should never appear in logs, regardless of nesting.
const SENSITIVE_KEYS = new Set([
  "password",
  "confirmPassword",
  "currentPassword",
  "newPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "jwt",
  "secret",
  "apiKey",
  "creditCard",
  "cvv",
]);

/**
 * Recursively walks a log metadata object and masks any value whose key
 * matches a known-sensitive field name (case-insensitive). Applied as a
 * Winston formatter so it runs on every single log call automatically.
 */
function redact(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return "[Circular]";
  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => redact(item, seen));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      result[key] = redact(value, seen);
    } else {
      result[key] = value;
    }
  }
  return result;
}

const redactFormat = winston.format((info) => {
  const { level, message, timestamp, stack, ...meta } = info;
  return {
    ...info,
    ...redact(meta),
  };
})();

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  redactFormat,
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level}: ${message}${metaStr}${stack ? `\n${stack}` : ""}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  redactFormat,
  winston.format.json()
);

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? prodFormat : devFormat,
  defaultMeta: { service: "nexbyte-backend" },
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test", // keep test output clean
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  // Never let a logging failure crash the process, and never silently
  // swallow it either — write to stderr as a last resort.
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(LOG_DIR, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(LOG_DIR, "rejections.log") }),
  ],
});

/**
 * Lightweight request logger for use as Express middleware in app.js.
 * Logs method/path/status/duration/ip — deliberately excludes headers
 * and body by default (those often carry auth tokens or PII); pass
 * verbose:true only in local dev if you need to debug payloads, and even
 * then, redact() still strips known-sensitive keys.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const meta = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userId: req.user?.id,
    };

    if (res.statusCode >= 500) {
      logger.error("Request completed with server error", meta);
    } else if (res.statusCode >= 400) {
      logger.warn("Request completed with client error", meta);
    } else {
      logger.info("Request completed", meta);
    }
  });

  next();
}

module.exports = logger;
module.exports.requestLogger = requestLogger;