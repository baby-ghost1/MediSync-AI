import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class DoctorService {
  async getDashboard() {
    const { data } = await API.get(ENDPOINTS.DOCTORS.DASHBOARD);
    return data;
  }

  async getDoctors(params = {}) {
    const { data } = await API.get(ENDPOINTS.DOCTORS.ALL, { params });
    return data;
  }

  async getDoctor(id) {
    const { data } = await API.get(ENDPOINTS.DOCTORS.DETAILS(id));
    return data;
  }

  async updateDoctor(id, payload) {
    const { data } = await API.patch(ENDPOINTS.DOCTORS.DETAILS(id), payload);
    return data;
  }

  async deleteDoctor(id) {
    const { data } = await API.delete(ENDPOINTS.DOCTORS.DETAILS(id));
    return data;
  }

  async getAvailableDoctors(params = {}) {
    const { data } = await API.get(ENDPOINTS.DOCTORS.AVAILABLE, { params });
    return data;
  }

  async updateAvailability(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.DOCTORS.ALL}/${id}/availability`, payload);
    return data;
  }

  async searchDoctors(query) {
    const { data } = await API.get(ENDPOINTS.DOCTORS.SEARCH, { params: { search: query } });
    return data;
  }

  async getProfile() {
    const { data } = await API.get(ENDPOINTS.DOCTORS.PROFILE);
    return data;
  }

  async updateProfile(payload) {
    const { data } = await API.patch(ENDPOINTS.DOCTORS.PROFILE, payload);
    return data;
  }

  async getPatientDetails(id) {
    const { data } = await API.get(ENDPOINTS.PATIENTS.DETAILS(id));
    return data;
  }

  async updatePatient(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.PATIENTS.DETAILS(id)}/medical`, payload);
    return data;
  }

  async updateSchedule(doctorId, availability) {
    const { data } = await API.patch(`${ENDPOINTS.DOCTORS.ALL}/${doctorId}/schedule`, { availability });
    return data;
  }

  async getAvailableSlots(doctorId, date) {
    const { data } = await API.get(`${ENDPOINTS.DOCTORS.ALL}/${doctorId}/slots`, { params: { date } });
    return data;
  }
}

export default new DoctorService();
