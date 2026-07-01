import {
  AdminService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class AdminController {
  getDashboard =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getDashboard();

        res.json({
          success: true,
          data,
        });
      }
    );

  getUsers =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getUsers(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  verifyUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.verifyUser(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  blockUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.blockUser(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  unblockUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.unblockUser(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  deleteUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.deleteUser(
            req.params.id
          );

        res.json(data);
      }
    );

  getDoctors =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getDoctors(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  updateDoctorVerification =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.updateDoctorVerification(
            req.params.id,
            req.body.verified
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getReports =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getReports(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getPrescriptions =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getPrescriptions(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  broadcastNotification =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.broadcastNotification(
            req.body
          );

        res.json(data);
      }
    );

  getSystemStatistics =
    asyncHandler(
      async (req, res) => {
        const data =
          await AdminService.getSystemStatistics();

        res.json({
          success: true,
          data,
        });
      }
    );
}

export default new AdminController();