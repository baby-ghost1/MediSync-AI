import {
  PatientRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class PatientService {
  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard(userId) {
    const patient =
      await PatientRepository.getDashboard(
        userId
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  /* ==========================================
      Profile
  ========================================== */

  async getProfile(userId) {
    const patient =
      await PatientRepository.getProfile(
        userId
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  async updateProfile(
    userId,
    payload
  ) {
    const patient =
      await PatientRepository.updateProfile(
        userId,
        payload
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatient(id) {
    const patient =
      await PatientRepository.getPatient(
        id
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  async getPatients(query) {
    const {
      page = 1,
      limit = 10,
    } = query;

    return PatientRepository.find(
      {},
      {
        page,
        limit,
        populate: "user",
      }
    );
  }

  /* ==========================================
      Search
  ========================================== */

  async searchPatients(
    keyword,
    page,
    limit
  ) {
    return PatientRepository.search(
      keyword,
      page,
      limit
    );
  }

  /* ==========================================
      Medical Information
  ========================================== */

  async updateMedicalInfo(
    id,
    payload
  ) {
    const patient =
      await PatientRepository.updateMedicalInfo(
        id,
        payload
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }
    /* ==========================================
      Emergency Contact
  ========================================== */

  async updateEmergencyContact(
    id,
    emergencyContact
  ) {
    const patient =
      await PatientRepository.updateEmergencyContact(
        id,
        emergencyContact
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  /* ==========================================
      Address
  ========================================== */

  async updateAddress(
    id,
    address
  ) {
    const patient =
      await PatientRepository.updateAddress(
        id,
        address
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return patient;
  }

  /* ==========================================
      Filters
  ========================================== */

  async getByBloodGroup(
    bloodGroup
  ) {
    return PatientRepository.findByBloodGroup(
      bloodGroup
    );
  }

  async getByDisease(
    disease
  ) {
    return PatientRepository.findByDisease(
      disease
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    return PatientRepository.getStatistics();
  }

  /* ==========================================
      Delete
  ========================================== */

  async deletePatient(id) {
    const patient =
      await PatientRepository.delete(
        id
      );

    if (!patient) {
      throw new ApiError(
        404,
        "Patient not found."
      );
    }

    return {
      success: true,
      message:
        "Patient deleted successfully.",
    };
  }
}

export default new PatientService();