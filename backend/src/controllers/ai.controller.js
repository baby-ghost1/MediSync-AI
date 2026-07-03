import { AIService } from "../services/index.js";
import { asyncHandler } from "../middleware/index.js";

class AIController {
  chat = asyncHandler(async (req, res) => {
    const data = await AIService.chat(req.user._id, req.body.prompt);
    res.json({ success: true, response: data.reply });
  });

  getChatHistory = asyncHandler(async (req, res) => {
    const data = await AIService.getChatHistory(req.user._id);
    res.json({ success: true, messages: data.messages });
  });

  clearChatHistory = asyncHandler(async (req, res) => {
    await AIService.clearChatHistory(req.user._id);
    res.json({ success: true, message: "Chat history cleared." });
  });

  summarizeReport = asyncHandler(async (req, res) => {
    const data = await AIService.summarizeReport(req.params.reportId);
    res.json({ success: true, summary: data?.aiSummary || data?.summary || data?.message });
  });

  generateHealthScore = asyncHandler(async (req, res) => {
    const data = await AIService.generateHealthScore(req.params.reportId);
    res.json({ success: true, score: data?.healthScore, summary: data?.aiSummary });
  });

  analyzeSymptoms = asyncHandler(async (req, res) => {
    const data = await AIService.analyzeSymptoms(req.body.symptoms);
    res.json({ success: true, ...data });
  });

  medicineAdvice = asyncHandler(async (req, res) => {
    const data = await AIService.medicineAdvice(req.body.medicine);
    res.json({ success: true, ...data });
  });

  calculateHealthScore = asyncHandler(async (req, res) => {
    const data = await AIService.calculateHealthScore(req.body);
    res.json({ success: true, healthScore: data.healthScore });
  });

  healthTips = asyncHandler(async (req, res) => {
    const data = await AIService.healthTips(req.body.age, req.body.gender);
    res.json({ success: true, tips: data.tips });
  });

  websiteAssistant = asyncHandler(async (req, res) => {
    const data = await AIService.websiteAssistant(req.body.message);
    res.json({ success: true, reply: data.reply });
  });

  askAI = asyncHandler(async (req, res) => {
    const data = await AIService.askAI(req.body.question);
    res.json({ success: true, answer: data.answer });
  });

  /* ==========================================
      Conversations
  ========================================== */

  listConversations = asyncHandler(async (req, res) => {
    const conversations = await AIService.listConversations(req.user._id);
    res.json({ success: true, data: conversations });
  });

  createConversation = asyncHandler(async (req, res) => {
    const conversation = await AIService.createConversation(req.user._id, req.body.title);
    res.status(201).json({ success: true, data: conversation });
  });

  getConversation = asyncHandler(async (req, res) => {
    const conversation = await AIService.getConversation(req.params.id, req.user._id);
    res.json({ success: true, data: conversation });
  });

  renameConversation = asyncHandler(async (req, res) => {
    const conversation = await AIService.renameConversation(req.params.id, req.user._id, req.body.title);
    res.json({ success: true, data: conversation });
  });

  deleteConversation = asyncHandler(async (req, res) => {
    const result = await AIService.deleteConversation(req.params.id, req.user._id);
    res.json(result);
  });

  conversationChat = asyncHandler(async (req, res) => {
    const data = await AIService.conversationChat(req.params.id, req.user._id, req.body.prompt);
    res.json({ success: true, response: data.reply });
  });

  conversationChatStream = asyncHandler(async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    await AIService.conversationChatStream(req.params.id, req.user._id, req.body.prompt, res);
  });

  interpretLabResults = asyncHandler(async (req, res) => {
    const data = await AIService.interpretLabResults(req.body);
    res.json({ success: true, interpretation: data.interpretation });
  });
}

export default new AIController();
