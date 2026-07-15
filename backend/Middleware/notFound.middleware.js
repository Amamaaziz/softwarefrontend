// Middleware/notFound.middleware.js
// -----------------------------------------------------------------------------
// Runs AFTER all routers in app.js. Any request that reaches here matched no
// route, so we hand a clean, operational 404 to the central error handler
// instead of letting the request hang.
// -----------------------------------------------------------------------------

const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;