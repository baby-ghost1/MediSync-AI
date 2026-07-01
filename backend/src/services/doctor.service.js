import {
  DoctorRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class DoctorService {
  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard() {
    return DoctorRepository.getStatistics();
  }

  /* ==========================================
      Profile
  ========================================== */

  async getProfile(userId) {
    const doctor =
      await DoctorRepository.getProfile(
        userId
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return doctor;
  }

  async updateProfile(
    userId,
    payload
  ) {
    const doctor =
      await DoctorRepository.updateProfile(
        userId,
        payload
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return doctor;
  }

  /* ==========================================
      Doctors
  ========================================== */

  async getDoctor(id) {
    const doctor =
      await DoctorRepository.getDoctor(
        id
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return doctor;
  }

  async getDoctors(query) {
    const {
      page = 1,
      limit = 10,
      specialization,
      hospital,
    } = query;

    const filter = {};

    if (specialization)
      filter.specialization =
        specialization;

    if (hospital)
      filter.hospital =
        hospital;

    return DoctorRepository.getDoctors(
      filter,
      {
        page,
        limit,
      }
    );
  }

  /* ==========================================
      Search
  ========================================== */

  async searchDoctors(
    keyword,
    page,
    limit
  ) {
    return DoctorRepository.search(
      keyword,
      page,
      limit
    );
  }

  /* ==========================================
      Availability
  ========================================== */

  async getAvailableDoctors() {
    return DoctorRepository.getAvailableDoctors();
  }

  async updateAvailability(
    doctorId,
    available
  ) {
    const doctor =
      await DoctorRepository.updateAvailability(
        doctorId,
        available
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return doctor;
  }
    /* ==========================================
      Filters
  ========================================== */

  async getBySpecialization(
    specialization
  ) {
    return DoctorRepository.findBySpecialization(
      specialization
    );
  }

  async getByHospital(
    hospital
  ) {
    return DoctorRepository.findByHospital(
      hospital
    );
  }

  async getTopRatedDoctors(
    limit = 10
  ) {
    return DoctorRepository.findTopRated(
      limit
    );
  }

  /* ==========================================
      Rating
  ========================================== */

  async updateRating(
    doctorId,
    rating,
    totalReviews
  ) {
    const doctor =
      await DoctorRepository.updateRating(
        doctorId,
        rating,
        totalReviews
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return doctor;
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    return DoctorRepository.getStatistics();
  }

  /* ==========================================
      Delete
  ========================================== */

  async deleteDoctor(id) {
    const doctor =
      await DoctorRepository.delete(
        id
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    return {
      success: true,
      message:
        "Doctor deleted successfully.",
    };
  }
}

export default new DoctorService();