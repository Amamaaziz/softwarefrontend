const prisma = require("../lib/prisma");

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix++}`;
  }
}

function serializeService(service) {
  const { id, subServices, ...rest } = service;
  return {
    _id: id,
    ...rest,
    subServices: (subServices ?? []).map(({ id: subId, serviceId, ...subRest }) => ({
      _id: subId,
      ...subRest,
    })),
  };
}

module.exports = { slugify, generateUniqueSlug, serializeService };