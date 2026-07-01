import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class PrescriptionService {
  async getPrescriptions(params = {}) {
    const { data } = await API.get(ENDPOINTS.PRESCRIPTIONS.ALL, { params });
    return data;
  }

  async getPrescription(id) {
    const { data } = await API.get(ENDPOINTS.PRESCRIPTIONS.DETAILS(id));
    return data;
  }

  async createPrescription(payload) {
    const { data } = await API.post(ENDPOINTS.PRESCRIPTIONS.CREATE, payload);
    return data;
  }

  async updatePrescription(id, payload) {
    const { data } = await API.patch(ENDPOINTS.PRESCRIPTIONS.UPDATE(id), payload);
    return data;
  }

  async deletePrescription(id) {
    const { data } = await API.delete(ENDPOINTS.PRESCRIPTIONS.DETAILS(id));
    return data;
  }

  async searchPrescriptions(query) {
    const { data } = await API.get(ENDPOINTS.PRESCRIPTIONS.SEARCH, { params: { search: query } });
    return data;
  }

  async getPatientPrescriptions(patientId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.PRESCRIPTIONS.ALL}/patient/${patientId}`, { params });
    return data;
  }

  async getDoctorPrescriptions(doctorId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.PRESCRIPTIONS.ALL}/doctor/${doctorId}`, { params });
    return data;
  }

  async getActivePrescriptions(patientId) {
    const { data } = await API.get(`${ENDPOINTS.PRESCRIPTIONS.ALL}/active/${patientId}`);
    return data;
  }

  async markDispensed(id) {
    const { data } = await API.patch(`${ENDPOINTS.PRESCRIPTIONS.DETAILS(id)}/dispense`);
    return data;
  }

  async markCompleted(id) {
    const { data } = await API.patch(`${ENDPOINTS.PRESCRIPTIONS.DETAILS(id)}/complete`);
    return data;
  }

  async renewPrescription(id) {
    const { data } = await API.patch(`${ENDPOINTS.PRESCRIPTIONS.DETAILS(id)}/renew`);
    return data;
  }
}

export default new PrescriptionService();
