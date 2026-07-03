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

import AuditService from "./audit.service.js";

// Direct import to avoid circular dependency through services/index.js

class AdminService {
  /* ==========================================
      Admin Login - Separate from public auth
  ========================================== */

  async login(email, password, res, ip = "", userAgent = "") {
    const user = await UserRepository.findByEmail(email);

    if (!user || user.role !== "admin") {
      throw new ApiError(401, "Invalid credentials.");
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      throw new ApiError(429, `Account locked. Try again in ${remaining} minutes.`);
    }

    const matched = await user.comparePassword(password);

    if (!matched) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.loginAttempts = 0;
        await user.save();
        throw new ApiError(429, "Account locked for 15 minutes.");
      }
      await user.save();
      throw new ApiError(401, "Invalid credentials.");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account blocked.");
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    await UserRepository.updateLastLogin(user._id);

    AuditService.log({
      actor: user._id,
      action: "LOGIN_SUCCESS",
      metadata: { role: "admin", ip },
      ip,
      userAgent,
    });

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

  async verifyUser(id, adminId, ip = "", userAgent = "") {
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

    AuditService.log({
      actor: adminId,
      action: "USER_VERIFY",
      target: id,
      targetModel: "User",
      metadata: { email: user.email },
      ip,
      userAgent,
    });

    return user;
  }

  async blockUser(id, adminId, ip = "", userAgent = "") {
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

    AuditService.log({
      actor: adminId,
      action: "USER_BLOCK",
      target: id,
      targetModel: "User",
      metadata: { email: user.email },
      ip,
      userAgent,
    });

    return user;
  }

  async unblockUser(id, adminId, ip = "", userAgent = "") {
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

    AuditService.log({
      actor: adminId,
      action: "USER_UNBLOCK",
      target: id,
      targetModel: "User",
      metadata: { email: user.email },
      ip,
      userAgent,
    });

    return user;
  }

  async deleteUser(id, adminId, ip = "", userAgent = "") {
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

    AuditService.log({
      actor: adminId,
      action: "USER_DELETE",
      target: id,
      targetModel: "User",
      metadata: { email: user.email },
      ip,
      userAgent,
    });

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

  async approveDoctor(doctorId, adminId) {
    const doctor = await DoctorRepository.getDoctor(doctorId);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found.");
    }

    doctor.isApproved = true;
    doctor.approvedAt = new Date();
    doctor.approvedBy = adminId;
    await doctor.save();

    await UserRepository.update(doctor.user?._id || doctor.user, { isVerified: true });

    AuditService.log({
      actor: adminId,
      action: "DOCTOR_APPROVE",
      target: doctor.user?._id || doctor.user,
      targetModel: "Doctor",
      metadata: { doctorId, specialization: doctor.specialization },
    });

    return doctor;
  }

  async rejectDoctor(doctorId) {
    const doctor = await DoctorRepository.getDoctor(doctorId);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found.");
    }

    doctor.isApproved = false;
    doctor.approvedAt = null;
    doctor.approvedBy = null;
    await doctor.save();

    return doctor;
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
    let lastId = null;
    let totalCreated = 0;
    const BATCH_SIZE = 1000;

    while (true) {
      const filter = lastId ? { _id: { $gt: lastId } } : {};
      const users = await UserRepository.find(
        filter,
        {
          limit: BATCH_SIZE,
          sort: "_id",
          select: "_id",
        }
      );

      if (!users.data || users.data.length === 0) break;

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

      totalCreated += notifications.length;
      lastId = users.data[users.data.length - 1]._id;

      if (users.data.length < BATCH_SIZE) break;
    }

    return {
      success: true,
      message:
        `Notification broadcasted successfully to ${totalCreated} users.`,
    };
  }

  async getAuditLogs(page = 1, limit = 20) {
    return AuditService.getLogs(page, limit);
  }

  async getAuditStatistics() {
    return AuditService.getStatistics();
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getSystemStatistics() {
    return this.getDashboard();
  }
}

export default new AdminService();