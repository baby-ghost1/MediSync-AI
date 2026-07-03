import BaseRepository from "./base.repository.js";

import { Doctor } from "../models/index.js";
import { escapeRegex } from "../utils/index.js";

class DoctorRepository extends BaseRepository {
  constructor() {
    super(Doctor);
  }

  /* ==========================================
      Profile
  ========================================== */

  async getProfile(userId) {
    return this.model
      .findOne({
        user: userId,
      })
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  async findByUserId(userId) {
    return this.model.findOne({
      user: userId,
    });
  }

  async updateProfile(
    userId,
    payload
  ) {
    return this.model
      .findOneAndUpdate(
        {
          user: userId,
        },
        payload,
        {
          new: true,
          runValidators: true,
        }
      )
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  /* ==========================================
      Doctor
  ========================================== */

  async getDoctor(id) {
    return this.model
      .findById(id)
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  async getDoctors(
    filter = {},
    options = {}
  ) {
    return this.find(filter, {
      populate: "user",
      ...options,
    });
  }

  /* ==========================================
      Availability
  ========================================== */

  async getAvailableDoctors() {
    return this.model
      .find({
        available: true,
      })
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  async updateAvailability(
    id,
    available
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        available,
      },
      {
        new: true,
      }
    );
  }

  async updateSchedule(id, availability) {
    return this.model.findByIdAndUpdate(
      id,
      { availability },
      { new: true }
    );
  }

  async getAvailableSlotsForDate(doctorId, date) {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = dayNames[new Date(date).getDay()];

    const doctor = await this.model.findById(doctorId);
    if (!doctor) return [];

    const daySchedule = doctor.availability?.find(
      (s) => s.day === day && s.isAvailable
    );
    if (!daySchedule) return [];

    const { startTime, endTime } = daySchedule;
    const duration = doctor.slotDuration || 30;
    const buffer = doctor.bufferBetweenSlots || 15;

    const slots = [];
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + duration <= end) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += duration + buffer;
    }

    return slots;
  }

  /* ==========================================
      Search
  ========================================== */

  async search(
    keyword,
    page = 1,
    limit = 10
  ) {
    return this.find(
      {
        $or: [
          {
            specialization: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
          {
            qualification: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
          {
            hospital: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
        ],
      },
      {
        page,
        limit,
        populate: "user",
      }
    );
  }

  /* ==========================================
      Filters
  ========================================== */

  async findBySpecialization(
    specialization
  ) {
    return this.model
      .find({
        specialization,
      })
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  async findByHospital(
    hospital
  ) {
    return this.model
      .find({
        hospital,
      })
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  async findTopRated(limit = 10) {
    return this.model
      .find()
      .sort({
        rating: -1,
      })
      .limit(limit)
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  /* ==========================================
      Rating
  ========================================== */

  async updateRating(
    id,
    rating,
    totalReviews
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        rating,
        totalReviews,
      },
      {
        new: true,
      }
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    const [
      totalDoctors,
      availableDoctors,
    ] = await Promise.all([
      this.count(),

      this.count({
        available: true,
      }),
    ]);

    const specializations =
      await this.model.aggregate([
        {
          $group: {
            _id: "$specialization",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    return {
      totalDoctors,
      availableDoctors,
      specializations,
    };
  }
}

export default new DoctorRepository();