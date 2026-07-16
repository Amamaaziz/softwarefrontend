const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeText, sanitizeHtml } = require("../utils/sanitize");
const { generateUniqueSlug, serializeService } = require("../utils/service.util");

const subServiceInclude = { subServices: { orderBy: { order: "asc" } } };

function sanitizePayload(data) {
  const clean = { ...data };

  if (clean.title) clean.title = sanitizeText(clean.title).slice(0, 200);
  if (clean.shortDescription) clean.shortDescription = sanitizeText(clean.shortDescription).slice(0, 200);
  if (clean.description) clean.description = sanitizeHtml(clean.description);

  if (clean.images) {
    clean.images = clean.images.map((url) => sanitizeText(url).trim()).filter(Boolean);
  }

  if (clean.subServices) {
    clean.subServices = clean.subServices.map((s) => ({
      title: sanitizeText(s.title).slice(0, 150),
      description: sanitizeHtml(s.description),
    }));
  }

  if (clean.isPublished !== undefined) clean.isPublished = Boolean(clean.isPublished);

  return clean;
}

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

const getPublicServices = asyncHandler(async (req, res) => {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: subServiceInclude,
  });
  return res.status(200).json(new ApiResponse(200, services.map(serializeService)));
});

const getPublicServiceBySlug = asyncHandler(async (req, res) => {
  const slug = sanitizeText(req.params.slug || "").toLowerCase();
  if (!slug) throw new ApiError(400, "Slug is required");

  const service = await prisma.service.findUnique({
    where: { slug },
    include: subServiceInclude,
  });

  if (!service || !service.isPublished) {
    throw new ApiError(404, "Service not found");
  }

  return res.status(200).json(new ApiResponse(200, serializeService(service)));
});

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const getAdminServices = asyncHandler(async (req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: subServiceInclude,
  });
  return res.status(200).json(new ApiResponse(200, services.map(serializeService)));
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: subServiceInclude,
  });
  if (!service) throw new ApiError(404, "Service not found");
  return res.status(200).json(new ApiResponse(200, serializeService(service)));
});

const createService = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const data = sanitizePayload(req.body);
  const slug = await generateUniqueSlug(data.title);

  const service = await prisma.service.create({
    data: {
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      images: data.images ?? [],
      order: data.order ?? 0,
      isPublished: data.isPublished ?? false,
      subServices: {
        create: (data.subServices ?? []).map((s, i) => ({ ...s, order: i })),
      },
    },
    include: subServiceInclude,
  });

  return res.status(201).json(new ApiResponse(201, serializeService(service), "Service created"));
});

const updateService = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const { id } = req.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Service not found");

  const data = sanitizePayload(req.body);
  const slug =
    data.title && data.title !== existing.title
      ? await generateUniqueSlug(data.title, existing.id)
      : existing.slug;

  if (data.title) {
    const conflict = await prisma.service.findUnique({ where: { slug } });
    if (conflict && conflict.id !== id) throw new ApiError(409, "A service with this title already exists");
  }

  const service = await prisma.$transaction(async (tx) => {
    if (data.subServices) {
      await tx.subService.deleteMany({ where: { serviceId: id } });
    }
    return tx.service.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title, slug }),
        ...(data.shortDescription && { shortDescription: data.shortDescription }),
        ...(data.description && { description: data.description }),
        ...(data.images && { images: data.images }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.subServices && {
          subServices: { create: data.subServices.map((s, i) => ({ ...s, order: i })) },
        }),
      },
      include: subServiceInclude,
    });
  });

  return res.status(200).json(new ApiResponse(200, serializeService(service), "Service updated"));
});

const publishService = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Service not found");

  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: { isPublished: req.body.isPublished },
    include: subServiceInclude,
  });

  return res.status(200).json(new ApiResponse(200, serializeService(service), "Service updated"));
});

const deleteService = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") throw new ApiError(403, "Not authorized to perform this action");

  const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Service not found");

  await prisma.service.delete({ where: { id: req.params.id } });

  return res.status(200).json(new ApiResponse(200, null, "Service deleted"));
});

module.exports = {
  getPublicServices,
  getPublicServiceBySlug,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  publishService,
  deleteService,
};