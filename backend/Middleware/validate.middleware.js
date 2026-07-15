// Middleware/validate.middleware.js

const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

/**
 * Generic schema-driven validation middleware.
 *
 * Usage in routes:
 *   router.post("/", validate(createPortfolioSchema), createPortfolio);
 *
 * `schema` is an object that may contain any of: body, params, query.
 * Each key maps to a Zod schema. We only validate the keys that are
 * actually present on the schema object — this keeps the same middleware
 * reusable across GET/POST/PATCH/DELETE routes without boilerplate.
 *
 * Security rationale:
 * - This runs AFTER auth middleware but BEFORE the controller, so no
 *   unvalidated input ever reaches business logic or the DB layer.
 * - We overwrite req.body / req.params / req.query with the *parsed*
 *   output (not the raw input). This matters because Zod coercion
 *   (z.coerce.number(), .trim(), .toLowerCase(), default values) only
 *   takes effect if we use the parsed result — otherwise the controller
 *   would still see the raw, untrusted strings.
 * - On failure we throw a structured 400 via ApiError rather than letting
 *   a raw ZodError bubble up, so we never leak internal schema/library
 *   details in the response.
 */
const validate = (schema) => (req, res, next) => {
  try {
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }

    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }

    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Flatten Zod's nested issue format into a clean, predictable
      // { field, message } list. This avoids exposing Zod's internal
      // error shape (which can include schema paths, codes, etc.)
      // directly to API consumers.
      const errors = err.errors.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));

      return next(new ApiError(400, "Validation failed", errors));
    }

    // Any non-Zod error here is unexpected (e.g. a bug in a schema
    // definition) — pass it to the central error handler rather than
    // trying to handle it inline.
    return next(err);
  }
};

module.exports = validate;