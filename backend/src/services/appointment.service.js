import {
  AppointmentRepository,
  DoctorRepository,
  PatientRepository,
  NotificationRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class AppointmentService {
  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard() {
    return AppointmentRepository.getDashboard();
  }

  /* ==========================================
      Appointment
  ========================================== */

  async createAppointment(
    payload
  ) {
    const {
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
    } = payload;

    const patientExists =
      await PatientRepository.findById(
        patient
      );

    if (!patientExists) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    const doctorExists =
      await DoctorRepository.findById(
        doctor
      );

    if (!doctorExists) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    const booked =
      await AppointmentRepository.checkSlotAvailability(
        doctor,
        appointmentDate,
        appointmentTime
      );

    if (booked) {
      throw new ApiError(
        409,
        "Time slot already booked."
      );
    }

    const appointment =
      await AppointmentRepository.create(
        payload
      );

    await NotificationRepository.create({
      recipient:
        doctorExists.user,

      title:
        "New Appointment",

      message:
        "A new appointment has been booked.",

      type:
        "appointment",
    });

    return appointment;
  }

  async getAppointment(id) {
    const appointment =
      await AppointmentRepository.getAppointment(
        id
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return appointment;
  }

  async getAppointments(
    query
  ) {
    const {
      page = 1,
      limit = 10,
      status,
    } = query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    return AppointmentRepository.getAppointments(
      filter,
      {
        page,
        limit,
      }
    );
  }

  async updateAppointment(
    id,
    payload
  ) {
    const appointment =
      await AppointmentRepository.update(
        id,
        payload
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return appointment;
  }

  async deleteAppointment(
    id
  ) {
    const appointment =
      await AppointmentRepository.delete(
        id
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return {
      success: true,
      message:
        "Appointment deleted successfully.",
    };
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatientAppointments(
    patientId,
    page,
    limit
  ) {
    return AppointmentRepository.getPatientAppointments(
      patientId,
      {
        page,
        limit,
      }
    );
  }

  async getDoctorAppointments(
    doctorId,
    page,
    limit
  ) {
    return AppointmentRepository.getDoctorAppointments(
      doctorId,
      {
        page,
        limit,
      }
    );
  }
    /* ==========================================
      Status
  ========================================== */

  async confirmAppointment(id) {
    const appointment =
      await AppointmentRepository.updateStatus(
        id,
        "confirmed"
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    await NotificationRepository.create({
      recipient:
        appointment.patient,

      title:
        "Appointment Confirmed",

      message:
        "Your appointment has been confirmed.",

      type: "appointment",
    });

    return appointment;
  }

  async completeAppointment(id) {
    const appointment =
      await AppointmentRepository.updateStatus(
        id,
        "completed"
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return appointment;
  }

  async cancelAppointment(id) {
    const appointment =
      await AppointmentRepository.updateStatus(
        id,
        "cancelled"
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return appointment;
  }

  async rescheduleAppointment(
    id,
    appointmentDate,
    appointmentTime
  ) {
    const appointment =
      await AppointmentRepository.getAppointment(id);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    const slot =
      await AppointmentRepository.checkSlotAvailability(
        appointment.doctor._id,
        appointmentDate,
        appointmentTime,
        id
      );

    if (slot) {
      throw new ApiError(
        409,
        "Selected slot is unavailable."
      );
    }

    return AppointmentRepository.reschedule(
      id,
      appointmentDate,
      appointmentTime
    );
  }

  async addNotes(
    id,
    notes
  ) {
    const appointment =
      await AppointmentRepository.addNotes(
        id,
        notes
      );

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    return appointment;
  }

  /* ==========================================
      Calendar
  ========================================== */

  async getTodayAppointments() {
    return AppointmentRepository.getTodayAppointments();
  }

  async getUpcomingAppointments() {
    return AppointmentRepository.getUpcomingAppointments();
  }

  async getAppointmentsByDate(
    date
  ) {
    return AppointmentRepository.getAppointmentsByDate(
      date
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    return AppointmentRepository.getStatistics();
  }
}

export default new AppointmentService();
