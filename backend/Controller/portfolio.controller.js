// Controller/portfolio.controller.js

const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeHtml, sanitizeText } = require("../utils/sanitize");

/**
 * Allowlist of fields a client is ever permitted to set.
 * This is the single most important line of defense against
 * mass-assignment attacks (e.g. someone POSTing { isFeatured: true, id: 1 }
 * or trying to inject relational fields that don't belong to them).
 * Never spread req.body directly into Prisma calls.
 */
const ALLOWED_FIELDS = [
  "title",
  "slug",
  "shortDescription",
  "description",
  "category",
  "client",
  "projectUrl",
  "tags",
  "images",
  "featured",
  "status", // "draft" | "published"
  "order",
];

function pickAllowedFields(body) {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

/**
 * Sanitize rich-text / free-text fields before they ever touch the DB.
 * Even though Prisma parameterizes queries (no SQL injection risk),
 * unsanitized HTML stored here becomes a STORED XSS vector when the
 * public frontend renders it with dangerouslySetInnerHTML.
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
  if (clean.shortDescription) {
    clean.shortDescription = sanitizeText(clean.shortDescription).slice(0, 300);
  }
  if (clean.description) {
    clean.description = sanitizeHtml(clean.description); // allows safe rich-text tags only
  }
  if (clean.client) clean.client = sanitizeText(clean.client).slice(0, 120);
  if (clean.category) clean.category = sanitizeText(clean.category).slice(0, 80);

  if (clean.projectUrl) {
    clean.projectUrl = sanitizeText(clean.projectUrl).trim();
    if (!/^https?:\/\//i.test(clean.projectUrl)) {
      throw new ApiError(400, "projectUrl must start with http:// or https://");
    }
  }

  if (clean.tags) {
    if (!Array.isArray(clean.tags)) {
      throw new ApiError(400, "tags must be an array of strings");
    }
    clean.tags = clean.tags
      .map((t) => sanitizeText(String(t)).slice(0, 40))
      .filter(Boolean)
      .slice(0, 20); // cap array size to prevent payload abuse
  }

  if (clean.images) {
    if (!Array.isArray(clean.images)) {
      throw new ApiError(400, "images must be an array of URLs");
    }
    clean.images = clean.images
      .map((img) => sanitizeText(String(img)).trim())
      .filter((img) => /^https?:\/\//i.test(img) || img.startsWith("/uploads/"))
      .slice(0, 15);
  }

  if (clean.status && !["draft", "published"].includes(clean.status)) {
    throw new ApiError(400, "status must be 'draft' or 'published'");
  }

  if (clean.featured !== undefined) clean.featured = Boolean(clean.featured);

  if (clean.order !== undefined) {
    const n = Number(clean.order);
    if (!Number.isInteger(n)) throw new ApiError(400, "order must be an integer");
    clean.order = n;
  }

  return clean;
}

/**
 * GET /api/portfolio
 * Public: only returns published items.
 * Admin (?all=true, requires isAdmin middleware upstream on that route): returns everything.
 */
const getAllPortfolios = asyncHandler(async (req, res) => {
  // Clamp pagination inputs — never trust raw query numbers directly.
  // Unbounded limit is a cheap DoS vector (SELECT * with no cap).
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const isAdminRequest = req.user?.role === "admin" && req.query.all === "true";

  const where = isAdminRequest ? {} : { status: "published" };

  if (req.query.category) {
    where.category = sanitizeText(String(req.query.category)).slice(0, 80);
  }
  if (req.query.featured === "true") {
    where.featured = true;
  }

  const [items, total] = await Promise.all([
    prisma.portfolio.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
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
 * Public: 404s (not 403) on unpublished items to non-admins,
 * so we don't leak the existence of draft content.
 */
const getPortfolioBySlug = asyncHandler(async (req, res) => {
  const slug = sanitizeText(req.params.slug || "").toLowerCase();
  if (!slug) throw new ApiError(400, "Slug is required");

  const item = await prisma.portfolio.findUnique({ where: { slug } });

  const isAdmin = req.user?.role === "admin";
  if (!item || (item.status !== "published" && !isAdmin)) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return res.status(200).json(new ApiResponse(200, item));
});

/**
 * POST /api/portfolio
 * Admin only — enforced by auth.middleware on the route, not re-checked here,
 * but we defensively re-verify since controllers should never assume
 * middleware ordering is immutable.
 */
const createPortfolio = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Not authorized to perform this action");
  }

  const picked = pickAllowedFields(req.body);
  if (!picked.title || !picked.slug) {
    throw new ApiError(400, "title and slug are required");
  }

  const data = sanitizePayload(picked);

  const existing = await prisma.portfolio.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A portfolio item with this slug already exists");

  const created = await prisma.portfolio.create({ data });

  return res.status(201).json(new ApiResponse(201, created, "Portfolio item created"));
});

/**
 * PATCH /api/portfolio/:id
 * Partial update — same allowlist + sanitize pipeline as create.
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