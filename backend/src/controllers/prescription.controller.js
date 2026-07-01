import {
  PrescriptionService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class PrescriptionController {
  createPrescription =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.createPrescription(
          req.body
        );

      res.status(201).json({
        success: true,
        data,
      });
    });

  getPrescriptions =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.getPrescriptions(
          req.query
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getPrescription =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.getPrescription(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  updatePrescription =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.updatePrescription(
          req.params.id,
          req.body
        );

      res.json({
        success: true,
        data,
      });
    });

  deletePrescription =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.deletePrescription(
          req.params.id
        );

      res.json(data);
    });

  getPatientPrescriptions =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.getPatientPrescriptions(
          req.params.patientId,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  getDoctorPrescriptions =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.getDoctorPrescriptions(
          req.params.doctorId,
          req.query.page,
          req.query.limit
        );

      res.json({
        success: true,
        ...data,
      });
    });

  markDispensed =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.markDispensed(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  markCompleted =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.markCompleted(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  renewPrescription =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.renewPrescription(
          req.params.id
        );

      res.json({
        success: true,
        data,
      });
    });

  getActivePrescriptions =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.getActivePrescriptions(
          req.params.patientId
        );

      res.json({
        success: true,
        data,
      });
    });

  searchPrescriptions =
    asyncHandler(async (req, res) => {
      const data =
        await PrescriptionService.searchPrescriptions(
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
        await PrescriptionService.getStatistics();

      res.json({
        success: true,
        data,
      });
    });
}

export default new PrescriptionController();

