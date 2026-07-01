import {
  UserRepository,
  PatientRepository,
  DoctorRepository,
  AppointmentRepository,
  ReportRepository,
  PrescriptionRepository,
  NotificationRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class AdminService {
  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard() {
    const [
      users,
      patients,
      doctors,
      appointments,
      reports,
      prescriptions,
    ] = await Promise.all([
      UserRepository.getStatistics(),

      PatientRepository.getStatistics(),

      DoctorRepository.getStatistics(),

      AppointmentRepository.getDashboard(),

      ReportRepository.getStatistics(),

      PrescriptionRepository.getStatistics(),
    ]);

    return {
      users,
      patients,
      doctors,
      appointments,
      reports,
      prescriptions,
    };
  }

  /* ==========================================
      Users
  ========================================== */

  async getUsers(query) {
    const {
      page = 1,
      limit = 10,
      role,
    } = query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    return UserRepository.find(
      filter,
      {
        page,
        limit,
      }
    );
  }

  async verifyUser(id) {
    const user =
      await UserRepository.verifyUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async blockUser(id) {
    const user =
      await UserRepository.blockUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async unblockUser(id) {
    const user =
      await UserRepository.unblockUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async deleteUser(id) {
    const user =
      await UserRepository.delete(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      success: true,
      message:
        "User deleted successfully.",
    };
  }
    /* ==========================================
      Doctors
  ========================================== */

  async getDoctors(query) {
    const {
      page = 1,
      limit = 10,
      specialization,
      available,
    } = query;

    const filter = {};

    if (specialization) {
      filter.specialization =
        specialization;
    }

    if (
      available !== undefined
    ) {
      filter.available =
        available === "true";
    }

    return DoctorRepository.getDoctors(
      filter,
      {
        page,
        limit,
      }
    );
  }

  async updateDoctorVerification(
    doctorId,
    verified
  ) {
    const doctor =
      await DoctorRepository.getDoctor(
        doctorId
      );

    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found."
      );
    }

    const user =
      await UserRepository.update(
        doctor.user?._id ||
          doctor.user,
        { isVerified: verified }
      );

    if (!user) {
      throw new ApiError(
        404,
        "Associated user not found."
      );
    }

    return {
      ...doctor.toObject(),
      user,
    };
  }

  /* ==========================================
      Reports
  ========================================== */

  async getReports(query) {
    const {
      page = 1,
      limit = 10,
    } = query;

    return ReportRepository.getReports(
      {},
      {
        page,
        limit,
      }
    );
  }

  /* ==========================================
      Prescriptions
  ========================================== */

  async getPrescriptions(
    query
  ) {
    const {
      page = 1,
      limit = 10,
    } = query;

    return PrescriptionRepository.find(
      {},
      {
        page,
        limit,
        populate:
          "patient doctor appointment",
      }
    );
  }

  /* ==========================================
      Notifications
  ========================================== */

  async broadcastNotification(
    payload
  ) {
    const users =
      await UserRepository.find(
        {},
        {
          page: 1,
          limit: 100000,
        }
      );

    const notifications =
      users.data.map((user) => ({
        recipient: user._id,

        title:
          payload.title,

        message:
          payload.message,

        type:
          payload.type ||
          "system",
      }));

    await NotificationRepository.createMany(
      notifications
    );

    return {
      success: true,
      message:
        "Notification broadcasted successfully.",
    };
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getSystemStatistics() {
    return this.getDashboard();
  }
}

export default new AdminService();