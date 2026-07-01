import {
  AIService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class AIController {
  chat = asyncHandler(async (req, res) => {
    const data = await AIService.chat(req.body.prompt);
    res.json({ success: true, response: data.reply });
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

  healthTips = asyncHandler(async (req, res) => {
    const data = await AIService.healthTips(req.body.age, req.body.gender);
    res.json({ success: true, tips: data.tips });
  });

  askAI = asyncHandler(async (req, res) => {
    const data = await AIService.askAI(req.body.question);
    res.json({ success: true, answer: data.answer });
  });
}

export default new AIController();