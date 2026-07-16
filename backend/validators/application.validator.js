const { z } = require("zod");

const uuidSchema = z.string().uuid("Must be a valid UUID");

// Public submission — matches what JobDetail.jsx and CareersList.jsx actually
// send. `job` may be a slug (JobDetail.jsx) or absent; CareersList.jsx sends
// the real `jobId` (UUID) plus `applyFor` as free text. Controller resolves
// jobId directly, or via slug lookup when only `job` is present.
const submitApplicationSchema = {
  body: z
    .object({
      job: z.string().trim().optional(), // slug, from JobDetail.jsx
      jobId: uuidSchema.optional(), // real job id, from CareersList.jsx
      applyFor: z.string().trim().optional(), // free-text role title, from CareersList.jsx
      applicantName: z.string().trim().min(2, "Enter your full name"),
      email: z.string().trim().email("Enter a valid email address"),
      phone: z.string().trim().min(7, "Enter a valid phone number"),
      gender: z.string().trim().optional(),
      dob: z.string().trim().optional(), // ISO date string
      address: z.string().trim().optional(),
      education: z.string().trim().optional(),
      experience: z.string().trim().optional(),
      remoteJob: z.string().trim().optional(),
      about: z.string().trim().max(5000).optional(),
      resumeName: z.string().trim().optional(), // no upload wired yet
    })
    .strict(),
};

// Admin update — matches the field names admin Applications.jsx's edit form
// actually uses (firstName/lastName, dateOfBirth, remote) rather than the
// schema's own field names. Mapped in the controller/serializer.
const updateApplicationSchema = {
  params: z.object({ id: uuidSchema }),
  body: z
    .object({
      firstName: z.string().trim().optional(),
      lastName: z.string().trim().optional(),
      gender: z.string().trim().optional(),
      dateOfBirth: z.string().trim().optional(),
      email: z.string().trim().email().optional(),
      phone: z.string().trim().optional(),
      address: z.string().trim().optional(),
      education: z.string().trim().optional(),
      experience: z.string().trim().optional(),
      remote: z.union([z.boolean(), z.string()]).optional(),
      about: z.string().trim().max(5000).optional(),
      status: z.enum(["new", "shortlisted", "interview", "rejected", "hired"]).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
};

const deleteApplicationSchema = { params: z.object({ id: uuidSchema }) };
const getApplicationByIdSchema = { params: z.object({ id: uuidSchema }) };

module.exports = {
  submitApplicationSchema,
  updateApplicationSchema,
  deleteApplicationSchema,
  getApplicationByIdSchema,
};