// Middleware/errorHandler.middleware.js

const { Prisma } = require("@prisma/client");
const ApiError = require("../utils/ApiError");
const logger = require("../lib/logger");

/**
 * Central error handler — the last line of defense before a response
 * leaves the server. Its job is twofold:
 *
 * 1. NEVER leak internals to the client: stack traces, Prisma error
 *    metadata, file paths, SQL, library-specific error shapes. An
 *    attacker probing your API should learn nothing from an error
 *    response beyond "here's what went wrong, generically."
 * 2. ALWAYS log the full detail server-side, so you (not the client)
 *    get the diagnostic information needed to actually debug it.
 *
 * This must be registered LAST in app.js, after all routes and other
 * middleware — Express identifies error-handling middleware by arity
 * (4 params: err, req, res, next), so the signature below is required
 * exactly as-is even though `next` is unused.
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Translates known third-party/library error types into a consistent
 * ApiError shape. Anything not recognized falls through to a generic
 * 500. This is the ONLY place in the app that should know about Prisma's
 * or Multer's specific error formats — controllers should never have to.
 */
function normalizeError(err) {
  if (err instanceof ApiError) {
    return err;
  }

  // Prisma known request errors (unique constraint violations, not found
  // on required relation, foreign key violations, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = Array.isArray(err.meta?.target)
          ? err.meta.target.join(", ")
          : err.meta?.target || "field";
        return new ApiError(409, `A record with this ${target} already exists`);
      }
      case "P2025":
        return new ApiError(404, "Record not found");
      case "P2003":
        return new ApiError(400, "Invalid reference to a related record");
      default:
        // Unmapped Prisma error code — don't guess, just treat as internal
        // and log the code so it can be added to this switch later.
        logger.warn(`Unhandled Prisma error code: ${err.code}`);
        return new ApiError(500, "A database error occurred");
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // This means the app sent Prisma a malformed query — a bug, not a
    // client input problem (input should have been caught by Zod first).
    return new ApiError(500, "A database error occurred");
  }

  // JWT errors (jsonwebtoken library) — thrown by auth.middleware.js
  if (err.name === "JsonWebTokenError") {
    return new ApiError(401, "Invalid authentication token");
  }
  if (err.name === "TokenExpiredError") {
    return new ApiError(401, "Authentication token has expired");
  }

  // Malformed JSON body (express.json() throws a SyntaxError with a
  // `body` property set when it fails to parse the request payload)
  if (err instanceof SyntaxError && "body" in err) {
    return new ApiError(400, "Malformed JSON in request body");
  }

  // Payload too large (express.json({ limit }) / raw body parser)
  if (err.type === "entity.too.large") {
    return new ApiError(413, "Request payload too large");
  }

  // Fallback: unknown/unexpected error — never expose err.message to the
  // client here, since it could be anything (DB connection strings, file
  // paths, third-party lib internals).
  return new ApiError(500, "Internal server error");
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);

  // Log full detail server-side regardless of what we send the client.
  // isOperational=false (or absent, for non-ApiError errors) means this
  // was NOT an intentionally-thrown, expected error — log it as an error
  // with full stack. Operational errors (404, validation, etc.) are
  // logged at a lower level since they're normal traffic, not bugs.
  const logPayload = {
    method: req.method,
    path: req.originalUrl,
    statusCode: normalized.statusCode,
    message: err.message,
    userId: req.user?.id,
    ip: req.ip,
  };

  if (normalized.isOperational && normalized.statusCode < 500) {
    logger.info("Handled request error", logPayload);
  } else {
    logger.error("Unhandled/internal error", {
      ...logPayload,
      stack: err.stack,
    });
  }

  const responseBody = {
    success: false,
    statusCode: normalized.statusCode,
    message: normalized.message,
    errors: normalized.errors || [],
  };

  // Stack traces only ever included outside production, and only for
  // genuine 500s — never for operational 4xx errors, which don't need
  // a trace anyway.
  if (!isProduction && normalized.statusCode >= 500) {
    responseBody.stack = err.stack;
  }

  res.status(normalized.statusCode).json(responseBody);
}

module.exports = errorHandler;