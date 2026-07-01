import ai from "../config/googleAI.js";

import {
  ReportRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class AIService {
  /* ==========================================
      Chat
  ========================================== */

  async chat(prompt) {
    if (!prompt) {
      throw new ApiError(
        400,
        "Prompt is required."
      );
    }

    if (!ai) {
      return {
        reply:
          "AI service is not configured. Please set a Gemini API key.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model:
            "gemini-2.5-flash",

          contents: prompt,
        });

      return {
        reply:
          response.text,
      };
    } catch (error) {
      return {
        reply:
          "AI request failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Report Summary
  ========================================== */

  async summarizeReport(
    reportId
  ) {
    const report =
      await ReportRepository.getReport(
        reportId
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    const prompt = `
Summarize the following medical report in simple language.

Title:
${report.title}

Diagnosis:
${report.diagnosis}

Observations:
${report.observations}

Recommendations:
${report.recommendations}
`;

    if (!ai) {
      return {
        success: true,
        message:
          "AI summary is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model:
            "gemini-2.5-flash",

          contents: prompt,
        });

      const summary =
        response.text;

      return ReportRepository.saveAISummary(
        reportId,
        summary,
        report.healthScore
      );
    } catch (error) {
      return {
        success: true,
        message:
          "AI summary failed. Please verify the Gemini API key.",
      };
    }

    return ReportRepository.saveAISummary(
      reportId,
      summary,
      report.healthScore
    );
  }

  /* ==========================================
      Health Score
  ========================================== */

  async generateHealthScore(
    reportId
  ) {
    const report =
      await ReportRepository.getReport(
        reportId
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    const prompt = `
Analyze this report and return ONLY one integer between 0 and 100.

Diagnosis:
${report.diagnosis}

Observations:
${report.observations}
`;

    if (!ai) {
      return {
        success: true,
        message:
          "Health score generation is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model:
            "gemini-2.5-flash",

          contents: prompt,
        });

      let score =
        Number(response.text);

    if (
      Number.isNaN(score)
    ) {
      score = 70;
    }

      score = Math.min(
        100,
        Math.max(0, score)
      );

      return ReportRepository.saveAISummary(
        reportId,
        report.aiSummary,
        score
      );
    } catch (error) {
      return {
        success: true,
        message:
          "Health score generation failed. Please verify the Gemini API key.",
      };
    }
  }
    /* ==========================================
      Symptom Analysis
  ========================================== */

  async analyzeSymptoms(
    symptoms
  ) {
    if (
      !symptoms ||
      symptoms.length === 0
    ) {
      throw new ApiError(
        400,
        "Symptoms are required."
      );
    }

    const prompt = `
You are an experienced physician.

Analyze these symptoms:

${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}

Return:

1. Possible diseases
2. Severity
3. Recommended specialist
4. Suggested tests
5. Home care
6. Emergency warning signs

Keep the response concise.
`;

    if (!ai) {
      return {
        symptoms,
        analysis:
          "AI symptom analysis is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      return {
        symptoms,
        analysis: response.text,
      };
    } catch (error) {
      return {
        symptoms,
        analysis:
          "AI symptom analysis failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Medicine Information
  ========================================== */

  async medicineAdvice(
    medicine
  ) {
    if (!medicine) {
      throw new ApiError(
        400,
        "Medicine name is required."
      );
    }

    const prompt = `
Provide medical information for:

${medicine}

Include:

- Uses
- Dosage
- Side Effects
- Precautions
- Drug Interactions
- Storage
`;

    if (!ai) {
      return {
        medicine,
        information:
          "AI medicine guidance is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      return {
        medicine,
        information:
          response.text,
      };
    } catch (error) {
      return {
        medicine,
        information:
          "AI medicine guidance failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Health Tips
  ========================================== */

  async healthTips(
    age,
    gender
  ) {
    const prompt = `
Generate personalized health tips.

Age: ${age}
Gender: ${gender}

Include:

- Diet
- Exercise
- Sleep
- Water Intake
- Regular Checkups
- Vaccinations
`;

    if (!ai) {
      return {
        tips:
          "AI health tips are unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      return {
        tips: response.text,
      };
    } catch (error) {
      return {
        tips:
          "AI health tips failed. Please verify the Gemini API key.",
      };
    }
  }

  /* ==========================================
      Ask Doctor AI
  ========================================== */

  async askAI(question) {
    if (!question) {
      throw new ApiError(
        400,
        "Question is required."
      );
    }

    if (!ai) {
      return {
        answer:
          "AI assistant is unavailable because the Gemini API key is not configured.",
      };
    }

    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: question,
        });

      return {
        answer:
          response.text,
      };
    } catch (error) {
      return {
        answer:
          "AI assistant request failed. Please verify the Gemini API key.",
      };
    }
  }
}

export default new AIService();