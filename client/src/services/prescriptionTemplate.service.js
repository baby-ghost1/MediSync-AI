import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class PrescriptionTemplateService {
  async createTemplate(payload) {
    const { data } = await API.post(ENDPOINTS.PRESCRIPTION_TEMPLATES.CREATE, payload);
    return data;
  }

  async getTemplate(id) {
    const { data } = await API.get(ENDPOINTS.PRESCRIPTION_TEMPLATES.DETAILS(id));
    return data;
  }

  async updateTemplate(id, payload) {
    const { data } = await API.patch(ENDPOINTS.PRESCRIPTION_TEMPLATES.UPDATE(id), payload);
    return data;
  }

  async deleteTemplate(id) {
    const { data } = await API.delete(ENDPOINTS.PRESCRIPTION_TEMPLATES.DELETE(id));
    return data;
  }

  async getMyTemplates(params = {}) {
    const { data } = await API.get(ENDPOINTS.PRESCRIPTION_TEMPLATES.MY, { params });
    return data;
  }

  async toggleFavorite(id) {
    const { data } = await API.post(ENDPOINTS.PRESCRIPTION_TEMPLATES.FAVORITE(id));
    return data;
  }

  async incrementUsage(id) {
    const { data } = await API.post(ENDPOINTS.PRESCRIPTION_TEMPLATES.USE(id));
    return data;
  }
}

export default new PrescriptionTemplateService();
