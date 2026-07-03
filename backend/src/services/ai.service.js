import ai from "../config/googleAI.js";
import { ReportRepository, ChatRepository } from "../repositories/index.js";
import Conversation from "../models/Conversation.js";
import { ApiError } from "../utils/index.js";
import logger from "./logger.service.js";

const MEDICAL_SYSTEM_PROMPT = `You are MediSync AI, a helpful medical information assistant. Your purpose is to provide general health education, discuss symptoms in an informational context, explain medical conditions and medications, and offer lifestyle and nutrition guidance.

IMPORTANT - You MUST follow these rules:
1. ALWAYS include this disclaimer: "⚠️ This information is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for personal medical decisions."
2. NEVER claim to replace a licensed doctor or healthcare professional.
3. For emergency symptoms (chest pain, severe bleeding, difficulty breathing, sudden severe headache, etc.), ALWAYS advise seeking immediate emergency care.
4. Do NOT provide definitive diagnoses - only discuss possible causes in general terms.
5. Be compassionate, clear, and use simple language.
6. For medication questions, provide general information about uses, common dosages, side effects, and precautions. Always advise consulting a doctor or pharmacist.
7. For mental health concerns, be supportive and recommend speaking with a mental health professional.
8. Do NOT prescribe specific treatments or medications.
9. Be concise but thorough in your responses.`;

class AIService {
  /* ==========================================
      Chat (with history persistence)
  ========================================== */

  async chat(userId, prompt) {
    if (!prompt) {
      throw new ApiError(400, "Prompt is required.");
    }

    await ChatRepository.addMessage(userId, "user", prompt);

    if (!ai) {
      const fallback = "AI service is not configured. Please set a Gemini API key in the server configuration.";
      await ChatRepository.addMessage(userId, "assistant", fallback);
      return { reply: fallback };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${MEDICAL_SYSTEM_PROMPT}\n\nUser: ${prompt}`,
      });

      const reply = response.text;
      await ChatRepository.addMessage(userId, "assistant", reply);
      return { reply };
    } catch (error) {
      logger.error("AI Chat Error:", error?.message || error);
      const fallback = "AI request failed. Please verify the Gemini API key and try again.";
      await ChatRepository.addMessage(userId, "assistant", fallback);
      return { reply: fallback };
    }
  }

  /* ==========================================
      Chat History
  ========================================== */

  async getChatHistory(userId) {
    const chat = await ChatRepository.getOrCreate(userId);
    return { messages: chat.messages };
  }

  async clearChatHistory(userId) {
    await ChatRepository.clearChat(userId);
    return { messages: [] };
  }

  /* ==========================================
      Report Summary
  ========================================== */

  async summarizeReport(reportId) {
    const report = await ReportRepository.getReport(reportId);

    if (!report) {
      throw new ApiError(404, "Report not found.");
    }

    const prompt = `Summarize the following medical report in simple language.

Title:
${report.title}

Diagnosis:
${report.diagnosis}

Observations:
${report.observations}

Recommendations:
${report.recommendations}

${MEDICAL_SYSTEM_PROMPT}`;

    if (!ai) {
      return {
        success: true,
        message: "AI summary is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const summary = response.text;

      return ReportRepository.saveAISummary(reportId, summary, report.healthScore);
    } catch (error) {
      logger.error("AI Summarize Error:", error?.message || error);
      return {
        success: true,
        message: "AI summary failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Health Score
  ========================================== */

  async generateHealthScore(reportId) {
    const report = await ReportRepository.getReport(reportId);

    if (!report) {
      throw new ApiError(404, "Report not found.");
    }

    const prompt = `Analyze this medical report and return ONLY one integer between 0 and 100 representing the patient's health score. 100 is perfect health, 0 is critical.

Diagnosis:
${report.diagnosis}

Observations:
${report.observations}

Return ONLY a number.`;

    if (!ai) {
      return {
        success: true,
        message: "Health score generation is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let score = Number(response.text);

      if (Number.isNaN(score)) {
        score = 70;
      }

      score = Math.min(100, Math.max(0, score));

      return ReportRepository.saveAISummary(reportId, report.aiSummary, score);
    } catch (error) {
      logger.error("AI Health Score Error:", error?.message || error);
      return {
        success: true,
        message: "Health score generation failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Standalone Health Score Calculator
  ========================================== */

  async calculateHealthScore({ age, weight, height, conditions }) {
    if (!age || !weight || !height) {
      throw new ApiError(400, "Age, weight, and height are required.");
    }

    const prompt = `${MEDICAL_SYSTEM_PROMPT}

Calculate a health score based on the following information:

Age: ${age}
Weight: ${weight} kg
Height: ${height} cm
Existing Conditions: ${conditions || "None"}

Return a JSON object with exactly these fields:
- score: integer between 0-100
- insights: paragraph about their health insights
- risks: paragraph about potential risk factors
- recommendations: paragraph with actionable recommendations

Return ONLY the JSON object, no other text.`;

    if (!ai) {
      return {
        healthScore: {
          score: 70,
          insights: "Health score calculation unavailable.",
          risks: "AI service not configured.",
          recommendations: "Please set a Gemini API key.",
        },
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let parsed;
      try {
        parsed = JSON.parse(response.text.replace(/```json|```/g, "").trim());
      } catch {
        parsed = {
          score: 70,
          insights: response.text,
          risks: "Unable to parse structured data.",
          recommendations: "Please consult with a healthcare provider for a personalized assessment.",
        };
      }

      return {
        healthScore: {
          score: Math.min(100, Math.max(0, Number(parsed.score) || 70)),
          insights: parsed.insights || response.text,
          risks: parsed.risks || "Regular monitoring recommended.",
          recommendations: parsed.recommendations || "Maintain a healthy lifestyle with regular checkups.",
        },
      };
    } catch (error) {
      logger.error("AI Health Score Calculation Error:", error?.message || error);
      return {
        healthScore: {
          score: 70,
          insights: "Unable to calculate health score at this time.",
          risks: "Please try again later.",
          recommendations: "Consult with a healthcare provider for a professional assessment.",
        },
      };
    }
  }

  /* ==========================================
      Symptom Analysis
  ========================================== */

  async analyzeSymptoms(symptoms) {
    if (!symptoms || symptoms.length === 0) {
      throw new ApiError(400, "Symptoms are required.");
    }

    const prompt = `${MEDICAL_SYSTEM_PROMPT}

Analyze these symptoms from an educational perspective:

${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}

Return a structured analysis with:
1. Possible conditions (general information only)
2. Severity assessment
3. Recommended specialist type
4. Suggested tests
5. Home care measures
6. Emergency warning signs that require immediate medical attention

Keep the response clear and educational.`;

    if (!ai) {
      return {
        symptoms,
        analysis: "AI symptom analysis is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return {
        symptoms,
        analysis: response.text,
      };
    } catch (error) {
      logger.error("AI Symptom Analysis Error:", error?.message || error);
      return {
        symptoms,
        analysis: "AI symptom analysis failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Medicine Information
  ========================================== */

  async medicineAdvice(medicine) {
    if (!medicine) {
      throw new ApiError(400, "Medicine name is required.");
    }

    const prompt = `${MEDICAL_SYSTEM_PROMPT}

Provide general educational information about this medication:

${medicine}

Include:
- Common uses
- Typical dosage information (general ranges)
- Possible side effects
- Precautions and warnings
- Drug interactions
- Storage guidelines

Always advise consulting a healthcare professional.`;

    if (!ai) {
      return {
        medicine,
        information: "AI medicine guidance is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return {
        medicine,
        information: response.text,
      };
    } catch (error) {
      logger.error("AI Medicine Error:", error?.message || error);
      return {
        medicine,
        information: "AI medicine guidance failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Health Tips
  ========================================== */

  async healthTips(age, gender) {
    const prompt = `${MEDICAL_SYSTEM_PROMPT}

Generate personalized health tips for a ${age}-year-old ${gender}.

Include recommendations for:
- Diet and nutrition
- Exercise and physical activity
- Sleep hygiene
- Water intake
- Regular checkups and screenings
- Vaccinations
- Stress management`;

    if (!ai) {
      return {
        tips: "AI health tips are unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return {
        tips: response.text,
      };
    } catch (error) {
      logger.error("AI Health Tips Error:", error?.message || error);
      return {
        tips: "AI health tips failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Website Assistant (no auth needed)
  ========================================== */

  async websiteAssistant(message) {
    if (!message) {
      throw new ApiError(400, "Message is required.");
    }

    const WEBSITE_SYSTEM_PROMPT = `You are MediSync AI Website Assistant. Your only job is to help users navigate the MediSync AI healthcare platform.

## About MediSync AI
MediSync AI is a healthcare management platform with three roles: Patient, Doctor, Admin.

### Patient Features
- Dashboard — overview of appointments, reports, health score
- Book Appointment — search doctors by specialization and book slots
- My Appointments — view upcoming/past appointments
- Doctors — browse all available doctors
- Medical Records — upload and manage reports (PDF, images)
- AI Assistant — chat with AI about health questions
- AI Symptom Checker — describe symptoms for educational analysis
- AI Medicine Info — get general medication information
- AI Health Score — calculate a health score from age, weight, height
- AI Health Tips — personalized wellness tips
- Profile — edit personal info and avatar
- Notifications — view real-time alerts
- Settings — update preferences, change password, delete account

### Doctor Features
- Dashboard — today's appointments, patient stats, notifications
- Appointments — manage (confirm/complete/cancel)
- Patients — browse assigned patients
- Reports — view patient medical reports
- AI Report Analysis — chat-based AI analysis of medical data
- Notifications, Profile, Settings

### Admin Features
- Dashboard — platform-wide statistics
- Users — manage all users (verify/block/delete)
- Doctors — verify doctor accounts
- Patients — view patient list
- Appointments — view all, update status
- Reports — view/delete reports
- Analytics — platform metrics
- System Settings — configure platform-wide settings

## Rules
1. Keep answers short, helpful, and practical (2-3 sentences per point)
2. Suggest relevant features based on what the user wants to do
3. If asked about medical/health questions, redirect: "For health questions, try our AI Assistant or Symptom Checker in your Patient dashboard."
4. Never give medical advice — point to the AI tools instead
5. If unsure, say "Try checking the sidebar menu or contact support."`;

    if (!ai) {
      return {
        reply: "AI assistant is not configured. Please contact the administrator.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${WEBSITE_SYSTEM_PROMPT}\n\nUser: ${message}`,
      });

      return { reply: response.text };
    } catch (error) {
      logger.error("Website Assistant Error:", error?.message || error);
      return {
        reply: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
    }
  }

  /* ==========================================
      Ask Doctor AI
  ========================================== */

  async askAI(question) {
    if (!question) {
      throw new ApiError(400, "Question is required.");
    }

    if (!ai) {
      return {
        answer: "AI assistant is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${MEDICAL_SYSTEM_PROMPT}\n\nUser Question: ${question}`,
      });

      return {
        answer: response.text,
      };
    } catch (error) {
      logger.error("AI Ask Error:", error?.message || error);
      return {
        answer: "AI assistant request failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Conversations (Multi-Conversation)
  ========================================== */

  async listConversations(userId) {
    const conversations = await Conversation.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select("title updatedAt createdAt")
      .lean();
    return conversations;
  }

  async createConversation(userId, title) {
    const conversation = await Conversation.create({
      user: userId,
      title: title || "New Conversation",
    });
    return conversation;
  }

  async getConversation(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });
    if (!conversation) throw new ApiError(404, "Conversation not found.");
    return conversation;
  }

  async renameConversation(conversationId, userId, title) {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, user: userId },
      { title },
      { new: true, runValidators: true }
    );
    if (!conversation) throw new ApiError(404, "Conversation not found.");
    return conversation;
  }

  async deleteConversation(conversationId, userId) {
    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      user: userId,
    });
    if (!conversation) throw new ApiError(404, "Conversation not found.");
    return { success: true, message: "Conversation deleted." };
  }

  /* ==========================================
      Conversation Chat (with context)
  ========================================== */

  async conversationChat(conversationId, userId, prompt) {
    if (!prompt) throw new ApiError(400, "Prompt is required.");

    const conversation = await this.getConversation(conversationId, userId);

    conversation.messages.push({ role: "user", content: prompt });

    if (!ai) {
      const fallback = "AI service is not configured. Please set a Gemini API key.";
      conversation.messages.push({ role: "assistant", content: fallback });
      await conversation.save();
      return { reply: fallback };
    }

    try {
      const historyContext = conversation.messages
        .slice(-20)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${MEDICAL_SYSTEM_PROMPT}\n\n${historyContext}`,
      });

      const reply = response.text;
      conversation.messages.push({ role: "assistant", content: reply });
      conversation.title = conversation.messages.length <= 2
        ? prompt.slice(0, 100)
        : conversation.title;
      await conversation.save();

      return { reply };
    } catch (error) {
      logger.error("AI Conversation Chat Error:", error?.message || error);
      const fallback = "AI request failed. Please try again.";
      conversation.messages.push({ role: "assistant", content: fallback });
      await conversation.save();
      return { reply: fallback };
    }
  }

  /* ==========================================
      Conversation Chat Streaming (SSE)
  ========================================== */

  async conversationChatStream(conversationId, userId, prompt, res) {
    if (!prompt) throw new ApiError(400, "Prompt is required.");

    const conversation = await this.getConversation(conversationId, userId);

    conversation.messages.push({ role: "user", content: prompt });

    if (!ai) {
      const fallback = "AI service is not configured. Please set a Gemini API key.";
      conversation.messages.push({ role: "assistant", content: fallback });
      await conversation.save();
      res.write(`data: ${JSON.stringify({ type: "text", content: fallback })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    try {
      const historyContext = conversation.messages
        .slice(-20)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: `${MEDICAL_SYSTEM_PROMPT}\n\n${historyContext}`,
      });

      let fullReply = "";
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullReply += text;
          res.write(`data: ${JSON.stringify({ type: "text", content: text })}\n\n`);
        }
      }

      conversation.messages.push({ role: "assistant", content: fullReply });
      conversation.title = conversation.messages.length <= 2
        ? prompt.slice(0, 100)
        : conversation.title;
      await conversation.save();

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      logger.error("AI Stream Error:", error?.message || error);
      const fallback = "AI request failed. Please try again.";
      conversation.messages.push({ role: "assistant", content: fallback });
      await conversation.save();
      res.write(`data: ${JSON.stringify({ type: "text", content: fallback })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }

  /* ==========================================
      Lab Interpretation
  ========================================== */

  async interpretLabResults(labData) {
    const { testType, results, patientAge, patientGender } = labData;

    if (!testType || !results) {
      throw new ApiError(400, "Test type and results are required.");
    }

    const prompt = `${MEDICAL_SYSTEM_PROMPT}

You are a clinical laboratory interpretation assistant. Analyze the following lab results and provide a structured interpretation.

Test Type: ${testType}
${patientAge ? `Patient Age: ${patientAge}` : ""}
${patientGender ? `Patient Gender: ${patientGender}` : ""}

Results:
${typeof results === "string" ? results : JSON.stringify(results, null, 2)}

Provide a structured interpretation with:
1. Summary of key findings
2. Values outside normal range (highlighted)
3. Potential clinical significance
4. Recommendations for follow-up
5. Caveats and limitations

Format the response in clear sections with markdown. Always include the standard medical disclaimer.`;

    if (!ai) {
      return {
        interpretation: "AI lab interpretation is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return { interpretation: response.text };
    } catch (error) {
      logger.error("AI Lab Interpretation Error:", error?.message || error);
      return {
        interpretation: "AI lab interpretation failed. Please verify the Gemini API key.",
      };
    }
  }
}

export default new AIService();
