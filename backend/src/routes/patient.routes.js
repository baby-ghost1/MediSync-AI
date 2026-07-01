import { Router } from "express";

import {
  PatientController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  updatePatientSchema,
} from "../validators/index.js";

const router = Router();

router.use(auth);

router.get(
  "/dashboard",
  authorize("patient"),
  PatientController.getDashboard
);

router.get(
  "/profile",
  authorize("patient"),
  PatientController.getProfile
);

router.patch(
  "/profile",
  authorize("patient"),
  validate(updatePatientSchema),
  PatientController.updateProfile
);

router.get(
  "/statistics",
  authorize("admin"),
  PatientController.getStatistics
);

router.get(
  "/",
  authorize("admin", "doctor"),
  PatientController.getPatients
);

router.get(
  "/search",
  authorize("admin", "doctor"),
  PatientController.searchPatients
);

router.get(
  "/:id",
  authorize("admin", "doctor"),
  PatientController.getPatient
);

router.patch(
  "/:id/medical",
  authorize("admin", "doctor"),
  validate(updatePatientSchema),
  PatientController.updateMedicalInfo
);

router.patch(
  "/:id/emergency-contact",
  authorize("admin", "patient"),
  PatientController.updateEmergencyContact
);

router.patch(
  "/:id/address",
  authorize("admin", "patient"),
  PatientController.updateAddress
);

router.delete(
  "/:id",
  authorize("admin"),
  PatientController.deletePatient
);

export default router;