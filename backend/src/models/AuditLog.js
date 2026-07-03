import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "USER_CREATE", "USER_VERIFY", "USER_BLOCK", "USER_UNBLOCK", "USER_DELETE",
        "DOCTOR_APPROVE", "DOCTOR_REJECT",
        "APPOINTMENT_UPDATE", "APPOINTMENT_DELETE",
        "BROADCAST_SEND",
        "SYSTEM_SETTINGS_UPDATE",
        "LOGIN_FAIL", "LOGIN_SUCCESS", "LOGOUT",
        "PASSWORD_CHANGE", "PASSWORD_RESET",
        "ROLE_CHANGE",
      ],
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    targetModel: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ip: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
