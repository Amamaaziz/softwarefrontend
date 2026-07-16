const { z } = require("zod");

const uuidSchema = z.string().uuid("Must be a valid UUID");

const titleSchema = z.string().trim().min(2, "Title is required").max(200);
const shortDescriptionSchema = z.string().trim().min(1, "Short description is required").max(200);
const descriptionSchema = z.string().trim().min(1, "Full description is required");

const subServiceSchema = z.object({
  title: z.string().trim().min(1, "Sub-service title is required").max(150),
  description: z.string().trim().min(1, "Sub-service description is required"),
});

const imagesSchema = z.array(z.string().trim().min(1)).max(20, "A maximum of 20 images is allowed").optional();

const idParamSchema = z.object({ id: uuidSchema });
const slugParamSchema = z.object({ slug: z.string().trim().min(1, "slug is required") });

const createServiceSchema = {
  body: z
    .object({
      title: titleSchema,
      shortDescription: shortDescriptionSchema,
      description: descriptionSchema,
      subServices: z.array(subServiceSchema).optional(),
      images: imagesSchema,
      order: z.coerce.number().int().min(0).optional(),
      isPublished: z.boolean().optional(),
    })
    .strict(),
};

const updateServiceSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: titleSchema.optional(),
      shortDescription: shortDescriptionSchema.optional(),
      description: descriptionSchema.optional(),
      subServices: z.array(subServiceSchema).optional(),
      images: imagesSchema,
      order: z.coerce.number().int().min(0).optional(),
      isPublished: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};

const publishServiceSchema = {
  params: idParamSchema,
  body: z.object({ isPublished: z.boolean() }).strict(),
};

const getServiceByIdSchema = { params: idParamSchema };
const deleteServiceSchema = { params: idParamSchema };
const getServiceBySlugSchema = { params: slugParamSchema };

module.exports = {
  createServiceSchema,
  updateServiceSchema,
  publishServiceSchema,
  getServiceByIdSchema,
  deleteServiceSchema,
  getServiceBySlugSchema,
};