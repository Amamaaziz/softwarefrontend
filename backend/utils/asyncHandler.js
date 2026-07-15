// utils/asyncHandler.js

/**
 * Wraps an async Express route handler so that any rejected promise
 * (thrown error, await failure, etc.) is automatically forwarded to
 * next(err) — and therefore into errorHandler.middleware.js.
 *
 * Why this matters: Express does NOT automatically catch errors thrown
 * inside async functions. Without this wrapper, an unhandled rejection
 * in a controller (e.g. a Prisma call that throws) would either:
 *   - crash the process (unhandled promise rejection), or
 *   - hang the request indefinitely with no response ever sent.
 *
 * Both are a reliability AND security concern — a single failing request
 * shouldn't be able to take the whole server down or leave connections
 * hanging (a cheap DoS vector if repeated).
 *
 * Usage:
 *   const getAllPortfolios = asyncHandler(async (req, res) => {
 *     const items = await prisma.portfolio.findMany();
 *     res.json(new ApiResponse(200, items));
 *   });
 *
 * Every controller function in this codebase should be wrapped in this,
 * with zero exceptions — it's what lets controllers throw ApiError
 * directly (see portfolio.controller.js) instead of needing a try/catch
 * in every single function.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;