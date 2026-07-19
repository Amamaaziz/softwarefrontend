const asyncHandler = require("../utils/asyncHandler");
const { uploadResumeBufferToCloudinary } = require("../utils/upload");

/**
 * Runs after uploadResume.single("resume") — takes the in-memory buffer
 * multer produced and pushes it to Cloudinary, attaching the resulting
 * secure_url onto req.file.cloudinaryUrl for the controller to use.
 */
const pushResumeToCloudinary = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(); // resume is optional on submitApplication

  const result = await uploadResumeBufferToCloudinary(req.file.buffer, req.file.originalname);
  req.file.cloudinaryUrl = result.secure_url;
  next();
});

module.exports = { pushResumeToCloudinary };