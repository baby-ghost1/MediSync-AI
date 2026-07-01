import {
  ReportService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class ReportController {
  createReport =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.createReport(
          req.body
        );

      res.status(201).json({
        success: true,
        data,
      });
    });

  getReports =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getReports(
          req.query
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getReport =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getReport(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  updateReport =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.updateReport(
          req.params.id,
          req.body
        );

      res.json({
        success: true,
        data,
      });
    });

  deleteReport =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.deleteReport(
          req.params.id
        );

      res.json(data);
    });

  getPatientReports =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getPatientReports(
          req.params.patientId,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getDoctorReports =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getDoctorReports(
          req.params.doctorId,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getAppointmentReport =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getAppointmentReport(
          req.params.appointmentId
        );

      res.json({
        success: true,
        data,
      });
    });

  addAttachment =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.addAttachment(
          req.params.id,
          req.body
        );

      res.json({
        success: true,
        data,
      });
    });

  removeAttachment =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.removeAttachment(
          req.params.id,
          req.params.publicId
        );

      res.json({
        success: true,
        data,
      });
    });

  saveAISummary =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.saveAISummary(
          req.params.id,
          req.body.summary,
          req.body.healthScore
        );

      res.json({
        success: true,
        data,
      });
    });

  searchReports =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.searchReports(
          req.query.q,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getStatistics =
    asyncHandler(async (req, res) => {
      const data =
        await ReportService.getStatistics();

      res.json({
        success: true,
        data,
      });
    });
}

export default new ReportController();