import mongoose from "mongoose";

const patientSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      dob: Date,

      gender: {
        type: String,
        enum: [
          "male",
          "female",
          "other",
        ],
      },

      bloodGroup: String,

      height: Number,

      weight: Number,

      allergies: [String],

      chronicDiseases: [String],

      emergencyContact: {
        name: String,

        phone: String,

        relation: String,
      },

      address: {
        street: String,

        city: String,

        state: String,

        country: String,

        pincode: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Patient",
  patientSchema
);