// utils/blog.util.js

const prisma = require("../lib/prisma");

function slugify(title) {
  return (
    String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 150) || "untitled"
  );
}

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let slug = base;
  let n = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

/**
 * Maps Prisma's `id` -> `_id`, flat seoMetaTitle/seoMetaDescription ->
 * nested seoMeta{metaTitle,metaDescription} (matches BlogForm.jsx), and
 * DRAFT/PUBLISHED -> draft/published (matches BlogForm.jsx + admin
 * BlogList.jsx, which both use lowercase).
 */
function serializeBlog(item) {
  if (!item) return item;
  const { id, seoMetaTitle, seoMetaDescription, status, ...rest } = item;

  return {
    _id: id,
    ...rest,
    status: status === "PUBLISHED" ? "published" : "draft",
    seoMeta: {
      metaTitle: seoMetaTitle || "",
      metaDescription: seoMetaDescription || "",
    },
  };
}

function serializeBlogList(items) {
  return items.map(serializeBlog);
}

module.exports = {
  slugify,
  generateUniqueSlug,
  serializeBlog,
  serializeBlogList,
};