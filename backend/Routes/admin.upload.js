const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAdmin } = require("../middleware/auth.middleware");
const { uploadImage } = require("../controller/upload.controller");

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!allowed.has(file.mimetype)) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

router.use(isAdmin);
router.post("/image", imageUpload.single("image"), uploadImage);

module.exports = router;