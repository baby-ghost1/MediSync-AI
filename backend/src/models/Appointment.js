import mongoose from "mongoose";

const appointmentSchema =
  new mongoose.Schema(
    {
      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
      },

      doctor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
      },

      appointmentDate: {
        type: Date,
        required: true,
      },

      appointmentTime: {
        type: String,
        required: true,
      },

      reason: String,

      symptoms: [String],

      status: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "completed",
          "cancelled",
        ],
        default: "pending",
      },

      notes: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Appointment",
  appointmentSchema
);