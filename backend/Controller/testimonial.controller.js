const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC — only published testimonials, newest first
exports.getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json(new ApiResponse(200, testimonials));
});

// ADMIN — list all (published + draft)
exports.listTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json(new ApiResponse(200, testimonials));
});

// ADMIN — get one
exports.getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  return res.status(200).json(new ApiResponse(200, testimonial));
});

// ADMIN — create
exports.createTestimonial = asyncHandler(async (req, res) => {
  const { clientName, company, photo, message, rating, isPublished } = req.body;

  if (!clientName || !message || !rating) {
    throw new ApiError(400, "clientName, message and rating are required");
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName,
      company: company || null,
      photo: photo || null,
      message,
      rating: Number(rating),
      isPublished: !!isPublished,
    },
  });

  return res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created"));
});

// ADMIN — update (full edit form)
exports.updateTestimonial = asyncHandler(async (req, res) => {
  const { clientName, company, photo, message, rating, isPublished } = req.body;

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        ...(clientName !== undefined && { clientName }),
        ...(company !== undefined && { company }),
        ...(photo !== undefined && { photo }),
        ...(message !== undefined && { message }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(isPublished !== undefined && { isPublished: !!isPublished }),
      },
    });
    return res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated"));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Testimonial not found");
    throw err;
  }
});

// ADMIN — publish toggle (used by the list page's ToggleSwitch)
exports.publishTestimonial = asyncHandler(async (req, res) => {
  const { isPublished } = req.body;
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: { isPublished: !!isPublished },
    });
    return res.status(200).json(new ApiResponse(200, testimonial));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Testimonial not found");
    throw err;
  }
});

// ADMIN — delete
exports.deleteTestimonial = asyncHandler(async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    return res.status(200).json(new ApiResponse(200, null, "Testimonial deleted"));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Testimonial not found");
    throw err;
  }
});