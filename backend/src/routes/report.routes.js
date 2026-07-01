import { Router } from "express";

import {
  ReportController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  createReportSchema,
  updateReportSchema,
} from "../validators/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  authorize("doctor", "admin"),
  validate(createReportSchema),
  ReportController.createReport
);

router.get(
  "/",
  ReportController.getReports
);

router.get(
  "/statistics",
  authorize("admin"),
  ReportController.getStatistics
);

router.get(
  "/search",
  ReportController.searchReports
);

router.get(
  "/patient/:patientId",
  ReportController.getPatientReports
);

router.get(
  "/doctor/:doctorId",
  ReportController.getDoctorReports
);

router.get(
  "/appointment/:appointmentId",
  ReportController.getAppointmentReport
);

router.get(
  "/:id",
  ReportController.getReport
);

router.patch(
  "/:id",
  validate(updateReportSchema),
  ReportController.updateReport
);

router.patch(
  "/:id/ai-summary",
  authorize("doctor", "admin"),
  ReportController.saveAISummary
);

router.post(
  "/:id/attachment",
  authorize("doctor", "admin"),
  ReportController.addAttachment
);

router.delete(
  "/:id/attachment/:publicId",
  authorize("doctor", "admin"),
  ReportController.removeAttachment
);

router.delete(
  "/:id",
  authorize("admin"),
  ReportController.deleteReport
);

export default router;