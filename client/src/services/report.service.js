import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class ReportService {
  async getReports(params = {}) {
    const { data } = await API.get(ENDPOINTS.REPORTS.ALL, { params });
    return data;
  }

  async getReport(id) {
    const { data } = await API.get(ENDPOINTS.REPORTS.DETAILS(id));
    return data;
  }

  async createReport(payload) {
    const { data } = await API.post(ENDPOINTS.REPORTS.CREATE, payload);
    return data;
  }

  async updateReport(id, payload) {
    const { data } = await API.patch(ENDPOINTS.REPORTS.UPDATE(id), payload);
    return data;
  }

  async deleteReport(id) {
    const { data } = await API.delete(ENDPOINTS.REPORTS.DELETE(id));
    return data;
  }

  async uploadReport(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await API.post(ENDPOINTS.UPLOADS.FILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  async addAttachment(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await API.post(`${ENDPOINTS.REPORTS.DETAILS(id)}/attachment`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  async removeAttachment(reportId, publicId) {
    const { data } = await API.delete(`${ENDPOINTS.REPORTS.DETAILS(reportId)}/attachment/${publicId}`);
    return data;
  }

  async updateAISummary(id, summary) {
    const { data } = await API.patch(`${ENDPOINTS.REPORTS.DETAILS(id)}/ai-summary`, { summary });
    return data;
  }

  async searchReports(query) {
    const { data } = await API.get(ENDPOINTS.REPORTS.SEARCH, { params: { search: query } });
    return data;
  }

  async getPatientReports(patientId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.REPORTS.ALL}/patient/${patientId}`, { params });
    return data;
  }

  async getDoctorReports(doctorId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.REPORTS.ALL}/doctor/${doctorId}`, { params });
    return data;
  }

  async getByAppointment(appointmentId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.REPORTS.ALL}/appointment/${appointmentId}`, { params });
    return data;
  }
}

export default new ReportService();
