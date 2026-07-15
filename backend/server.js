// server.js
// -----------------------------------------------------------------------------
// HTTP server bootstrap. Kept intentionally thin.
//
// NOTE: lib/prisma.js already registers SIGINT/SIGTERM handlers to disconnect
// the DB, and lib/logger.js already installs process-level uncaughtException /
// unhandledRejection handlers — so we do NOT duplicate those here. This file
// only owns the HTTP server lifecycle.
// -----------------------------------------------------------------------------

const app = require("./app");
const config = require("./config/env");
const logger = require("./lib/logger");   

const server = app.listen(config.PORT, () => {
  logger.info(`Server listening on port ${config.PORT} [${config.NODE_ENV}]`);
});

// Drain in-flight HTTP connections cleanly on shutdown signals. Prisma's own
// handlers (registered in lib/prisma.js) take care of closing the DB pool.
const shutdown = (signal) => {
  logger.info(`${signal} received — closing HTTP server...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });

  // Failsafe: if connections don't drain in time, force exit.
  setTimeout(() => {
    logger.error("Forced shutdown (connection drain timed out).");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = server;