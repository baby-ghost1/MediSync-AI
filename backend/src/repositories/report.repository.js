import BaseRepository from "./base.repository.js";

import { Report } from "../models/index.js";
import { escapeRegex } from "../utils/index.js";

class ReportRepository extends BaseRepository {
  constructor() {
    super(Report);
  }

  /* ==========================================
      Report
  ========================================== */

  async getReport(id) {
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
      })
      .populate("appointment");
  }

  async getReports(
    filter = {},
    options = {}
  ) {
    return this.find(filter, {
      populate:
        "patient doctor appointment",
      ...options,
    });
  }

  /* ==========================================
      Patient
  ========================================== */

  async getPatientReports(
    patientId,
    options = {}
  ) {
    return this.find(
      {
        patient: patientId,
      },
      {
        populate:
          "doctor appointment",
        ...options,
      }
    );
  }

  /* ==========================================
      Doctor
  ========================================== */

  async getDoctorReports(
    doctorId,
    options = {}
  ) {
    return this.find(
      {
        doctor: doctorId,
      },
      {
        populate:
          "patient appointment",
        ...options,
      }
    );
  }

  /* ==========================================
      Appointment
  ========================================== */

  async getAppointmentReport(
    appointmentId
  ) {
    return this.model
      .findOne({
        appointment:
          appointmentId,
      })
      .populate(
        "patient doctor appointment"
      );
  }

  /* ==========================================
      AI
  ========================================== */

  async saveAISummary(
    id,
    aiSummary,
    healthScore
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        aiSummary,
        healthScore,
      },
      {
        new: true,
      }
    );
  }

  /* ==========================================
      Attachment
  ========================================== */

  async addAttachment(
    id,
    attachment
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $push: {
          attachments:
            attachment,
        },
      },
      {
        new: true,
      }
    );
  }

  async removeAttachment(
    id,
    publicId
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $pull: {
          attachments: {
            publicId,
          },
        },
      },
      {
        new: true,
      }
    );
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
            title: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
          {
            diagnosis: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
          {
            observations: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
        ],
      },
      {
        page,
        limit,
        populate:
          "patient doctor",
      }
    );
  }

  /* ==========================================
      Filters
  ========================================== */

  async findByCategory(
    category
  ) {
    return this.model
      .find({
        category,
      })
      .populate(
        "patient doctor"
      );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    const [
      totalReports,
      categories,
    ] = await Promise.all([
      this.count(),

      this.model.aggregate([
        {
          $group: {
            _id: "$category",

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    return {
      totalReports,
      categories,
    };
  }
}

export default new ReportRepository();