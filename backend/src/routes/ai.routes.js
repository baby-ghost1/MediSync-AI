import { Router } from "express";

import { AIController } from "../controllers/index.js";
import { auth, validate } from "../middleware/index.js";
import { chatSchema, askSchema, symptomsSchema, medicineSchema, healthTipsSchema } from "../validators/ai.validator.js";

const router = Router();

/**
 * @openapi
 * /api/ai/website-assistant:
 *   post:
 *     tags: [AI]
 *     summary: Public website assistant (no auth required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 */
router.post("/website-assistant", AIController.websiteAssistant);

router.use(auth);

/**
 * @openapi
 * /api/ai/chat:
 *   post:
 *     tags: [AI]
 *     summary: Send a chat message to the AI assistant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI chat response
 */
router.post("/chat", validate(chatSchema), AIController.chat);

/**
 * @openapi
 * /api/ai/chat/history:
 *   get:
 *     tags: [AI]
 *     summary: Get chat history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history
 *   delete:
 *     tags: [AI]
 *     summary: Clear chat history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history cleared
 */
router.get("/chat/history", AIController.getChatHistory);
router.delete("/chat/history", AIController.clearChatHistory);

/**
 * @openapi
 * /api/ai/ask:
 *   post:
 *     tags: [AI]
 *     summary: Ask a general health question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI answer
 */
router.post("/ask", validate(askSchema), AIController.askAI);

/**
 * @openapi
 * /api/ai/symptoms:
 *   post:
 *     tags: [AI]
 *     summary: Analyze symptoms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symptoms
 *             properties:
 *               symptoms:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Symptom analysis
 */
router.post("/symptoms", validate(symptomsSchema), AIController.analyzeSymptoms);

/**
 * @openapi
 * /api/ai/medicine:
 *   post:
 *     tags: [AI]
 *     summary: Get medicine information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicineName
 *             properties:
 *               medicineName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicine information
 */
router.post("/medicine", validate(medicineSchema), AIController.medicineAdvice);

/**
 * @openapi
 * /api/ai/health-score:
 *   post:
 *     tags: [AI]
 *     summary: Calculate a health score
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health score calculation
 */
router.post("/health-score", AIController.calculateHealthScore);

router.post("/health-tips", validate(healthTipsSchema), AIController.healthTips);
router.post("/report/:reportId/summary", AIController.summarizeReport);
router.post("/report/:reportId/health-score", AIController.generateHealthScore);

/**
 * @openapi
 * /api/ai/conversations:
 *   get:
 *     tags: [AI]
 *     summary: List all conversations for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *   post:
 *     tags: [AI]
 *     summary: Create a new conversation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 default: "New Conversation"
 *     responses:
 *       201:
 *         description: Conversation created
 */
router.get("/conversations", AIController.listConversations);
router.post("/conversations", AIController.createConversation);

/**
 * @openapi
 * /api/ai/conversations/{id}:
 *   get:
 *     tags: [AI]
 *     summary: Get a conversation with its messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation with messages
 *   patch:
 *     tags: [AI]
 *     summary: Rename a conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation renamed
 *   delete:
 *     tags: [AI]
 *     summary: Delete a conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation deleted
 */
router.get("/conversations/:id", AIController.getConversation);
router.patch("/conversations/:id", AIController.renameConversation);
router.delete("/conversations/:id", AIController.deleteConversation);

/**
 * @openapi
 * /api/ai/conversations/{id}/chat:
 *   post:
 *     tags: [AI]
 *     summary: Send a message in a conversation (non-streaming)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 */
router.post("/conversations/:id/chat", AIController.conversationChat);
router.post("/conversations/:id/stream", AIController.conversationChatStream);

/**
 * @openapi
 * /api/ai/interpret-lab:
 *   post:
 *     tags: [AI]
 *     summary: Interpret lab test results
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testType
 *               - results
 *             properties:
 *               testType:
 *                 type: string
 *                 description: Type of lab test (e.g., CBC, BMP, Lipid Panel)
 *               customTestName:
 *                 type: string
 *               results:
 *                 type: string
 *                 description: Lab results text to interpret
 *               patientAge:
 *                 type: number
 *               patientGender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab interpretation
 */
router.post("/interpret-lab", AIController.interpretLabResults);

export default router;
