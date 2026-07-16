const express = require("express");
const router = express.Router();

const {
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  publishService,
  deleteService,
} = require("../Controller/service.controller");

const {
  createServiceSchema,
  updateServiceSchema,
  publishServiceSchema,
  getServiceByIdSchema,
  deleteServiceSchema,
} = require("../validators/service.validator");

const { isAdmin } = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validate.middleware");
const { generalApiLimiter } = require("../Middleware/rateLimiter.middleware");

router.use(isAdmin);

router.get("/", generalApiLimiter, getAdminServices);
router.get("/:id", generalApiLimiter, validate(getServiceByIdSchema), getServiceById);
router.post("/", generalApiLimiter, validate(createServiceSchema), createService);
router.patch("/:id", generalApiLimiter, validate(updateServiceSchema), updateService);
router.patch("/:id/publish", generalApiLimiter, validate(publishServiceSchema), publishService);
router.delete("/:id", generalApiLimiter, validate(deleteServiceSchema), deleteService);

module.exports = router;