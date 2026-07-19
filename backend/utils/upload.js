const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.memoryStorage();

const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only PDF or DOCX files are allowed"));
    }
    cb(null, true);
  },
});

/**
 * Uploads a buffer to Cloudinary as a raw resource (non-image files like
 * PDF/DOCX use resource_type "raw"). Call this AFTER multer has run, from
 * inside the route or a wrapping middleware — req.file.buffer must exist.
 */
function uploadResumeBufferToCloudinary(buffer, originalname) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "nexbyte/resumes", resource_type: "raw", filename_override: originalname, use_filename: true },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = { uploadResume, uploadResumeBufferToCloudinary };