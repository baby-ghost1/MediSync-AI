import { Router } from "express";

import {
  AppointmentController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
  validate,
} from "../middleware/index.js";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
  rescheduleAppointmentSchema,
} from "../validators/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  authorize("patient", "admin"),
  validate(createAppointmentSchema),
  AppointmentController.createAppointment
);

router.get(
  "/",
  AppointmentController.getAppointments
);

router.get(
  "/today",
  AppointmentController.getTodayAppointments
);

router.get(
  "/upcoming",
  AppointmentController.getUpcomingAppointments
);

router.get(
  "/statistics",
  authorize("admin"),
  AppointmentController.getStatistics
);

router.get(
  "/patient/:patientId",
  AppointmentController.getPatientAppointments
);

router.get(
  "/doctor/:doctorId",
  AppointmentController.getDoctorAppointments
);

router.get(
  "/date/:date",
  AppointmentController.getAppointmentsByDate
);

router.get(
  "/:id",
  AppointmentController.getAppointment
);

router.patch(
  "/:id",
  validate(updateAppointmentSchema),
  AppointmentController.updateAppointment
);

router.patch(
  "/:id/confirm",
  authorize("doctor", "admin"),
  AppointmentController.confirmAppointment
);

router.patch(
  "/:id/complete",
  authorize("doctor", "admin"),
  AppointmentController.completeAppointment
);

router.patch(
  "/:id/cancel",
  AppointmentController.cancelAppointment
);

router.patch(
  "/:id/reschedule",
  validate(rescheduleAppointmentSchema),
  AppointmentController.rescheduleAppointment
);

router.patch(
  "/:id/notes",
  authorize("doctor"),
  AppointmentController.addNotes
);

router.delete(
  "/:id",
  authorize("admin"),
  AppointmentController.deleteAppointment
);

export default router;