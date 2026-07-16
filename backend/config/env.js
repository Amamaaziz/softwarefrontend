// config/env.js
// -----------------------------------------------------------------------------
// Validates and exposes environment configuration at BOOT.
// If a required variable is missing/invalid, the process exits immediately with
// a readable message — failing loudly on startup beats a mysterious crash later.
//
// auth.middleware.js and auth.controller.js import from here, so this module is
// loaded very early. It exports a FLAT object, which supports both:
//   const { JWT_SECRET } = require("../config/env");
//   const config = require("../config/env"); config.JWT_SECRET;
// -----------------------------------------------------------------------------

// Load a .env file if dotenv is present. Guarded so this module still works if
// you inject env vars through the host/runtime instead of a file.
try {
  require("dotenv").config();
} catch {
  /* dotenv not installed — assume env vars are provided by the runtime */
}

const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  // Token lifetimes — rename these if auth.controller.js expects different keys.
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  DUMMY_PASSWORD_HASH: z.string().min(1, "DUMMY_PASSWORD_HASH is required"),

  // Comma-separated allowlist of browser origins for CORS. Example:
  //   CORS_ORIGINS="https://nexbyte.com,https://www.nexbyte.com,https://admin.nexbyte.com"
  CORS_ORIGINS: z.string().default(""),

  // Set this if the admin panel and API live on different subdomains and you
  // need cookies shared across them, e.g. ".nexbyte.com".
  COOKIE_DOMAIN: z.string().optional(),

  // Directory (relative to project root) where uploads are written/served.
  UPLOAD_DIR: z.string().default("uploads"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n Invalid environment configuration:\n");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nFix your .env and restart.\n");
  process.exit(1);
}

const env = parsed.data;

const config = {
  ...env,
  isProd: env.NODE_ENV === "production",
  isDev: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
  // Parsed list form of CORS_ORIGINS, ready to hand to the cors middleware.
  corsOrigins: env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : [],
};

module.exports = config;