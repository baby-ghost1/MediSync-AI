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

/**
 * @openapi
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Create a new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - date
 *               - time
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: Doctor user ID
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-15"
 *               time:
 *                 type: string
 *                 example: "10:30"
 *               type:
 *                 type: string
 *                 enum: [in-person, video, phone]
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authorize("patient", "admin"),
  validate(createAppointmentSchema),
  AppointmentController.createAppointment
);

/**
 * @openapi
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get all appointments (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, completed, cancelled, no-show]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of appointments
 */
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

/**
 * @openapi
 * /api/appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get a single appointment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Appointment not found
 *   patch:
 *     tags: [Appointments]
 *     summary: Update an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, completed, cancelled, no-show]
 *               type:
 *                 type: string
 *                 enum: [in-person, video, phone]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       404:
 *         description: Appointment not found
 *   delete:
 *     tags: [Appointments]
 *     summary: Delete an appointment (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 *       403:
 *         description: Not authorized
 */
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

/**
 * @openapi
 * /api/appointments/{id}/reschedule:
 *   patch:
 *     tags: [Appointments]
 *     summary: Reschedule an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment rescheduled
 */
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
