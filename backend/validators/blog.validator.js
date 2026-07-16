// validators/blog.validator.js

const { z } = require("zod");

// `slug` and `authorName` are NOT part of the body schema — slug is
// server-generated from title, authorName is set server-side from the
// logged-in admin (single-admin architecture, matches how BlogForm.jsx
// has no author field at all).

const uuidSchema = z.string().uuid("Must be a valid UUID");

const titleSchema = z.string().trim().min(2, "Title is required").max(200);
const categorySchema = z.string().trim().min(1, "Category is required").max(80);

const coverImageSchema = z
  .string()
  .trim()
  .refine((val) => /^https?:\/\//i.test(val) || val.startsWith("/uploads/"), {
    message: "coverImage must be a valid URL or an /uploads/ path",
  });

const contentSchema = z.string().trim().min(1, "Post content is required").max(50000);
const excerptSchema = z.string().trim().min(1, "Excerpt is required").max(200, "Keep it under 200 characters");

// Nested to match BlogForm.jsx's register('seoMeta.metaTitle') /
// register('seoMeta.metaDescription'). Flattened to seoMetaTitle /
// seoMetaDescription in the controller before hitting Prisma.
const seoMetaSchema = z
  .object({
    metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
    metaDescription: z.string().trim().max(300).optional().or(z.literal("")),
  })
  .optional();

// Lowercase to match BlogForm.jsx's <Select> values ('draft' / 'published').
// Mapped to the Prisma enum (DRAFT / PUBLISHED) in the controller.
const statusSchema = z.enum(["draft", "published"]);

const idParamSchema = z.object({
  id: uuidSchema,
});

const slugParamSchema = z.object({
  slug: z.string().trim().min(1, "slug is required"),
});

const createBlogSchema = {
  body: z
    .object({
      title: titleSchema,
      category: categorySchema,
      coverImage: coverImageSchema,
      content: contentSchema,
      excerpt: excerptSchema,
      seoMeta: seoMetaSchema,
      status: statusSchema,
    })
    .strict(),
};

const updateBlogSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: titleSchema.optional(),
      category: categorySchema.optional(),
      coverImage: coverImageSchema.optional(),
      content: contentSchema.optional(),
      excerpt: excerptSchema.optional(),
      seoMeta: seoMetaSchema,
      status: statusSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};

const deleteBlogSchema = {
  params: idParamSchema,
};

const getBlogBySlugSchema = {
  params: slugParamSchema,
};

const getAllBlogsQuerySchema = {
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
      category: z.string().trim().optional(),
      all: z.enum(["true", "false"]).optional(), // admin-only flag, re-checked in controller
    })
    .strict(),
};

module.exports = {
  createBlogSchema,
  updateBlogSchema,
  deleteBlogSchema,
  getBlogBySlugSchema,
  getAllBlogsQuerySchema,
  idParamSchema,
};