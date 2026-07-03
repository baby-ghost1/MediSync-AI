import { Router } from "express";

import * as PrescriptionTemplateController from "../controllers/prescriptionTemplate.controller.js";
import { auth, authorize } from "../middleware/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  authorize("doctor", "admin"),
  PrescriptionTemplateController.createTemplate
);

router.get(
  "/my",
  PrescriptionTemplateController.getMyTemplates
);

router.post(
  "/:id/use",
  PrescriptionTemplateController.incrementUsage
);

router.post(
  "/:id/favorite",
  PrescriptionTemplateController.toggleFavorite
);

router.get(
  "/:id",
  PrescriptionTemplateController.getTemplate
);

router.patch(
  "/:id",
  authorize("doctor", "admin"),
  PrescriptionTemplateController.updateTemplate
);

router.delete(
  "/:id",
  authorize("doctor", "admin"),
  PrescriptionTemplateController.deleteTemplate
);

export default router;
