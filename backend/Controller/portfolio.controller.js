// Controller/portfolio.controller.js

const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeHtml, sanitizeText } = require("../utils/sanitize");

/**
 * Allowlist matches the real Portfolio model exactly. No `status`,
 * `images[]`, `tags[]`, `category`, `order`, or `description` fields —
 * those don't exist on this schema. Never spread req.body directly into
 * Prisma regardless — this allowlist is what blocks mass assignment.
 */
const ALLOWED_FIELDS = [
  "title",
  "slug",
  "client",
  "serviceId",
  "coverImage",
  "challenge",
  "solution",
  "result",
  "technologies",
  "isFeatured",
  "isNewArrival",
  "isPublished",
];

function pickAllowedFields(body) {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

/**
 * Sanitize free-text / rich-text fields before they hit the DB.
 * challenge/solution/result are @db.Text in the schema — likely rendered
 * as rich text on the public case-study page, so they go through
 * sanitizeHtml (not sanitizeText) to preserve safe formatting while
 * stripping XSS vectors.
 */
function sanitizePayload(data) {
  const clean = { ...data };

  if (clean.title) clean.title = sanitizeText(clean.title).slice(0, 200);

  if (clean.slug) {
    clean.slug = sanitizeText(clean.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  if (clean.client) clean.client = sanitizeText(clean.client).slice(0, 120);

  if (clean.coverImage) {
    clean.coverImage = sanitizeText(clean.coverImage).trim();
    const valid =
      /^https?:\/\//i.test(clean.coverImage) || clean.coverImage.startsWith("/uploads/");
    if (!valid) {
      throw new ApiError(400, "coverImage must be a valid URL or an /uploads/ path");
    }
  }

  if (clean.challenge) clean.challenge = sanitizeHtml(clean.challenge);
  if (clean.solution) clean.solution = sanitizeHtml(clean.solution);
  if (clean.result) clean.result = sanitizeHtml(clean.result);

  if (clean.technologies) {
    if (!Array.isArray(clean.technologies)) {
      throw new ApiError(400, "technologies must be an array of strings");
    }
    clean.technologies = clean.technologies
      .map((t) => sanitizeText(String(t)).slice(0, 40))
      .filter(Boolean)
      .slice(0, 30);
  }

  if (clean.isFeatured !== undefined) clean.isFeatured = Boolean(clean.isFeatured);
  if (clean.isNewArrival !== undefined) clean.isNewArrival = Boolean(clean.isNewArrival);
  if (clean.isPublished !== undefined) clean.isPublished = Boolean(clean.isPublished);

  // serviceId: null explicitly clears the relation; undefined leaves it
  // untouched; a string gets sanitized as a plain token (UUID format is
  // already enforced by the validator before this runs).
  if (clean.serviceId !== undefined && clean.serviceId !== null) {
    clean.serviceId = sanitizeText(clean.serviceId).trim();
  }

  return clean;
}

/**
 * GET /api/portfolio
 * Public: only isPublished=true items.
 * Admin (?all=true + optionalAuth/isAdmin upstream): everything.
 */
const getAllPortfolios = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const isAdminRequest = req.user?.role === "admin" && req.query.all === "true";

  const where = isAdminRequest ? {} : { isPublished: true };

  if (req.query.serviceId) {
    where.serviceId = sanitizeText(String(req.query.serviceId)).trim();
  }
  if (req.query.featured === "true") {
    where.isFeatured = true;
  }
  if (req.query.newArrival === "true") {
    where.isNewArrival = true;
  }

  const [items, total] = await Promise.all([
    prisma.portfolio.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: limit,
      include: { service: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.portfolio.count({ where }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
});

/**
 * GET /api/portfolio/:slug
 * 404 (not 403) on unpublished items for non-admins — avoids leaking
 * draft existence.
 */
const getPortfolioBySlug = asyncHandler(async (req, res) => {
  const slug = sanitizeText(req.params.slug || "").toLowerCase();
  if (!slug) throw new ApiError(400, "Slug is required");

  const item = await prisma.portfolio.findUnique({
    where: { slug },
    include: { service: { select: { id: true, title: true, slug: true } } },
  });

  const isAdmin = req.user?.role === "admin";
  if (!item || (!item.isPublished && !isAdmin)) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return res.status(200).json(new ApiResponse(200, item));
});

/**
 * POST /api/portfolio
 * Admin only. If serviceId is provided, we verify the Service actually
 * exists BEFORE attempting the insert — this turns a possible Prisma
 * P2003 foreign-key error into a clean, specific 400 instead of a
 * generic normalizeError() fallback.
 */
const createPortfolio = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Not authorized to perform this action");
  }

  const picked = pickAllowedFields(req.body);
  const required = ["title", "slug", "client", "coverImage", "challenge", "solution", "result"];
  const missing = required.filter((f) => !picked[f]);
  if (missing.length) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
  }

  const data = sanitizePayload(picked);

  const existingSlug = await prisma.portfolio.findUnique({ where: { slug: data.slug } });
  if (existingSlug) throw new ApiError(409, "A portfolio item with this slug already exists");

  if (data.serviceId) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new ApiError(400, "serviceId does not reference an existing service");
  }

  const created = await prisma.portfolio.create({ data });

  return res.status(201).json(new ApiResponse(201, created, "Portfolio item created"));
});

/**
 * PATCH /api/portfolio/:id
 */
const updatePortfolio = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Not authorized to perform this action");
  }

  const { id } = req.params;
  const existing = await prisma.portfolio.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Portfolio item not found");

  const picked = pickAllowedFields(req.body);
  const data = sanitizePayload(picked);

  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.portfolio.findUnique({ where: { slug: data.slug } });
    if (conflict) throw new ApiError(409, "A portfolio item with this slug already exists");
  }

  if (data.serviceId) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new ApiError(400, "serviceId does not reference an existing service");
  }

  const updated = await prisma.portfolio.update({ where: { id }, data });

  return res.status(200).json(new ApiResponse(200, updated, "Portfolio item updated"));
});

/**
 * DELETE /api/portfolio/:id
 */
const deletePortfolio = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Not authorized to perform this action");
  }

  const { id } = req.params;
  const existing = await prisma.portfolio.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Portfolio item not found");

  await prisma.portfolio.delete({ where: { id } });

  return res.status(200).json(new ApiResponse(200, null, "Portfolio item deleted"));
});

module.exports = {
  getAllPortfolios,
  getPortfolioBySlug,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};