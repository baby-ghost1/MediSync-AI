import mongoose from "mongoose";

const medicineSchema =
  new mongoose.Schema(
    {
      medicine: {
        type: String,
        required: true,
      },

      dosage: String,

      frequency: String,

      duration: String,

      instructions: String,
    },
    {
      _id: false,
    }
  );

const prescriptionSchema =
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

      appointment: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },

      medicines: [medicineSchema],

      diagnosis: String,

      advice: String,

      followUpDate: Date,

      status: {
        type: String,
        enum: [
          "active",
          "dispensed",
          "completed",
          "expired",
        ],
        default: "active",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Prescription",
  prescriptionSchema
);
