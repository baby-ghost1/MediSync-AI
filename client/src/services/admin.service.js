import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AdminService {
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
}

export default new AdminService();
