import BaseRepository from "./base.repository.js";

import { Prescription } from "../models/index.js";
import { escapeRegex } from "../utils/index.js";

class PrescriptionRepository extends BaseRepository {
  constructor() {
    super(Prescription);
  }

  async getPrescription(id) {
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

  async getPrescriptions(
    filter = {},
    options = {}
  ) {
    return this.find(filter, {
      populate:
        "patient doctor appointment",
      ...options,
    });
  }

  async getPatientPrescriptions(
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

  async getDoctorPrescriptions(
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

  async getActivePrescriptions(
    patientId
  ) {
    return this.model
      .find({
        patient: patientId,
        status: "active",
      })
      .populate(
        "doctor appointment"
      );
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async search(
    keyword,
    page = 1,
    limit = 10
  ) {
    return this.find(
      {
        $or: [
          {
            diagnosis: {
              $regex: escapeRegex(keyword),
              $options: "i",
            },
          },
          {
            advice: {
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

  async getStatistics() {
    const [totalPrescriptions, statuses] =
      await Promise.all([
        this.count(),

        this.model.aggregate([
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]),
      ]);

    return {
      totalPrescriptions,
      statuses,
    };
  }
}

export default new PrescriptionRepository();
