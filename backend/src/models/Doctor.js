import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const doctorSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      specialization: {
        type: String,
        index: true,
      },

      qualification: String,

      experience: Number,

      consultationFee: Number,

      hospital: String,

      about: String,

      available: {
        type: Boolean,
        default: true,
        index: true,
      },

      availability: [availabilitySlotSchema],

      slotDuration: {
        type: Number,
        default: 30,
      },

      bufferBetweenSlots: {
        type: Number,
        default: 15,
      },

      rating: {
        type: Number,
        default: 0,
      },

      totalReviews: {
        type: Number,
        default: 0,
      },

      isApproved: {
        type: Boolean,
        default: false,
        index: true,
      },

      approvedAt: Date,

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Doctor",
  doctorSchema
);