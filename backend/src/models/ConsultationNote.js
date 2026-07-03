import mongoose from "mongoose";

const consultationNoteSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    symptoms: [String],
    diagnosis: String,
    observations: String,
    treatmentPlan: String,
    followUpDate: Date,
    notes: String,
    isDraft: {
      type: Boolean,
      default: true,
    },
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number,
      height: Number,
    },
  },
  { timestamps: true }
);

consultationNoteSchema.index({ doctor: 1, createdAt: -1 });
consultationNoteSchema.index({ patient: 1, createdAt: -1 });

export default mongoose.model("ConsultationNote", consultationNoteSchema);
