const { z } = require("zod");

const uuidSchema = z.string().uuid("Must be a valid UUID");

const JOB_TYPES = ["full-time", "part-time", "remote", "contract"];
const JOB_STATUSES = ["open", "closed"];

const titleSchema = z.string().trim().min(2, "Title is required").max(200);
const departmentSchema = z.string().trim().min(1, "Department is required").max(100);
const locationSchema = z.string().trim().min(1, "Location is required").max(150);
const experienceLevelSchema = z.string().trim().min(1, "Experience level is required").max(100);
const descriptionSchema = z.string().trim().min(1, "Job description is required");
const listSchema = z.array(z.string().trim().min(1)).min(1, "Add at least one item");

const idParamSchema = z.object({ id: uuidSchema });
const slugParamSchema = z.object({ slug: z.string().trim().min(1, "slug is required") });

const createJobSchema = {
  body: z
    .object({
      title: titleSchema,
      department: departmentSchema,
      location: locationSchema,
      type: z.enum(JOB_TYPES),
      experienceLevel: experienceLevelSchema,
      description: descriptionSchema,
      requirements: listSchema,
      responsibilities: listSchema,
      status: z.enum(JOB_STATUSES),
    })
    .strict(),
};

const updateJobSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: titleSchema.optional(),
      department: departmentSchema.optional(),
      location: locationSchema.optional(),
      type: z.enum(JOB_TYPES).optional(),
      experienceLevel: experienceLevelSchema.optional(),
      description: descriptionSchema.optional(),
      requirements: listSchema.optional(),
      responsibilities: listSchema.optional(),
      status: z.enum(JOB_STATUSES).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};

const deleteJobSchema = { params: idParamSchema };
const getJobBySlugSchema = { params: slugParamSchema };
const getJobByIdSchema = { params: idParamSchema };

module.exports = {
  JOB_TYPES,
  JOB_STATUSES,
  createJobSchema,
  updateJobSchema,
  deleteJobSchema,
  getJobBySlugSchema,
  getJobByIdSchema,
  idParamSchema,
};