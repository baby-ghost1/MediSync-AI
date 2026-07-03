import { Router } from "express";

import {
  AdminController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  loginSchema,
} from "../validators/index.js";

const router = Router();

router.post(
  "/login",
  validate(loginSchema),
  AdminController.login
);

router.use(
  auth,
  authorize("admin")
);

router.get(
  "/dashboard",
  AdminController.getDashboard
);

router.get(
  "/statistics",
  AdminController.getSystemStatistics
);

router.get(
  "/users",
  AdminController.getUsers
);

router.patch(
  "/users/:id/verify",
  AdminController.verifyUser
);

router.patch(
  "/users/:id/block",
  AdminController.blockUser
);

router.patch(
  "/users/:id/unblock",
  AdminController.unblockUser
);

router.delete(
  "/users/:id",
  AdminController.deleteUser
);

router.get(
  "/doctors",
  AdminController.getDoctors
);

router.patch(
  "/doctors/:id/verify",
  AdminController.updateDoctorVerification
);

router.get(
  "/reports",
  AdminController.getReports
);

router.get(
  "/appointments",
  AdminController.getAppointments
);

router.patch(
  "/appointments/:id/status",
  AdminController.updateAppointmentStatus
);

router.get(
  "/prescriptions",
  AdminController.getPrescriptions
);

router.post(
  "/broadcast",
  AdminController.broadcastNotification
);

router.get(
  "/audit-logs",
  AdminController.getAuditLogs
);

router.get(
  "/audit-logs/statistics",
  AdminController.getAuditStatistics
);

router.get(
  "/settings",
  AdminController.getSettings
);

router.patch(
  "/settings",
  AdminController.updateSettings
);

router.patch(
  "/doctors/:id/approve",
  AdminController.approveDoctor
);

router.patch(
  "/doctors/:id/reject",
  AdminController.rejectDoctor
);

export default router;