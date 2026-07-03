import mongoose from "mongoose";

const appointmentSchema =
  new mongoose.Schema(
    {
      patient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
        index: true,
      },

      doctor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
        index: true,
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
        index: true,
      },

      notes: String,
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

appointmentSchema.virtual("date").get(function () {
  return this.appointmentDate;
});

appointmentSchema.virtual("time").get(function () {
  return this.appointmentTime;
});

appointmentSchema.index({ status: 1, appointmentDate: 1 });

export default mongoose.model(
  "Appointment",
  appointmentSchema
);