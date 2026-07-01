import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "blood-test",
        "xray",
        "ct-scan",
        "mri",
        "ecg",
        "prescription",
        "other",
      ],
      default: "other",
    },

    diagnosis: String,

    observations: String,

    recommendations: String,

    aiSummary: String,

    healthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    attachments: [
      {
        url: String,
        publicId: String,
        fileName: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Report",
  reportSchema
);