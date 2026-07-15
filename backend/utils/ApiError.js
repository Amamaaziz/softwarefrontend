// utils/ApiError.js

/**
 * Standardized application error class.
 *
 * Every intentional error thrown anywhere in the app (controllers,
 * middleware, validators) should be an ApiError — never a raw Error
 * or a raw string. This lets errorHandler.middleware.js treat all
 * "expected" failures uniformly and, critically, avoid leaking
 * internal details (stack traces, DB error messages, library internals)
 * for anything that ISN'T an ApiError.
 *
 * Usage:
 *   throw new ApiError(404, "Portfolio item not found");
 *   throw new ApiError(400, "Validation failed", [{ field: "slug", message: "..." }]);
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (4xx/5xx)
   * @param {string} message - Human-readable, client-safe message
   * @param {Array<{field?: string, message: string}>} errors - Optional structured details (e.g. per-field validation errors)
   * @param {string} [stack] - Optional explicit stack trace (rarely needed; usually captured automatically)
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.success = false;

    // Distinguishes "expected" operational errors (bad input, not found,
    // unauthorized) from unexpected programming errors / bugs. Central
    // error handlers commonly use this flag to decide whether to log
    // verbosely or alert on-call vs. just return the response.
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Convenience factories for the most common cases — keeps controllers
  // readable and consistent instead of hand-rolling status codes everywhere.
  static badRequest(message = "Bad request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = "Too many requests") {
    return new ApiError(429, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;