import BaseRepository from "./base.repository.js";

import { Patient } from "../models/index.js";
import { escapeRegex } from "../utils/index.js";

class PatientRepository extends BaseRepository {
  constructor() {
    super(Patient);
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
      Details
  ========================================== */

  async getPatient(id) {
    return this.model
      .findById(id)
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

  /* ==========================================
      Search
  ========================================== */

  async search(
    keyword,
    page = 1,
    limit = 10
  ) {
    const patients =
      await this.model
        .find()
        .populate({
          path: "user",
          match: {
            $or: [
              {
                firstName: {
                  $regex: escapeRegex(keyword),
                  $options: "i",
                },
              },

              {
                lastName: {
                  $regex: escapeRegex(keyword),
                  $options: "i",
                },
              },

              {
                email: {
                  $regex: escapeRegex(keyword),
                  $options: "i",
                },
              },
            ],
          },
        })
        .skip((page - 1) * limit)
        .limit(limit);

    return patients.filter(
      (patient) => patient.user
    );
  }

  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboard(userId) {
    return this.model
      .findOne({
        user: userId,
      })
      .populate(
        "user",
        "-password -refreshToken"
      );
  }

  /* ==========================================
      Medical
  ========================================== */

  async updateMedicalInfo(
    id,
    payload
  ) {
    return this.model.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateEmergencyContact(
    id,
    emergencyContact
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        emergencyContact,
      },
      {
        new: true,
      }
    );
  }

  async updateAddress(
    id,
    address
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        address,
      },
      {
        new: true,
      }
    );
  }

  /* ==========================================
      Filters
  ========================================== */

  async findByBloodGroup(
    bloodGroup
  ) {
    return this.model.find({
      bloodGroup,
    });
  }

  async findByDisease(
    disease
  ) {
    return this.model.find({
      chronicDiseases: disease,
    });
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics() {
    const [
      totalPatients,
      male,
      female,
    ] = await Promise.all([
      this.count(),

      this.count({
        gender: "male",
      }),

      this.count({
        gender: "female",
      }),
    ]);

    return {
      totalPatients,
      male,
      female,
    };
  }
}

export default new PatientRepository();