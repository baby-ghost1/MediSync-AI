import { Router } from "express";

import {
  DoctorController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  updateDoctorSchema,
} from "../validators/index.js";

const router = Router();

router.use(auth);

router.get(
  "/dashboard",
  authorize("doctor"),
  DoctorController.getDashboard
);

router.get(
  "/profile",
  authorize("doctor"),
  DoctorController.getProfile
);

router.patch(
  "/profile",
  authorize("doctor"),
  validate(updateDoctorSchema),
  DoctorController.updateProfile
);

router.get(
  "/available",
  DoctorController.getAvailableDoctors
);

router.get(
  "/statistics",
  authorize("admin"),
  DoctorController.getStatistics
);

router.get(
  "/search",
  DoctorController.searchDoctors
);

router.get(
  "/",
  DoctorController.getDoctors
);

router.get(
  "/:id",
  DoctorController.getDoctor
);

router.patch(
  "/:id/availability",
  authorize("doctor", "admin"),
  DoctorController.updateAvailability
);

router.delete(
  "/:id",
  authorize("admin"),
  DoctorController.deleteDoctor
);

export default router;