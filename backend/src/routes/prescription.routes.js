import { Router } from "express";

import {
  PrescriptionController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../validators/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  authorize("doctor", "admin"),
  validate(createPrescriptionSchema),
  PrescriptionController.createPrescription
);

router.get(
  "/",
  PrescriptionController.getPrescriptions
);

router.get(
  "/statistics",
  authorize("admin"),
  PrescriptionController.getStatistics
);

router.get(
  "/search",
  PrescriptionController.searchPrescriptions
);

router.get(
  "/patient/:patientId",
  PrescriptionController.getPatientPrescriptions
);

router.get(
  "/doctor/:doctorId",
  PrescriptionController.getDoctorPrescriptions
);

router.get(
  "/active/:patientId",
  PrescriptionController.getActivePrescriptions
);

router.get(
  "/:id",
  PrescriptionController.getPrescription
);

router.patch(
  "/:id",
  validate(updatePrescriptionSchema),
  PrescriptionController.updatePrescription
);

router.patch(
  "/:id/dispense",
  authorize("doctor", "admin"),
  PrescriptionController.markDispensed
);

router.patch(
  "/:id/complete",
  authorize("doctor", "admin"),
  PrescriptionController.markCompleted
);

router.patch(
  "/:id/renew",
  authorize("doctor", "admin"),
  PrescriptionController.renewPrescription
);

router.delete(
  "/:id",
  authorize("admin"),
  PrescriptionController.deletePrescription
);

export default router;