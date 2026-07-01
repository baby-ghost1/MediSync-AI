import BaseRepository from "./base.repository.js";

import { Notification } from "../models/index.js";

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  /* ==========================================
      User Notifications
  ========================================== */

  async getUserNotifications(
    userId,
    options = {}
  ) {
    return this.find(
      {
        recipient: userId,
      },
      {
        sort: "-createdAt",
        ...options,
      }
    );
  }

  async getUnreadNotifications(
    userId
  ) {
    return this.model
      .find({
        recipient: userId,
        isRead: false,
      })
      .sort("-createdAt");
  }

  async getUnreadCount(userId) {
    return this.count({
      recipient: userId,
      isRead: false,
    });
  }

  /* ==========================================
      Read Status
  ========================================== */

  async markAsRead(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }

  async markAllAsRead(userId) {
    return this.model.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );
  }

  async markAsUnread(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isRead: false,
      },
      {
        new: true,
      }
    );
  }

  /* ==========================================
      Delete
  ========================================== */

  async deleteRead(userId) {
    return this.model.deleteMany({
      recipient: userId,
      isRead: true,
    });
  }

  async clearAll(userId) {
    return this.model.deleteMany({
      recipient: userId,
    });
  }

  /* ==========================================
      Type
  ========================================== */

  async getByType(
    userId,
    type
  ) {
    return this.model
      .find({
        recipient: userId,
        type,
      })
      .sort("-createdAt");
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics(userId) {
    const [
      total,
      unread,
      appointment,
      reports,
      prescriptions,
      system,
    ] = await Promise.all([
      this.count({
        recipient: userId,
      }),

      this.count({
        recipient: userId,
        isRead: false,
      }),

      this.count({
        recipient: userId,
        type: "appointment",
      }),

      this.count({
        recipient: userId,
        type: "report",
      }),

      this.count({
        recipient: userId,
        type: "prescription",
      }),

      this.count({
        recipient: userId,
        type: "system",
      }),
    ]);

    return {
      total,
      unread,
      appointment,
      reports,
      prescriptions,
      system,
    };
  }

  /* ==========================================
      Broadcast
  ========================================== */

  async createMany(
    notifications
  ) {
    return this.model.insertMany(
      notifications
    );
  }
}

export default new NotificationRepository();