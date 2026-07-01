import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AIService {
  async chat(payload) {
    const { data } = await API.post(ENDPOINTS.AI.CHAT, { prompt: payload.message || payload });
    return data;
  }

  async askAI(question) {
    const { data } = await API.post(ENDPOINTS.AI.ASK, { question });
    return data;
  }

  async analyzeSymptoms(symptoms) {
    const { data } = await API.post(ENDPOINTS.AI.SYMPTOMS, { symptoms });
    return data;
  }

  async summarizeReport(reportId) {
    const { data } = await API.post(ENDPOINTS.AI.SUMMARIZE_REPORT(reportId));
    return data;
  }

  async healthScore(reportId, payload = {}) {
    const { data } = await API.post(ENDPOINTS.AI.HEALTH_SCORE(reportId), payload);
    return data;
  }

  async medicineAdvice(medicine) {
    const { data } = await API.post(ENDPOINTS.AI.MEDICINE_ADVICE, { medicine });
    return data;
  }

  async healthTips(payload) {
    const { data } = await API.post(ENDPOINTS.AI.HEALTH_TIPS, payload);
    return data;
  }
}

export default new AIService();
