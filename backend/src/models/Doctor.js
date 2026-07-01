import mongoose from "mongoose";

const doctorSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      specialization: String,

      qualification: String,

      experience: Number,

      consultationFee: Number,

      hospital: String,

      about: String,

      available: {
        type: Boolean,
        default: true,
      },

      rating: {
        type: Number,
        default: 0,
      },

      totalReviews: {
        type: Number,
        default: 0,
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