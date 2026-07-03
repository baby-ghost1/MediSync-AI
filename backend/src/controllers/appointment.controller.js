import {
  AppointmentService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

import {
  PatientRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class AppointmentController {
  createAppointment =
    asyncHandler(
      async (req, res) => {
        const patientProfile =
          await PatientRepository.findByUserId(
            req.user._id
          );

        if (!patientProfile) {
          throw new ApiError(
            404,
            "Patient profile not found. Please complete your profile first."
          );
        }

        const payload = {
          patient:
            patientProfile._id,
          doctor:
            req.body.doctorId,
          appointmentDate:
            req.body.date,
          appointmentTime:
            req.body.time,
          reason:
            req.body.reason,
          notes:
            req.body.notes || "",
        };

        const data =
          await AppointmentService.createAppointment(
            payload
          );

        res.status(201).json({
          success: true,
          data,
        });
      }
    );

  getAppointments =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getAppointments(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getAppointment(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.updateAppointment(
            req.params.id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  deleteAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.deleteAppointment(
            req.params.id
          );

        res.json(data);
      }
    );

  getPatientAppointments =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getPatientAppointments(
            req.params.patientId,
            req.query.page,
            req.query.limit
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getDoctorAppointments =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getDoctorAppointments(
            req.params.doctorId,
            req.query.page,
            req.query.limit
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  confirmAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.confirmAppointment(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  completeAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.completeAppointment(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  cancelAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.cancelAppointment(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  rescheduleAppointment =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.rescheduleAppointment(
            req.params.id,
            req.body.appointmentDate,
            req.body.appointmentTime
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  addNotes =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.addNotes(
            req.params.id,
            req.body.notes
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getTodayAppointments =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getTodayAppointments();

        res.json({
          success: true,
          data,
        });
      }
    );

  getUpcomingAppointments =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getUpcomingAppointments();

        res.json({
          success: true,
          data,
        });
      }
    );

  getAppointmentsByDate =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getAppointmentsByDate(
            req.params.date
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getStatistics =
    asyncHandler(
      async (req, res) => {
        const data =
          await AppointmentService.getStatistics();

        res.json({
          success: true,
          data,
        });
      }
    );
}

export default new AppointmentController();