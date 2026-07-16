const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeText, sanitizeHtml } = require("../utils/sanitize");
const { generateUniqueSlug, serializeBlog, serializeBlogList } = require("../utils/blog.util");

function sanitizePayload(data) {
  const clean = { ...data };

  if (clean.title) clean.title = sanitizeText(clean.title).slice(0, 200);
  if (clean.category) clean.category = sanitizeText(clean.category).slice(0, 80);
  if (clean.excerpt) clean.excerpt = sanitizeText(clean.excerpt).slice(0, 200);
  if (clean.content) clean.content = sanitizeHtml(clean.content);

  if (clean.coverImage) {
    clean.coverImage = sanitizeText(clean.coverImage).trim();
    const valid = /^https?:\/\//i.test(clean.coverImage) || clean.coverImage.startsWith("/uploads/");
    if (!valid) throw new ApiError(400, "coverImage must be a valid URL or an /uploads/ path");
  }

  if (clean.seoMeta) {
    clean.seoMetaTitle = clean.seoMeta.metaTitle ? sanitizeText(clean.seoMeta.metaTitle).slice(0, 200) : null;
    clean.seoMetaDescription = clean.seoMeta.metaDescription
      ? sanitizeText(clean.seoMeta.metaDescription).slice(0, 300)
      : null;
    delete clean.seoMeta;
  }

  if (clean.status) clean.status = clean.status.toUpperCase(); // draft/published -> DRAFT/PUBLISHED

  return clean;
}

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

const getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  const serialized = serializeBlogList(blogs);
  return res.status(200).json(
    new ApiResponse(200, { data: serialized, total: serialized.length })
  );
});

const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const slug = sanitizeText(req.params.slug || "").toLowerCase();
  if (!slug) throw new ApiError(400, "Slug is required");

  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog || blog.status !== "PUBLISHED") throw new ApiError(404, "Post not found");

  return res.status(200).json(new ApiResponse(200, serializeBlog(blog)));
});

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  return res.status(200).json(new ApiResponse(200, serializeBlogList(blogs)));
});

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await prisma.blog.findUnique({ where: { id: req.params.id } });
  if (!blog) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, serializeBlog(blog)));
});

const createBlog = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const data = sanitizePayload(req.body);
  const slug = await generateUniqueSlug(data.title);

  // authorName set server-side from the logged-in admin — BlogForm.jsx has
  // no author field at all, consistent with the single-admin architecture.
  const admin = await prisma.user.findUnique({ where: { id: req.user.id } });

  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      slug,
      category: data.category,
      coverImage: data.coverImage,
      content: data.content,
      excerpt: data.excerpt,
      authorName: admin?.name || "Admin",
      seoMetaTitle: data.seoMetaTitle,
      seoMetaDescription: data.seoMetaDescription,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return res.status(201).json(new ApiResponse(201, serializeBlog(blog), "Post created"));
});

const updateBlog = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const { id } = req.params;
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Post not found");

  const data = sanitizePayload(req.body);
  const slug =
    data.title && data.title !== existing.title
      ? await generateUniqueSlug(data.title, existing.id)
      : existing.slug;

  // Stamp publishedAt the first time it goes live; clear it if it returns
  // to draft — same rule the mock beforeWrite() used to enforce.
  let publishedAt = existing.publishedAt;
  if (data.status === "PUBLISHED" && !existing.publishedAt) publishedAt = new Date();
  if (data.status === "DRAFT") publishedAt = null;

  const blog = await prisma.blog.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title, slug }),
      ...(data.category && { category: data.category }),
      ...(data.coverImage && { coverImage: data.coverImage }),
      ...(data.content && { content: data.content }),
      ...(data.excerpt && { excerpt: data.excerpt }),
      ...(data.seoMetaTitle !== undefined && { seoMetaTitle: data.seoMetaTitle }),
      ...(data.seoMetaDescription !== undefined && { seoMetaDescription: data.seoMetaDescription }),
      ...(data.status && { status: data.status, publishedAt }),
    },
  });

  return res.status(200).json(new ApiResponse(200, serializeBlog(blog), "Post updated"));
});

const deleteBlog = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const existing = await prisma.blog.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Post not found");

  await prisma.blog.delete({ where: { id: req.params.id } });
  return res.status(200).json(new ApiResponse(200, null, "Post deleted"));
});

module.exports = {
  getPublicBlogs,
  getPublicBlogBySlug,
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};