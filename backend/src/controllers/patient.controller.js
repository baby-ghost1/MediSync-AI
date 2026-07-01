import {
  PatientService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class PatientController {
  getDashboard =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.getDashboard(
            req.user._id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getProfile =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.getProfile(
            req.user._id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateProfile =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.updateProfile(
            req.user._id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getPatients =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.getPatients(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getPatient =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.getPatient(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  searchPatients =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.searchPatients(
            req.query.q,
            req.query.page,
            req.query.limit
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateMedicalInfo =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.updateMedicalInfo(
            req.params.id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateEmergencyContact =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.updateEmergencyContact(
            req.params.id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateAddress =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.updateAddress(
            req.params.id,
            req.body
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
          await PatientService.getStatistics();

        res.json({
          success: true,
          data,
        });
      }
    );

  deletePatient =
    asyncHandler(
      async (req, res) => {
        const data =
          await PatientService.deletePatient(
            req.params.id
          );

        res.json(data);
      }
    );
}

export default new PatientController();
