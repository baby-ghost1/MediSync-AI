import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AppointmentService {
  async getDashboard() {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.ALL, { params: { dashboard: true } });
    return data;
  }

  async getAppointments(params = {}) {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.ALL, { params });
    return data;
  }

  async getAppointment(id) {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.DETAILS(id));
    return data;
  }

  async createAppointment(payload) {
    const { data } = await API.post(ENDPOINTS.APPOINTMENTS.CREATE, payload);
    return data;
  }

  async updateAppointment(id, payload) {
    const { data } = await API.patch(ENDPOINTS.APPOINTMENTS.UPDATE(id), payload);
    return data;
  }

  async deleteAppointment(id) {
    const { data } = await API.delete(ENDPOINTS.APPOINTMENTS.DELETE(id));
    return data;
  }

  async cancelAppointment(id, reason) {
    const { data } = await API.patch(ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason });
    return data;
  }

  async completeAppointment(id) {
    const { data } = await API.patch(`${ENDPOINTS.APPOINTMENTS.DETAILS(id)}/complete`);
    return data;
  }

  async confirmAppointment(id) {
    const { data } = await API.patch(`${ENDPOINTS.APPOINTMENTS.DETAILS(id)}/confirm`);
    return data;
  }

  async rescheduleAppointment(id, payload) {
    const { data } = await API.patch(`${ENDPOINTS.APPOINTMENTS.DETAILS(id)}/reschedule`, payload);
    return data;
  }

  async getUpcoming() {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.UPCOMING);
    return data;
  }

  async getToday() {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.TODAY);
    return data;
  }

  async getByDoctor(doctorId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.APPOINTMENTS.ALL}/doctor/${doctorId}`, { params });
    return data;
  }

  async getByPatient(patientId, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.APPOINTMENTS.ALL}/patient/${patientId}`, { params });
    return data;
  }

  async getByDate(date, params = {}) {
    const { data } = await API.get(`${ENDPOINTS.APPOINTMENTS.ALL}/date/${date}`, { params });
    return data;
  }

  async addNotes(id, notes) {
    const { data } = await API.patch(`${ENDPOINTS.APPOINTMENTS.DETAILS(id)}/notes`, { notes });
    return data;
  }

  async getMyAppointments(params = {}) {
    const { data } = await API.get(ENDPOINTS.APPOINTMENTS.ALL, { params });
    return data;
  }
}

export default new AppointmentService();
