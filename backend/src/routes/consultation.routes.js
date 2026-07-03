import { Router } from "express";

import * as ConsultationController from "../controllers/consultation.controller.js";
import { auth, authorize, validate } from "../middleware/index.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  authorize("doctor", "admin"),
  ConsultationController.createNote
);

router.get(
  "/doctor/:doctorId",
  authorize("doctor", "admin"),
  ConsultationController.getDoctorNotes
);

router.get(
  "/patient/:patientId",
  ConsultationController.getPatientNotes
);

router.get(
  "/appointment/:appointmentId",
  ConsultationController.getNoteByAppointment
);

router.get(
  "/:id",
  ConsultationController.getNote
);

router.patch(
  "/:id",
  authorize("doctor", "admin"),
  ConsultationController.updateNote
);

router.delete(
  "/:id",
  authorize("doctor", "admin"),
  ConsultationController.deleteNote
);

export default router;
