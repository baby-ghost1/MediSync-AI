import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AdminService {
  async login(credentials) {
    const { data } = await API.post(ENDPOINTS.ADMIN.LOGIN, credentials);
    return data;
  }

  async getDashboard() {
    const { data } = await API.get(ENDPOINTS.ADMIN.DASHBOARD);
    return data;
  }

  async getStatistics(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.STATISTICS, { params });
    return data;
  }

  async getUsers(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.USERS, { params });
    return data;
  }

  async deleteUser(id) {
    const { data } = await API.delete(`${ENDPOINTS.ADMIN.USERS}/${id}`);
    return data;
  }

  async verifyUser(id) {
    const { data } = await API.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/verify`);
    return data;
  }

  async blockUser(id) {
    const { data } = await API.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/block`);
    return data;
  }

  async unblockUser(id) {
    const { data } = await API.patch(`${ENDPOINTS.ADMIN.USERS}/${id}/unblock`);
    return data;
  }

  async getDoctors(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.DOCTORS, { params });
    return data;
  }

  async verifyDoctor(id) {
    const { data } = await API.patch(`${ENDPOINTS.ADMIN.DOCTORS}/${id}/verify`);
    return data;
  }

  async getAppointments(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.APPOINTMENTS, { params });
    return data;
  }

  async updateAppointmentStatus(id, status) {
    const { data } = await API.patch(`${ENDPOINTS.ADMIN.APPOINTMENTS}/${id}/status`, { status });
    return data;
  }

  async getReports(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.REPORTS, { params });
    return data;
  }

  async getPrescriptions(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.PRESCRIPTIONS, { params });
    return data;
  }

  async broadcast(payload) {
    const { data } = await API.post(ENDPOINTS.ADMIN.BROADCAST, payload);
    return data;
  }

  async getSettings() {
    const { data } = await API.get("/admin/settings");
    return data;
  }

  async updateSettings(payload) {
    const { data } = await API.patch("/admin/settings", payload);
    return data;
  }

  async approveDoctor(id) {
    const { data } = await API.patch(ENDPOINTS.ADMIN.APPROVE_DOCTOR(id));
    return data;
  }

  async rejectDoctor(id) {
    const { data } = await API.patch(ENDPOINTS.ADMIN.REJECT_DOCTOR(id));
    return data;
  }

  async getAuditLogs(params = {}) {
    const { data } = await API.get(ENDPOINTS.ADMIN.AUDIT_LOGS, { params });
    return data;
  }

  async getAuditStatistics() {
    const { data } = await API.get(ENDPOINTS.ADMIN.AUDIT_STATISTICS);
    return data;
  }
}

export default new AdminService();
