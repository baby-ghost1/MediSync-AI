import {
  NotificationRepository,
  UserRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class NotificationService {
  /* ==========================================
      Create
  ========================================== */

  async createNotification(
    payload
  ) {
    const user =
      await UserRepository.findById(
        payload.recipient
      );

    if (!user) {
      throw new ApiError(
        404,
        "Recipient not found."
      );
    }

    return NotificationRepository.create(
      payload
    );
  }

  /* ==========================================
      Notifications
  ========================================== */

  async getNotifications(
    userId,
    page = 1,
    limit = 10
  ) {
    return NotificationRepository.getUserNotifications(
      userId,
      {
        page,
        limit,
      }
    );
  }

  async getNotification(id) {
    const notification =
      await NotificationRepository.findById(
        id
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return notification;
  }

  async deleteNotification(
    id
  ) {
    const notification =
      await NotificationRepository.delete(
        id
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return {
      success: true,
      message:
        "Notification deleted successfully.",
    };
  }

  /* ==========================================
      Read
  ========================================== */

  async markAsRead(id) {
    const notification =
      await NotificationRepository.markAsRead(
        id
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return notification;
  }

  async markAsUnread(id) {
    const notification =
      await NotificationRepository.markAsUnread(
        id
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return notification;
  }

  async markAllAsRead(
    userId
  ) {
    await NotificationRepository.markAllAsRead(
      userId
    );

    return {
      success: true,
      message:
        "All notifications marked as read.",
    };
  }
    /* ==========================================
      Delete
  ========================================== */

  async deleteReadNotifications(
    userId
  ) {
    await NotificationRepository.deleteRead(
      userId
    );

    return {
      success: true,
      message:
        "Read notifications deleted successfully.",
    };
  }

  async clearAllNotifications(
    userId
  ) {
    await NotificationRepository.clearAll(
      userId
    );

    return {
      success: true,
      message:
        "All notifications cleared successfully.",
    };
  }

  /* ==========================================
      Filters
  ========================================== */

  async getUnreadNotifications(
    userId
  ) {
    return NotificationRepository.getUnreadNotifications(
      userId
    );
  }

  async getUnreadCount(
    userId
  ) {
    const count =
      await NotificationRepository.getUnreadCount(
        userId
      );

    return {
      unread: count,
    };
  }

  async getNotificationsByType(
    userId,
    type
  ) {
    return NotificationRepository.getByType(
      userId,
      type
    );
  }

  /* ==========================================
      Broadcast
  ========================================== */

  async broadcast(
    notifications
  ) {
    return NotificationRepository.createMany(
      notifications
    );
  }

  /* ==========================================
      Statistics
  ========================================== */

  async getStatistics(
    userId
  ) {
    return NotificationRepository.getStatistics(
      userId
    );
  }
}

export default new NotificationService();