const express = require("express");
const router = express.Router();

const {
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  publishService,
  deleteService,
} = require("../controller/service.controller");

const {
  createServiceSchema,
  updateServiceSchema,
  publishServiceSchema,
  getServiceByIdSchema,
  deleteServiceSchema,
} = require("../validators/service.validator");

const { isAdmin } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { generalApiLimiter } = require("../middleware/rateLimiter.middleware");

router.use(isAdmin);

router.get("/", generalApiLimiter, getAdminServices);
router.get("/:id", generalApiLimiter, validate(getServiceByIdSchema), getServiceById);
router.post("/", generalApiLimiter, validate(createServiceSchema), createService);
router.patch("/:id", generalApiLimiter, validate(updateServiceSchema), updateService);
router.patch("/:id/publish", generalApiLimiter, validate(publishServiceSchema), publishService);
router.delete("/:id", generalApiLimiter, validate(deleteServiceSchema), deleteService);

module.exports = router;