// utils/portfolio.util.js

const prisma = require("../lib/prisma");

/**
 * Slugs are server-generated from `title`, matching the Services module's
 * convention (see handoff doc: "Slugs are server-generated from title...
 * not supplied by the admin form"). PortfolioForm.jsx never collects a
 * slug field, so this MUST run on every create, and on update whenever
 * the title changes.
 */
function slugify(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150) || "untitled";
}

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let slug = base;
  let n = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.portfolio.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

/**
 * Maps Prisma's `id` -> `_id` (and nested `service.id` -> `service._id`)
 * so the admin panel's existing components (which all read `_id`) work
 * without being rewritten — same pattern as Services' serializeService.
 */
function serializePortfolio(item) {
  if (!item) return item;
  const { id, service, ...rest } = item;
  const serialized = { _id: id, ...rest };

  if (service) {
    const { id: serviceId, ...serviceRest } = service;
    serialized.service = { _id: serviceId, ...serviceRest };
  }

  return serialized;
}

function serializePortfolioList(items) {
  return items.map(serializePortfolio);
}

module.exports = {
  slugify,
  generateUniqueSlug,
  serializePortfolio,
  serializePortfolioList,
};