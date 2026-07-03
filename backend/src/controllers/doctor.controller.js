import {
  DoctorService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class DoctorController {
  getDashboard =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.getDashboard();

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
          await DoctorService.getProfile(
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
          await DoctorService.updateProfile(
            req.user._id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getDoctors =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.getDoctors(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getDoctor =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.getDoctor(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  searchDoctors =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.searchDoctors(
            req.query.q,
            req.query.page,
            req.query.limit
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getAvailableDoctors =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.getAvailableDoctors();

        res.json({
          success: true,
          data,
        });
      }
    );

  updateAvailability =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.updateAvailability(
            req.params.id,
            req.body.available
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateSchedule =
    asyncHandler(
      async (req, res) => {
        const data = await DoctorService.updateSchedule(
          req.params.id,
          req.body.availability
        );
        res.json({ success: true, data });
      }
    );

  getAvailableSlots =
    asyncHandler(
      async (req, res) => {
        const slots = await DoctorService.getAvailableSlots(
          req.params.doctorId,
          req.query.date
        );
        res.json({ success: true, data: slots });
      }
    );

  getStatistics =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.getStatistics();

        res.json({
          success: true,
          data,
        });
      }
    );

  deleteDoctor =
    asyncHandler(
      async (req, res) => {
        const data =
          await DoctorService.deleteDoctor(
            req.params.id
          );

        res.json(data);
      }
    );
}

export default new DoctorController();