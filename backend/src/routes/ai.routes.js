import { Router } from "express";

import {
  AIController,
} from "../controllers/index.js";

import {
  auth,
} from "../middleware/index.js";

const router = Router();

router.use(auth);

router.post(
  "/chat",
  AIController.chat
);

router.post(
  "/ask",
  AIController.askAI
);

router.post(
  "/symptoms",
  AIController.analyzeSymptoms
);

router.post(
  "/medicine",
  AIController.medicineAdvice
);

router.post(
  "/health-tips",
  AIController.healthTips
);

router.post(
  "/report/:reportId/summary",
  AIController.summarizeReport
);

router.post(
  "/report/:reportId/health-score",
  AIController.generateHealthScore
);

export default router;