import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "appointment",
          "report",
          "prescription",
          "system",
          "chat",
        ],
        default: "system",
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      metadata: {
        type: Object,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model(
  "Notification",
  notificationSchema
);