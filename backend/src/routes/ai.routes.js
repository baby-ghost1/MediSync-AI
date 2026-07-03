import { Router } from "express";

import { AIController } from "../controllers/index.js";
import { auth, validate } from "../middleware/index.js";
import { chatSchema, askSchema, symptomsSchema, medicineSchema, healthTipsSchema } from "../validators/ai.validator.js";

const router = Router();

router.post("/website-assistant", AIController.websiteAssistant);

router.use(auth);

router.post("/chat", validate(chatSchema), AIController.chat);
router.get("/chat/history", AIController.getChatHistory);
router.delete("/chat/history", AIController.clearChatHistory);

router.post("/ask", validate(askSchema), AIController.askAI);
router.post("/symptoms", validate(symptomsSchema), AIController.analyzeSymptoms);
router.post("/medicine", validate(medicineSchema), AIController.medicineAdvice);
router.post("/health-score", AIController.calculateHealthScore);
router.post("/health-tips", validate(healthTipsSchema), AIController.healthTips);
router.post("/report/:reportId/summary", AIController.summarizeReport);
router.post("/report/:reportId/health-score", AIController.generateHealthScore);

export default router;
