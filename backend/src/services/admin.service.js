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
  sendToken,
} from "../utils/index.js";

class AdminService {
  /* ==========================================
      Admin Login - Separate from public auth
  ========================================== */

  async login(email, password, res) {
    const user = await UserRepository.findByEmail(email);

    if (!user || user.role !== "admin") {
      throw new ApiError(401, "Invalid credentials.");
    }

    const matched = await user.comparePassword(password);

    if (!matched) {
      throw new ApiError(401, "Invalid credentials.");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account blocked.");
    }

    await UserRepository.updateLastLogin(user._id);

    return sendToken(res, user, 200, "Admin login successful.");
  }

  /* ==========================================
      Dashboard - Full Monitoring System
  ========================================== */

  async getDashboard() {
    const [
      users,
      patients,
      doctors,
      appointments,
      reports,
      prescriptions,
      recentUsers,
      recentAppointments,
      recentNotifications,
    ] = await Promise.all([
      UserRepository.getStatistics(),

      PatientRepository.getStatistics(),

      DoctorRepository.getStatistics(),

      AppointmentRepository.getDashboard(),

      ReportRepository.getStatistics(),

      PrescriptionRepository.getStatistics(),

      UserRepository.find(
        {},
        {
          page: 1,
          limit: 10,
          sort: "-createdAt",
        }
      ),

      AppointmentRepository.find(
        {},
        {
          page: 1,
          limit: 10,
          sort: "-createdAt",
          populate: "patient doctor",
        }
      ),

      NotificationRepository.find(
        {},
        {
          page: 1,
          limit: 10,
          sort: "-createdAt",
        }
      ),
    ]);

    const totalAppointments = appointments.total || 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Calculate growth rates (comparing with total registered)
    const userGrowth = users.totalUsers > 0 ? Math.round((recentUsers.data.length / users.totalUsers) * 100) : 0;

    return {
      users,
      patients,
      doctors,
      appointments,
      reports,
      prescriptions,
      stats: {
        totalUsers: users.totalUsers || 0,
        totalPatients: users.patients || 0,
        totalDoctors: users.doctors || 0,
        totalAdmins: users.admins || 0,
        verifiedUsers: users.verified || 0,
        totalAppointments,
        pendingAppointments: appointments.pending || 0,
        confirmedAppointments: appointments.confirmed || 0,
        completedAppointments: appointments.completed || 0,
        cancelledAppointments: appointments.cancelled || 0,
        totalDoctorsCount: doctors.totalDoctors || 0,
        availableDoctors: doctors.availableDoctors || 0,
        userGrowth,
        appointmentGrowth: totalAppointments > 0 ? Math.round((appointments.confirmed / totalAppointments) * 100) : 0,
      },
      recentUsers: recentUsers.data,
      recentAppointments: recentAppointments.data,
      recentNotifications: recentNotifications.data,
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
      Appointments
  ========================================== */

  async getAppointments(query) {
    const {
      page = 1,
      limit = 10,
      status,
    } = query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    return AppointmentRepository.find(
      filter,
      {
        page,
        limit,
        populate: "patient doctor",
        sort: "-createdAt",
      }
    );
  }

  async updateAppointmentStatus(id, status) {
    const appointment =
      await AppointmentRepository.findById(id);

    if (!appointment) {
      throw new ApiError(
        404,
        "Appointment not found."
      );
    }

    appointment.status = status;
    await appointment.save();

    return appointment;
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