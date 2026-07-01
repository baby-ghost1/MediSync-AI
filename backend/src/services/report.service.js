import {
  ReportRepository,
  PatientRepository,
  DoctorRepository,
  AppointmentRepository,
  NotificationRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class ReportService {
  /* ==========================================
      Create Report
  ========================================== */

  async createReport(payload) {
    const {
      patient,
      doctor,
      appointment,
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

    if (appointment) {
      const exists =
        await AppointmentRepository.findById(
          appointment
        );

      if (!exists) {
        throw new ApiError(
          404,
          "Appointment not found."
        );
      }
    }

    const report =
      await ReportRepository.create(
        payload
      );

    await NotificationRepository.create({
      recipient:
        patientExists.user,

      title:
        "Medical Report Added",

      message:
        "A new medical report has been uploaded.",

      type:
        "report",
    });

    return report;
  }

  /* ==========================================
      Reports
  ========================================== */

  async getReport(id) {
    const report =
      await ReportRepository.getReport(
        id
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  async getReports(query) {
    const {
      page = 1,
      limit = 10,
      category,
    } = query;

    const filter = {};

    if (category) {
      filter.category =
        category;
    }

    return ReportRepository.getReports(
      filter,
      {
        page,
        limit,
      }
    );
  }

  async updateReport(
    id,
    payload
  ) {
    const report =
      await ReportRepository.update(
        id,
        payload
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  async deleteReport(id) {
    const report =
      await ReportRepository.delete(
        id
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return {
      success: true,
      message:
        "Report deleted successfully.",
    };
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatientReports(
    patientId,
    page,
    limit
  ) {
    return ReportRepository.getPatientReports(
      patientId,
      {
        page,
        limit,
      }
    );
  }

  async getDoctorReports(
    doctorId,
    page,
    limit
  ) {
    return ReportRepository.getDoctorReports(
      doctorId,
      {
        page,
        limit,
      }
    );
  }
    /* ==========================================
      Appointment
  ========================================== */

  async getAppointmentReport(
    appointmentId
  ) {
    const report =
      await ReportRepository.getAppointmentReport(
        appointmentId
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  /* ==========================================
      Attachments
  ========================================== */

  async addAttachment(
    reportId,
    attachment
  ) {
    const report =
      await ReportRepository.addAttachment(
        reportId,
        attachment
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  async removeAttachment(
    reportId,
    publicId
  ) {
    const report =
      await ReportRepository.removeAttachment(
        reportId,
        publicId
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  /* ==========================================
      AI Summary
  ========================================== */

  async saveAISummary(
    reportId,
    summary,
    healthScore
  ) {
    const report =
      await ReportRepository.saveAISummary(
        reportId,
        summary,
        healthScore
      );

    if (!report) {
      throw new ApiError(
        404,
        "Report not found."
      );
    }

    return report;
  }

  /* ==========================================
      Search
  ========================================== */

  async searchReports(
    keyword,
    page,
    limit
  ) {
    return ReportRepository.search(
      keyword,
      page,
      limit
    );
  }

  async getByCategory(
    category
  ) {
    return ReportRepository.findByCategory(
      category
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    return ReportRepository.getStatistics();
  }
}

export default new ReportService();