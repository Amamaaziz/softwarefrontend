const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeText } = require("../utils/sanitize");
const {
  STATUS_TO_ENUM,
  remoteToRemoteJob,
  joinName,
  serializeApplication,
  serializeApplicationList,
} = require("../utils/application.util");

const jobSelect = { job: { select: { id: true, title: true } } };

// ---------------------------------------------------------------------------
// Public — submission only, no read access
// ---------------------------------------------------------------------------

const submitApplication = asyncHandler(async (req, res) => {
  const body = req.body;

  let matchedJob = null;
  if (body.jobId) {
    matchedJob = await prisma.job.findUnique({ where: { id: body.jobId } });
    if (!matchedJob) throw new ApiError(400, "Selected job posting does not exist");
  }

  const application = await prisma.application.create({
    data: {
      jobId: matchedJob?.id ?? null,
      applyFor: matchedJob?.title ?? null,
      applicantName: sanitizeText(body.applicantName),
      email: sanitizeText(body.email).toLowerCase(),
      phone: sanitizeText(body.phone),
      gender: body.gender ? sanitizeText(body.gender) : null,
      dob: body.dob ? new Date(body.dob) : null,
      address: body.address ? sanitizeText(body.address) : null,
      education: body.education ? sanitizeText(body.education) : null,
      experience: body.experience ? sanitizeText(body.experience) : null,
      remoteJob: body.remoteJob ? sanitizeText(body.remoteJob) : null,
      about: body.about ? sanitizeText(body.about) : null,
      resumeUrl: null,
      status: "NEW",
    },
  });

  return res.status(201).json(new ApiResponse(201, { success: true, id: application.id }, "Application submitted"));
});

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const getAdminApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: jobSelect,
  });
  return res.status(200).json(new ApiResponse(200, serializeApplicationList(applications)));
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
    include: jobSelect,
  });
  if (!application) throw new ApiError(404, "Application not found");
  return res.status(200).json(new ApiResponse(200, serializeApplication(application)));
});

const updateApplication = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const { id } = req.params;
  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Application not found");

  const body = req.body;

  // firstName/lastName re-joined into the schema's single applicantName —
  // if only one is sent, fall back to splitting the existing name for the
  // other half so a partial edit doesn't blank out part of it.
  let applicantName;
  if (body.firstName !== undefined || body.lastName !== undefined) {
    const currentFirst = existing.applicantName?.split(/\s+/)[0] || "";
    const currentRest = existing.applicantName?.split(/\s+/).slice(1).join(" ") || "";
    applicantName = joinName(
      body.firstName !== undefined ? sanitizeText(body.firstName) : currentFirst,
      body.lastName !== undefined ? sanitizeText(body.lastName) : currentRest
    );
  }

  const application = await prisma.application.update({
    where: { id },
    data: {
      ...(applicantName && { applicantName }),
      ...(body.gender !== undefined && { gender: sanitizeText(body.gender) || null }),
      ...(body.dateOfBirth !== undefined && { dob: body.dateOfBirth ? new Date(body.dateOfBirth) : null }),
      ...(body.email !== undefined && { email: sanitizeText(body.email).toLowerCase() }),
      ...(body.phone !== undefined && { phone: sanitizeText(body.phone) }),
      ...(body.address !== undefined && { address: sanitizeText(body.address) || null }),
      ...(body.education !== undefined && { education: sanitizeText(body.education) || null }),
      ...(body.experience !== undefined && { experience: sanitizeText(body.experience) || null }),
      ...(body.remote !== undefined && { remoteJob: remoteToRemoteJob(body.remote) }),
      ...(body.about !== undefined && { about: sanitizeText(body.about) || null }),
      ...(body.status && { status: STATUS_TO_ENUM[body.status] }),
    },
    include: jobSelect,
  });

  return res.status(200).json(new ApiResponse(200, serializeApplication(application), "Application updated"));
});

const deleteApplication = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Application not found");

  await prisma.application.delete({ where: { id: req.params.id } });
  return res.status(200).json(new ApiResponse(200, null, "Application deleted"));
});

module.exports = {
  submitApplication,
  getAdminApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};