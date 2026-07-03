import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AIService {
  async websiteAssistant(message) {
    const { data } = await API.post(ENDPOINTS.AI.WEBSITE_ASSISTANT, { message });
    return data;
  }

  async chat(payload) {
    const { data } = await API.post(ENDPOINTS.AI.CHAT, { prompt: payload.message || payload });
    return data;
  }

  async getChatHistory() {
    const { data } = await API.get(ENDPOINTS.AI.CHAT_HISTORY);
    return data;
  }

  async clearChatHistory() {
    const { data } = await API.delete(ENDPOINTS.AI.CHAT_HISTORY);
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

  async healthScore(payload) {
    const { data } = await API.post(ENDPOINTS.AI.HEALTH_SCORE_CALC, payload);
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

  /* ==========================================
      Conversations
  ========================================== */

  async listConversations() {
    const { data } = await API.get(ENDPOINTS.AI.CONVERSATIONS);
    return data;
  }

  async createConversation(title) {
    const { data } = await API.post(ENDPOINTS.AI.CONVERSATIONS, { title });
    return data;
  }

  async getConversation(id) {
    const { data } = await API.get(ENDPOINTS.AI.CONVERSATION(id));
    return data;
  }

  async renameConversation(id, title) {
    const { data } = await API.patch(ENDPOINTS.AI.CONVERSATION(id), { title });
    return data;
  }

  async deleteConversation(id) {
    const { data } = await API.delete(ENDPOINTS.AI.CONVERSATION(id));
    return data;
  }

  async conversationChat(conversationId, prompt) {
    const { data } = await API.post(ENDPOINTS.AI.CONVERSATION_CHAT(conversationId), { prompt });
    return data;
  }

  async conversationChatStream(conversationId, prompt, onChunk, onDone, onError) {
    try {
      const token = API.defaults.headers.common["Authorization"]?.replace("Bearer ", "") || "";
      const response = await fetch(`${API.defaults.baseURL}${ENDPOINTS.AI.CONVERSATION_STREAM(conversationId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            onDone?.();
            return;
          }
          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === "text") {
              onChunk?.(parsed.content);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (buffer.startsWith("data: ")) {
        const payload = buffer.slice(6).trim();
        if (payload === "[DONE]") {
          onDone?.();
          return;
        }
      }

      onDone?.();
    } catch (error) {
      onError?.(error);
    }
  }

  /* ==========================================
      Lab Interpretation
  ========================================== */

  async interpretLabResults(payload) {
    const { data } = await API.post(ENDPOINTS.AI.INTERPRET_LAB, payload);
    return data;
  }
}

export default new AIService();
