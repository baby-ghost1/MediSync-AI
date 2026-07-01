import BaseRepository from "./base.repository.js";

import { Appointment } from "../models/index.js";

class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard() {
    const [
      total,
      pending,
      confirmed,
      completed,
      cancelled,
    ] = await Promise.all([
      this.count(),

      this.count({
        status: "pending",
      }),

      this.count({
        status: "confirmed",
      }),

      this.count({
        status: "completed",
      }),

      this.count({
        status: "cancelled",
      }),
    ]);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }

  /* ==========================================
      Appointment
  ========================================== */

  async getAppointment(id) {
    return this.model
      .findById(id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select:
            "-password -refreshToken",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select:
            "-password -refreshToken",
        },
      });
  }

  async getAppointments(
    filter = {},
    options = {}
  ) {
    return this.find(filter, {
      populate:
        "patient doctor",
      ...options,
    });
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatientAppointments(
    patientId,
    options = {}
  ) {
    return this.find(
      {
        patient: patientId,
      },
      {
        populate: "doctor",
        ...options,
      }
    );
  }

  /* ==========================================
      Doctor
  ========================================== */

  async getDoctorAppointments(
    doctorId,
    options = {}
  ) {
    return this.find(
      {
        doctor: doctorId,
      },
      {
        populate: "patient",
        ...options,
      }
    );
  }

  /* ==========================================
      Calendar
  ========================================== */

  async getAppointmentsByDate(
    date
  ) {
    return this.model
      .find({
        appointmentDate: date,
      })
      .populate(
        "patient doctor"
      );
  }

  async checkSlotAvailability(
    doctorId,
    appointmentDate,
    appointmentTime,
    excludeId = null
  ) {
    const filter = {
      doctor: doctorId,

      appointmentDate,

      appointmentTime,

      status: {
        $in: [
          "pending",
          "confirmed",
        ],
      },
    };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    return this.model.findOne(filter);
  }

  /* ==========================================
      Status
  ========================================== */

  async updateStatus(
    id,
    status
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async addNotes(id, notes) {
    return this.model.findByIdAndUpdate(
      id,
      {
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async reschedule(
    id,
    appointmentDate,
    appointmentTime
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        appointmentDate,
        appointmentTime,
        status: "pending",
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /* ==========================================
      Filters
  ========================================== */

  async getTodayAppointments() {
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return this.model
      .find({
        appointmentDate: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .populate(
        "patient doctor"
      );
  }

  async getUpcomingAppointments() {
    return this.model
      .find({
        appointmentDate: {
          $gte: new Date(),
        },

        status: {
          $in: [
            "pending",
            "confirmed",
          ],
        },
      })
      .sort({
        appointmentDate: 1,
      })
      .populate(
        "patient doctor"
      );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    const result =
      await this.model.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    return result;
  }
}

export default new AppointmentRepository();
