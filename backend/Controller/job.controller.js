const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeText, sanitizeHtml } = require("../utils/sanitize");
const { TYPE_TO_ENUM, STATUS_TO_ENUM, generateUniqueSlug, serializeJob, serializeJobList } = require("../utils/job.util");

function sanitizePayload(data) {
  const clean = { ...data };
  if (clean.title) clean.title = sanitizeText(clean.title).slice(0, 200);
  if (clean.department) clean.department = sanitizeText(clean.department).slice(0, 100);
  if (clean.location) clean.location = sanitizeText(clean.location).slice(0, 150);
  if (clean.experienceLevel) clean.experienceLevel = sanitizeText(clean.experienceLevel).slice(0, 100);
  if (clean.description) clean.description = sanitizeHtml(clean.description);
  if (clean.requirements) clean.requirements = clean.requirements.map((r) => sanitizeText(r)).filter(Boolean);
  if (clean.responsibilities) clean.responsibilities = clean.responsibilities.map((r) => sanitizeText(r)).filter(Boolean);
  if (clean.type) clean.type = TYPE_TO_ENUM[clean.type];
  if (clean.status) clean.status = STATUS_TO_ENUM[clean.status];
  return clean;
}

// ---------------------------------------------------------------------------
// Public — no publish gate; CareersList.jsx shows closed roles too (greyed out)
// ---------------------------------------------------------------------------

const getPublicJobs = asyncHandler(async (req, res) => {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  return res.status(200).json(new ApiResponse(200, serializeJobList(jobs)));
});

const getPublicJobBySlug = asyncHandler(async (req, res) => {
  const slug = sanitizeText(req.params.slug || "").toLowerCase();
  if (!slug) throw new ApiError(400, "Slug is required");

  const job = await prisma.job.findUnique({ where: { slug } });
  if (!job) throw new ApiError(404, "Job not found");

  return res.status(200).json(new ApiResponse(200, serializeJob(job)));
});

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const getAdminJobs = asyncHandler(async (req, res) => {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  return res.status(200).json(new ApiResponse(200, serializeJobList(jobs)));
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, serializeJob(job)));
});

const createJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const data = sanitizePayload(req.body);
  const slug = await generateUniqueSlug(data.title);

  const job = await prisma.job.create({
    data: {
      title: data.title,
      slug,
      department: data.department,
      location: data.location,
      type: data.type,
      experienceLevel: data.experienceLevel,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      status: data.status,
    },
  });

  return res.status(201).json(new ApiResponse(201, serializeJob(job), "Job posting created"));
});

const updateJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const { id } = req.params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Job not found");

  const data = sanitizePayload(req.body);
  const slug =
    data.title && data.title !== existing.title ? await generateUniqueSlug(data.title, existing.id) : existing.slug;

  const job = await prisma.job.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title, slug }),
      ...(data.department && { department: data.department }),
      ...(data.location && { location: data.location }),
      ...(data.type && { type: data.type }),
      ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
      ...(data.description && { description: data.description }),
      ...(data.requirements && { requirements: data.requirements }),
      ...(data.responsibilities && { responsibilities: data.responsibilities }),
      ...(data.status && { status: data.status }),
    },
  });

  return res.status(200).json(new ApiResponse(200, serializeJob(job), "Job posting updated"));
});

const deleteJob = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Job not found");

  // Applications keep jobId: null (onDelete: SetNull) — existing applications
  // are preserved, matching the ConfirmDialog copy in JobsList.jsx.
  await prisma.job.delete({ where: { id: req.params.id } });
  return res.status(200).json(new ApiResponse(200, null, "Job posting deleted"));
});

module.exports = {
  getPublicJobs,
  getPublicJobBySlug,
  getAdminJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};