// Middleware/upload.middleware.js

const multer = require("multer");
const path = require("path");
const streamifier = require("streamifier");
const ApiError = require("../utils/ApiError");
const { sanitizeFilename } = require("../utils/sanitize");
const cloudinary = require("../config/cloudinary");

/**
 * Security model for uploads (Cloudinary version):
 *
 * 1. Extension allowlist (not blocklist) per upload kind (image vs resume).
 * 2. MIME type check from the browser's Content-Type header — cheap first
 *    filter, never trusted alone.
 * 3. Magic-number (file signature) verification on the in-memory buffer
 *    BEFORE it's ever sent to Cloudinary — same defense as before, just
 *    checked on the buffer instead of a file on disk.
 * 4. Nothing is ever written to local disk — multer uses memoryStorage,
 *    so there's no ephemeral-filesystem risk on hosts that wipe disk on
 *    redeploy/restart.
 * 5. Strict size and count limits — prevents abuse regardless of storage
 *    backend.
 * 6. Cloudinary is the source of truth for the final public URL — nothing
 *    in this app ever constructs a file path for a client-supplied name.
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES_PER_REQUEST = 10;

const ALLOWED_IMAGE_TYPES = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".gif": ["image/gif"],
};

const ALLOWED_RESUME_TYPES = {
  ".pdf": ["application/pdf"],
};

const FILE_SIGNATURES = {
  "image/jpeg": [Buffer.from([0xff, 0xd8, 0xff])],
  "image/png": [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  "image/gif": [Buffer.from("GIF87a", "ascii"), Buffer.from("GIF89a", "ascii")],
  "image/webp": [Buffer.from("RIFF", "ascii")], // checked more precisely below
  "application/pdf": [Buffer.from("%PDF-", "ascii")],
};

function verifyBufferSignature(buffer, mimetype) {
  const signatures = FILE_SIGNATURES[mimetype];
  if (!signatures) return false;

  if (mimetype === "image/webp") {
    return (
      buffer.slice(0, 4).toString("ascii") === "RIFF" &&
      buffer.slice(8, 12).toString("ascii") === "WEBP"
    );
  }

  return signatures.some((sig) => buffer.slice(0, sig.length).equals(sig));
}

function makeFileFilter(allowedTypes) {
  return (req, file, cb) => {
    const ext = path.extname(sanitizeFilename(file.originalname)).toLowerCase();

    if (!allowedTypes[ext]) {
      return cb(new ApiError(400, `File type '${ext || "unknown"}' is not allowed`));
    }
    if (!allowedTypes[ext].includes(file.mimetype)) {
      return cb(new ApiError(400, "File content type does not match its extension"));
    }
    cb(null, true);
  };
}

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: makeFileFilter(ALLOWED_IMAGE_TYPES),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_REQUEST,
    fields: 20,
    fieldNameSize: 100,
    fieldSize: 2 * 1024 * 1024,
  },
});

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: makeFileFilter(ALLOWED_RESUME_TYPES),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
    fields: 20,
    fieldNameSize: 100,
    fieldSize: 2 * 1024 * 1024,
  },
});

function uploadBufferToCloudinary(buffer, { folder, resourceType }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Wraps a multer memory-storage handler with:
 *  - multer error translation into ApiError
 *  - post-upload magic-number verification on the in-memory buffer
 *  - upload to Cloudinary, attaching the resulting secure_url + public_id
 *    onto req.file / req.files so controllers stay storage-agnostic
 */
function handleUpload(multerMiddleware, { folder, resourceType }) {
  return (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new ApiError(400, `File exceeds the ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit`));
        }
        if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
          return next(new ApiError(400, `Too many files, maximum ${MAX_FILES_PER_REQUEST} allowed`));
        }
        return next(new ApiError(400, "File upload error"));
      }
      if (err) return next(err);

      const files = req.files || (req.file ? [req.file] : []);
      if (files.length === 0) return next();

      try {
        for (const file of files) {
          const valid = verifyBufferSignature(file.buffer, file.mimetype);
          if (!valid) {
            return next(new ApiError(400, "File content does not match a valid format"));
          }
        }

        for (const file of files) {
          const result = await uploadBufferToCloudinary(file.buffer, { folder, resourceType });
          file.cloudinaryUrl = result.secure_url;
          file.cloudinaryPublicId = result.public_id;
        }

        next();
      } catch (uploadErr) {
        next(new ApiError(500, "Failed to upload file to storage"));
      }
    });
  };
}

// Usage:
//   router.post("/", uploadImageSingle("photo"), controller.create)
//   router.post("/", uploadResumeSingle("resume"), controller.create)

const uploadImageSingle = (fieldName) =>
  handleUpload(imageUpload.single(fieldName), { folder: "nexbyte/images", resourceType: "image" });

const uploadImageArray = (fieldName, maxCount = MAX_FILES_PER_REQUEST) =>
  handleUpload(imageUpload.array(fieldName, maxCount), { folder: "nexbyte/images", resourceType: "image" });

const uploadResumeSingle = (fieldName) =>
  handleUpload(resumeUpload.single(fieldName), { folder: "nexbyte/resumes", resourceType: "raw" });

module.exports = {
  uploadImageSingle,
  uploadImageArray,
  uploadResumeSingle,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
};