// Middleware/upload.middleware.js

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const ApiError = require("../utils/ApiError");
const { sanitizeFilename } = require("../utils/sanitize");

/**
 * Security model for uploads:
 *
 * 1. Extension allowlist (not blocklist) — only known-safe image extensions
 *    are accepted. Blocklists are always incomplete.
 * 2. MIME type check from the browser's Content-Type header — a first,
 *    CHEAP filter, but NEVER trusted alone (trivially spoofable by
 *    renaming a .php file to .jpg and setting Content-Type manually).
 * 3. Magic-number (file signature) verification AFTER upload, in a
 *    separate step (verifyFileSignature) — checks the actual byte content
 *    of the file matches what it claims to be. This is the real defense
 *    against disguised executables/scripts.
 * 4. Filename sanitization — prevents path traversal and strips any
 *    characters that could be abused in shell commands, URLs, or on
 *    exotic filesystems.
 * 5. Files are written with a randomly generated name, NOT the original
 *    client-supplied filename — the original name is preserved only in
 *    metadata if you need it, never used as the actual disk path.
 * 6. Strict size and count limits — prevents disk-fill DoS.
 * 7. Upload directory is outside of anything ever passed to eval/exec,
 *    and is served statically as read-only static assets, never executed.
 */

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES_PER_REQUEST = 10;

// Extension -> expected MIME types (allowlist)
const ALLOWED_TYPES = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".gif": ["image/gif"],
};

// Magic number (file signature) reference for post-upload verification.
// Buffers are the leading bytes each file type actually starts with,
// regardless of what its extension/mimetype claims.
const FILE_SIGNATURES = {
  "image/jpeg": [Buffer.from([0xff, 0xd8, 0xff])],
  "image/png": [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  "image/gif": [Buffer.from("GIF87a", "ascii"), Buffer.from("GIF89a", "ascii")],
  "image/webp": [Buffer.from("RIFF", "ascii")], // WEBP has RIFF....WEBP; checked more precisely below
};

// Ensure upload directory exists at boot, not on first request.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Never trust or reuse the client-supplied filename directly.
    // Generate a random name; keep only the (already-validated) extension.
    const ext = path.extname(sanitizeFilename(file.originalname)).toLowerCase();
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(sanitizeFilename(file.originalname)).toLowerCase();

  if (!ALLOWED_TYPES[ext]) {
    return cb(new ApiError(400, `File type '${ext || "unknown"}' is not allowed`));
  }

  if (!ALLOWED_TYPES[ext].includes(file.mimetype)) {
    return cb(
      new ApiError(400, `File content type does not match its extension`)
    );
  }

  cb(null, true);
}

const baseUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_REQUEST,
    fields: 20, // caps non-file form fields to limit multipart abuse
    fieldNameSize: 100,
    fieldSize: 2 * 1024 * 1024, // 2MB max per non-file field value
  },
});

/**
 * Reads the first bytes of a file on disk and confirms they match a known
 * signature for the claimed mimetype. This runs AFTER multer has already
 * written the file, as a second-pass integrity check — catches the case
 * where someone renamed a malicious file and spoofed its Content-Type
 * header (fileFilter alone can't detect this, since it never inspects
 * actual bytes).
 */
function verifyFileSignature(filePath, mimetype) {
  const signatures = FILE_SIGNATURES[mimetype];
  if (!signatures) return false;

  const buffer = Buffer.alloc(16);
  const fd = fs.openSync(filePath, "r");
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  if (mimetype === "image/webp") {
    // WEBP = "RIFF" + 4 bytes size + "WEBP"
    return buffer.slice(0, 4).toString("ascii") === "RIFF" &&
      buffer.slice(8, 12).toString("ascii") === "WEBP";
  }

  return signatures.some((sig) => buffer.slice(0, sig.length).equals(sig));
}

/**
 * Wraps multer's single/array upload handlers with:
 *  - multer error translation into ApiError (so errorHandler.middleware.js
 *    handles them uniformly instead of multer's raw errors leaking through)
 *  - post-upload magic-number verification
 *  - automatic cleanup of any file that fails verification, so nothing
 *    invalid is ever left sitting on disk even momentarily longer than
 *    needed
 */
function handleUpload(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new ApiError(400, `File exceeds the ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit`));
        }
        if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
          return next(new ApiError(400, `Too many files, maximum ${MAX_FILES_PER_REQUEST} allowed`));
        }
        return next(new ApiError(400, "File upload error"));
      }

      if (err) return next(err); // ApiError thrown from fileFilter, or unexpected error

      const files = req.files || (req.file ? [req.file] : []);

      for (const file of files) {
        const valid = verifyFileSignature(file.path, file.mimetype);
        if (!valid) {
          // Clean up immediately — an invalid/disguised file should never
          // remain on disk, even briefly.
          for (const f of files) {
            fs.existsSync(f.path) && fs.unlinkSync(f.path);
          }
          return next(new ApiError(400, "File content does not match a valid image format"));
        }
      }

      // Expose a clean, public-facing relative path for each file so
      // controllers don't need to know about the disk layout.
      for (const file of files) {
        file.publicUrl = `/uploads/${path.basename(file.path)}`;
      }

      next();
    });
  };
}

// Common exports for route usage:
//   router.post("/", uploadSingle("image"), controller.create)
//   router.post("/", uploadArray("images", 5), controller.create)

const uploadSingle = (fieldName) => handleUpload(baseUpload.single(fieldName));
const uploadArray = (fieldName, maxCount = MAX_FILES_PER_REQUEST) =>
  handleUpload(baseUpload.array(fieldName, maxCount));

module.exports = {
  uploadSingle,
  uploadArray,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
};