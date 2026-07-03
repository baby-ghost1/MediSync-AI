import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class ConsultationService {
  async createNote(payload) {
    const { data } = await API.post(ENDPOINTS.CONSULTATIONS.CREATE, payload);
    return data;
  }

  async getNote(id) {
    const { data } = await API.get(ENDPOINTS.CONSULTATIONS.DETAILS(id));
    return data;
  }

  async getNoteByAppointment(appointmentId) {
    const { data } = await API.get(ENDPOINTS.CONSULTATIONS.BY_APPOINTMENT(appointmentId));
    return data;
  }

  async updateNote(id, payload) {
    const { data } = await API.patch(ENDPOINTS.CONSULTATIONS.UPDATE(id), payload);
    return data;
  }

  async deleteNote(id) {
    const { data } = await API.delete(ENDPOINTS.CONSULTATIONS.DELETE(id));
    return data;
  }

  async getDoctorNotes(doctorId, params = {}) {
    const { data } = await API.get(ENDPOINTS.CONSULTATIONS.BY_DOCTOR(doctorId), { params });
    return data;
  }

  async getPatientNotes(patientId, params = {}) {
    const { data } = await API.get(ENDPOINTS.CONSULTATIONS.BY_PATIENT(patientId), { params });
    return data;
  }
}

export default new ConsultationService();
