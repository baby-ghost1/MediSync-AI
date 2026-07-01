import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class PatientService {
  async getDashboard() {
    const { data } = await API.get(ENDPOINTS.PATIENTS.DASHBOARD);
    return data;
  }

  async getPatients(params = {}) {
    const { data } = await API.get(ENDPOINTS.PATIENTS.ALL, { params });
    return data;
  }

  async getPatient(id) {
    const { data } = await API.get(ENDPOINTS.PATIENTS.DETAILS(id));
    return data;
  }

  async updatePatient(id, payload) {
    const { data } = await API.patch(ENDPOINTS.PATIENTS.DETAILS(id), payload);
    return data;
  }

  async deletePatient(id) {
    const { data } = await API.delete(ENDPOINTS.PATIENTS.DETAILS(id));
    return data;
  }

  async updateMedicalInfo(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.PATIENTS.DETAILS(id)}/medical`, payload);
    return data;
  }

  async updateEmergencyContact(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.PATIENTS.DETAILS(id)}/emergency-contact`, payload);
    return data;
  }

  async updateAddress(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.PATIENTS.DETAILS(id)}/address`, payload);
    return data;
  }

  async searchPatients(query) {
    const { data } = await API.get(ENDPOINTS.PATIENTS.SEARCH, { params: { search: query } });
    return data;
  }

  async uploadMedicalRecord(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await API.post(ENDPOINTS.UPLOADS.FILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  async getProfile() {
    const { data } = await API.get(ENDPOINTS.PATIENTS.PROFILE);
    return data;
  }

  async updateProfile(payload) {
    const { data } = await API.patch(ENDPOINTS.PATIENTS.PROFILE, payload);
    return data;
  }
}

export default new PatientService();
