import { Router } from "express";

import {
  AdminController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
} from "../middleware/index.js";

const router = Router();

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
  "/prescriptions",
  AdminController.getPrescriptions
);

router.post(
  "/broadcast",
  AdminController.broadcastNotification
);

export default router;