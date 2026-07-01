import { Router } from "express";

import {
  NotificationController,
} from "../controllers/index.js";

import {
  auth,
} from "../middleware/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  NotificationController.createNotification
);

router.get(
  "/",
  NotificationController.getNotifications
);

router.get(
  "/unread",
  NotificationController.getUnreadNotifications
);

router.get(
  "/unread-count",
  NotificationController.getUnreadCount
);

router.get(
  "/statistics",
  NotificationController.getStatistics
);

router.get(
  "/:id",
  NotificationController.getNotification
);

router.patch(
  "/:id/read",
  NotificationController.markAsRead
);

router.patch(
  "/:id/unread",
  NotificationController.markAsUnread
);

router.patch(
  "/read-all",
  NotificationController.markAllAsRead
);

router.delete(
  "/read",
  NotificationController.deleteReadNotifications
);

router.delete(
  "/all",
  NotificationController.clearAllNotifications
);

router.delete(
  "/:id",
  NotificationController.deleteNotification
);

export default router;