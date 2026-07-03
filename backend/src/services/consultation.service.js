import ConsultationNote from "../models/ConsultationNote.js";
import {
  AppointmentRepository,
  DoctorRepository,
  PatientRepository,
  NotificationRepository,
} from "../repositories/index.js";
import { ApiError } from "../utils/index.js";

class ConsultationService {
  async createNote(payload) {
    const { appointment, doctor } = payload;

    const appointmentExists = await AppointmentRepository.findById(appointment);
    if (!appointmentExists) throw new ApiError(404, "Appointment not found.");

    const doctorExists = await DoctorRepository.findById(doctor);
    if (!doctorExists) throw new ApiError(404, "Doctor not found.");

    const existing = await ConsultationNote.findOne({ appointment });
    if (existing) throw new ApiError(409, "Consultation note already exists for this appointment.");

    const note = await ConsultationNote.create(payload);

    if (!payload.isDraft) {
      await AppointmentRepository.updateStatus(appointment, "completed");
      await NotificationRepository.create({
        recipient: appointmentExists.patient.user,
        title: "Consultation Completed",
        message: "Your consultation notes are now available.",
        type: "appointment",
      });
    }

    return note;
  }

  async getNote(id) {
    const note = await ConsultationNote.findById(id)
      .populate("appointment")
      .populate("doctor")
      .populate("patient");
    if (!note) throw new ApiError(404, "Consultation note not found.");
    return note;
  }

  async getNoteByAppointment(appointmentId) {
    const note = await ConsultationNote.findOne({ appointment: appointmentId })
      .populate("doctor")
      .populate("patient");
    return note;
  }

  async updateNote(id, payload) {
    const wasDraft = (await ConsultationNote.findById(id))?.isDraft;
    const note = await ConsultationNote.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .populate("appointment")
      .populate("doctor")
      .populate("patient");
    if (!note) throw new ApiError(404, "Consultation note not found.");

    if (wasDraft && !note.isDraft && note.appointment) {
      await AppointmentRepository.updateStatus(note.appointment._id, "completed");
      await NotificationRepository.create({
        recipient: note.appointment.patient,
        title: "Consultation Completed",
        message: "Your consultation notes are now available.",
        type: "appointment",
      });
    }

    return note;
  }

  async deleteNote(id) {
    const note = await ConsultationNote.findByIdAndDelete(id);
    if (!note) throw new ApiError(404, "Consultation note not found.");
    return { success: true, message: "Consultation note deleted." };
  }

  async getDoctorNotes(doctorId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [notes, total] = await Promise.all([
      ConsultationNote.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("appointment")
        .populate("patient"),
      ConsultationNote.countDocuments({ doctor: doctorId }),
    ]);
    return { data: notes, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async getPatientNotes(patientId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [notes, total] = await Promise.all([
      ConsultationNote.find({ patient: patientId, isDraft: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName" } })
        .populate("appointment"),
      ConsultationNote.countDocuments({ patient: patientId, isDraft: false }),
    ]);
    return { data: notes, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}

export default new ConsultationService();
