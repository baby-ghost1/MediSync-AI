import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicine: { type: String, required: true },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  },
  { _id: false }
);

const prescriptionTemplateSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: String,
    medicines: [medicineSchema],
    advice: String,
    followUpDays: Number,
    isFavorite: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

prescriptionTemplateSchema.index({ doctor: 1, name: 1 });
prescriptionTemplateSchema.index({ doctor: 1, isFavorite: -1 });

export default mongoose.model(
  "PrescriptionTemplate",
  prescriptionTemplateSchema
);
