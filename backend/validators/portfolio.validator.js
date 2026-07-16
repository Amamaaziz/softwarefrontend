// validators/portfolio.validator.js

const { z } = require("zod");

/**
 * Rebuilt to match the actual Portfolio model: UUID id, case-study
 * fields (challenge/solution/result), single coverImage, technologies[],
 * boolean flags (isFeatured/isNewArrival/isPublished), and an optional
 * relation to Service via serviceId.
 *
 * `slug` is intentionally NOT part of either body schema below — it's
 * server-generated from `title` in the controller (see portfolio.util.js),
 * matching how the Services module already works. PortfolioForm.jsx never
 * collects a slug, so requiring it here would always fail validation.
 */

// Postgres uuid (v4-shaped, but gen_random_uuid() produces standard UUIDs
// generally) — validate shape, not version, since dbgenerated() output
// format can vary slightly by Postgres version/extension.
const uuidSchema = z.string().uuid("Must be a valid UUID");

const titleSchema = z.string().trim().min(3).max(200);

const clientSchema = z.string().trim().min(1, "Client is required").max(120);

const coverImageSchema = z
  .string()
  .trim()
  .refine((val) => /^https?:\/\//i.test(val) || val.startsWith("/uploads/"), {
    message: "coverImage must be a valid URL or an /uploads/ path",
  });

// Case-study text fields — generous length caps since these are the core
// content of the item, but still bounded to prevent abuse.
const challengeSchema = z.string().trim().min(1).max(20000);
const solutionSchema = z.string().trim().min(1).max(20000);
const resultSchema = z.string().trim().min(1).max(20000);

// Raised from 40 -> 100 chars per tag; 40 was too tight for real tech
// names/phrases people actually type (e.g. "Next.js App Router + RSC").
const technologiesSchema = z
  .array(z.string().trim().min(1).max(100))
  .max(30, "A maximum of 30 technologies is allowed")
  .optional();

const booleanFlag = z.boolean().optional();

// serviceId is optional (nullable relation) — accept a valid UUID, or
// explicit null to clear the relation, or omit entirely on partial updates.
const serviceIdSchema = z.union([uuidSchema, z.null()]).optional();

const idParamSchema = z.object({
  id: uuidSchema,
});

const slugParamSchema = z.object({
  slug: z.string().trim().min(1, "slug is required"),
});

/**
 * POST /api/portfolio
 */
const createPortfolioSchema = {
  body: z
    .object({
      title: titleSchema,
      client: clientSchema,
      serviceId: serviceIdSchema,
      coverImage: coverImageSchema,
      challenge: challengeSchema,
      solution: solutionSchema,
      result: resultSchema,
      technologies: technologiesSchema,
      isFeatured: booleanFlag,
      isNewArrival: booleanFlag,
      isPublished: booleanFlag,
    })
    .strict(),
};

/**
 * PATCH /api/portfolio/:id
 * All fields optional for partial update; at least one must be present.
 */
const updatePortfolioSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: titleSchema.optional(),
      client: clientSchema.optional(),
      serviceId: serviceIdSchema,
      coverImage: coverImageSchema.optional(),
      challenge: challengeSchema.optional(),
      solution: solutionSchema.optional(),
      result: resultSchema.optional(),
      technologies: technologiesSchema,
      isFeatured: booleanFlag,
      isNewArrival: booleanFlag,
      isPublished: booleanFlag,
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};

const deletePortfolioSchema = {
  params: idParamSchema,
};

const getPortfolioBySlugSchema = {
  params: slugParamSchema,
};

/**
 * GET /api/portfolio
 */
const getAllPortfoliosQuerySchema = {
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
      serviceId: uuidSchema.optional(),
      featured: z.enum(["true", "false"]).optional(),
      newArrival: z.enum(["true", "false"]).optional(),
      all: z.enum(["true", "false"]).optional(), // admin-only flag, re-checked in controller
    })
    .strict(),
};

module.exports = {
  createPortfolioSchema,
  updatePortfolioSchema,
  deletePortfolioSchema,
  getPortfolioBySlugSchema,
  getAllPortfoliosQuerySchema,
  idParamSchema,
};