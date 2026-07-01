import {
  PrescriptionRepository,
  PatientRepository,
  DoctorRepository,
  AppointmentRepository,
  NotificationRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class PrescriptionService {
  /* ==========================================
      Create Prescription
  ========================================== */

  async createPrescription(
    payload
  ) {
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

    const prescription =
      await PrescriptionRepository.create(
        payload
      );

    await NotificationRepository.create({
      recipient:
        patientExists.user,

      title:
        "Prescription Added",

      message:
        "Your doctor has added a prescription.",

      type:
        "prescription",
    });

    return prescription;
  }

  /* ==========================================
      Prescription
  ========================================== */

  async getPrescription(id) {
    const prescription =
      await PrescriptionRepository.getPrescription(
        id
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return prescription;
  }

  async getPrescriptions(
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

    return PrescriptionRepository.find(
      filter,
      {
        page,
        limit,
        populate:
          "patient doctor appointment",
      }
    );
  }

  async updatePrescription(
    id,
    payload
  ) {
    const prescription =
      await PrescriptionRepository.update(
        id,
        payload
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return prescription;
  }

  async deletePrescription(
    id
  ) {
    const prescription =
      await PrescriptionRepository.delete(
        id
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return {
      success: true,
      message:
        "Prescription deleted successfully.",
    };
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatientPrescriptions(
    patientId,
    page,
    limit
  ) {
    return PrescriptionRepository.getPatientPrescriptions(
      patientId,
      {
        page,
        limit,
      }
    );
  }

  async getDoctorPrescriptions(
    doctorId,
    page,
    limit
  ) {
    return PrescriptionRepository.getDoctorPrescriptions(
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

  async markDispensed(id) {
    const prescription =
      await PrescriptionRepository.updateStatus(
        id,
        "dispensed"
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return prescription;
  }

  async markCompleted(id) {
    const prescription =
      await PrescriptionRepository.updateStatus(
        id,
        "completed"
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return prescription;
  }

  async renewPrescription(
    id
  ) {
    const prescription =
      await PrescriptionRepository.updateStatus(
        id,
        "active"
      );

    if (!prescription) {
      throw new ApiError(
        404,
        "Prescription not found."
      );
    }

    return prescription;
  }

  /* ==========================================
      Filters
  ========================================== */

  async getActivePrescriptions(
    patientId
  ) {
    return PrescriptionRepository.getActivePrescriptions(
      patientId
    );
  }

  async searchPrescriptions(
    keyword,
    page,
    limit
  ) {
    return PrescriptionRepository.search(
      keyword,
      page,
      limit
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    return PrescriptionRepository.getStatistics();
  }
}

export default new PrescriptionService();