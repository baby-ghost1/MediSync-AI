import {
  NotificationService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class NotificationController {
  createNotification =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.createNotification(
          req.body
        );

      res.status(201).json({
        success: true,
        data,
      });
    });

  getNotifications =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.getNotifications(
          req.user._id,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getNotification =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.getNotification(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  markAsRead =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.markAsRead(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  markAsUnread =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.markAsUnread(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  markAllAsRead =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.markAllAsRead(
          req.user._id
        );

      res.json(data);
    });

  deleteNotification =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.deleteNotification(
          req.params.id
        );

      res.json(data);
    });

  deleteReadNotifications =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.deleteReadNotifications(
          req.user._id
        );

      res.json(data);
    });

  clearAllNotifications =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.clearAllNotifications(
          req.user._id
        );

      res.json(data);
    });

  getUnreadNotifications =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.getUnreadNotifications(
          req.user._id
        );

      res.json({
        success: true,
        data,
      });
    });

  getUnreadCount =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.getUnreadCount(
          req.user._id
        );

      res.json({
        success: true,
        data,
      });
    });

  getStatistics =
    asyncHandler(async (req, res) => {
      const data =
        await NotificationService.getStatistics(
          req.user._id
        );

      res.json({
        success: true,
        data,
      });
    });
}

export default new NotificationController();