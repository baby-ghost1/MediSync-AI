import mongoose from "mongoose";

const conversationMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Conversation",
      maxlength: 200,
    },
    messages: [conversationMessageSchema],
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
