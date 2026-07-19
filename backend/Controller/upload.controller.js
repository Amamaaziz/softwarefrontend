const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "nexbyte/images", resource_type: "image", transformation: [{ width: 1200, crop: "limit" }] },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided");

  try {
    const result = await uploadBuffer(req.file.buffer);
    return res.status(200).json(new ApiResponse(200, { url: result.secure_url }, "Image uploaded"));
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new ApiError(502, "Failed to upload image to storage");
  }
});